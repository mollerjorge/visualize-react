# Architecture

**Analysis Date:** 2026-01-25

## Pattern Overview

**Overall:** Full-stack server-side rendered (SSR) marketing site using Remix v2 with client hydration

**Key Characteristics:**
- Single-page landing page with progressive section scrolling
- Server-rendered HTML with client interactivity via React 18
- Exit-intent modal with email capture integration
- Dual analytics tracking (Vercel + Mixpanel)
- CSS-in-JS via Tailwind with custom theme tokens

## Layers

**Server Layer:**
- Purpose: Render initial HTML, handle bot requests specially, serve static assets
- Location: `app/entry.server.tsx`
- Contains: SSR logic, bot detection, streaming response handling
- Depends on: React DOM server, Remix server runtime, isbot library
- Used by: Initial page load, all HTTP requests

**Route Layer:**
- Purpose: Define application routes and page structure
- Location: `app/routes/_index.jsx`
- Contains: Single landing page component, meta export, Mixpanel initialization, Modal state management
- Depends on: Page components, Modal, Analytics, Remix routing
- Used by: Request handler → renders entire page

**Component Layer:**
- Purpose: Reusable UI sections with internal state and event handling
- Location: `app/components/`
- Contains: Header, Hero, Pricing, Modal, Testimonials, TheProblem, etc.
- Dependencies: Each component uses Remix Link, Headless UI, clsx for styling
- Interaction: Wired together in `_index.jsx` in linear order

**Client Hydration:**
- Purpose: Enable client-side interactivity after SSR
- Location: `app/entry.client.tsx`
- Behavior: Hydrates on load with StrictMode, enables React on browser
- Handles: Click handlers, modal state, scroll events, analytics

**Styling Layer:**
- Purpose: Theme tokens, responsive design, animations
- Location: `app/tailwind.css` (imported in `root.tsx`), `tailwind.config.js`
- Custom tokens: body-1/2 backgrounds, purple-1/2 accents, thiccboi font
- Animations: marquee scroll, modal transitions

## Data Flow

**Page Load (SSR):**

1. User requests `/`
2. `app/entry.server.tsx` checks if request is from bot (via isbot library)
3. If bot: render full shell before streaming (onAllReady)
4. If browser: stream as soon as shell is ready (onShellReady) for faster FCP
5. `app/routes/_index.jsx` renders with initial modal state `false`
6. HTML streamed with hydration scripts
7. Client hydrates in `app/entry.client.tsx`, React takes over

**Interactivity:**

- Click events tracked via Vercel Analytics (`track()`) and Mixpanel (`mixpanel.track()`)
- Navigation links in Header and buttons trigger scroll to section ID (hash links)
- Modal state managed in `_index.jsx` (lifted), passed to Modal component
- Modal opens on mouseleave (exit intent) or when URL contains `?interview` query

**Modal Flow:**

1. Document `mouseleave` event detected when cursor leaves viewport
2. `setIsModalOpen(true)` triggers in `_index.jsx`
3. Modal renders with Headless UI Dialog + Transition
4. User enters email, form POSTs to Lemon Squeezy endpoint
5. On success: PDF downloaded, modal closes
6. Analytics tracked on both Vercel and Mixpanel

**Hero Video Lazy Load:**

- Scroll listener in Hero component detects when video element enters viewport
- On scroll, `isScrolledIntoView()` checks if video visible
- Only plays video on desktop (width > 1024px) when in view
- Event listener added on mount, removed on unmount

**State Management:**

- Modal visibility: lifted to `_index.jsx`, passed as props
- Component state: each section manages its own (animations, hover states)
- Animations: React Spring in Hero component (fade-in with molasses easing)
- No global state management; props flow down from root

## Key Abstractions

**Button Component:**
- Purpose: Unified call-to-action element with optional primary styling
- Location: `app/components/Button.jsx`
- Pattern: Polymorphic component (renders `<Link>` or `<a>`)
- Props: `primary` (adds sparkle icon), `full`, `to` (for internal links), `href` (for external)
- Used by: Header, Hero, Pricing (all CTAs)

**Container Component:**
- Purpose: Responsive max-width wrapper with padding
- Location: `app/components/Container.jsx`
- Pattern: Wrapper with clsx utility for conditional classes
- Provides: `max-w-7xl`, responsive padding (sm/md/lg)
- Used by: Header navigation

**Modal Component:**
- Purpose: Exit-intent capture modal with Lemon Squeezy integration
- Location: `app/components/Modal.jsx`
- Pattern: Controlled component (state lifted to parent)
- Integrates: Headless UI Dialog, email form POST to external endpoint
- Features: Dynamic title, loading state, PDF download on success

**useOnScreen Hook:**
- Purpose: Detect when element enters/leaves viewport
- Location: `app/hooks/useOnScreen.jsx`
- Pattern: Custom hook using IntersectionObserver API
- Returns: Boolean `isIntersecting` state
- Note: Defined but not currently used in components

**Marquee Component:**
- Purpose: Infinite scroll animation of company logos
- Location: `app/components/Marquee.tsx`
- Pattern: Duplicated content with CSS animation
- Animation: Tailwind `animate-marquee` (80s linear)
- Implementation: Duplicates logo array 4x for seamless loop, gradient overlays at edges
- Status: Currently commented out in `_index.jsx`

## Entry Points

**Server Entry:**
- Location: `app/entry.server.tsx`
- Triggers: Every HTTP request
- Responsibilities: Determine if bot or browser, stream appropriate response

**Client Entry:**
- Location: `app/entry.client.tsx`
- Triggers: Page load in browser
- Responsibilities: Hydrate React tree, enable interactivity

**Route Entry:**
- Location: `app/routes/_index.jsx`
- Triggers: GET `/`
- Responsibilities: Render landing page, manage modal state, initialize analytics

**App Shell:**
- Location: `app/root.tsx`
- Triggers: Wraps all routes
- Responsibilities: Document head (meta, viewport), layout shell, load Tailwind CSS

## Error Handling

**Strategy:** Try-catch in critical paths, console.error in streaming, user-facing alerts in Modal

**Patterns:**

**Modal form submission errors:**
```javascript
try {
  let response = await fetch(formUrl, { method: "POST", body: new FormData(e.target) });
  if (response.ok) {
    // Success path
  } else {
    alert("Sorry, we couldn't subscribe you.");
  }
} catch (error) {
  alert("Sorry, there was an issue: " + error);
}
```

**Streaming render errors:** Caught in `entry.server.tsx` onError callback, logged to console but don't crash response

**No explicit error boundary:** Marketing site has no fallback UI for component errors

## Cross-Cutting Concerns

**Logging:** Console only (no structured logging)
- Hero scroll detection logs via console
- No request-level logging visible

**Validation:**
- Modal email input: HTML5 `required` and `type="email"`
- Form submission validated by Lemon Squeezy server

**Authentication:** None (public marketing site)

**Analytics:**
- Vercel Analytics: Automatic FCP/LCP/CLS tracking + custom `track()` events
- Mixpanel: Custom events on navigation clicks and CTA interactions
- Dual tracking ensures redundancy; Mixpanel provides event history, Vercel provides performance metrics

**Navigation:**
- All navigation via Remix `Link` component (hash links to section IDs)
- No page transitions (single-page, scroll-based navigation)
- Mobile nav uses Headless UI Popover

---

*Architecture analysis: 2026-01-25*
