# Stack Research: OpenPanel Analytics Integration

**Domain:** Analytics Integration for Remix SSR Marketing Site
**Researched:** 2026-01-25
**Updated:** 2026-01-27 (Webhook integration milestone)
**Confidence:** HIGH

## Recommended Stack

### Core Package

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| @openpanel/web | 1.0.7 | Client-side analytics SDK | Official OpenPanel package, TypeScript support, modern API matching Mixpanel patterns, tiny bundle, privacy-first (no cookies) |

### Supporting Approach

| Approach | Purpose | When to Use |
|----------|---------|-------------|
| Direct API calls | Server-side tracking | For SSR pageviews, form submissions requiring `clientSecret`, any analytics event from Remix loaders/actions |
| SDK global properties | Persistent attributes | Track user context, subscription status, feature flags across all events |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| TypeScript types | Type safety | Built-in with @openpanel/web (codebase is 84.7% TypeScript) |
| Browser DevTools | Debug tracking | OpenPanel has `debug` mode similar to Mixpanel |

## Installation

```bash
# Core client-side SDK
npm install @openpanel/web
```

No additional packages needed. OpenPanel runs alongside existing Mixpanel and Vercel Analytics without conflicts.

---

## Webhook Integration Stack (Added 2026-01-27)

### Zero Dependencies Required for Webhooks

| What | Decision | Rationale |
|------|----------|-----------|
| Webhook signature verification | Node.js built-in `crypto` module | HMAC-SHA256 verification requires no dependencies. Available since Node 0.10, stable API. |
| HTTP client for OpenPanel API | Node.js built-in `fetch` | Native fetch available in Node 18+. Project requires Node >=18 per package.json. No need for axios/node-fetch. |
| Environment variables | `.env` file (existing pattern) | Remix supports process.env natively. No dotenv needed in production. |

### Environment Variables for Webhooks

Add to `.env` (development) and deployment environment:

```bash
# Lemon Squeezy
LEMON_SQUEEZY_WEBHOOK_SECRET=your_signing_secret_here

# OpenPanel (server-side)
OPENPANEL_CLIENT_ID=c1eb2b83-2218-46cd-907b-ce5681c8ad76
OPENPANEL_CLIENT_SECRET=your_secret_here
```

**Why these specific variables:**
- `LEMON_SQUEEZY_WEBHOOK_SECRET`: Per [Lemon Squeezy signing docs](https://docs.lemonsqueezy.com/help/webhooks/signing-requests), webhook signature verification requires the signing secret configured when creating the webhook
- `OPENPANEL_CLIENT_ID`: Already known (c1eb2b83-2218-46cd-907b-ce5681c8ad76)
- `OPENPANEL_CLIENT_SECRET`: Per [OpenPanel authentication docs](https://openpanel.dev/docs/api/authentication), server-side API requires both client ID and secret in headers to prevent unauthorized requests (CORS not applicable server-side)

### Webhook Signature Verification Implementation

**Algorithm:** HMAC-SHA256 hex digest
**Header:** `X-Signature`
**Comparison:** `crypto.timingSafeEqual()` (prevents timing attacks)

```typescript
import crypto from "node:crypto";

// In resource route action
const rawBody = await request.text();
const signature = request.headers.get("X-Signature");

const hmac = crypto.createHmac("sha256", process.env.LEMON_SQUEEZY_WEBHOOK_SECRET);
const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
const expected = Buffer.from(signature || "", "utf8");

if (!crypto.timingSafeEqual(digest, expected)) {
  return json({ error: "Invalid signature" }, 401);
}

// CRITICAL: Parse JSON AFTER verification
const payload = JSON.parse(rawBody);
```

**Why this approach:**
- Must use `request.text()` before JSON parsing (per [Remix webhook patterns](https://community.shopify.com/c/shopify-apps/how-do-i-implement-hmac-signature-for-webhook-verification-in-a/td-p/2539131)) - JSON parsing alters raw body causing signature mismatch
- `timingSafeEqual()` prevents timing attacks (security best practice per [Node crypto docs](https://nodejs.org/api/crypto.html))
- Lemon Squeezy uses hex encoding (not base64 like Stripe/Shopify)

### OpenPanel Server-Side Tracking via Webhooks

**Endpoint:** `https://api.openpanel.dev/track`
**Method:** POST
**Headers:**
- `Content-Type: application/json`
- `openpanel-client-id: {client_id}`
- `openpanel-client-secret: {client_secret}`

```typescript
const response = await fetch("https://api.openpanel.dev/track", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "openpanel-client-id": process.env.OPENPANEL_CLIENT_ID,
    "openpanel-client-secret": process.env.OPENPANEL_CLIENT_SECRET,
  },
  body: JSON.stringify({
    type: "track",
    payload: {
      name: "order_created",
      properties: {
        user_email: data.attributes.user_email,
        user_name: data.attributes.user_name,
        subtotal_usd: data.attributes.subtotal_usd,
      },
    },
  }),
});
```

**Why this approach:**
- Native fetch available in Node 18+ (no axios needed)
- Per [OpenPanel Track API docs](https://openpanel.dev/docs/api/track), server-side requires both client ID and secret (different from client-side SDK which only uses ID)
- Payload format: `{ type: "track", payload: { name, properties } }`

### What NOT to Add for Webhooks

| Library | Why NOT | Alternative |
|---------|---------|-------------|
| `@lemonsqueezy/lemonsqueezy.js` | SDK is for API calls (creating checkouts, etc), not webhook verification. Adds 200KB+ dependency for functionality we don't need. | Node crypto module |
| `axios` / `node-fetch` | Native fetch available in Node 18+. Remix requires >=18 per package.json. | Native fetch |
| `dotenv` | Remix loads .env automatically in development. Production uses platform env vars. | Built-in |
| `express-raw-body` | Remix Request API provides `.text()` natively. No Express middleware needed. | `request.text()` |
| `@openpanel/sdk` | Designed for client-side or Next.js. Direct API call simpler for single-purpose webhook. | Native fetch |

### Remix Resource Route Pattern for Webhooks

Create route at: `app/routes/api.v1.integrations.lemon-squeezy-webhook.$id.ts`

**Why this path:**
- Remix file-based routing: dots → path segments
- `api.v1.integrations.lemon-squeezy-webhook.$id.ts` → `/api/v1/integrations/lemon-squeezy-webhook/:id`
- `$id` dynamic segment allows webhook URL variation if needed later

```typescript
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

// No default export = resource route (not UI)
export const action = async ({ request }: ActionFunctionArgs) => {
  // Webhook logic here
};
```

**Why resource route:**
- Per [Remix resource routes guide](https://v2.remix.run/docs/guides/resource-routes/), routes without default component export are API endpoints
- Action function handles POST requests
- Returns Response directly to caller (Lemon Squeezy)

### Request Body Handling

**CRITICAL:** Clone request before reading body if you need it multiple times.

```typescript
const rawBody = await request.text();
// request.text() can only be called ONCE per request
// If you need both raw and parsed:
const payload = JSON.parse(rawBody);
```

**Why:**
- Request body is a stream, can only be consumed once
- Must verify signature with raw body BEFORE parsing
- Per [webhook verification best practices](https://stenzr.medium.com/intercepting-raw-http-request-bodies-ensuring-security-and-authenticity-in-webhooks-and-api-3b365b8a795b)

### Webhook Error Handling

```typescript
// Signature verification
if (!crypto.timingSafeEqual(digest, expected)) {
  return json({ error: "Invalid signature" }, 401);
}

// OpenPanel API call
const response = await fetch(/* ... */);
if (!response.ok) {
  console.error("OpenPanel API error:", await response.text());
  // Still return 200 to Lemon Squeezy to prevent retries
  return json({ received: true }, 200);
}
```

**Why:**
- Return 401 for signature failures (reject invalid webhooks)
- Return 200 even if OpenPanel fails (prevent Lemon Squeezy retry storms)
- Log OpenPanel failures for monitoring but acknowledge webhook receipt

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| @openpanel/web SDK | Script tag approach | Only if build process unavailable or prototype/quick test (no TypeScript, no tree-shaking, less control) |
| @openpanel/web | @openpanel/nextjs | Only if migrating to Next.js (not applicable for Remix v2) |
| Client-side SDK | Server-only tracking | Never for marketing site (lose client interactions, no scroll events, no exit-intent detection) |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Script tag CDN approach | Codebase uses TypeScript + bundler, loses type safety, no version lock, adds external dependency | @openpanel/web npm package |
| clientSecret in client code | Security risk - allows anyone to send server events as your app, explicitly warned in docs | Keep clientSecret server-only, use in Remix loaders/actions |
| Removing Mixpanel/Vercel | Requirement is additive, not replacement | Run all three analytics in parallel |
| @openpanel/react-native | Wrong platform (mobile-only, v1.0.5) | @openpanel/web for browser |

## Stack Pattern for Remix SSR Marketing Site

**Client-side initialization (app/routes/_index.jsx pattern):**
```typescript
import { OpenPanel } from '@openpanel/web';

const op = new OpenPanel({
  clientId: 'c1eb2b83-2218-46cd-907b-ce5681c8ad76',
  trackScreenViews: true,      // Auto-track navigation (like Mixpanel)
  trackOutgoingLinks: true,    // Track external clicks
  trackAttributes: true,       // Enable data-track HTML attributes
});

// Track custom events (matches Mixpanel pattern)
op.track('Click', { navbar: 'Overview' });
```

**Server-side tracking (Remix loader/action pattern):**
```typescript
// In loader or action only
import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  // Server-side event via fetch API
  await fetch('https://api.openpanel.dev/track', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'openpanel-client-id': process.env.OPENPANEL_CLIENT_ID,
      'openpanel-client-secret': process.env.OPENPANEL_CLIENT_SECRET, // Server-only!
    },
    body: JSON.stringify({
      type: 'track',
      payload: { name: 'ssr_pageview', properties: { path: new URL(request.url).pathname } }
    })
  });

  return json({ data: 'your data' });
};
```

**Rationale for SDK vs API approach:**
- **Client-side:** Use @openpanel/web SDK (cleaner API, type safety, automatic session handling, matches existing Mixpanel pattern)
- **Server-side:** Use direct API calls (no official Remix SDK exists, avoid pulling server SDK for minimal usage, Remix loaders already have fetch)

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| @openpanel/web@1.0.7 | React 18 | No React dependency - vanilla JS SDK that works in any browser |
| @openpanel/web@1.0.7 | Remix v2 | Framework-agnostic, works in any SSR setup |
| @openpanel/web@1.0.7 | TypeScript 5+ | Built-in types, no @types package needed |
| @openpanel/web@1.0.7 | mixpanel-browser@2.48.1 | No conflicts - different global scope |
| @openpanel/web@1.0.7 | @vercel/analytics@1.1.1 | No conflicts - different tracking approaches |
| Node.js crypto | Node 18+ | Built-in module, used for webhook signature verification |
| Node.js fetch | Node 18+ | Built-in, used for OpenPanel server-side API calls |

**Browser compatibility:** Modern browsers (ES6+). No specific minimum version documented, but TypeScript 84.7% codebase implies modern target. Same tier as existing Mixpanel/Vercel setup.

## Migration from Mixpanel API Pattern

**Similar API surface:**
| Mixpanel | OpenPanel | Notes |
|----------|-----------|-------|
| `mixpanel.init(token, config)` | `new OpenPanel({ clientId, ...config })` | Constructor pattern vs global init |
| `mixpanel.track(name, props)` | `op.track(name, props)` | Identical signature |
| `mixpanel.identify(userId)` | `op.identify({ profileId: userId })` | OpenPanel uses object argument |
| `localStorage` persistence | Session-based tracking | OpenPanel is cookieless, no localStorage by default |

**Key differences:**
- OpenPanel uses `clientId` (visible client-side) + `clientSecret` (server-only) vs Mixpanel's single token
- OpenPanel auto-tracks via fingerprinting (no cookies), Mixpanel uses distinct_id in localStorage
- OpenPanel has no consent banner requirement (privacy-first), Mixpanel needs GDPR consent for localStorage

**Confidence:** HIGH - Both APIs verified via official docs (openpanel.dev/docs/sdks/web, openpanel.dev/docs/api/track)

## Privacy & Compliance

**OpenPanel advantages over Mixpanel:**
- No cookies (cookieless tracking via fingerprinting)
- No localStorage persistence by default
- GDPR & CCPA compliant out of box
- No consent banner needed

**Implication:** Existing codebase has concern flagged: "Mixpanel initialized with localStorage persistence but no consent management" (.planning/codebase/CONCERNS.md line 26). OpenPanel sidesteps this entirely.

**Confidence:** HIGH - Verified via openpanel.dev/articles/cookieless-analytics and openpanel.dev/articles/better-compliance-self-hosted-analytics

## Performance Characteristics

**Bundle size:** "Tiny, high-performance tracker" per official marketing. No specific KB measurement found in docs.

**Comparison to Mixpanel:** "Mixpanel might be a bit faster but it's not a big difference" per OpenPanel's own comparison. Real-time dashboards with "seconds" latency.

**Network:** Single endpoint (api.openpanel.dev/track) vs Mixpanel's multiple subdomains. Simpler CORS/CSP config.

**Confidence:** MEDIUM - Based on marketing claims and comparison article. No hard benchmarks or bundle size analysis found.

## Event Tracking Coverage

**Required events from PROJECT.md:**
- ✅ Pageviews: `trackScreenViews: true` auto-tracks (client) + manual SSR tracking (server)
- ✅ Clicks: `op.track('Click', { ...props })` (same pattern as Mixpanel)
- ✅ Form submissions: `op.track('Form Submit', { ...props })` in submit handler
- ✅ Video plays: `op.track('Video Play', { ...props })` on play event
- ✅ Webhook events: Server-side tracking via fetch API in resource routes (order_created, subscription_created)

**Tracking parity:** OpenPanel API is functionally equivalent to Mixpanel for all current use cases in codebase. Same event/properties model.

**Confidence:** HIGH - API verified via official docs

## Version Summary

| Technology | Version | Source |
|------------|---------|--------|
| @openpanel/web | 1.0.7 | npm registry |
| Node.js | >=18.0.0 | Required by project (package.json) |
| `node:crypto` | Built-in | Native module |
| `fetch` | Built-in | Native in Node 18+ |
| Remix | 2.2.0 | Existing (package.json) |

## Sources

**Official Documentation:**
- [OpenPanel Web SDK](https://openpanel.dev/docs/sdks/web) - Installation, config, React patterns (HIGH confidence)
- [OpenPanel API Specification](https://openpanel.dev/docs/api/track) - Server-side tracking endpoint (HIGH confidence)
- [OpenPanel Authentication](https://openpanel.dev/docs/api/authentication) - Client ID/secret requirements (HIGH confidence)
- [OpenPanel React Integration](https://openpanel.dev/docs/sdks/react) - React-specific guidance (HIGH confidence)
- [OpenPanel SDKs Overview](https://openpanel.dev/docs/sdks) - Available SDK options (HIGH confidence)

**NPM Registry:**
- [@openpanel/web v1.0.7](https://www.npmjs.com/package/@openpanel/web) - Current version, published within last week (HIGH confidence)

**Comparison & Privacy:**
- [OpenPanel vs Mixpanel](https://openpanel.dev/articles/vs-mixpanel) - Feature comparison (MEDIUM confidence - marketing page)
- [Cookieless Analytics](https://openpanel.dev/articles/cookieless-analytics) - Privacy approach (MEDIUM confidence - marketing)
- [Better Compliance Self-Hosted](https://openpanel.dev/articles/better-compliance-self-hosted-analytics) - GDPR/CCPA (MEDIUM confidence - marketing)

**Webhook Integration:**
- [Lemon Squeezy Webhook Signing](https://docs.lemonsqueezy.com/help/webhooks/signing-requests) - Official signature verification docs (HIGH confidence)
- [Lemon Squeezy Webhook Developer Guide](https://docs.lemonsqueezy.com/guides/developer-guide/webhooks) - Integration patterns (HIGH confidence)

**Community:**
- [OpenPanel GitHub](https://github.com/Openpanel-dev/openpanel) - Codebase, TypeScript adoption (HIGH confidence - 1,258 commits, active)
- [Hacker News Discussion](https://news.ycombinator.com/item?id=40432213) - Community reception (LOW confidence - anecdotal)

**Remix Patterns:**
- [Remix Environment Variables](https://remix.run/docs/en/main/guides/envvars) - How to handle clientSecret server-side (HIGH confidence - official Remix docs)
- [Remix Resource Routes Guide](https://v2.remix.run/docs/guides/resource-routes/) - Webhook endpoint pattern (HIGH confidence - official Remix docs)
- [Shopify Remix Webhook Discussion](https://community.shopify.com/c/shopify-apps/how-do-i-implement-hmac-signature-for-webhook-verification-in-a/td-p/2539131) - Raw body handling (MEDIUM confidence - community)

**Node.js:**
- [Crypto Module Documentation](https://nodejs.org/api/crypto.html) - HMAC verification (HIGH confidence - official Node.js docs)
- [Authgear HMAC Guide](https://www.authgear.com/post/generate-verify-hmac-signatures) - Security best practices (MEDIUM confidence)

**Security:**
- [Raw HTTP Request Bodies](https://stenzr.medium.com/intercepting-raw-http-request-bodies-ensuring-security-and-authenticity-in-webhooks-and-api-3b365b8a795b) - Why raw body verification matters (MEDIUM confidence)

---
*Stack research for: OpenPanel analytics integration into Remix v2 SSR marketing site*
*Initial research: 2026-01-25*
*Webhook integration update: 2026-01-27*
*Current versions: @openpanel/web@1.0.7, existing stack Remix v2 + React 18 + mixpanel-browser@2.48.1 + @vercel/analytics@1.1.1*
