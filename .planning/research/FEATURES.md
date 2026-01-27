# Feature Research

**Domain:** Analytics Integration (OpenPanel) + Payment Webhooks (Lemon Squeezy)
**Researched:** 2026-01-25 (OpenPanel), 2026-01-27 (Lemon Squeezy)
**Confidence:** HIGH

---

## OpenPanel Features (Existing)

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Pageview tracking | Basic web analytics requirement | LOW | Auto via `trackScreenViews: true` config |
| Custom event tracking | Core analytics capability | LOW | `track(name, properties)` method |
| Event properties/metadata | Context for events | LOW | Supports string, number, boolean types |
| User identification | Connect events to users | LOW | `identify()` method with profileId |
| Real-time event processing | Data visible immediately | LOW | Built-in, no config needed |
| Client-side SDK | Browser event tracking | LOW | Web SDK or script tag |
| Privacy compliance (GDPR) | Legal requirement EU markets | LOW | Cookieless tracking built-in |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valuable.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Cookieless tracking | Works when cookies blocked, no consent banner | LOW | Uses fingerprinting + session-based tracking |
| Data attributes tracking | Track events without JavaScript | LOW | `data-track` and `data-*` attributes on HTML |
| Self-hosting option | Full data sovereignty | MEDIUM | Open-source, deploy anywhere |
| Smart notifications | Alert on event/funnel conditions | MEDIUM | Custom triggers for Slack/email |
| Transparent pricing | Predictable costs vs event-based pricing | LOW | Not implementation feature |
| Multi-platform SDKs | Consistent API across platforms | LOW | 15+ SDKs (web, mobile, server) |
| Funnels | Conversion path analysis | LOW | Built-in dashboard feature |
| Cohorts | User segmentation | MEDIUM | Group users by behavior |
| A/B testing support | Variant tracking built-in | MEDIUM | Track variants in events |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Session replay | "Want to see user behavior" | Privacy concerns, performance cost, storage explosion | Use funnels + user profiles to understand behavior |
| Heatmaps | "Visualize clicks/scrolls" | Heavy client payload, privacy issues | Use event tracking with position properties |
| Automatic everything tracking | "Don't want to instrument code" | Noisy data, unclear events, hard to filter | Manual tracking = intentional data |
| Cookie-based persistence | "Better cross-session tracking" | GDPR issues, cookie consent fatigue | Cookieless fingerprinting sufficient |
| Server-side tracking for marketing site | "More accurate data" | Complexity for minimal gain on static site | Client-side sufficient for this use case |

---

## Lemon Squeezy Webhook Features (New Milestone)

### Table Stakes (Webhook Integration Basics)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Signature verification | Security requirement for webhooks | LOW | HMAC-SHA256 with X-Signature header |
| 200 response on success | Standard webhook protocol | LOW | Acknowledge receipt immediately |
| Event filtering | Process only relevant events | LOW | Filter by meta.event_name |
| Payload parsing | Access event data | LOW | JSON:API format with meta/data/relationships |
| Error handling | Handle validation/processing failures | LOW | Return non-200 triggers retry |
| Idempotency | Handle duplicate deliveries | MEDIUM | Use event ID or order ID to dedupe |

### Signature Verification (Critical Security Feature)

**Method:** HMAC-SHA256 hex digest
**Header:** `X-Signature`
**Algorithm:** `crypto.createHmac('sha256', secret).update(rawBody).digest('hex')`
**Comparison:** `crypto.timingSafeEqual()` to prevent timing attacks

**Implementation Requirements:**
- MUST use raw request body (not parsed JSON)
- MUST use timing-safe comparison
- Secret configured at webhook creation: `162cf4f57ba3212`
- Signature mismatch → return 401/403 → no retry

**Critical:** Remix body parsers modify raw body. Must access raw body BEFORE parsing.

### Response Requirements

| Scenario | Status Code | Retry Behavior | Notes |
|----------|-------------|----------------|-------|
| Success | 200 | No retry | Only 200 signals success |
| Invalid signature | 401/403 | No retry | Security rejection |
| Processing error | 500/502/503 | Retry 3x | 5s, 25s, 125s exponential backoff |
| Timeout | 504 | Retry 3x | Same backoff as 5xx |
| Any non-200 | Varies | Retry 3x max | After 3 failures, stops permanently |

**Timeout:** Not explicitly documented. Assume < 30 seconds based on standard webhook patterns.

**Best Practice:** Return 200 immediately, process asynchronously. Don't block on OpenPanel API call.

### Event Types for This Integration

| Event Name | Trigger | When to Process | Data Available |
|------------|---------|-----------------|----------------|
| `order_created` | Purchase completed | Always | user_name, user_email, subtotal_usd |
| `subscription_created` | Recurring payment started | Always | Same as order_created |
| `order_refunded` | Payment reversed | Skip for now | Could invalidate OpenPanel event |
| `subscription_payment_success` | Renewal succeeded | Skip for now | Future: track LTV |
| `subscription_cancelled` | Customer cancelled | Skip for now | Future: churn tracking |

**MVP Scope:** Filter for `order_created` and `subscription_created` only.

### Payload Structure (JSON:API Format)

```javascript
{
  "meta": {
    "event_name": "order_created",        // Filter on this
    "custom_data": {...}                   // Optional checkout data
  },
  "data": {
    "type": "orders",
    "id": "123456",
    "attributes": {
      "user_name": "John Doe",             // Send to OpenPanel
      "user_email": "john@example.com",    // Send to OpenPanel
      "subtotal_usd": 4900,                // Send to OpenPanel (cents)
      "created_at": "2026-01-27T...",
      // ... many other fields
    }
  },
  "relationships": {...}                   // Related resources
}
```

**Headers Sent:**
- `Content-Type: application/json`
- `X-Event-Name: order_created` (redundant with meta.event_name)
- `X-Signature: abc123...` (HMAC-SHA256 hex)

### OpenPanel Integration Mapping

| Lemon Squeezy Field | OpenPanel Event Property | Notes |
|---------------------|-------------------------|-------|
| `data.attributes.user_email` | `user_email` | Identifier |
| `data.attributes.user_name` | `user_name` | Display name |
| `data.attributes.subtotal_usd` | `subtotal_usd` | Convert cents → dollars? |
| `meta.event_name` | Event name: "purchase" | Or use "order_created" directly |
| `data.id` | `order_id` | For deduplication |

**OpenPanel Call:**
```javascript
openpanel.track('purchase', {
  user_email: payload.data.attributes.user_email,
  user_name: payload.data.attributes.user_name,
  subtotal_usd: payload.data.attributes.subtotal_usd / 100, // cents → dollars
  order_id: payload.data.id,
  event_source: 'lemon_squeezy'
});
```

### Differentiators (Lemon Squeezy Specific)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Test mode simulation | Trigger events manually | LOW | Use dashboard "Simulate event" |
| Custom data pass-through | Checkout → webhook metadata | LOW | Access via meta.custom_data |
| Retry visibility | See failed deliveries in dashboard | LOW | Built-in monitoring |
| Webhook history | Review past deliveries | LOW | Audit log in dashboard |

### Anti-Features (Webhook Integration)

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Synchronous processing | Blocks response, causes timeouts | Return 200, queue job |
| Skipping signature verification | Security vulnerability | Always verify before processing |
| No idempotency handling | Process duplicates on retry | Track order_id, skip if seen |
| Storing raw webhook payloads | Storage bloat | Store only extracted fields |
| Processing all event types | Unnecessary complexity | Filter for order_created, subscription_created |
| Relying on X-Event-Name header | Can be spoofed | Use meta.event_name from body |

### Error Scenarios

| Error Type | Detection | Handling | User Impact |
|------------|-----------|----------|-------------|
| Invalid signature | Signature mismatch | Return 403, log warning | None (attacker) |
| Missing required fields | Payload validation | Return 500, log error, retry | Retry succeeds |
| OpenPanel API failure | HTTP error | Log, return 200 anyway | Event lost, acceptable |
| Duplicate delivery | order_id seen before | Return 200, skip processing | None (idempotent) |
| Unknown event type | event_name not in filter | Return 200, skip processing | None (filtered) |

**Critical Decision:** If OpenPanel fails, still return 200. Don't retry webhook for analytics failures.

### Feature Dependencies

```
[Webhook Endpoint]
    └──requires──> [Raw Body Access]
                      └──requires──> [Custom Remix Loader/Action]
                                        └──enables──> [Signature Verification]
                                                         └──enables──> [Event Processing]
                                                                          └──enables──> [OpenPanel Tracking]

[Idempotency]
    └──requires──> [Order ID Storage]
                      └──requires──> [KV Store or Database]

[Async Processing]
    └──requires──> [Queue System]
                      └──optional──> [For MVP: sync is acceptable]
```

**Dependency Notes:**
- Signature verification blocks all processing (security gate)
- Raw body access required before any JSON parsing
- Idempotency optional for MVP if retry window small
- OpenPanel server-side SDK required (not browser SDK)

### MVP Definition (Webhook Integration)

#### Launch With (v1)

- [ ] POST endpoint at `/api/v1/integrations/lemon-squeezy-webhook/:id`
- [ ] Raw body extraction in Remix action
- [ ] HMAC-SHA256 signature verification with timing-safe comparison
- [ ] Event filtering (order_created, subscription_created)
- [ ] Extract user_name, user_email, subtotal_usd
- [ ] Send to OpenPanel server-side
- [ ] Return 200 immediately
- [ ] Basic error logging (signature failures, missing fields)

#### Add After Validation (v1.x)

- [ ] Idempotency tracking (store order IDs)
- [ ] Async queue processing (if webhook volume increases)
- [ ] Webhook delivery monitoring dashboard
- [ ] Process additional events (subscription_payment_success)
- [ ] Enhanced error alerting (Slack/email)
- [ ] Retry failed OpenPanel calls

#### Future Consideration (v2+)

- [ ] Webhook signature rotation support
- [ ] Custom data pass-through from checkout
- [ ] Refund event handling (invalidate OpenPanel events)
- [ ] Subscription lifecycle tracking (renewals, churn)
- [ ] Revenue analytics in OpenPanel

---

## Combined Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| **OpenPanel (Existing)** |
| Pageview tracking | HIGH | LOW | P1 ✓ |
| Click event tracking | HIGH | LOW | P1 ✓ |
| Form submission tracking | HIGH | LOW | P1 ✓ |
| Video play tracking | MEDIUM | MEDIUM | P1 ✓ |
| **Lemon Squeezy Webhooks (New)** |
| Webhook endpoint | HIGH | LOW | P1 |
| Signature verification | HIGH | LOW | P1 |
| Event filtering | HIGH | LOW | P1 |
| OpenPanel integration | HIGH | LOW | P1 |
| 200 response pattern | HIGH | LOW | P1 |
| Idempotency | MEDIUM | MEDIUM | P2 |
| Async processing | LOW | HIGH | P3 |
| Additional event types | MEDIUM | LOW | P2 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

---

## Implementation Complexity Notes

### Low Complexity (< 1 hour)
- Remix action with raw body access
- HMAC-SHA256 signature verification
- Event name filtering (if/else)
- Field extraction from payload
- OpenPanel track() call

### Medium Complexity (1-3 hours)
- Idempotency with KV storage
- Error logging infrastructure
- Test mode webhook simulation
- Edge cases (missing fields, malformed JSON)

### High Complexity (3+ hours)
- Async queue system integration
- Webhook monitoring dashboard
- Signature rotation support
- Complex event orchestration (refunds)

---

## Lemon Squeezy Anti-Patterns

Based on official documentation and best practices:

1. **Synchronous processing in webhook handler**
   - Causes: Timeouts, failed deliveries, retry loops
   - DO: Return 200 immediately, process async

2. **Skipping signature verification**
   - Causes: Security vulnerability, spoofed webhooks
   - DO: Always verify X-Signature with timing-safe comparison

3. **Using parsed body for signature verification**
   - Causes: Signature mismatch (body transformation breaks hash)
   - DO: Use raw body string before JSON.parse()

4. **No idempotency handling**
   - Causes: Duplicate OpenPanel events on retry
   - DO: Track order_id, skip if already processed

5. **Processing all event types**
   - Causes: Unnecessary complexity, edge cases
   - DO: Filter for only needed events

6. **Failing webhook on downstream API errors**
   - Causes: Retry loop for analytics failures
   - DO: Return 200 even if OpenPanel fails, log error

7. **Hardcoding webhook secret in code**
   - Causes: Secret exposed in git, can't rotate
   - DO: Use environment variable

---

## Sources

### Lemon Squeezy Official Documentation (HIGH confidence)

- [Signing Requests](https://docs.lemonsqueezy.com/help/webhooks/signing-requests) - HMAC-SHA256 verification
- [Webhook Requests](https://docs.lemonsqueezy.com/help/webhooks/webhook-requests) - Response codes, retry behavior
- [Sync With Webhooks Guide](https://docs.lemonsqueezy.com/guides/developer-guide/webhooks) - Event types, best practices
- [Webhooks Overview](https://docs.lemonsqueezy.com/help/webhooks) - Dashboard setup
- [The Webhook Object API](https://docs.lemonsqueezy.com/api/webhooks/the-webhook-object) - Programmatic setup

### Lemon Squeezy Guides (MEDIUM confidence)

- [Receive Webhooks in Next.js](https://docs.lemonsqueezy.com/guides/tutorials/webhooks-nextjs) - Implementation patterns
- [Medium: Lemon Squeezy Webhooks with Next.js](https://medium.com/@elior238/how-to-verify-and-subscribe-to-lemon-squeezy-webhooks-using-next-js-api-routes-54b0e784b58a) - Practical examples

### OpenPanel Official Documentation (HIGH confidence)

- [OpenPanel Track API](https://openpanel.dev/docs/api/track)
- [Track Events Guide](https://openpanel.dev/docs/get-started/track-events)
- [Web SDK Documentation](https://openpanel.dev/docs/sdks/web)
- [Next.js SDK Documentation](https://openpanel.dev/docs/sdks/nextjs)
- [SDKs Overview](https://openpanel.dev/docs/sdks)

### Comparison & Features (MEDIUM confidence)

- [OpenPanel vs Mixpanel](https://openpanel.dev/articles/vs-mixpanel)
- [Mixpanel Alternatives Article](https://openpanel.dev/articles/mixpanel-alternatives)
- [GitHub Repository](https://github.com/Openpanel-dev/openpanel)

### General Best Practices (MEDIUM confidence)

- [Event Naming Conventions - Wudpecker](https://www.wudpecker.io/blog/simple-event-naming-conventions-for-product-analytics)
- [Analytics Event Management - Medium](https://medium.com/@maremeinhard/effective-strategies-for-analytics-event-naming-and-management-8ff2f3b44e3f)
- [Twilio Segment Naming Conventions](https://segment.com/academy/collecting-data/naming-conventions-for-clean-data/)

---

*Feature research for: OpenPanel Analytics Integration + Lemon Squeezy Webhook Integration*
*Researched: 2026-01-25 (OpenPanel), 2026-01-27 (Lemon Squeezy)*
*Confidence: HIGH*
