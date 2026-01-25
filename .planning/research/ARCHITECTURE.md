# Architecture Research

**Domain:** OpenPanel analytics integration with Remix SSR
**Researched:** 2026-01-25
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
├─────────────────────────────────────────────────────────────┤
│                    OpenPanel API                             │
│  ┌──────────────────────────────────────────────┐           │
│  │        Event Collection Service              │           │
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

## Recommended Project Structure

```
app/
├── root.tsx              # Script tag injection (RECOMMENDED)
├── routes/
│   └── _index.jsx        # Route-level SDK init (ALTERNATIVE)
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

### Pattern 3: Centralized Analytics Module (FUTURE)

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

### Event Tracking Flow

```
[User Action] (click, scroll, exit-intent)
    ↓
[Component handler] → [window.op('track', 'event', props)]
    ↓
[OpenPanel SDK] → [Queue event] → [Batch send]
    ↓
[OpenPanel API] → [Event stored]
```

### Key Data Flows

1. **Page view tracking:** Automatic via trackScreenViews config, fires on route changes
2. **Custom events:** Manual via window.op('track', ...) or op.track(...)
3. **User identification:** window.op('identify', {...}) on login/signup
4. **Exit-intent:** Existing modal logic can call window.op('track', 'exit_intent')

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-10k users/month | Script tag in root.tsx is sufficient |
| 10k-100k users/month | Consider Web SDK for filtering, add server-side tracking for critical events |
| 100k+ users/month | Implement centralized analytics module, add queue/retry logic, consider self-hosted OpenPanel |

### Scaling Priorities

1. **First bottleneck:** Event volume on client - mitigate with event filtering, sampling
2. **Second bottleneck:** Multiple analytics providers (Mixpanel + OpenPanel + Vercel) - mitigate with centralized module

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
**Do this instead:** Only use clientId for client tracking, reserve clientSecret for server-side events (if needed later)

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| OpenPanel Cloud | Script tag with clientId | Default, easiest |
| Self-hosted OpenPanel | Script tag with custom apiUrl | Requires self-hosting setup |
| OpenPanel API | REST API for server events | Optional, for server-side tracking |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| root.tsx ↔ OpenPanel | Script tag injection | One-way: app → analytics |
| _index.jsx ↔ OpenPanel | window.op() calls | Current Mixpanel pattern |
| Modal ↔ OpenPanel | window.op('track', ...) | Exit-intent tracking |
| Vercel Analytics ↔ OpenPanel | Independent | No interaction, parallel tracking |

## SSR vs Client-Side Considerations

### Server-Side Rendering (SSR)

**What happens:**
- Remix renders HTML on server
- Script tag is included in HTML as static string
- No JavaScript execution on server for OpenPanel

**Implications:**
- No SSR-side tracking with Web SDK (client-only)
- Script tag is SSR-safe (just HTML)
- Server-side events would require separate Node.js SDK (not needed for this project)

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
- **Client-side only tracking** - sufficient for user behavior analytics
- **Script tag in root.tsx** - matches existing Vercel Analytics pattern
- **No server-side tracking** - not needed for conversion tracking

If server-side tracking becomes necessary:
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

### Phase 3: Migrate Mixpanel Events (Optional)
- Location: app/routes/_index.jsx
- Pattern: Replace mixpanel.track() with window.op('track', ...)
- Decision: Keep both or migrate fully
- Verify: Event parity between providers

### Phase 4: Centralize Analytics (Future)
- Location: app/utils/analytics.ts
- Pattern: Facade over OpenPanel + Mixpanel
- Benefits: Type safety, single API, easier testing
- Verify: Refactor doesn't break tracking

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

**MEDIUM Confidence:**
- GitHub Openpanel repository - Open source analytics platform
- NPM @openpanel/web package - Web SDK package documentation

---
*Architecture research for: OpenPanel analytics integration with Remix SSR*
*Researched: 2026-01-25*
