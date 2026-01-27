# Webhook & Server-Side Analytics Pitfalls

**Domain:** Lemon Squeezy Webhook Integration + OpenPanel Server-Side Tracking
**Researched:** 2026-01-27
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Signature Verification with Parsed Body

**What goes wrong:**
Webhook signature fails even for legitimate Lemon Squeezy requests. Error: "Invalid signature" on every webhook. Signature verification returns false despite correct secret. Webhooks never process successfully.

**Why it happens:**
Remix automatically parses JSON body via `request.json()`. Signature is calculated from raw unparsed bytes. After JSON parsing, body is altered (whitespace removed, keys reordered). Computing signature from parsed body produces different hash than Lemon Squeezy sent.

**Consequences:**
- All webhooks rejected as invalid
- Subscription updates never reach database
- Payment confirmations lost
- Manual reconciliation required

**Prevention:**
```typescript
// WRONG - Signature fails
const body = await request.json();
const signature = computeSignature(JSON.stringify(body)); // Altered

// CORRECT - Use raw body
const text = await request.text();
const signature = computeSignature(text); // Original bytes
const body = JSON.parse(text); // Parse after verification
```

**Detection:**
- All webhook requests fail signature check
- Works in testing with manual JSON but fails from Lemon Squeezy
- Signature comparison shows different hashes for same payload
- Lemon Squeezy dashboard shows failed delivery attempts

**Phase to address:**
Webhook endpoint implementation - Must use `request.text()` before any parsing

---

### Pitfall 2: Non-Constant-Time Signature Comparison

**What goes wrong:**
Webhook endpoint vulnerable to timing attacks. Attacker sends malicious payloads, measures response time variations, deduces secret one character at a time. After ~256 attempts per character, attacker reconstructs full signing secret and can forge webhooks.

**Why it happens:**
Using `===` or `==` for signature comparison exits early on first character mismatch. Longer match = longer execution time. Attacker measures this timing difference (microseconds) to infer correct characters.

**Consequences:**
- Signing secret leaked via timing side-channel
- Attacker can forge webhooks
- Malicious subscription updates injected
- Data corruption from fake payment events

**Prevention:**
```typescript
import crypto from 'crypto';

// WRONG - Timing attack vulnerable
if (receivedSignature === computedSignature) { ... }

// CORRECT - Constant-time comparison
const receivedBuffer = Buffer.from(receivedSignature, 'hex');
const computedBuffer = Buffer.from(computedSignature, 'hex');
if (crypto.timingSafeEqual(receivedBuffer, computedBuffer)) { ... }
```

**Detection:**
- Security audit flags non-constant-time comparisons
- Code review identifies `===` for secret comparison
- No use of `crypto.timingSafeEqual` in signature check

**Phase to address:**
Signature verification implementation - Use `crypto.timingSafeEqual()` from start

---

### Pitfall 3: Missing Idempotency - Duplicate Processing

**What goes wrong:**
Lemon Squeezy retries webhook after timeout. Endpoint processes same event twice. User subscription activated, database updated, OpenPanel event sent. Retry arrives 5 seconds later. Same operations run again. Duplicate OpenPanel events inflate analytics. If billing logic runs twice, user charged twice.

**Why it happens:**
Lemon Squeezy guarantees "at least once" delivery. Network issues, slow responses, or temporary failures trigger automatic retries (up to 4 attempts). No idempotency key checking means same event processes multiple times.

**Consequences:**
- Duplicate analytics events (inflated metrics)
- Duplicate email notifications
- Race conditions in database updates
- Potential duplicate charges/credits
- Data integrity violations

**Prevention:**
```typescript
// Create unique constraint
// schema.prisma: @@unique([webhookId])

async function handleWebhook(eventId: string, payload: any) {
  try {
    // Attempt insert - fails if duplicate
    await db.processedWebhooks.create({
      data: { webhookId: eventId, processedAt: new Date() }
    });
  } catch (error) {
    if (error.code === 'P2002') { // Unique constraint violation
      return; // Already processed, skip silently
    }
    throw error;
  }

  // Process event only if insert succeeded
  await processSubscription(payload);
  await trackToOpenPanel(payload);
}
```

**Detection:**
- Duplicate events in OpenPanel dashboard
- Same subscription event appears twice in logs
- Database shows duplicate timestamps for single webhook
- User reports receiving multiple emails for one action

**Phase to address:**
Webhook handler implementation - Add idempotency tracking before processing logic

---

### Pitfall 4: Synchronous Processing Causes Timeouts

**What goes wrong:**
Webhook handler updates database, sends OpenPanel event, triggers email, checks external API. Takes 8 seconds total. Lemon Squeezy times out after 30 seconds on first try, but processing delays response. Lemon Squeezy sees slow response, retries webhook. Handler still processing first request. Now two handlers run concurrently, causing race conditions.

**Why it happens:**
Webhook handlers do all processing synchronously before responding. Long operations (external API calls, email sending, complex DB queries) delay HTTP 200 response. Providers expect quick ACK (< 1-2 seconds).

**Consequences:**
- Unnecessary retries due to slow responses
- Race conditions from concurrent processing
- Timeout triggers even when processing succeeds
- Increased load from retry storms
- Provider may disable endpoint after repeated "failures"

**Prevention:**
```typescript
// WRONG - Synchronous processing
export async function action({ request }: ActionFunctionArgs) {
  const payload = await verifyWebhook(request);
  await db.subscription.update(...);        // 2 seconds
  await sendEmail(payload);                 // 3 seconds
  await trackToOpenPanel(payload);          // 1 second
  await syncToBackoffice(payload);          // 2 seconds
  return json({ ok: true });                // 8 seconds total!
}

// CORRECT - Queue for background processing
export async function action({ request }: ActionFunctionArgs) {
  const payload = await verifyWebhook(request);

  // Store for processing, respond immediately
  await db.webhookQueue.create({
    data: { payload, status: 'pending' }
  });

  return json({ ok: true }, { status: 200 }); // < 100ms
}
// Separate worker processes queue
```

**Detection:**
- Webhook responses take > 2 seconds
- Lemon Squeezy shows "timeout" in delivery logs despite success
- Multiple processing logs for same event ID
- Database shows concurrent updates from same webhook

**Phase to address:**
Architecture design - Decide sync vs async before implementation

---

### Pitfall 5: Wrong HTTP Status Codes

**What goes wrong:**
Webhook validates successfully, database update fails due to transient error. Handler returns 500 error. Lemon Squeezy retries. Database error persists. After 4 attempts, webhook marked as permanently failed. Now subscription update lost, requires manual fix.

Alternate scenario: Signature validation fails (attacker). Handler returns 200 to "avoid retries". Lemon Squeezy thinks delivery succeeded. Attacker continues sending invalid webhooks.

**Why it happens:**
Misunderstanding of what status codes signal to webhook provider. 2xx = success, don't retry. 4xx = client error, don't retry. 5xx = server error, retry. Using wrong code for error type breaks retry logic.

**Consequences:**
- Legitimate events permanently lost (wrong 4xx/5xx)
- Invalid events not filtered (wrong 2xx)
- Retry storms from wrong 5xx
- Manual intervention required for lost events

**Prevention:**
```typescript
// Status code decision tree
if (!signatureValid) {
  return json({ error: 'Invalid signature' }, { status: 401 }); // Don't retry
}

if (eventAlreadyProcessed) {
  return json({ ok: true }, { status: 200 }); // Already done, success
}

try {
  await processEvent(payload);
  return json({ ok: true }, { status: 200 }); // Success
} catch (error) {
  if (error.code === 'ECONNREFUSED') {
    // Transient - retry might succeed
    return json({ error: 'DB unavailable' }, { status: 503 });
  }
  if (error.message.includes('Invalid data')) {
    // Permanent - retry won't fix
    return json({ error: 'Bad data' }, { status: 422 });
  }
  throw error; // Let Remix return 500
}
```

**Detection:**
- Legitimate webhooks marked as permanently failed
- Invalid webhooks show "successful delivery"
- Retry storms visible in server logs
- Mismatch between Lemon Squeezy status and actual processing

**Phase to address:**
Error handling implementation - Map error types to correct status codes

---

### Pitfall 6: Exposed Webhook Secrets

**What goes wrong:**
Webhook signing secret committed to Git in `.env.example` or hardcoded in route file. Secret visible in GitHub public repo. Attacker finds secret, forges webhooks with valid signatures. Malicious subscription updates injected. All signature verification bypassed.

**Why it happens:**
Developer creates `.env` file with real secrets, commits it. Or hardcodes secret "temporarily" for testing. Or includes real secret in `.env.example` as "documentation". Secret management seen as "later" task.

**Consequences:**
- Webhook endpoint completely compromised
- Attacker can forge any subscription event
- No way to distinguish real from fake webhooks
- Requires secret rotation and re-deployment
- Potential data breach or financial loss

**Prevention:**
```typescript
// WRONG - Hardcoded
const WEBHOOK_SECRET = 'whsec_abc123...';

// WRONG - Committed .env
// .env: LEMONSQUEEZY_WEBHOOK_SECRET=whsec_abc123...

// CORRECT - Environment variable, excluded from Git
const WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
if (!WEBHOOK_SECRET) {
  throw new Error('LEMONSQUEEZY_WEBHOOK_SECRET not configured');
}

// .gitignore
.env
.env.local

// .env.example (NO real secrets)
LEMONSQUEEZY_WEBHOOK_SECRET=your_secret_here
```

**Detection:**
- `.env` files tracked in Git
- Secret visible in commit history
- Hardcoded strings matching webhook secret format
- No environment variable validation on startup

**Phase to address:**
Setup phase - Configure environment variables before writing webhook code

---

### Pitfall 7: Missing OpenPanel Server-Side Authentication

**What goes wrong:**
OpenPanel server-side tracking sends events without `openpanel-client-id` or `openpanel-client-secret` headers. API returns 401 Unauthorized. All events silently fail. Webhook processes successfully but analytics never updated. Metrics dashboards missing subscription events.

**Why it happens:**
Developer assumes server-side tracking works like client SDK (automatic auth). Server-side API requires explicit authentication headers. Copy-pasted client-side tracking code doesn't include headers. Environment variables not configured for server context.

**Consequences:**
- All server-side events lost
- No analytics for webhook-triggered actions
- Incomplete funnel tracking
- Silent failures (no visible errors)
- Metrics gaps not noticed until later

**Prevention:**
```typescript
// WRONG - Missing authentication
await fetch('https://api.openpanel.dev/track', {
  method: 'POST',
  body: JSON.stringify({ event: 'subscription_created', ... })
});

// CORRECT - Include auth headers
const OPENPANEL_CLIENT_ID = process.env.OPENPANEL_CLIENT_ID;
const OPENPANEL_CLIENT_SECRET = process.env.OPENPANEL_CLIENT_SECRET;

if (!OPENPANEL_CLIENT_ID || !OPENPANEL_CLIENT_SECRET) {
  throw new Error('OpenPanel credentials not configured');
}

await fetch('https://api.openpanel.dev/track', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'openpanel-client-id': OPENPANEL_CLIENT_ID,
    'openpanel-client-secret': OPENPANEL_CLIENT_SECRET,
  },
  body: JSON.stringify({ event: 'subscription_created', ... })
});
```

**Detection:**
- OpenPanel dashboard shows no server-side events
- Webhook logs show 401 responses from OpenPanel
- Client-side events present but server-side missing
- Environment variables not set in deployment config

**Phase to address:**
OpenPanel integration - Configure credentials before sending first event

---

### Pitfall 8: Rate Limiting Without Backoff

**What goes wrong:**
Webhook handler sends OpenPanel event for each subscription update. During promotion, 100 users subscribe in 1 minute. Handler sends 100 API requests to OpenPanel. OpenPanel rate limit exceeded. Returns 429 Too Many Requests. Handler doesn't retry. 80 subscription events lost from analytics.

**Why it happens:**
No retry logic for rate-limited requests. No exponential backoff. No queue for batching. Treating OpenPanel API like database (no rate limits). Spike traffic not anticipated.

**Consequences:**
- Event data loss during traffic spikes
- Incomplete analytics during critical periods (launches, promotions)
- Cascading failures (retry storm makes problem worse)
- No visibility into what events were lost

**Prevention:**
```typescript
async function trackToOpenPanel(event: any, attempt = 1) {
  const response = await fetch('https://api.openpanel.dev/track', {
    method: 'POST',
    headers: { /* auth headers */ },
    body: JSON.stringify(event)
  });

  if (response.status === 429) {
    if (attempt > 3) {
      // Give up after 3 attempts, queue for later
      await db.failedEvents.create({ data: event });
      return;
    }

    // Exponential backoff with jitter
    const backoffMs = (2 ** attempt) * 1000 + Math.random() * 1000;
    await new Promise(resolve => setTimeout(resolve, backoffMs));
    return trackToOpenPanel(event, attempt + 1);
  }

  if (!response.ok) {
    throw new Error(`OpenPanel error: ${response.status}`);
  }
}
```

**Detection:**
- 429 errors in logs during traffic spikes
- Analytics gaps during high-volume periods
- No retry attempts visible in logs
- Event counts don't match webhook counts

**Phase to address:**
Error handling implementation - Add retry logic for all external API calls

---

### Pitfall 9: Missing Geo/Device Context

**What goes wrong:**
Webhook handler sends OpenPanel events without `x-client-ip` or `user-agent` headers. OpenPanel stores events but without location or device data. All events show "Unknown" location. Analytics reports can't segment by geography or device. Metrics less actionable.

**Why it happens:**
Server-side context doesn't have browser data automatically. Developer doesn't realize OpenPanel needs explicit headers for geo/device tracking. Copy-pasted minimal example that works but loses context.

**Consequences:**
- No geographic segmentation
- No device/browser analytics
- Reports show "Unknown" for most dimensions
- Less actionable insights
- Harder to debug user-specific issues

**Prevention:**
```typescript
// Webhook context doesn't have user IP/agent directly
// But can pass through from original user session if stored

// Store during checkout session creation
await db.checkoutSession.create({
  data: {
    userId,
    userIp: request.headers.get('x-forwarded-for') || 'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown'
  }
});

// Use in webhook handler
const session = await db.checkoutSession.findUnique({ where: { userId } });

await fetch('https://api.openpanel.dev/track', {
  headers: {
    'openpanel-client-id': CLIENT_ID,
    'openpanel-client-secret': CLIENT_SECRET,
    'x-client-ip': session?.userIp || 'unknown',
    'user-agent': session?.userAgent || 'unknown',
  },
  body: JSON.stringify(event)
});
```

**Detection:**
- OpenPanel events show "Unknown" location
- No device breakdown in reports
- All server-side events missing geographic data
- Headers not included in tracking calls

**Phase to address:**
Analytics integration - Plan context capture before implementation

---

### Pitfall 10: Webhook Secret Scope Confusion

**What goes wrong:**
Developer creates one webhook secret in Lemon Squeezy dashboard, uses it for all environments (dev, staging, production). Dev webhook fires, sent to production endpoint. Signature validates (same secret). Production database updated with test data. Test subscriptions pollute production analytics.

Alternate: Uses different secrets per environment but hardcodes production secret in code "temporarily". Secret leaked via dev environment logs.

**Why it happens:**
Lemon Squeezy requires manually created signing secret (unlike Stripe's auto-generated per-endpoint). Developer uses single secret to "simplify" setup. Or separate secrets exist but configuration mixes them up.

**Consequences:**
- Test data in production database/analytics
- Production secret exposed in dev logs
- Unable to distinguish test vs real webhooks
- Inflated metrics from test traffic

**Prevention:**
```typescript
// Separate secrets per environment
// Production: whsec_prod_abc123...
// Staging: whsec_stag_xyz789...
// Dev: whsec_dev_def456...

// Environment-specific config
const WEBHOOK_SECRET = process.env.NODE_ENV === 'production'
  ? process.env.LEMONSQUEEZY_WEBHOOK_SECRET_PROD
  : process.env.LEMONSQUEEZY_WEBHOOK_SECRET_DEV;

// Lemon Squeezy dashboard: Create 3 webhooks
// 1. https://app.example.com/api/webhook (prod secret)
// 2. https://staging.example.com/api/webhook (staging secret)
// 3. https://dev.example.com/api/webhook (dev secret)
```

**Detection:**
- Test subscription events in production database
- Same webhook secret across all environments
- Production analytics includes localhost events
- Unable to filter test vs real traffic

**Phase to address:**
Setup phase - Configure separate secrets before exposing endpoints

---

## Moderate Pitfalls

### Pitfall 11: Event Replay Attacks

**What goes wrong:**
Attacker intercepts valid webhook (HTTPS but logged), replays same request later. Signature still valid. Handler processes "new" subscription that actually happened weeks ago. Duplicate processing or stale data applied.

**Prevention:**
- Include timestamp validation (reject requests > 5 minutes old)
- Store processed event IDs with TTL (idempotency)
- Check event sequence numbers if available

**Detection:**
- Duplicate events days/weeks apart
- Same signature accepted multiple times
- No timestamp validation in code

---

### Pitfall 12: No HTTPS Enforcement

**What goes wrong:**
Webhook endpoint accepts HTTP requests. Attacker performs MITM, intercepts webhook, steals signing secret from legitimate request. Uses secret to forge future webhooks.

**Prevention:**
```typescript
// Reject non-HTTPS in production
if (process.env.NODE_ENV === 'production' &&
    request.headers.get('x-forwarded-proto') !== 'https') {
  return json({ error: 'HTTPS required' }, { status: 403 });
}
```

**Detection:**
- Webhook endpoint accessible via HTTP
- No HTTPS redirect configured
- Missing protocol check in handler

---

### Pitfall 13: Insufficient Error Context

**What goes wrong:**
Webhook fails, logs show "Error processing webhook". No event ID, no error details, no payload snippet. Impossible to debug or reproduce. Can't identify which user affected or what triggered failure.

**Prevention:**
```typescript
try {
  await processWebhook(payload);
} catch (error) {
  console.error('Webhook processing failed', {
    eventId: payload.meta.event_id,
    eventName: payload.meta.event_name,
    userId: payload.data.attributes.user_id,
    error: error.message,
    stack: error.stack
  });
  // Still return 500 to trigger retry
  throw error;
}
```

**Detection:**
- Generic error messages in logs
- Unable to identify affected users
- No payload context in error logs
- Difficult to reproduce issues

---

### Pitfall 14: Hardcoded Event Names

**What goes wrong:**
Tracking code uses string literals: `trackEvent('subscription_created')`. Another file uses `trackEvent('subscription-created')`. Analytics shows two different events for same action. Reports inconsistent. No type safety.

**Prevention:**
```typescript
// constants/events.ts
export const EVENTS = {
  SUBSCRIPTION_CREATED: 'subscription_created',
  SUBSCRIPTION_UPDATED: 'subscription_updated',
  SUBSCRIPTION_CANCELLED: 'subscription_cancelled',
} as const;

// Usage
trackToOpenPanel({ event: EVENTS.SUBSCRIPTION_CREATED, ... });
```

**Detection:**
- Multiple similar event names in analytics
- String literals scattered across codebase
- No shared event name constants
- TypeScript allows any string

---

### Pitfall 15: No Webhook Testing Strategy

**What goes wrong:**
Developer builds webhook handler, deploys to production, hopes it works. First real webhook fails. No way to test signature verification without real webhook. Can't reproduce issues locally.

**Prevention:**
- Use Lemon Squeezy webhook testing endpoint
- Store sample payloads from docs
- Create unit tests with real signatures
- Set up ngrok/localtunnel for local testing
- Add manual retry endpoint for failed webhooks

**Detection:**
- No test coverage for webhook handler
- No sample payloads in codebase
- First production webhook is first test
- No local testing setup documented

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Synchronous processing in webhook | Simpler code | Timeouts, retries, race conditions | Never - always queue |
| String comparison for signatures | Works functionally | Timing attack vulnerability | Never - use timingSafeEqual |
| No idempotency tracking | Less database setup | Duplicate processing, data corruption | Never - retries guaranteed |
| Hardcoded webhook secret | Faster initial setup | Secret exposure, can't rotate | Never - use env vars from start |
| No retry logic for OpenPanel | Simpler error handling | Lost events during spikes | Initial MVP only |
| Single webhook secret all envs | Easier management | Test data in production | Never - separate always |
| Return 200 for invalid signatures | "Avoid retries" | Security bypass, no filtering | Never - return 401 |
| No timestamp validation | Simpler verification | Replay attack vulnerability | Low-risk webhooks only |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Lemon Squeezy + Remix | Use `request.json()` before signature | Clone request, use `request.text()`, verify, then parse |
| Signature verification | Use `===` comparison | Use `crypto.timingSafeEqual()` |
| OpenPanel server-side | Missing auth headers | Include `openpanel-client-id` and `openpanel-client-secret` |
| Rate limiting | No retry logic | Exponential backoff with jitter |
| Idempotency | Check after processing | Check before processing, fail fast |
| HTTP status codes | Return 500 for invalid signature | Return 401 (don't retry), 503 (retry), 200 (success) |
| Environment secrets | Share secret across environments | Separate secret per environment |
| Processing time | Synchronous operations block response | Queue for background processing |

## Response Timing Requirements

| Provider | Timeout | Recommended ACK Time | Impact of Slow Response |
|----------|---------|---------------------|-------------------------|
| Lemon Squeezy | 30 seconds | < 2 seconds | Retry after 4 failed attempts (permanent failure) |
| OpenPanel API | 30 seconds | < 5 seconds | 429 rate limit if too many concurrent |
| General webhooks | 10-30 seconds | < 1 second | Retry storms, concurrent processing, race conditions |

## Signature Verification Checklist

- [ ] Use raw request body (`request.text()`) before any parsing
- [ ] Clone request if need body twice (`request.clone()`)
- [ ] Compute HMAC-SHA256 with signing secret
- [ ] Use `crypto.timingSafeEqual()` for comparison (not `===`)
- [ ] Return 401 for invalid signatures (don't retry)
- [ ] Log failed attempts with event ID and signature comparison
- [ ] Validate timestamp if provided (reject old requests)
- [ ] Store signing secret in environment variable
- [ ] Use separate secrets per environment
- [ ] Never commit secrets to Git

## Idempotency Implementation Checklist

- [ ] Database table with unique constraint on event ID
- [ ] Check idempotency BEFORE processing
- [ ] Insert event ID as first database operation
- [ ] Handle unique constraint violation gracefully (skip processing)
- [ ] Return 200 for already-processed events
- [ ] Include timestamp for debugging duplicate scenarios
- [ ] Clean up old processed events (TTL or periodic cleanup)
- [ ] Test with duplicate payloads

## OpenPanel Server-Side Checklist

- [ ] Include `openpanel-client-id` header
- [ ] Include `openpanel-client-secret` header
- [ ] Include `Content-Type: application/json` header
- [ ] Include `x-client-ip` header for geo tracking (if available)
- [ ] Include `user-agent` header for device tracking (if available)
- [ ] Use HTTPS endpoint (`https://api.openpanel.dev`)
- [ ] Implement retry logic for 429 rate limits
- [ ] Exponential backoff with jitter
- [ ] Handle 401 errors (credential issue)
- [ ] Store failed events for manual retry
- [ ] Never expose credentials in client code
- [ ] Validate response status codes
- [ ] Log tracking failures with context

## Error Handling Checklist

- [ ] Return 200 only for successfully processed events
- [ ] Return 401 for authentication failures (invalid signature)
- [ ] Return 422 for invalid payload data (permanent error)
- [ ] Return 503 for transient failures (database down, retry)
- [ ] Return 500 for unexpected errors (retry)
- [ ] Include error context in logs (event ID, user ID, error message)
- [ ] Don't expose sensitive data in error responses
- [ ] Track failed events for manual investigation
- [ ] Alert on repeated failures (same error multiple times)
- [ ] Implement dead letter queue for exhausted retries

## Security Checklist

- [ ] Webhook secret stored in environment variable
- [ ] Webhook secret never committed to Git
- [ ] Different secrets per environment
- [ ] HTTPS enforced in production
- [ ] Signature verification before processing
- [ ] Timing-safe comparison for signatures
- [ ] Timestamp validation (reject old requests)
- [ ] Idempotency prevents replay attacks
- [ ] No PII in event properties
- [ ] OpenPanel credentials never exposed client-side
- [ ] Rate limiting to prevent abuse
- [ ] Error messages don't leak sensitive data

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Parsed body breaks signature | LOW | Use `request.text()`, redeploy, replay failed webhooks |
| Timing attack vulnerability | MEDIUM | Switch to `timingSafeEqual()`, rotate secret, redeploy |
| Missing idempotency | HIGH | Add tracking table, identify duplicates, deduplicate database |
| Synchronous processing timeouts | MEDIUM | Add queue/background jobs, redeploy, replay failed webhooks |
| Wrong status codes | MEDIUM | Fix status logic, redeploy, manually replay lost events |
| Exposed webhook secret | CRITICAL | Rotate secret immediately, audit for forged webhooks, redeploy |
| Missing OpenPanel auth | LOW | Add headers, redeploy, replay webhook events |
| Rate limiting failures | MEDIUM | Add retry logic, implement queue, replay lost events |
| Missing geo/device context | LOW | Update tracking calls, context lost for past events |
| Secret scope confusion | HIGH | Separate secrets, clean test data from production |

## Testing Strategy

### Unit Tests
```typescript
describe('Webhook signature verification', () => {
  it('accepts valid signature', async () => {
    const payload = '{"event":"subscription_created"}';
    const signature = createSignature(payload, SECRET);
    const valid = await verifySignature(payload, signature, SECRET);
    expect(valid).toBe(true);
  });

  it('rejects invalid signature', async () => {
    const payload = '{"event":"subscription_created"}';
    const signature = 'invalid';
    const valid = await verifySignature(payload, signature, SECRET);
    expect(valid).toBe(false);
  });

  it('rejects modified payload', async () => {
    const original = '{"event":"subscription_created"}';
    const modified = '{"event":"subscription_cancelled"}';
    const signature = createSignature(original, SECRET);
    const valid = await verifySignature(modified, signature, SECRET);
    expect(valid).toBe(false);
  });
});
```

### Integration Tests
- Use Lemon Squeezy test mode webhooks
- Store real webhook payloads as fixtures
- Test idempotency with duplicate sends
- Verify OpenPanel events with real API (separate test project)
- Test error scenarios (invalid signature, rate limit, etc.)

### Local Testing
- Use ngrok/localtunnel to expose localhost
- Configure Lemon Squeezy webhook to local URL
- Monitor webhook delivery in Lemon Squeezy dashboard
- Test signature verification with real payloads
- Verify OpenPanel events in test project

## Sources

**Lemon Squeezy Webhooks:**
- [Guides: Sync With Webhooks • Lemon Squeezy](https://docs.lemonsqueezy.com/guides/developer-guide/webhooks)
- [Docs: Webhook Requests • Lemon Squeezy](https://docs.lemonsqueezy.com/help/webhooks/webhook-requests)
- [Debugging Invalid Webhook Signatures | Medium](https://sachinmittal98.medium.com/debugging-invalid-webhook-signatures-9e92017ea548)

**Webhook Security:**
- [The Webhook Trap: Securing the "Reverse" API Entry Point | Medium](https://medium.com/@instatunnel/the-webhook-trap-securing-the-reverse-api-entry-point-1f95b89aa63e)
- [Common Webhook Signatures Failure Modes | Svix Blog](https://www.svix.com/blog/common-failure-modes-for-webhook-signatures/)
- [Webhook Security Vulnerabilities Guide | Hookdeck](https://hookdeck.com/webhooks/guides/webhook-security-vulnerabilities-guide)

**Remix Webhooks:**
- [Resource Routes | Remix](https://remix.run/docs/en/main/guides/resource-routes)
- [Handle Stripe webhooks in Remix | GitHub Gist](https://gist.github.com/cjavilla-stripe/241682c549292bc21165744401d38793)
- [How do I implement HMAC signature for webhook verification in a Remix](https://community.shopify.com/c/shopify-apps/how-do-i-implement-hmac-signature-for-webhook-verification-in-a/td-p/2539131)

**Idempotency:**
- [How to Implement Webhook Idempotency | Hookdeck](https://hookdeck.com/webhooks/guides/implement-webhook-idempotency)
- [Webhooks at Scale: Designing an Idempotent, Replay-Safe System | DEV](https://dev.to/art_light/webhooks-at-scale-designing-an-idempotent-replay-safe-and-observable-webhook-system-7lk)
- [Handling Payment Webhooks Reliably (Idempotency, Retries, Validation) | Medium](https://medium.com/@sohail_saifii/handling-payment-webhooks-reliably-idempotency-retries-validation-69b762720bf5)

**OpenPanel Server-Side:**
- [Track | OpenPanel](https://openpanel.dev/docs/api/track)
- [Common Mistakes in Server-Side Tracking Setup | Medium](https://medium.com/@pritikadb3/common-mistakes-in-server-side-tracking-setup-and-how-to-avoid-them-8ccd43eb6e0d)

**Retry Patterns:**
- [How to Implement Webhook Retry Logic | Latenode](https://latenode.com/blog/integration-api-management/webhook-setup-configuration/how-to-implement-webhook-retry-logic)
- [Webhook Retry Best Practices | Svix Resources](https://www.svix.com/resources/webhook-best-practices/retries/)
- [Handling failed webhooks with Exponential Backoff | Medium](https://medium.com/wellhub-tech-team/handling-failed-webhooks-with-exponential-backoff-72d2e01017d7)

**Environment Security:**
- [Securing Environment Variables in Remix | Medium](https://vitalii4reva.medium.com/securing-environment-variables-in-remix-a-practical-guide-4a51297d3487)
- [Are environment variables still safe for secrets in 2026? | Security Boulevard](https://securityboulevard.com/2025/12/are-environment-variables-still-safe-for-secrets-in-2026/)

---
*Webhook & server-side analytics pitfalls for Lemon Squeezy + OpenPanel integration*
*Researched: 2026-01-27*
*Confidence: HIGH - Verified with official docs and webhook security best practices*
