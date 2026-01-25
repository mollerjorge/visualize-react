# Visualize React - OpenPanel Integration

## What This Is

Marketing site for a React education product (infographics + video course). Adding OpenPanel analytics alongside existing Mixpanel and Vercel Analytics to track all user events — pageviews, clicks, form submissions, video plays.

## Core Value

Events must be visible in OpenPanel dashboard — comprehensive tracking parity with what Mixpanel captures today.

## Requirements

### Validated

- ✓ SSR marketing site with Remix v2 + React 18 — existing
- ✓ Dual analytics tracking (Vercel Analytics + Mixpanel) — existing
- ✓ Exit-intent modal with Lemon Squeezy email capture — existing
- ✓ Video content with scroll-triggered lazy loading — existing
- ✓ Pricing section with 3 tiers linking to Lemon Squeezy checkout — existing
- ✓ Navigation with hash-based scroll to sections — existing
- ✓ Custom Tailwind theme (dark mode, purple accents, Thiccboi font) — existing

### Active

- [ ] OpenPanel SDK integrated and initialized with client ID
- [ ] Pageview tracking on route load
- [ ] Click events tracked (CTAs, navigation, pricing buttons)
- [ ] Form submission events (email capture modal)
- [ ] Video play events (Hero video, Bonus video)
- [ ] Events visible in OpenPanel dashboard

### Out of Scope

- Removing Mixpanel or Vercel Analytics — keeping existing analytics intact
- Server-side event tracking — client-side SDK only for this integration
- Custom dashboards in OpenPanel — just integration, not dashboard setup

## Context

**Existing analytics implementation:**
- Mixpanel initialized in `app/routes/_index.jsx` with `mixpanel.track()` calls throughout components
- Vercel Analytics via `@vercel/analytics` with `track()` function
- Both track similar events: clicks, pageviews, CTA interactions

**OpenPanel client ID:** `c1eb2b83-2218-46cd-907b-ce5681c8ad76`

**Key files to modify:**
- `app/routes/_index.jsx` — analytics initialization
- `app/components/Header.jsx` — navigation click events
- `app/components/Hero.jsx` — CTA clicks, video play
- `app/components/Pricing.jsx` — pricing button clicks
- `app/components/Modal.jsx` — form submission events
- `app/components/Bonus.jsx` — video play events

## Constraints

- **Tech stack**: Must use OpenPanel's official SDK/script, no custom implementation
- **No breaking changes**: Existing analytics must continue working
- **Client-side only**: No server-side event tracking needed

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Add OpenPanel alongside existing analytics | User wants triple redundancy, not replacement | — Pending |
| Track all events (not just subset) | Comprehensive coverage requested | — Pending |

---
*Last updated: 2026-01-25 after initialization*
