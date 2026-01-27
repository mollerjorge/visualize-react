# Architecture Research

**Domain:** OpenPanel analytics integration with Remix SSR
**Researched:** 2026-01-25
**Last Updated:** 2026-01-27 (Lemon Squeezy webhook integration added)
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Client)                         │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │ Header  │  │  Hero   │  │ Pricing │  │  Modal  │        │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘        │
│       │            │            │            │              │
│       └────────────┴────────────┴────────────┘              │
│                      │                                       │
│       ┌──────────────▼──────────────┐                       │
│       │   OpenPanel Web SDK         │                       │
│       │   (client-side tracking)    │                       │
│       └──────────────┬──────────────┘                       │
│                      │                                       │
├──────────────────────┼───────────────────────────────────────┤
│         Remix SSR    │                                       │
├──────────────────────┼───────────────────────────────────────┤
│  ┌───────────────────▼────────────────────┐                 │
│  │         root.tsx (App Shell)           │                 │
│  │  - Script tag injection                │                 │
│  │  - Vercel Analytics component          │                 │
│  └────────────────────────────────────────┘                 │
│  ┌─────────────────────────────────────────┐                │
│  │       _index.jsx (Route)                │                │
│  │  - Mixpanel init (client-side)          │                │
│  │  - Exit-intent modal logic              │                │
│  └─────────────────────────────────────────┘                │
│  ┌─────────────────────────────────────────┐                │
│  │ api.v1.integrations.                    │ ◄─── Lemon     │
│  │   lemon-squeezy-webhook.$id.tsx         │      Squeezy   │
│  │ (NEW: Server-side webhook handler)      │      Webhooks  │
│  └───────────────┬─────────────────────────┘                │
│                  │                                           │
├──────────────────┼───────────────────────────────────────────┤
│                  │     OpenPanel API                         │
│  ┌───────────────▼──────────────────────────────┐           │
│  │     Event Collection Service                 │           │
│  │  - Client SDK events (browser)               │           │
│  │  - Server-side events (webhook handler) ◄────┘           │
│  └──────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| root.tsx | App shell, global scripts, meta tags | Script tag injection in <head> or <body> |
| _index.jsx | Route-level logic, analytics init | Client-side SDK initialization in useEffect |
| OpenPanel SDK | Event tracking, user identification | npm package or script tag |
| entry.client.tsx | Client hydration | Standard Remix hydration (no analytics) |
| entry.server.tsx | SSR rendering | Standard Remix SSR (no analytics) |
| **Webhook Route** | **Webhook verification, server-side tracking** | **Resource route with action export** |

## Recommended Project Structure

```
app/
├── root.tsx              # Script tag injection (RECOMMENDED)
├── routes/
│   ├── _index.jsx        # Route-level SDK init (ALTERNATIVE)
│   └── api.v1.integrations.lemon-squeezy-webhook.$id.tsx  # NEW: Webhook handler
├── entry.client.tsx      # Client hydration entry
├── entry.server.tsx      # SSR entry
├── utils/
│   └── analytics.ts      # Centralized tracking utils (FUTURE)
└── components/
    └── Analytics.tsx     # Component wrapper (FUTURE)
```

### Structure Rationale

- **root.tsx:** Best for script tag - loads once, available across all routes, matches Vercel Analytics pattern
- **_index.jsx:** Current Mixpanel pattern - route-level init, but duplicates across routes if multi-page
- **Webhook route:** Resource route (API-only) - no default export, server-side only
- **utils/analytics.ts:** Future refactor - centralized tracking logic, type-safe helpers
- **entry.client.tsx:** Client-only - no analytics init needed (SDK handles hydration)

## Architectural Patterns

### Pattern 1: Script Tag in Root Layout

**What:** Inject OpenPanel script tag in root.tsx <head> or <body>
**When to use:** Simplest integration, follows existing Vercel Analytics pattern, no build step
**Trade-offs:**
- Pros: Zero config, global availability, SSR-safe, no hydration issues
- Cons: Less type safety, global window.op object, harder to test

**Example:**
```tsx
// app/root.tsx
export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.op=window.op||function(){var n=[];return new Proxy(function(){arguments.length&&n.push([].slice.call(arguments))},{get:function(t,r){return"q"===r?n:function(){n.push([r].concat([].slice.call(arguments)))}} ,has:function(t,r){return"q"===r}}) }();
              window.op('init', {
                clientId: 'YOUR_CLIENT_ID',
                trackScreenViews: true,
                trackOutgoingLinks: true,
              });
            `,
          }}
        />
        <script src="https://openpanel.dev/op1.js" defer async />
      </body>
    </html>
  );
}
```

### Pattern 2: Web SDK in Route

**What:** Import and initialize @openpanel/web in route component useEffect
**When to use:** Need programmatic control, TypeScript support, custom filtering
**Trade-offs:**
- Pros: Type safety, testable, programmatic event tracking
- Cons: Requires npm install, needs client-side check, duplicates if multi-route

**Example:**
```typescript
// app/routes/_index.jsx
import { OpenPanel } from '@openpanel/web';
import { useEffect } from 'react';

export default function Index() {
  useEffect(() => {
    const op = new OpenPanel({
      clientId: 'YOUR_CLIENT_ID',
      trackScreenViews: true,
      trackOutgoingLinks: true,
    });
  }, []);

  return <main>...</main>;
}
```

### Pattern 3: Server-Side Webhook Handler (NEW)

**What:** Remix resource route for webhook verification and server-side tracking
**When to use:** Lemon Squeezy webhooks, payment events, server-initiated tracking
**Trade-offs:**
- Pros: Secure signature verification, reliable event tracking, no client dependency
- Cons: Requires webhook configuration, environment variables, signature verification logic

**File naming for `/api/v1/integrations/lemon-squeezy-webhook/:id`:**
```
app/routes/api.v1.integrations.lemon-squeezy-webhook.$id.tsx
```

**Convention:**
- Dots (`.`) → slashes (`/`) in URL
- Dollar sign (`$`) → dynamic segment
- No default export → resource route (API-only)

**Example:**
```typescript
import crypto from "node:crypto";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  // STEP 1: Get raw body for signature verification
  const rawBody = await request.text();

  // STEP 2: Verify Lemon Squeezy signature
  const signature = request.headers.get("X-Signature");
  if (!signature) {
    return json({ error: "Missing signature" }, 401);
  }

  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET!;
  const hmac = crypto.createHmac("sha256", secret);
  const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
  const signatureBuffer = Buffer.from(signature, "utf8");

  if (!crypto.timingSafeEqual(digest, signatureBuffer)) {
    return json({ error: "Invalid signature" }, 401);
  }

  // STEP 3: Parse body AFTER verification
  const payload = JSON.parse(rawBody);

  // STEP 4: Send to OpenPanel server-side
  await sendToOpenPanel(payload.meta.event_name, {
    customer_id: payload.data.attributes.customer_id,
    product_name: payload.data.attributes.product_name,
    amount: payload.data.attributes.total,
  });

  return json({ success: true }, 200);
};

async function sendToOpenPanel(eventName: string, properties: object) {
  const response = await fetch("https://api.openpanel.dev/track", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "openpanel-client-id": process.env.OPENPANEL_CLIENT_ID!,
      "openpanel-client-secret": process.env.OPENPANEL_CLIENT_SECRET!,
    },
    body: JSON.stringify({
      type: "track",
      payload: {
        name: eventName,
        properties,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenPanel API error: ${response.status}`);
  }

  return response.json();
}
```

**Critical: Use `request.text()` not `request.json()`**

Why: JSON parsing reorders fields, breaking signature hash. Verify signature with raw body, parse JSON after.

**Sources:**
- [Remix Resource Routes](https://v2.remix.run/docs/guides/resource-routes/)
- [Remix Route File Naming](https://v2.remix.run/docs/file-conventions/routes/)
- [Lemon Squeezy Signing Requests](https://docs.lemonsqueezy.com/help/webhooks/signing-requests)

### Pattern 4: Centralized Analytics Module (FUTURE)

**What:** Create utils/analytics.ts with typed tracking helpers
**When to use:** Multiple analytics providers, custom event taxonomy, team collaboration
**Trade-offs:**
- Pros: Single source of truth, type-safe events, testable, provider-agnostic
- Cons: More upfront work, requires refactor of existing Mixpanel code

## Data Flow

### Request Flow

```
[User loads page]
    ↓
[Remix SSR] → [Render HTML] → [Inject script tag]
    ↓
[Browser receives HTML]
    ↓
[Script tag executes] → [window.op initialized]
    ↓
[op1.js loads async] → [OpenPanel SDK ready]
    ↓
[trackScreenViews] → [Page view event] → [OpenPanel API]
```

### Event Tracking Flow (Client-Side)

```
[User Action] (click, scroll, exit-intent)
    ↓
[Component handler] → [window.op('track', 'event', props)]
    ↓
[OpenPanel SDK] → [Queue event] → [Batch send]
    ↓
[OpenPanel API] → [Event stored]
```

### Webhook Flow (Server-Side, NEW)

```
[Lemon Squeezy Event] (subscription_created, order.success)
    ↓
[POST /api/v1/integrations/lemon-squeezy-webhook/:id]
    Headers: X-Signature
    Body: JSON webhook payload
    ↓
[Remix Resource Route]
    1. request.text() → raw body
    2. Verify X-Signature with HMAC SHA-256
    3. Parse JSON
    4. Extract event data
    ↓
[POST https://api.openpanel.dev/track]
    Headers: openpanel-client-id, openpanel-client-secret
    Body: {type: "track", payload: {...}}
    ↓
[OpenPanel API] → [Event stored]
```

**Webhook signature verification:**
- Header: `X-Signature`
- Algorithm: HMAC SHA-256
- Secret: Lemon Squeezy webhook signing secret
- Compare with `crypto.timingSafeEqual()` to prevent timing attacks

**OpenPanel server-side API:**
- Endpoint: `https://api.openpanel.dev/track`
- Auth: Custom headers (`openpanel-client-id`, `openpanel-client-secret`)
- Payload: `{type: "track", payload: {name: "event", properties: {...}}}`

**Sources:**
- [Lemon Squeezy Signing Requests](https://docs.lemonsqueezy.com/help/webhooks/signing-requests)
- [OpenPanel Track API](https://openpanel.dev/docs/api/track)
- [OpenPanel Authentication](https://openpanel.dev/docs/api/authentication)

### Key Data Flows

1. **Page view tracking:** Automatic via trackScreenViews config, fires on route changes
2. **Custom events:** Manual via window.op('track', ...) or op.track(...)
3. **User identification:** window.op('identify', {...}) on login/signup
4. **Exit-intent:** Existing modal logic can call window.op('track', 'exit_intent')
5. **Payment events (NEW):** Lemon Squeezy webhook → Remix → OpenPanel server-side

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-10k users/month | Script tag in root.tsx is sufficient |
| 10k-100k users/month | Consider Web SDK for filtering, add server-side tracking for critical events |
| 100k+ users/month | Implement centralized analytics module, add queue/retry logic, consider self-hosted OpenPanel |

### Scaling Priorities

1. **First bottleneck:** Event volume on client - mitigate with event filtering, sampling
2. **Second bottleneck:** Multiple analytics providers (Mixpanel + OpenPanel + Vercel) - mitigate with centralized module
3. **Webhook reliability:** Lemon Squeezy retries on 5xx, consider queue (Inngest, BullMQ) for high volume

## Anti-Patterns

### Anti-Pattern 1: Initialize SDK on Server

**What people do:** Try to call OpenPanel SDK in Remix loaders/actions or entry.server.tsx
**Why it's wrong:** OpenPanel Web SDK requires browser APIs (localStorage, DOM), causes SSR errors
**Do this instead:** Use script tag or useEffect-based init for client-only execution

### Anti-Pattern 2: Duplicate Init Across Routes

**What people do:** Copy/paste OpenPanel init into every route file (like current Mixpanel pattern)
**Why it's wrong:** SDK inits multiple times, duplicate events, harder to update config
**Do this instead:** Init once in root.tsx (script tag) or create shared hook

### Anti-Pattern 3: Expose Client Secret Client-Side

**What people do:** Use clientSecret in browser-side OpenPanel init
**Why it's wrong:** Security risk - secret exposed in browser bundle
**Do this instead:** Only use clientId for client tracking, reserve clientSecret for server-side events (webhook handler)

### Anti-Pattern 4: Use request.json() for Webhook Signature Verification (NEW)

**What people do:** `const payload = await request.json()` then `JSON.stringify(payload)` for signature
**Why it's wrong:** JSON stringification reorders keys, breaks signature verification
**Do this instead:** Use `request.text()` for raw body, verify signature, then parse JSON

**Source:** Community pattern from [Stripe webhooks in Remix](https://maxkarlsson.dev/blog/verify-stripe-webhooks-in-remix-on-cloudflare-pages)

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| OpenPanel Cloud (client) | Script tag with clientId | Default, easiest |
| OpenPanel API (server) | REST API with clientId/clientSecret | For webhook handler |
| Self-hosted OpenPanel | Script tag with custom apiUrl | Requires self-hosting setup |
| Lemon Squeezy | Webhook POST to Remix resource route | Requires signature verification |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| root.tsx ↔ OpenPanel | Script tag injection | One-way: app → analytics |
| _index.jsx ↔ OpenPanel | window.op() calls | Current Mixpanel pattern |
| Modal ↔ OpenPanel | window.op('track', ...) | Exit-intent tracking |
| Vercel Analytics ↔ OpenPanel | Independent | No interaction, parallel tracking |
| Webhook route ↔ OpenPanel API | HTTPS POST with auth headers | Server-to-server |

## SSR vs Client-Side Considerations

### Server-Side Rendering (SSR)

**What happens:**
- Remix renders HTML on server
- Script tag is included in HTML as static string
- No JavaScript execution on server for OpenPanel
- Webhook routes run server-side only (no browser)

**Implications:**
- No SSR-side tracking with Web SDK (client-only)
- Script tag is SSR-safe (just HTML)
- Webhook handler is server-only (no client access)
- Server-side events require OpenPanel API with clientSecret

### Client-Side Hydration

**What happens:**
- Browser receives HTML with script tag
- React hydrates components
- OpenPanel SDK loads asynchronously (defer async)
- Proxy pattern queues events before SDK ready

**Implications:**
- SDK may not be ready during initial render
- Use window.op() which queues events (safe)
- trackScreenViews handles initial page view automatically

### Recommendation

For this marketing site:
- **Client-side tracking:** User behavior analytics (script tag in root.tsx)
- **Server-side tracking (NEW):** Payment events via webhook handler
- **No server-side tracking for page views:** Not needed for conversion tracking

If server-side tracking becomes necessary beyond webhooks:
- Use @openpanel/sdk (Node.js) with clientSecret
- Track in Remix actions (form submissions, purchases)
- Keep client/server tracking separate

## Integration Order

Based on existing architecture, recommended build order:

### Phase 1: Add OpenPanel Script Tag
- Location: app/root.tsx (before </body>)
- Pattern: Same as Vercel Analytics component
- Config: trackScreenViews, trackOutgoingLinks
- Verify: Page views tracked automatically

### Phase 2: Add Custom Event Tracking
- Location: Existing components (Modal, Pricing, etc.)
- Pattern: window.op('track', 'event_name', props)
- Events: exit_intent, pricing_click, cta_click
- Verify: Events appear in OpenPanel dashboard

### Phase 3: Add Webhook Handler (NEW)
- Location: app/routes/api.v1.integrations.lemon-squeezy-webhook.$id.tsx
- Pattern: Resource route with signature verification
- Config: LEMON_SQUEEZY_WEBHOOK_SECRET, OPENPANEL_CLIENT_ID, OPENPANEL_CLIENT_SECRET
- Verify: Lemon Squeezy test webhook succeeds, events in OpenPanel

### Phase 4: Migrate Mixpanel Events (Optional)
- Location: app/routes/_index.jsx
- Pattern: Replace mixpanel.track() with window.op('track', ...)
- Decision: Keep both or migrate fully
- Verify: Event parity between providers

### Phase 5: Centralize Analytics (Future)
- Location: app/utils/analytics.ts
- Pattern: Facade over OpenPanel + Mixpanel
- Benefits: Type safety, single API, easier testing
- Verify: Refactor doesn't break tracking

## Environment Variables (NEW)

**Required for webhook integration:**

```bash
# Lemon Squeezy
LEMON_SQUEEZY_WEBHOOK_SECRET=your_signing_secret_6_40_chars

# OpenPanel (server-side)
OPENPANEL_CLIENT_ID=your_client_id
OPENPANEL_CLIENT_SECRET=your_client_secret
```

**Security:**
- Never commit secrets to git
- Use Vercel environment variables for production
- Use .env.local for local development
- clientSecret is server-only (never expose to client)

## Existing Patterns to Match

### Vercel Analytics (Component Pattern)
```tsx
// app/routes/_index.jsx
import { Analytics } from '@vercel/analytics/react';

export default function Index() {
  return (
    <main>
      {/* ... */}
      <Analytics />
    </main>
  );
}
```

**Insight:** OpenPanel could follow same pattern in root.tsx, but script tag is more common

### Mixpanel (Route-Level Init Pattern)
```javascript
// app/routes/_index.jsx
import mixpanel from "mixpanel-browser";

mixpanel.init("PROJECT_TOKEN", {
  debug: true,
  track_pageview: true,
  persistence: "localStorage",
});
```

**Insight:** Works but inits on every route render - OpenPanel script tag in root.tsx avoids this

## Sources

**HIGH Confidence:**
- [OpenPanel SDKs Overview](https://openpanel.dev/docs/sdks) - Official SDK documentation
- [OpenPanel Web SDK](https://openpanel.dev/docs/sdks/web) - Web SDK installation and config
- [OpenPanel Script Tag](https://openpanel.dev/docs/sdks/script) - Script tag integration method
- [OpenPanel Next.js Integration](https://openpanel.dev/docs/sdks/nextjs) - SSR patterns (analogous to Remix)
- [OpenPanel Remix SDK](https://openpanel.dev/docs/sdks/remix) - Current status: use script tag or Web SDK
- [OpenPanel Track API](https://openpanel.dev/docs/api/track) - Server-side tracking endpoint
- [OpenPanel Authentication](https://openpanel.dev/docs/api/authentication) - API auth headers
- [Remix Resource Routes](https://v2.remix.run/docs/guides/resource-routes/) - Webhook handler pattern
- [Remix Route File Naming](https://v2.remix.run/docs/file-conventions/routes/) - Flat routes convention
- [Lemon Squeezy Signing Requests](https://docs.lemonsqueezy.com/help/webhooks/signing-requests) - Signature verification

**MEDIUM Confidence:**
- GitHub Openpanel repository - Open source analytics platform
- NPM @openpanel/web package - Web SDK package documentation
- [Max Karlsson: Stripe Webhooks in Remix](https://maxkarlsson.dev/blog/verify-stripe-webhooks-in-remix-on-cloudflare-pages) - Community pattern

---
*Architecture research for: OpenPanel analytics integration with Remix SSR*
*Initial research: 2026-01-25*
*Webhook integration added: 2026-01-27*
