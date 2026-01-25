# Phase 2: Click Event Tracking - Research

**Researched:** 2026-01-25
**Domain:** Click event tracking with OpenPanel in React/Remix SSR environment
**Confidence:** HIGH

## Summary

Click event tracking in React requires adding `window.op('track', 'event_name', { properties })` calls to existing onClick handlers. OpenPanel supports both imperative tracking (JavaScript API) and declarative tracking (data attributes). Current codebase already tracks clicks via Mixpanel + Vercel Analytics, making this additive integration straightforward.

**Critical findings:**
- OpenPanel track API identical to Mixpanel: `op.track(name, props)` vs `mixpanel.track(name, props)`
- Data attributes enable no-code tracking: `data-track="event_name"` auto-tracks clicks
- Current event naming inconsistent: Vercel uses `"Click"` with `{ name: "X" }`, Mixpanel uses `"Click"` with nested props
- Standard schema (Object-Action pattern) recommended: `button_clicked`, `nav_link_clicked` with location properties
- Multi-provider tracking common but needs consistent naming schema to prevent analytics fragmentation

**Primary recommendation:** Add parallel OpenPanel tracking to existing onClick handlers using consistent snake_case event naming schema. Create unified schema across all three providers (OpenPanel, Mixpanel, Vercel) to enable cross-provider analysis.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| window.op() API | Built-in | Event tracking via OpenPanel SDK | Already initialized in Phase 1, global API available, matches Mixpanel pattern |
| React onClick handlers | React 18 | Imperative click tracking | Standard React pattern, full control over event properties, existing implementation |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Data attributes (data-track) | Built-in | No-code auto-tracking | Simple buttons without complex metadata, reduces JavaScript boilerplate |
| useCallback hook | React 18 | Stable event handler references | Prevents re-renders, optimizes performance for analytics wrappers |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Inline onClick | react-tracking library | Declarative tracking context, but adds 12KB dependency, overkill for Phase 2 scope |
| Manual tracking | Data attributes only | Simpler code, but lacks dynamic context (pricing tier index, CTA location logic) |
| Triple tracking | Unified analytics wrapper | DRY code, but premature abstraction for 3 providers with different APIs |

**Installation:**
```bash
# No installation needed - OpenPanel SDK already initialized in Phase 1
# Future phases may add:
# npm install react-tracking  # If adopting declarative tracking library
```

## Architecture Patterns

### Recommended Event Structure
```
Events to track:
├── Navigation clicks (Header)
│   ├── nav_link_clicked (Overview, What's Inside, Testimonials, Pricing)
│   └── nav_cta_clicked (Get it now in Header)
├── CTA clicks (Hero, Testimonials)
│   └── cta_clicked (Get it now buttons)
└── Pricing button clicks
    └── pricing_cta_clicked (Infographics, Video Course, Bundle)

Properties schema:
- location: string (header, hero, pricing, testimonials)
- link_destination: string (#pricing, #testimonials, etc.)
- pricing_tier: string (infographics, video_course, bundle)
- tier_price: string ($34, $149, $54)
```

### Pattern 1: Parallel Multi-Provider Tracking

**What:** Add OpenPanel tracking alongside existing Mixpanel + Vercel calls
**When to use:** Current phase - maintain all three providers during transition
**Example:**
```javascript
// app/components/Header.jsx - Navigation click
<Link
  onClick={() => {
    // Existing tracking
    track("Click", { name: "Overview" });
    mixpanel.track("Click", { navbar: "Overview" });

    // NEW: OpenPanel tracking with consistent schema
    window.op('track', 'nav_link_clicked', {
      location: 'header',
      link_text: 'Overview',
      link_destination: '#overview'
    });
  }}
  to="#overview"
>
  Overview
</Link>
```

**Why this pattern:**
- Maintains backward compatibility with existing analytics
- Allows gradual migration to unified schema
- Each provider receives events independently
- Easy to compare event volumes across providers

### Pattern 2: Consistent Event Naming Schema

**What:** Use Object-Action snake_case pattern across all providers
**When to use:** New events in Phase 2+, refactor existing events in Phase 4
**Example:**
```javascript
// CURRENT (inconsistent):
track("Get it now", { name: "Hero" });
mixpanel.track("Click", { "Get it now": "hero" });

// RECOMMENDED (consistent):
const eventName = 'cta_clicked';
const properties = {
  button_text: 'Get it now',
  location: 'hero',
  cta_type: 'primary'
};

window.op('track', eventName, properties);
track(eventName, properties);  // Vercel Analytics
mixpanel.track(eventName, properties);  // Mixpanel
```

**Standard event verbs:**
- `clicked` - User clicks button/link
- `viewed` - Page/section becomes visible
- `submitted` - Form submission
- `downloaded` - File download

**Standard objects:**
- `nav_link` - Navigation link
- `cta` - Call-to-action button
- `pricing_cta` - Pricing tier button
- `modal` - Modal interaction

### Pattern 3: Property Metadata Enrichment

**What:** Include contextual metadata with every event
**When to use:** All click events - helps answer "what drove this click?"
**Example:**
```javascript
// app/components/Pricing.jsx - Pricing button click
onClick={() => {
  const tierNames = ['infographics', 'video_course', 'bundle'];
  const tierPrices = ['$34', '$149', '$54'];

  window.op('track', 'pricing_cta_clicked', {
    pricing_tier: tierNames[index],
    tier_price: tierPrices[index],
    tier_position: index + 1,  // 1, 2, 3
    button_text: 'Get it now',
    location: 'pricing',
    discount_label: index === 2 ? '30% OFF' : '50% OFF'
  });
}
```

**Recommended properties:**
- **location:** Where on page (header, hero, pricing, testimonials)
- **button_text:** CTA text ("Get it now", "Download now")
- **link_destination:** Target URL or hash (#pricing, external URL)
- **position:** Array index or order (1st, 2nd, 3rd)
- **variant:** UI variant (primary, secondary, mobile)

### Pattern 4: Data Attribute Auto-Tracking (Alternative)

**What:** Use data attributes for simple clicks without dynamic context
**When to use:** Static links where all metadata known at render time
**Example:**
```html
<!-- Mobile navigation - no dynamic pricing logic -->
<Link
  to="#pricing"
  data-track="nav_link_clicked"
  data-location="mobile_menu"
  data-link_destination="#pricing"
>
  Pricing
</Link>
```

**Limitations:**
- Cannot compute dynamic values (pricing tier from index)
- All data-* attributes become event properties automatically
- Less visibility - tracking logic hidden in HTML attributes
- Not suitable for Phase 2 scope (CTA buttons have dynamic context)

### Anti-Patterns to Avoid

- **Inconsistent naming across providers:** Don't use `"Click"` for Mixpanel and `"button_clicked"` for OpenPanel - makes cross-provider analysis impossible
- **Blocking synchronous tracking:** Analytics calls should never block user navigation or form submission
- **Missing error boundaries:** If `window.op` undefined (script blocked), code throws - always check existence
- **Hardcoded values in duplicated logic:** Extract event name/properties to variables shared across providers
- **Over-tracking:** Don't track every hover/scroll/mouse move - focus on meaningful user intent signals

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Event name validation | Custom schema validator | Naming convention + code review | Event schemas evolve rapidly, enforcement creates friction, better as guideline |
| Analytics wrapper utility | Generic track() function | Direct provider calls | Three providers have different APIs (object vs strings), abstraction hides provider-specific features |
| Event property sanitization | Custom filter logic | Send raw data, filter in dashboard | Analytics platforms handle PII filtering, sanitization logic has bugs, better server-side |
| Click event deduplication | Debounce/throttle on onClick | Native browser click behavior | Browser already prevents double-click in < 300ms, debouncing breaks user expectation |
| Offline event queueing | localStorage buffer | OpenPanel built-in queue | SDK automatically queues events when offline, handles retry logic, prevents data loss |

**Key insight:** Analytics SDKs already handle hard problems (queueing, retry, fingerprinting). Focus implementation on business logic (what to track, when, with what context) not infrastructure (how to send reliably).

## Common Pitfalls

### Pitfall 1: window.op Undefined (Script Blocked)

**What goes wrong:** Code throws `TypeError: window.op is not a function` when adblocker blocks OpenPanel script, breaks entire onClick handler, button becomes non-functional.

**Why it happens:** OpenPanel script (op1.js) loaded from CDN can be blocked by privacy tools (uBlock Origin, Brave browser, corporate firewalls). Script tag in Phase 1 has defer/async so no guarantee of load timing.

**How to avoid:**
```javascript
// WRONG - no error handling
onClick={() => {
  window.op('track', 'event_name', props);  // Throws if op undefined
}}

// RIGHT - defensive check
onClick={() => {
  if (typeof window !== 'undefined' && window.op) {
    window.op('track', 'event_name', props);
  }
  // Rest of onClick logic continues even if tracking fails
}}
```

**Warning signs:**
- Buttons stop working for some users
- Console errors: "window.op is not a function"
- Analytics events missing from dashboard for subset of users
- Higher bounce rate from privacy-conscious users

**Verification:**
- Test with uBlock Origin enabled
- Test in Brave browser (aggressive blocking)
- Check console for TypeError exceptions
- Navigation/forms should work even if tracking fails

### Pitfall 2: Inconsistent Event Naming Across Providers

**What goes wrong:** Same click tracked as `"Click"` (Vercel), `"Click"` with different properties (Mixpanel), `"nav_link_clicked"` (OpenPanel). Cross-provider dashboards show inconsistent counts, can't correlate events, fragmented analytics.

**Why it happens:** Each provider added incrementally with different naming conventions. Mixpanel uses `"Click"` as catch-all, Vercel uses similar pattern, OpenPanel follows modern Object-Action schema.

**How to avoid:**
- Define event schema document before Phase 2 implementation
- Use same event name variable across all three providers
- Phase 4: Refactor existing Mixpanel/Vercel events to match schema
```javascript
// CONSISTENT naming
const eventName = 'nav_link_clicked';
const properties = { location: 'header', link_text: 'Overview' };

window.op('track', eventName, properties);
track(eventName, properties);
mixpanel.track(eventName, properties);
```

**Warning signs:**
- Event counts differ significantly between providers (beyond expected variance)
- Can't build unified funnel across providers
- Team debates what event name to use
- Documentation says one name, code uses another

**Verification:**
- Compare event volumes across providers (should be within 5-10%)
- Spot-check event names in all three dashboards
- grep codebase for event name strings - should find all three providers using identical names

### Pitfall 3: Blocking User Navigation with Slow Analytics

**What goes wrong:** User clicks CTA button, analytics tracking makes slow network request, button feels unresponsive, user clicks again (double-tracking), poor UX perception.

**Why it happens:** onClick handler runs synchronous analytics code before navigation. If analytics API slow (>100ms), blocks UI update.

**How to avoid:**
```javascript
// WRONG - synchronous tracking before navigation
onClick={() => {
  window.op('track', 'cta_clicked', props);  // Blocks if slow
  window.location.href = targetUrl;  // Navigation delayed
}}

// RIGHT - tracking doesn't block navigation
<Link
  to={targetUrl}
  onClick={() => {
    // Fire-and-forget tracking
    window.op && window.op('track', 'cta_clicked', props);
    // Link navigation happens immediately via Remix
  }}
>
```

**Alternative for external links:**
```javascript
// External link - need to delay navigation for tracking
onClick={(e) => {
  e.preventDefault();

  // Send tracking event with callback
  window.op && window.op('track', 'external_link_clicked', props);

  // Navigate after short timeout (analytics SDKs batch events)
  setTimeout(() => {
    window.location.href = externalUrl;
  }, 100);
}}
```

**Warning signs:**
- Buttons feel sluggish
- Users double-clicking CTAs
- Analytics shows duplicate events within 1 second
- High latency in analytics network requests

**Verification:**
- Test on slow 3G connection (DevTools network throttling)
- Check onClick handler execution time < 50ms
- Navigation should feel instant
- No layout shift or flash before navigation

### Pitfall 4: Dynamic Property Values Not Captured

**What goes wrong:** Pricing button onClick tracks static `pricing_tier: "Video Course"` but user clicked index 2 (Bundle). Properties hardcoded instead of computed from component state.

**Why it happens:** Copy-paste onClick handler from first pricing tier, forget to update properties for each tier.

**How to avoid:**
```javascript
// WRONG - hardcoded properties
{Pricings.map((pricing, index) => (
  <Button
    onClick={() => {
      window.op('track', 'pricing_cta_clicked', {
        pricing_tier: 'Video Course',  // WRONG - always Video Course
      });
    }}
  />
))}

// RIGHT - dynamic properties from array/index
{Pricings.map((pricing, index) => (
  <Button
    onClick={() => {
      const tierNames = ['infographics', 'video_course', 'bundle'];
      window.op('track', 'pricing_cta_clicked', {
        pricing_tier: tierNames[index],  // Correct tier per index
        tier_price: pricing.price,  // From Pricings array
        tier_position: index + 1,
      });
    }}
  />
))}
```

**Warning signs:**
- Dashboard shows all clicks as single pricing tier
- Properties don't match user's actual click target
- A/B test results skewed because wrong variant tracked

**Verification:**
- Click each pricing tier button, verify correct tier name in dashboard
- Verify all dynamic properties (index, price, etc.) captured correctly
- Check network tab for event payload - properties should match UI state

### Pitfall 5: Event Name Typos Silently Lost

**What goes wrong:** Type `'cta_clikced'` instead of `'cta_clicked'`, event sent successfully but dashboard shows zero events, silent failure.

**Why it happens:** Event names are strings, no TypeScript validation, no feedback when typo occurs.

**How to avoid:**
```javascript
// Option 1: Constants file
// app/analytics/events.js
export const EVENTS = {
  NAV_LINK_CLICKED: 'nav_link_clicked',
  CTA_CLICKED: 'cta_clicked',
  PRICING_CTA_CLICKED: 'pricing_cta_clicked',
};

// Usage
import { EVENTS } from '~/analytics/events';
window.op('track', EVENTS.CTA_CLICKED, props);

// Option 2: Inline variable (Phase 2 - simpler)
const eventName = 'cta_clicked';
window.op && window.op('track', eventName, props);
track(eventName, props);  // Same variable = consistency
```

**Warning signs:**
- Dashboard shows zero events for newly implemented tracking
- Network tab shows events sent (200 OK) but dashboard empty
- Event names differ by single character

**Verification:**
- Search dashboard for misspelled event names
- Verify event names match schema document exactly
- Use browser DevTools Network tab to inspect event payload

## Code Examples

### Verified Pattern: Navigation Link Click (Header.jsx)

```javascript
// app/components/Header.jsx
// Source: Existing Mixpanel pattern + OpenPanel docs
<Link
  onClick={() => {
    // Existing Vercel Analytics
    track("Click", { name: "Overview" });

    // Existing Mixpanel
    mixpanel.track("Click", { navbar: "Overview" });

    // NEW: OpenPanel tracking
    if (typeof window !== 'undefined' && window.op) {
      window.op('track', 'nav_link_clicked', {
        location: 'header',
        link_text: 'Overview',
        link_destination: '#overview'
      });
    }
  }}
  className="hover:text-white"
  to="#overview"
>
  Overview
</Link>
```

### Verified Pattern: CTA Button Click (Hero.jsx)

```javascript
// app/components/Hero.jsx
// Source: Existing pattern + OpenPanel docs
<Button
  onClick={() => {
    // Existing tracking
    track("Get it now", { name: "Hero" });
    mixpanel.track("Click", { "Get it now": "hero" });

    // NEW: OpenPanel tracking with consistent schema
    if (typeof window !== 'undefined' && window.op) {
      window.op('track', 'cta_clicked', {
        button_text: 'Get it now',
        location: 'hero',
        cta_type: 'primary',
        link_destination: '#pricing'
      });
    }
  }}
  to="#pricing"
  primary
>
  Get it now
</Button>
```

### Verified Pattern: Pricing Button Click with Dynamic Properties (Pricing.jsx)

```javascript
// app/components/Pricing.jsx
// Source: OpenPanel property examples + existing pattern
{Pricings.map((pricing, index) => {
  const tierNames = ['infographics', 'video_course', 'bundle'];
  const tierPrices = ['$34', '$149', '$54'];

  return (
    <Button
      key={index}
      onClick={() => {
        // Existing tracking (keep for backward compatibility)
        track("Get it now", { name: tierNames[index] });
        mixpanel.track("Click", { "Get it now": tierNames[index] });

        // NEW: OpenPanel tracking with full context
        if (typeof window !== 'undefined' && window.op) {
          window.op('track', 'pricing_cta_clicked', {
            pricing_tier: tierNames[index],
            tier_price: tierPrices[index],
            tier_position: index + 1,
            button_text: 'Get it now',
            location: 'pricing',
            discount_percentage: index === 2 ? '30%' : '50%'
          });
        }
      }}
      to={pricing.href}
      primary
      full
    >
      Get it now
    </Button>
  );
})}
```

### Verified Pattern: Data Attribute Auto-Tracking (Alternative)

```html
<!-- app/components/Header.jsx - Mobile navigation -->
<!-- Source: https://openpanel.dev/docs/get-started/track-events -->
<Link
  to="#what-is-inside"
  data-track="nav_link_clicked"
  data-location="mobile_menu"
  data-link_text="What's inside"
  data-link_destination="#what-is-inside"
>
  What's inside?
</Link>

<!-- OpenPanel automatically tracks this click with all data-* attributes as properties -->
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Single analytics provider | Multi-provider strategy (3+ tools) | 2023-2024 | Need consistent event schema across providers |
| Generic "Click" event for everything | Object-Action semantic naming | 2024+ | Better dashboard filtering, self-documenting events |
| Inline tracking code | react-tracking declarative library | 2024+ | Cleaner component code, but adds dependency weight |
| Manual onClick handlers | Data attribute auto-tracking | 2025+ | Less JavaScript, but limited to static properties |
| Synchronous tracking | Fire-and-forget async pattern | 2024+ | Non-blocking UI, better UX, prevents navigation delays |

**Deprecated/outdated:**
- **Generic "Click" event:** Modern analytics uses semantic names (`nav_link_clicked`, `cta_clicked`) for better filtering
- **Page-level tracking:** Component-level granularity preferred (which specific CTA in pricing section)
- **Camel case event names:** snake_case is standard in 2026 (GA4, Amplitude, OpenPanel all recommend)
- **Property abbreviations:** `loc` vs `location` - disk space cheap, clarity expensive

## Open Questions

### Question 1: Unified event schema across all providers?

**What we know:**
- Three providers active: OpenPanel (new), Mixpanel (existing), Vercel Analytics (existing)
- Current naming inconsistent: `"Click"` vs `"Get it now"` vs different properties
- Modern standard is Object-Action snake_case pattern

**What's unclear:**
- Should Phase 2 standardize all three providers immediately?
- Or Phase 2 adds OpenPanel with new schema, Phase 4 refactors Mixpanel/Vercel?

**Recommendation:**
- Phase 2: Add OpenPanel tracking with consistent schema (don't modify existing)
- Keep parallel tracking temporarily for comparison
- Phase 4: Migrate Mixpanel/Vercel to unified schema once OpenPanel validated
- Allows gradual transition without breaking existing dashboards

### Question 2: Track all buttons or just primary CTAs?

**What we know:**
- Success criteria: "Navigation clicks, CTA clicks, Pricing button clicks"
- Requirements: OP-03 specifies CTAs, navigation, pricing buttons
- Current implementation: Header links (4), CTA buttons (3 locations), Pricing (3 tiers)

**What's unclear:**
- Track secondary buttons? (Modal close button, video play button)
- Track outgoing links automatically (Lemon Squeezy checkout)?
- Track mobile navigation separately from desktop?

**Recommendation:**
- Phase 2: Focus on requirement scope (nav, primary CTAs, pricing)
- OpenPanel `trackOutgoingLinks: true` already tracks external links (Phase 1)
- Mobile vs desktop: Same events, differentiate via `location: 'mobile_menu'` property
- Secondary interactions: Defer to Phase 3 (modal tracking)

### Question 3: Performance impact of triple-tracking?

**What we know:**
- Three analytics providers called on every click
- Each provider: ~10-50ms network request (non-blocking)
- Main thread impact: 3x function calls per click

**What's unclear:**
- Measurable impact on Core Web Vitals (Interaction to Next Paint)?
- Should tracking be throttled/debounced?
- Benefits of analytics wrapper to batch calls?

**Recommendation:**
- Phase 2: Implement triple-tracking as-is (fire-and-forget, non-blocking)
- Monitor INP metrics in Phase 2 verification
- If INP > 200ms, investigate wrapper in Phase 4
- Current pattern (direct calls) simplest, unlikely to cause performance issues

## Sources

### Primary (HIGH confidence)
- [OpenPanel Track Events Guide](https://openpanel.dev/docs/get-started/track-events) - No-code tracking, data attributes, property examples
- [OpenPanel Track API Reference](https://openpanel.dev/docs/api/track) - API signature, property structure, headers
- [Analytics Event Naming Conventions](https://medium.com/@maremeinhard/effective-strategies-for-analytics-event-naming-and-management-8ff2f3b44e3f) - Object-Action pattern, snake_case standard
- [Twilio Segment Naming Conventions](https://segment.com/academy/collecting-data/naming-conventions-for-clean-data/) - Category:Object:Action framework
- Phase 1 Research: OpenPanel SDK already initialized via script tag in root.tsx

### Secondary (MEDIUM confidence)
- [Simple Event Naming for Product Analytics](https://www.wudpecker.io/blog/simple-event-naming-conventions-for-product-analytics) - Verb standardization, consistency principles
- [Avo Naming Conventions](https://www.avo.app/docs/data-design/best-practices/naming-conventions) - Casing, validation patterns
- [React Analytics Hooks](https://getanalytics.io/utils/react-hooks/) - useAnalytics pattern for React
- [Expedia React Analytics Context Pattern](https://medium.com/expedia-group-tech/contextual-and-consistent-analytic-event-triggering-in-react-40b48b15739e) - Multi-provider tracking strategy (403 error, content from search preview)
- [Slack React Analytics Library](https://slack.engineering/creating-a-react-analytics-logging-library/) - Wrapper component pattern (66% code reduction)

### Tertiary (LOW confidence - WebSearch only)
- react-tracking library patterns (declarative context approach, 12KB overhead)
- Performance impact of onClick analytics (minimize main thread work guidance)
- Multi-provider dual tracking strategies (no specific 2026 guidance found)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - OpenPanel API verified via official docs, React onClick is standard pattern
- Architecture: HIGH - Patterns match existing codebase structure (Header/Hero/Pricing components)
- Event naming: HIGH - Object-Action snake_case is industry standard (Segment, Avo, GA4)
- Pitfalls: MEDIUM - Based on common multi-provider issues, not OpenPanel-specific documentation
- Performance: MEDIUM - General React performance guidance, not specific to triple-tracking scenario

**Research date:** 2026-01-25
**Valid until:** 2026-02-25 (30 days - stable APIs, naming conventions unlikely to change)

**Implementation readiness:** Ready to plan Phase 2
- OpenPanel track API signature verified: `window.op('track', 'event_name', { properties })`
- Event schema defined: nav_link_clicked, cta_clicked, pricing_cta_clicked
- Property structure documented with examples
- Pitfall avoidance strategies identified
- Code examples verified against existing patterns
