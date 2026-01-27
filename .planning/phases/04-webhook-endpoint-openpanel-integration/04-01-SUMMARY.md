---
phase: 04-webhook-endpoint-openpanel-integration
plan: 01
subsystem: api
tags: [lemon-squeezy, webhooks, openpanel, analytics, hmac, security]

# Dependency graph
requires:
  - phase: 03-form-video-events
    provides: OpenPanel client-side tracking infrastructure
provides:
  - Lemon Squeezy webhook endpoint with HMAC signature verification
  - Server-side event tracking to OpenPanel for conversion measurement
  - Secure payment event pipeline (order_created, subscription_created)
affects: [analytics, conversion-tracking]

# Tech tracking
tech-stack:
  added: [Node.js crypto (built-in), fetch API (built-in)]
  patterns: [HMAC-SHA256 signature verification, timing-safe comparison, fire-and-forget event forwarding]

key-files:
  created:
    - app/routes/api.v1.integrations.lemon-squeezy-webhook.$id.tsx
  modified: []

key-decisions:
  - "Use crypto.timingSafeEqual for signature comparison to prevent timing attacks"
  - "Extract raw body before JSON parsing (required for HMAC verification)"
  - "Return 200 even if OpenPanel fails to prevent Lemon Squeezy retry storms"
  - "Map subscription_created to subscription_created_test event name"

patterns-established:
  - "Webhook security: Raw body extraction → signature verification → JSON parsing"
  - "Fire-and-forget pattern: Return 200 immediately, log failures without blocking"

# Metrics
duration: 2min
completed: 2026-01-27
---

# Phase 04 Plan 01: Webhook Endpoint + OpenPanel Integration Summary

**Lemon Squeezy webhook with HMAC-SHA256 verification forwarding payment events to OpenPanel analytics**

## Performance

- **Duration:** 2 min
- **Started:** 2026-01-27T22:14:35Z
- **Completed:** 2026-01-27T22:16:25Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments
- Secure webhook endpoint with HMAC-SHA256 signature verification using timing-safe comparison
- Server-side event tracking to OpenPanel for order_created and subscription_created events
- Fire-and-forget pattern prevents Lemon Squeezy retry storms on OpenPanel failures

## Task Commits

Each task was committed atomically:

1. **Tasks 1-2: Webhook route with HMAC verification and OpenPanel tracking** - `7de9e38` (feat)

**Plan metadata:** Not yet committed

_Note: Both tasks implemented in single file, committed together_

## Files Created/Modified
- `app/routes/api.v1.integrations.lemon-squeezy-webhook.$id.tsx` - Remix resource route handling POST webhooks with signature verification and OpenPanel forwarding

## Decisions Made

**1. Use crypto.timingSafeEqual for signature comparison**
- Prevents timing attacks on HMAC verification
- More secure than string equality comparison

**2. Extract raw body before JSON parsing**
- HMAC signature computed on raw bytes
- Parsing body first breaks signature verification

**3. Return 200 even if OpenPanel fails**
- Prevents Lemon Squeezy retry storms
- Fire-and-forget pattern logs errors but doesn't block webhook response

**4. Map subscription_created to subscription_created_test**
- Per plan specification for testing/staging differentiation

## Deviations from Plan

**Auto-fixed Issues**

**1. [Rule 1 - Bug] Fixed crypto import for TypeScript**
- **Found during:** Build verification after file creation
- **Issue:** TypeScript error - crypto module has no default export
- **Fix:** Changed `import crypto from "crypto"` to `import * as crypto from "crypto"`
- **Files modified:** app/routes/api.v1.integrations.lemon-squeezy-webhook.$id.tsx
- **Verification:** Build passes, TypeScript compiles
- **Committed in:** 7de9e38 (corrected in initial commit)

---

**Total deviations:** 1 auto-fixed (1 bug - TypeScript import)
**Impact on plan:** Minor syntax correction for TypeScript compatibility. No scope change.

## Issues Encountered

None - pre-existing react-spring TypeScript error in repo (unrelated to webhook implementation)

## User Setup Required

**External services require manual configuration.** Environment variables needed:

**Lemon Squeezy:**
- `LEMON_SQUEEZY_WEBHOOK_SECRET` - From Lemon Squeezy Dashboard → Settings → Webhooks → Signing secret
- Used for HMAC-SHA256 signature verification

**OpenPanel:**
- `OPENPANEL_CLIENT_ID` - Already in use: c1eb2b83-2218-46cd-907b-ce5681c8ad76
- `OPENPANEL_CLIENT_SECRET` - From OpenPanel Dashboard → Settings → Client Secret
- Used for server-side event tracking authentication

**Verification:**
1. Set env vars in production environment
2. Configure webhook URL in Lemon Squeezy: `https://[domain]/api/v1/integrations/lemon-squeezy-webhook/[id]`
3. Test with Lemon Squeezy webhook test event
4. Verify events appear in OpenPanel dashboard

## Next Phase Readiness

- Webhook endpoint complete and secure
- Ready for production deployment after env vars configured
- OpenPanel conversion tracking enabled for payment events
- No blockers

---
*Phase: 04-webhook-endpoint-openpanel-integration*
*Completed: 2026-01-27*
