# Codebase Concerns

**Analysis Date:** 2026-01-25

## Tech Debt

**Mixed JSX/TSX file types:**
- Issue: Codebase mixes `.jsx` and `.tsx` files without clear separation. Most components are JSX but entry points and Marquee are TSX, creating inconsistency in type safety and tooling expectations.
- Files: `app/components/` (mostly JSX), `app/routes/_index.jsx`, `app/root.tsx`, `app/entry.server.tsx`, `app/entry.client.tsx`, `app/components/Marquee.tsx`
- Impact: Reduced type safety, inconsistent IDE behavior, harder onboarding for new developers, potential for runtime errors in untyped components
- Fix approach: Convert all `.jsx` files to `.tsx` with proper type annotations, establish consistent typing patterns across the codebase

**Inline SVG duplication:**
- Issue: SVG icons are duplicated inline across multiple files instead of being extracted as reusable components (e.g., checkmark icons in `Pricing.jsx` lines 29-34, 76-81, 95-100, etc.)
- Files: `app/components/Pricing.jsx` (checkmarks repeated 3x), `app/components/Button.jsx` (sparkles inline), `app/components/Hero.jsx` (decorative SVG)
- Impact: Large bundle size, difficult to maintain icon consistency, tedious updates when icon design changes
- Fix approach: Extract SVG icons to `app/components/icons/` directory with reusable components like `CheckIcon`, `SparklesIcon`, `WaveIcon`

**Hardcoded Lemon Squeezy URLs:**
- Issue: Product checkout links embedded directly in component props without configuration management
- Files: `app/components/Pricing.jsx` (lines 16, 64, 148), `app/components/Modal.jsx` (line 18)
- Impact: Cannot change links without code changes, difficult to support multiple product variants or regions
- Fix approach: Move URLs to environment variables or a config file at `app/config/products.ts`

**Raw localStorage with analytics persistence:**
- Issue: Mixpanel initialized with localStorage persistence but no consent management or privacy controls
- Files: `app/routes/_index.jsx` (line 22)
- Impact: May violate GDPR/privacy regulations, users not offered opt-out option, no clear privacy notice
- Fix approach: Add cookie consent banner before initializing Mixpanel, respect `Do Not Track` header, add privacy policy link

## Known Bugs

**Scroll event listener not cleaned up in root page:**
- Symptoms: Mouse leave event listener added on page load never removed, accumulates on subsequent visits in SPA
- Files: `app/routes/_index.jsx` (lines 35-46)
- Trigger: Visit page, navigate away, return to page; each visit adds another listener
- Workaround: Manual browser refresh clears accumulated listeners
- Severity: High - causes memory leak and multiple modals opening on mouse leave

**IntersectionObserver not unobserved:**
- Symptoms: Memory leak as observers accumulate without cleanup
- Files: `app/hooks/useOnScreen.jsx` (line 7-11)
- Trigger: Component mounts and unmounts multiple times
- Impact: Observer continues watching after component unmount, slow degradation on SPAs
- Fix approach: Add `observer.unobserve(ref.current)` and `observer.disconnect()` in cleanup function

**Hero video play state not validated:**
- Symptoms: Calling `video.play()` on element that may not exist or be null causes silent failures
- Files: `app/components/Hero.jsx` (lines 50-54), `app/components/Bonus.jsx` (lines 17-21)
- Trigger: Rapid scrolling, slow network, element not yet rendered
- Workaround: Browser silently fails without throwing errors
- Fix approach: Add null checks: `video?.play?.()` with proper error handling

**Typo in WhatIsInside component heading:**
- Symptoms: User-facing text reads "The Infographpics" instead of "The Infographics"
- Files: `app/components/WhatIsInside.jsx` (line 265)
- Trigger: Navigate to What's Inside section
- Impact: Minor - affects user perception of quality
- Fix approach: Change "Infographpics" to "Infographics"

**Modal dependency on window.location.search:**
- Symptoms: URL query parameter check happens in useEffect without cleanup, may fire on every render
- Files: `app/components/Modal.jsx` (lines 20-26)
- Trigger: Any re-render of Modal component
- Impact: Inefficient, could cause modal to open unexpectedly on re-renders
- Fix approach: Wrap in condition to only check once, use useCallback, or move to router-level logic

## Security Considerations

**Inline third-party script without integrity checks:**
- Risk: External script from cdn.paritydeals.com loaded without Subresource Integrity (SRI) verification
- Files: `app/routes/_index.jsx` (line 62)
- Current mitigation: Script is async-loaded, minimal impact if compromised
- Recommendations: Add `integrity` attribute, use Content Security Policy headers, consider if PurityDeals is still needed

**External image domains without verification:**
- Risk: Marquee component loads logos from external CDN (cdn.magicui.design) without validation
- Files: `app/components/Marquee.tsx` (lines 3-10)
- Current mitigation: Images are read-only assets, low risk
- Recommendations: Host logos locally in `public/` to avoid external dependencies, reduce network requests

**Cloudinary URL for video captions:**
- Risk: Hardcoded Cloudinary URL for video captions, media could be modified externally
- Files: `app/components/Hero.jsx` (line 178)
- Current mitigation: Only captions affected, not core video
- Recommendations: Host captions locally, use SRI if keeping external source

**Email form endpoint without CSRF protection:**
- Risk: Fetch to Lemon Squeezy email subscribe endpoint in Modal uses FormData but no CSRF token
- Files: `app/components/Modal.jsx` (lines 92-95)
- Current mitigation: POST to external domain, relies on same-origin-policy
- Recommendations: Validate response, add error handling for failed subscriptions, implement rate limiting

**Exposed Mixpanel token in client code:**
- Risk: Mixpanel project token visible in browser source, allows anyone to send analytics events
- Files: `app/routes/_index.jsx` (line 19)
- Current mitigation: Token is read-only for public project, limited damage
- Recommendations: Use environment-based token, consider server-side analytics proxy if sensitive

## Performance Bottlenecks

**Duplicate logo rendering in Marquee:**
- Problem: Logos array spread four times (repeated twice in JSX), creates 32 img elements for 8 logos
- Files: `app/components/Marquee.tsx` (lines 22-37)
- Cause: Seamless loop implementation duplicates content in DOM
- Improvement path: Use CSS animation with `translateX` and JavaScript to wrap animation, render logos once, use CSS `animation: linear infinite`

**Large component files without code splitting:**
- Problem: `Pricing.jsx` (328 lines), `WhatIsInside.jsx` (325 lines) bundle large data structures with UI code
- Files: `app/components/Pricing.jsx` (lines 12-209), `app/components/WhatIsInside.jsx` (lines 28-146)
- Cause: All pricing data and infographic/video definitions inline
- Improvement path: Extract to `app/data/pricing.ts`, `app/data/content.ts`, lazy-load with route-based code splitting

**Scroll event listener fires on every scroll:**
- Problem: `onScroll` handler in Hero and Bonus runs on every pixel of scroll, checking DOM repeatedly
- Files: `app/components/Hero.jsx` (line 58), `app/components/Bonus.jsx` (line 25)
- Cause: Document-level scroll listener without throttling/debouncing
- Improvement path: Use Intersection Observer instead (already have `useOnScreen` hook), remove DOM queries from scroll handler, throttle events to 100ms intervals

**Missing preload for video assets:**
- Problem: Hero and Bonus videos use `preload="none"` but no lazy loading strategy, blocks initial page paint
- Files: `app/components/Hero.jsx` (line 176), `app/components/Bonus.jsx` (line 54)
- Cause: Videos only load when scrolled into view but create render-blocking resources
- Improvement path: Use `loading="lazy"`, serve in modern format (webp for posters), consider HLS/DASH streaming

**No image optimization:**
- Problem: All images imported directly without optimization, served at full resolution
- Files: Throughout `app/components/` and `app/routes/`
- Cause: No Remix image component or optimization pipeline
- Improvement path: Use Remix built-in image optimization, serve WebP with fallbacks, implement responsive images with `srcset`

## Fragile Areas

**Hero scroll detection logic:**
- Files: `app/components/Hero.jsx` (lines 37-55)
- Why fragile: Uses hardcoded viewport height check without accounting for mobile viewports, inconsistent scroll detection across browsers
- Safe modification: Add unit tests for viewport calculation, use Intersection Observer instead of custom logic
- Test coverage: No tests for scroll behavior, video play conditions

**Modal exit-intent trigger:**
- Files: `app/routes/_index.jsx` (lines 35-46)
- Why fragile: Simple clientY/X boundary check doesn't account for touch devices, accidental triggers on trackpad scrolling, fires multiple times
- Safe modification: Add flag to fire once per session, debounce to 500ms, test on actual mobile/trackpad devices
- Test coverage: No tests for modal visibility, trigger conditions

**WhatIsInside animation state management:**
- Files: `app/components/WhatIsInside.jsx` (lines 158-189)
- Why fragile: Two independent `useTrail` animations with manual refs, animations trigger even if user doesn't scroll to section, no loading state
- Safe modification: Consolidate animation logic, tie to intersection observer for performance
- Test coverage: No snapshot or animation tests

**Lightbox gallery initialization:**
- Files: `app/components/WhatIsInside.jsx` (lines 248-254, 309-321)
- Why fragile: Index state not validated, opening gallery at invalid index could break, no error boundary
- Safe modification: Validate index bounds, add error boundary, extract to custom hook
- Test coverage: No tests for gallery state transitions

## Test Coverage Gaps

**No unit tests:**
- What's not tested: Hook behavior (useOnScreen), component isolation, prop validation
- Files: All files in `app/components/`, `app/hooks/`
- Risk: Scroll optimizations could break gallery, animation timing could fail on low-end devices, scroll listeners leak memory
- Priority: High

**No integration tests:**
- What's not tested: Modal trigger flow, form submission to Lemon Squeezy, analytics event firing
- Files: `app/routes/_index.jsx`, `app/components/Modal.jsx`
- Risk: Email capture broken unnoticed, analytics events not firing, Vercel Analytics and Mixpanel could diverge
- Priority: High

**No E2E tests:**
- What's not tested: Full user journey (scroll → modal → subscribe → download PDF), video playback
- Files: All components involved in critical user flows
- Risk: Breaking changes to checkout flow go undetected, can't verify PDF download works
- Priority: Medium

## Scaling Limits

**No server-side rendering for analytics:**
- Current capacity: All tracking client-side, relies on JavaScript execution
- Limit: Users with JS disabled don't generate events, tracking requests lost if JS errors occur
- Scaling path: Implement server-side event tracking via Remix loaders, use Vercel Analytics as fallback

**Hardcoded product pricing and content:**
- Current capacity: 3 pricing tiers, 6 infographics, 6 video thumbnails
- Limit: Cannot add products without code changes, content management requires developer intervention
- Scaling path: Extract to CMS (Sanity, Contentful), implement dynamic content loading from API

**Single-page landing with all components loaded:**
- Current capacity: ~2.2MB of component code, all sections load on home page
- Limit: Performance degrades with each new section added, mobile users on slow connections suffer
- Scaling path: Route-based code splitting, implement progressive enhancement, lazy-load sections below fold

## Dependencies at Risk

**Mixpanel Browser v2.48.1:**
- Risk: Library not actively maintained, security patches may be slow
- Impact: Privacy issues if Mixpanel data handling changes, no recourse for vulnerabilities
- Migration plan: Replace with PostHog (self-hosted option) or Plausible (privacy-focused), already have Vercel Analytics as modern fallback

**yet-another-react-lightbox v3.15.2:**
- Risk: Niche library, smaller community, risk of abandonment
- Impact: Gallery functionality breaks if library unmaintained, accessibility issues not fixed
- Migration plan: Migrate to Headless UI dialog or Radix UI with custom lightbox, or use modern browser APIs (`<dialog>`)

**@remix-run packages at v2.2.0:**
- Risk: Remix v2 could introduce breaking changes, community smaller than Next.js
- Impact: Framework upgrades required to stay current, development becomes harder
- Migration plan: Monitor Remix release notes, plan gradual upgrades, consider Next.js migration if Remix adoption stalls

## Missing Critical Features

**No error boundary:**
- Problem: Any component error crashes entire page with no graceful fallback
- Blocks: Cannot reliably deploy new features without fear of crashing production
- Recommendation: Add error boundary wrapper in `app/root.tsx`, implement error page component

**No analytics error tracking:**
- Problem: JavaScript errors not sent to Sentry/error tracker, users suffer silently
- Blocks: Cannot debug production issues (video playback fails, scroll events not firing)
- Recommendation: Add Sentry integration, track console.error calls, monitor Core Web Vitals

**No A/B testing framework:**
- Problem: Cannot test different CTAs, pricing tiers, or layouts without manual changes
- Blocks: Cannot optimize conversion rate systematically, changes are risky
- Recommendation: Integrate LaunchDarkly or Vercel A/B Testing, tie to analytics

**No caching strategy:**
- Problem: All assets requested fresh on each page load, no service worker
- Blocks: Cannot support offline mode, slow on repeat visits
- Recommendation: Add service worker for static assets, implement HTTP cache headers, consider Vercel edge caching

---

*Concerns audit: 2026-01-25*
