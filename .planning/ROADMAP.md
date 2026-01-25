# Roadmap: OpenPanel Analytics Integration

## Overview

Add OpenPanel analytics to Remix marketing site alongside existing Mixpanel and Vercel Analytics. Three phases deliver complete event tracking: SDK initialization with pageviews, click event tracking across all CTAs and navigation, and video play tracking. Each phase is independently deployable and verifiable via OpenPanel dashboard.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: SDK Integration** - Install and initialize OpenPanel with pageview tracking
- [x] **Phase 2: Click Event Tracking** - Track all user interactions (navigation, CTAs, pricing)
- [ ] **Phase 3: Form & Video Events** - Track email capture and video plays

## Phase Details

### Phase 1: SDK Integration
**Goal**: OpenPanel SDK initialized and tracking pageviews
**Depends on**: Nothing (first phase)
**Requirements**: OP-01 (SDK integration), OP-02 (Pageview tracking), OP-06 (Dashboard visibility)
**Success Criteria** (what must be TRUE):
  1. OpenPanel SDK loaded in app/root.tsx via script tag
  2. Client ID configured for environment (dev/prod separation)
  3. Pageviews tracked automatically on route navigation
  4. Events visible in OpenPanel dashboard
  5. Existing Mixpanel and Vercel Analytics continue working
**Plans**: 1 plan

Plans:
- [x] 01-01-PLAN.md - Initialize OpenPanel SDK, disable Mixpanel auto-pageview

### Phase 2: Click Event Tracking
**Goal**: All user clicks tracked across site
**Depends on**: Phase 1
**Requirements**: OP-03 (Click events)
**Success Criteria** (what must be TRUE):
  1. Navigation clicks tracked (Header links)
  2. CTA clicks tracked (Hero, all "Get it now" buttons)
  3. Pricing button clicks tracked (all three tiers)
  4. Events include contextual metadata (button location, CTA type)
  5. Event names follow consistent schema across all providers
**Plans**: 1 plan

Plans:
- [x] 02-01-PLAN.md — Add click tracking to Header, Hero, and Pricing components

### Phase 3: Form & Video Events
**Goal**: Email capture and video engagement tracked
**Depends on**: Phase 2
**Requirements**: OP-04 (Form submissions), OP-05 (Video plays)
**Success Criteria** (what must be TRUE):
  1. Exit-intent modal submission tracked (email capture)
  2. Hero video play events tracked
  3. Bonus video play events tracked
  4. Form submission events include success/failure status
  5. Video events include video ID and play position
**Plans**: 1 plan

Plans:
- [ ] 03-01-PLAN.md — Track form submission and video play/pause/ended events

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. SDK Integration | 1/1 | Complete | 2026-01-25 |
| 2. Click Event Tracking | 1/1 | Complete | 2026-01-25 |
| 3. Form & Video Events | 0/1 | Ready | - |
