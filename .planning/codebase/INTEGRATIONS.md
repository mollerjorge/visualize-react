# External Integrations

**Analysis Date:** 2026-01-25

## APIs & External Services

**Email Subscription:**
- Lemon Squeezy - Email capture & product delivery
  - Endpoint: `https://georgemoller.lemonsqueezy.com/email-subscribe/external`
  - Implementation: Form POST in `app/components/Modal.jsx`
  - Used for: Email list signup with PDF delivery

**Commerce:**
- Lemon Squeezy - Product checkout (three pricing tiers)
  - Checkout links in `app/components/Pricing.jsx`:
    - Infographics: `https://georgemoller.lemonsqueezy.com/checkout/buy/185f28df-b087-4a7c-a7ac-c797fdbc14cf`
    - Video Course: `https://georgemoller.lemonsqueezy.com/checkout/buy/992390e3-36f8-4ee7-8200-2ba781004206`
    - Videos & Infographics: `https://georgemoller.lemonsqueezy.com/checkout/buy/601f46d6-3f75-4ab8-8ae1-70a5f1006c50`

**CDN/Third-party Scripts:**
- Parity Deals - Price comparison/deal banner
  - Script: `https://cdn.paritydeals.com/banner.js` (async)
  - Injected in `app/routes/_index.jsx`

## Data Storage

**Databases:**
- Not detected - No ORM/database client in dependencies

**File Storage:**
- Local filesystem only - Static assets served from `/public` (Remix default)
- PDF delivery: `react-interview-questions-and-answers.pdf` served locally via download link

**Caching:**
- Browser localStorage for Mixpanel persistence (configured: `persistence: "localStorage"`)

## Authentication & Identity

**Auth Provider:**
- None - No auth system in codebase
- Lemon Squeezy handles customer authentication/checkout

## Monitoring & Observability

**Error Tracking:**
- Not detected - No error tracking SDK (Sentry, etc.)

**Analytics:**
- Vercel Analytics - Web Vitals and page performance
  - Package: `@vercel/analytics`
  - Integration: `<Analytics />` component in `app/routes/_index.jsx`
  - Tracking: Custom events via `track()` function in components
  - Example events:
    - `track("Click", { name: "Download 30 Interview Questions and Answers" })`
    - `track("Get it now", { name: "Infographics" })`

- Mixpanel - User event analytics
  - Token: `fa22af7fecb1e5b8d0c88bd7111c0c63`
  - Initialization: `app/routes/_index.jsx` with options:
    ```javascript
    mixpanel.init("fa22af7fecb1e5b8d0c88bd7111c0c63", {
      debug: true,
      track_pageview: true,
      persistence: "localStorage",
    });
    ```
  - Tracked in: Header, Pricing, Modal, Testimonials, Hero components
  - Example events: "Click", "Get it now" with contextual metadata

**Logs:**
- Browser console (no structured logging)
- Mixpanel debug mode enabled in development

## CI/CD & Deployment

**Hosting:**
- Not specified in codebase - Typically Vercel (given use of @vercel/analytics)

**CI Pipeline:**
- Not detected - No CI config files (no GitHub Actions, etc.)

## Environment Configuration

**Required env vars:**
- Not detected - No `.env` file or environment variable usage
- Hardcoded values:
  - Mixpanel token in source code
  - Lemon Squeezy URLs hardcoded in component props
  - Parity Deals script URL hardcoded

**Secrets location:**
- None configured - All endpoints/tokens are public or non-sensitive

## Webhooks & Callbacks

**Incoming:**
- Not detected - Site is SSR marketing page, no webhook endpoints

**Outgoing:**
- Lemon Squeezy form POST: `https://georgemoller.lemonsqueezy.com/email-subscribe/external`
  - Method: POST with FormData
  - Response handling: Redirect download on success, alert on failure
  - Location: `app/components/Modal.jsx` lines 92-112

## Query Strings & UTM Tracking

**Special Parameters:**
- `interview` query parameter - Triggers modal on page load with interview ebook offer
  - Check: `window.location.search?.includes("interview")`
  - Location: `app/components/Modal.jsx` lines 20-26

---

*Integration audit: 2026-01-25*
