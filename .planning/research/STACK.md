# Stack Research: OpenPanel Analytics Integration

**Domain:** Analytics Integration for Remix SSR Marketing Site
**Researched:** 2026-01-25
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

**Tracking parity:** OpenPanel API is functionally equivalent to Mixpanel for all current use cases in codebase. Same event/properties model.

**Confidence:** HIGH - API verified via official docs

## Sources

**Official Documentation:**
- [OpenPanel Web SDK](https://openpanel.dev/docs/sdks/web) - Installation, config, React patterns (HIGH confidence)
- [OpenPanel API Specification](https://openpanel.dev/docs/api/track) - Server-side tracking endpoint (HIGH confidence)
- [OpenPanel React Integration](https://openpanel.dev/docs/sdks/react) - React-specific guidance (HIGH confidence)
- [OpenPanel SDKs Overview](https://openpanel.dev/docs/sdks) - Available SDK options (HIGH confidence)

**NPM Registry:**
- [@openpanel/web v1.0.7](https://www.npmjs.com/package/@openpanel/web) - Current version, published within last week (HIGH confidence)

**Comparison & Privacy:**
- [OpenPanel vs Mixpanel](https://openpanel.dev/articles/vs-mixpanel) - Feature comparison (MEDIUM confidence - marketing page)
- [Cookieless Analytics](https://openpanel.dev/articles/cookieless-analytics) - Privacy approach (MEDIUM confidence - marketing)
- [Better Compliance Self-Hosted](https://openpanel.dev/articles/better-compliance-self-hosted-analytics) - GDPR/CCPA (MEDIUM confidence - marketing)

**Community:**
- [OpenPanel GitHub](https://github.com/Openpanel-dev/openpanel) - Codebase, TypeScript adoption (HIGH confidence - 1,258 commits, active)
- [Hacker News Discussion](https://news.ycombinator.com/item?id=40432213) - Community reception (LOW confidence - anecdotal)

**Remix Patterns:**
- [Remix Environment Variables](https://remix.run/docs/en/main/guides/envvars) - How to handle clientSecret server-side (HIGH confidence - official Remix docs)

---
*Stack research for: OpenPanel analytics integration into Remix v2 SSR marketing site*
*Researched: 2026-01-25*
*Current versions: @openpanel/web@1.0.7, existing stack Remix v2 + React 18 + mixpanel-browser@2.48.1 + @vercel/analytics@1.1.1*
