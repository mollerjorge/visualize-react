# Phase 1: SDK Integration - Research

**Researched:** 2026-01-25
**Domain:** OpenPanel Analytics SDK Integration in Remix v2 SSR
**Confidence:** HIGH

## Summary

OpenPanel SDK integration in Remix v2 SSR requires script tag injection in root.tsx to avoid hydration errors. Script tag is the standard approach for SSR frameworks (matches existing Vercel Analytics pattern). Client ID: c1eb2b83-2218-46cd-907b-ce5681c8ad76 already available.

**Critical findings:**
- Script tag approach prevents SSR hydration errors (npm package requires client-only guards)
- `trackScreenViews: true` enables auto-pageview tracking (matches Mixpanel pattern)
- Dev/prod separation requires separate OpenPanel projects (single client ID pollutes analytics)
- Duplicate tracking risk: three providers (Mixpanel, Vercel, OpenPanel) all auto-track independently

**Primary recommendation:** Use script tag in root.tsx body with defer/async, set trackScreenViews: true, create separate dev/prod client IDs via environment variables.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Script Tag | N/A | OpenPanel initialization | Official method for SSR frameworks, no build step, matches Vercel Analytics pattern, prevents hydration issues |
| @openpanel/web | 1.0.7 | Alternative npm package | TypeScript support, programmatic control, better for complex tracking logic (not recommended for Phase 1) |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Remix env vars | Built-in | Client ID environment separation | Expose via root loader to window.ENV for dev/prod separation |
| window.op() proxy | Included in script | Queue events before SDK loads | Prevents race conditions during async script loading |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Script tag | @openpanel/web npm | More control, TypeScript types, but requires useEffect guard, increases bundle size 32.9 KB, hydration complexity |
| Script tag | Server-side SDK | Only for server events (form submissions), overkill for pageviews/clicks, requires clientSecret management |
| Single client ID | Separate dev/prod IDs | Simpler setup but pollutes production dashboard with localhost events |

**Installation:**
```bash
# No installation needed for script tag approach (Phase 1)
# Future phases may add:
# npm install @openpanel/web  # If switching to npm package
```

## Architecture Patterns

### Recommended Project Structure
```
app/
├── root.tsx              # Script tag injection HERE (Phase 1)
├── routes/
│   └── _index.jsx        # Mixpanel already here (keep separate)
├── components/
│   ├── Modal.jsx         # Exit-intent tracking (Phase 2)
│   └── Pricing.jsx       # CTA tracking (Phase 2)
└── utils/
    └── analytics.ts      # Centralized tracking (Phase 4 - future)
```

### Pattern 1: Script Tag in root.tsx Body

**What:** Inject OpenPanel initialization script in `<body>` before `</body>` tag
**When to use:** SSR frameworks (Remix, Next.js), when avoiding hydration errors is critical
**Example:**
```tsx
// app/root.tsx
// Source: https://openpanel.dev/docs/sdks/script
export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="...">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />

        {/* OpenPanel initialization */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.op=window.op||function(){var n=[];return new Proxy(function(){arguments.length&&n.push([].slice.call(arguments))},{get:function(t,r){return"q"===r?n:function(){n.push([r].concat([].slice.call(arguments)))}} ,has:function(t,r){return"q"===r}}) }();
              window.op('init', {
                clientId: '${typeof window !== 'undefined' && window.ENV?.OPENPANEL_CLIENT_ID || 'c1eb2b83-2218-46cd-907b-ce5681c8ad76'}',
                trackScreenViews: true,
                trackOutgoingLinks: true,
                trackAttributes: true,
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

**Why this pattern:**
- Matches existing Vercel Analytics placement
- Script executes only in browser (SSR-safe)
- Proxy pattern queues events before op1.js loads
- defer/async prevents blocking page render
- No React hydration mismatch

### Pattern 2: Environment-Specific Client ID

**What:** Expose OpenPanel client ID via Remix loader, use different IDs for dev/prod
**When to use:** Always, to prevent dev traffic polluting production analytics
**Example:**
```typescript
// app/root.tsx
// Source: https://v2.remix.run/docs/guides/envvars/
import type { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  return json({
    ENV: {
      OPENPANEL_CLIENT_ID: process.env.OPENPANEL_CLIENT_ID,
    },
  });
}

export default function App() {
  const data = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />
      </head>
      <body>
        {/* ... */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.op('init', {
                clientId: window.ENV.OPENPANEL_CLIENT_ID,
                trackScreenViews: true,
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

**Environment variables:**
```bash
# .env.development
OPENPANEL_CLIENT_ID=dev-project-id-here

# .env.production
OPENPANEL_CLIENT_ID=c1eb2b83-2218-46cd-907b-ce5681c8ad76
```

### Pattern 3: Disable Duplicate Pageview Tracking

**What:** Disable auto-pageview on one provider to avoid triple-counting
**When to use:** When running multiple analytics providers simultaneously
**Example:**
```javascript
// app/routes/_index.jsx - Disable Mixpanel auto-pageview
mixpanel.init("fa22af7fecb1e5b8d0c88bd7111c0c63", {
  debug: false,  // Turn off debug in production
  track_pageview: false,  // DISABLE - let OpenPanel handle pageviews
  persistence: "localStorage",
});

// app/root.tsx - Enable OpenPanel auto-pageview
window.op('init', {
  clientId: 'c1eb2b83-2218-46cd-907b-ce5681c8ad76',
  trackScreenViews: true,  // ENABLE - OpenPanel owns pageview tracking
  trackOutgoingLinks: true,
  trackAttributes: true,
});
```

**Rationale:**
- Mixpanel: `track_pageview: false` - disables auto-tracking
- OpenPanel: `trackScreenViews: true` - enables auto-tracking
- Vercel Analytics: keep as-is (lightweight, no conflict)

### Anti-Patterns to Avoid

- **Initialize SDK in route component:** Causes hydration errors, duplicates init across routes. Script tag in root.tsx runs once.
- **Use clientSecret client-side:** Security risk. Only needed for server-side events (not needed for Phase 1).
- **Hardcode client ID:** Prevents dev/prod separation. Use environment variables.
- **Load script synchronously:** Blocks page render. Always use defer/async attributes.
- **Initialize before hydration:** Third-party scripts modify DOM before React hydrates. Script tag after <Scripts/> ensures Remix hydrates first.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Event queueing before SDK loads | Custom event buffer | window.op() proxy (built-in) | OpenPanel's proxy queues events automatically, handles race conditions, prevents lost events |
| Dev/prod environment detection | if (window.location.hostname === 'localhost') | Remix loader + env vars | Server knows environment, client hostname unreliable (staging, previews) |
| Pageview tracking on route change | useEffect with useLocation | trackScreenViews: true | OpenPanel auto-tracks Remix route navigation, handles SPA transitions |
| User session fingerprinting | Custom device/browser detection | OpenPanel cookieless tracking | Privacy-compliant, GDPR-safe, no consent banner needed |

**Key insight:** Analytics SDKs solve hard problems (fingerprinting, session management, offline queueing, retry logic). Custom solutions miss edge cases and create maintenance burden.

## Common Pitfalls

### Pitfall 1: SSR Hydration Mismatch

**What goes wrong:** React throws "Text content does not match server-rendered HTML" errors, events don't track on first page load, visual glitches during hydration.

**Why it happens:** OpenPanel SDK accesses window object during SSR. Server renders HTML without window, client hydrates with window, causing mismatch.

**How to avoid:**
- Use script tag in root.tsx (SSR-safe)
- If using @openpanel/web npm package, wrap in useEffect or ClientOnly boundary
- Place script after <Scripts/> tag (Remix hydrates first)

**Warning signs:**
- Console errors: "window is not defined", "Hydration failed"
- Events missing from dashboard on first page load
- Flash of unstyled content

**Verification:**
- No console errors on page load
- First pageview event appears in OpenPanel dashboard
- No visual glitches during hydration

### Pitfall 2: Duplicate Pageview Tracking

**What goes wrong:** Same pageview counted 3x (Mixpanel + Vercel + OpenPanel), inflated metrics, triple MTU billing, dashboard confusion.

**Why it happens:** All three providers auto-track by default. Mixpanel has `track_pageview: true`, OpenPanel has `trackScreenViews`, Vercel auto-tracks.

**How to avoid:**
- Disable Mixpanel auto-pageview: `track_pageview: false`
- Keep OpenPanel auto-pageview: `trackScreenViews: true`
- Keep Vercel as-is (lightweight, no duplication concern)
- Document tracking plan: which provider owns which events

**Warning signs:**
- Pageview counts jump 3x after integration
- Dashboard shows same session ID across providers
- MTU billing increases unexpectedly

**Verification:**
- Check Mixpanel init has `track_pageview: false`
- Single pageview event per actual page load
- Event counts stable before/after integration

### Pitfall 3: Dev Traffic Pollutes Production Dashboard

**What goes wrong:** Localhost events appear in production OpenPanel project, test data mixed with real users, dashboard metrics unreliable.

**Why it happens:** Single client ID used across all environments. Current code hardcodes production ID: `c1eb2b83-2218-46cd-907b-ce5681c8ad76`.

**How to avoid:**
- Create separate OpenPanel project for development
- Use Remix loader to expose client ID from env var
- Set OPENPANEL_CLIENT_ID per environment (.env.development vs .env.production)

**Warning signs:**
- Events from localhost:3000 in production dashboard
- Test events mixed with real user events
- Unable to filter dev traffic

**Verification:**
- Production dashboard shows no localhost events
- Dev dashboard shows only localhost events
- Environment variables loaded correctly

### Pitfall 4: Mixpanel Debug Mode in Production

**What goes wrong:** Browser console spammed with Mixpanel logs in production, looks unprofessional, potential information leakage.

**Why it happens:** Current code has `debug: true` in production (line 19 of _index.jsx).

**How to avoid:**
```javascript
// app/routes/_index.jsx
mixpanel.init("fa22af7fecb1e5b8d0c88bd7111c0c63", {
  debug: process.env.NODE_ENV === 'development',  // Only debug in dev
  track_pageview: false,  // Disable to avoid duplicates
  persistence: "localStorage",
});
```

**Warning signs:**
- Console logs on production site
- Mixpanel debug messages visible to users

**Verification:**
- No Mixpanel logs in production console
- Debug logs visible only in development

### Pitfall 5: Script Load Failure Goes Unnoticed

**What goes wrong:** op1.js fails to load (CDN down, adblocker), events never tracked, silent failure.

**Why it happens:** Script tag with defer/async fails silently. No error handling.

**How to avoid:**
- Check window.op exists before tracking custom events
- Add error handler to script tag (Phase 2+)
- Monitor dashboard for expected event volume

**Warning signs:**
- Expected events missing from dashboard
- Adblockers/privacy tools blocking script
- CDN outage

**Verification:**
- Events appear in dashboard within 30 seconds
- Test with adblocker enabled
- Check browser Network tab for op1.js load

## Code Examples

### Verified Pattern: Script Tag in root.tsx

```tsx
// app/root.tsx
// Source: https://openpanel.dev/docs/sdks/script
import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

export default function App() {
  return (
    <html className="scroll-smooth" lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="tracking-wide bg-gradient-to-b from-body-1 to-body-2 text-white">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />

        {/* OpenPanel Analytics - Phase 1 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.op=window.op||function(){var n=[];return new Proxy(function(){arguments.length&&n.push([].slice.call(arguments))},{get:function(t,r){return"q"===r?n:function(){n.push([r].concat([].slice.call(arguments)))}} ,has:function(t,r){return"q"===r}}) }();
              window.op('init', {
                clientId: 'c1eb2b83-2218-46cd-907b-ce5681c8ad76',
                trackScreenViews: true,
                trackOutgoingLinks: true,
                trackAttributes: true,
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

### Verified Pattern: Disable Mixpanel Auto-Pageview

```javascript
// app/routes/_index.jsx
// Source: https://docs.mixpanel.com/docs/tracking-best-practices/developer-environments
import mixpanel from "mixpanel-browser";

mixpanel.init("fa22af7fecb1e5b8d0c88bd7111c0c63", {
  debug: process.env.NODE_ENV === 'development',
  track_pageview: false,  // Disable - OpenPanel handles pageviews
  persistence: "localStorage",
});
```

### Verified Pattern: Environment-Based Client ID

```tsx
// app/root.tsx
// Source: https://v2.remix.run/docs/guides/envvars/
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  return json({
    ENV: {
      OPENPANEL_CLIENT_ID: process.env.OPENPANEL_CLIENT_ID || 'c1eb2b83-2218-46cd-907b-ce5681c8ad76',
    },
  });
}

export default function App() {
  const data = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />
      </head>
      <body>
        <Outlet />
        <Scripts />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.op=window.op||function(){var n=[];return new Proxy(function(){arguments.length&&n.push([].slice.call(arguments))},{get:function(t,r){return"q"===r?n:function(){n.push([r].concat([].slice.call(arguments)))}} ,has:function(t,r){return"q"===r}}) }();
              window.op('init', {
                clientId: window.ENV.OPENPANEL_CLIENT_ID,
                trackScreenViews: true,
                trackOutgoingLinks: true,
                trackAttributes: true,
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

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| npm package for all frameworks | Script tag for SSR | 2024-2025 | Simpler SSR integration, no hydration errors |
| Single analytics provider | Multi-provider strategy | 2023+ | Need auto-tracking coordination to avoid duplicates |
| Cookies for user tracking | Cookieless fingerprinting | 2024+ | No consent banner needed, GDPR-compliant by default |
| Manual pageview tracking | Auto-tracking via router integration | 2024+ | trackScreenViews handles SPA navigation automatically |

**Deprecated/outdated:**
- **@openpanel/sdk beta versions:** Use 1.0.7+ (stable release as of 2026-01-25)
- **Manual environment detection:** Use Remix loader + env vars, not window.location checks
- **clientSecret in browser:** Never expose, server-only (not needed for client tracking)

## Open Questions

### Question 1: Should we create a separate dev OpenPanel project?

**What we know:**
- Current client ID is c1eb2b83-2218-46cd-907b-ce5681c8ad76 (likely production)
- Best practice is separate projects per environment
- PITFALLS.md flags dev pollution as critical issue

**What's unclear:**
- Does user already have dev project ID?
- Should we create it in Phase 1 or defer?

**Recommendation:**
- Phase 1: Use environment variable with fallback to production ID
- User can add dev ID later without code changes
- Document in implementation plan

### Question 2: Keep Mixpanel or migrate fully to OpenPanel?

**What we know:**
- Requirement is additive (add OpenPanel, keep existing)
- Mixpanel already tracking some events
- Both can coexist with auto-pageview disabled on one

**What's unclear:**
- Long-term strategy: dual tracking or full migration?
- Which custom events currently tracked by Mixpanel?

**Recommendation:**
- Phase 1: Keep both, disable Mixpanel auto-pageview
- Phase 2+: Evaluate migration based on event usage
- Document tracking plan showing which provider owns what

### Question 3: Bundle size impact with three analytics providers?

**What we know:**
- @openpanel/web npm package: 32.9 KB unpacked, 2.3 KB minified+gzipped
- Script tag approach: loads async, doesn't block render
- Vercel Analytics: lightweight
- Mixpanel: ~50 KB

**What's unclear:**
- Total analytics overhead with all three
- Performance impact on Core Web Vitals
- Whether to lazy-load any provider

**Recommendation:**
- Phase 1: Use script tag (minimal impact)
- Phase 4: Measure performance, consider lazy loading
- Monitor Lighthouse score before/after

## Sources

### Primary (HIGH confidence)
- [OpenPanel Script Tag Documentation](https://openpanel.dev/docs/sdks/script) - Official script tag integration guide
- [OpenPanel Web SDK Documentation](https://openpanel.dev/docs/sdks/web) - npm package alternative
- [OpenPanel SDKs Overview](https://openpanel.dev/docs/sdks) - Available SDK options
- [Remix Environment Variables Guide](https://v2.remix.run/docs/guides/envvars/) - Official Remix env var patterns
- [@openpanel/web npm package](https://www.npmjs.com/package/@openpanel/web) - Version 1.0.7, size info

### Secondary (MEDIUM confidence)
- [OpenPanel Environment Variables](https://openpanel.dev/docs/self-hosting/environment-variables) - Environment configuration patterns
- [Solve React hydration errors in Remix/Next apps](https://www.jacobparis.com/content/remix-hydration-errors) - SSR hydration best practices
- [Type-safe environment variables in Remix](https://dev.to/seasonedcc/type-safe-environment-variables-on-both-client-and-server-with-remix-54l5) - Client-side env var patterns

### Tertiary (LOW confidence - WebSearch only)
- OpenPanel Remix SDK mentioned in navigation but no dedicated docs page found
- Bundle size comparisons (2.3 KB vs 36-96 KB for Amplitude) from marketing materials
- Community discussions about multi-provider analytics strategies

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Script tag approach verified in official docs, matches existing Vercel Analytics pattern
- Architecture: HIGH - Patterns verified via official Remix and OpenPanel documentation
- Pitfalls: HIGH - Hydration issues well-documented, duplicate tracking is known multi-provider issue
- Environment separation: MEDIUM - Best practice pattern but not verified if dev project exists
- Performance impact: MEDIUM - Size claims from marketing, not independently verified

**Research date:** 2026-01-25
**Valid until:** 2026-02-25 (30 days - stable SDK, unlikely to change rapidly)

**Implementation readiness:** Ready to plan Phase 1
- Script tag code verified and complete
- Client ID available
- Pitfall avoidance strategies documented
- Verification steps defined
