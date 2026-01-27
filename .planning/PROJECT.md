# Visualize React

## What This Is

Marketing site for a React education product (infographics + video course). Triple analytics tracking (Vercel, Mixpanel, OpenPanel) with Lemon Squeezy integration for purchases.

## Core Value

Track user journey from page visit to purchase — comprehensive analytics for conversion optimization.

## Current Milestone: v1.1 Lemon Squeezy Webhooks

**Goal:** Track purchases in OpenPanel via Lemon Squeezy webhooks for conversion measurement.

**Target features:**
- Webhook endpoint for Lemon Squeezy events
- Track `order_created` with user_name, user_email, subtotal_usd
- Track `subscription_created` for testing

## Requirements

### Validated

- ✓ SSR marketing site with Remix v2 + React 18 — existing
- ✓ Dual analytics tracking (Vercel Analytics + Mixpanel) — existing
- ✓ Exit-intent modal with Lemon Squeezy email capture — existing
- ✓ Video content with scroll-triggered lazy loading — existing
- ✓ Pricing section with 3 tiers linking to Lemon Squeezy checkout — existing
- ✓ Navigation with hash-based scroll to sections — existing
- ✓ Custom Tailwind theme (dark mode, purple accents, Thiccboi font) — existing
- ✓ OpenPanel SDK integrated and initialized — v1.0
- ✓ Pageview tracking on route load — v1.0
- ✓ Click events tracked (CTAs, navigation, pricing) — v1.0
- ✓ Form submission events (email capture modal) — v1.0
- ✓ Video play events (Hero, Bonus) — v1.0

### Active

- [ ] Lemon Squeezy webhook endpoint
- [ ] Webhook signature verification
- [ ] Track order_created in OpenPanel (server-side)
- [ ] Track subscription_created in OpenPanel (test event)

### Out of Scope

- Removing Mixpanel or Vercel Analytics — keeping existing analytics
- Custom dashboards in OpenPanel — just integration
- Tracking all Lemon Squeezy events — only order_created and subscription_created for now

## Context

**Existing analytics:**
- OpenPanel client-side: pageviews, clicks, forms, video (v1.0 complete)
- Mixpanel: initialized in `app/routes/_index.jsx`
- Vercel Analytics: `@vercel/analytics`

**OpenPanel client ID:** `c1eb2b83-2218-46cd-907b-ce5681c8ad76`

**Lemon Squeezy webhook config:**
- Callback URL: `api.paritydeals.com/api/v1/integrations/lemon-squeezy-webhook/2e51bc30-5a3c-4879-bee4-162cf4f57ba3/`
- Signing secret: `162cf4f57ba3212`
- Events: order_created, subscription_created

**Webhook payload structure:**
- `meta.event_name` — event type
- `data.attributes.user_name` — customer name
- `data.attributes.user_email` — customer email
- `data.attributes.subtotal_usd` — amount in cents

## Constraints

- **Tech stack**: Use OpenPanel server-side API for webhook events
- **Security**: Verify Lemon Squeezy webhook signature
- **No breaking changes**: Existing client-side analytics must continue working

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Add OpenPanel alongside existing analytics | Triple redundancy, not replacement | ✓ Good |
| Track all client events | Comprehensive coverage | ✓ Good |
| Server-side tracking for webhooks | Webhooks are server-to-server | — Pending |

---
*Last updated: 2026-01-27 after v1.1 milestone start*
