# Roadmap: v1.1 Lemon Squeezy Webhooks

## Overview

Add Lemon Squeezy webhook endpoint to capture order_created and subscription_created events, verify signatures for security, and forward payment data to OpenPanel server-side API for conversion tracking.

## Phases

- [ ] **Phase 4: Webhook Endpoint + OpenPanel Integration** - Secure webhook handler with server-side analytics

## Phase Details

### Phase 4: Webhook Endpoint + OpenPanel Integration
**Goal**: Capture and track Lemon Squeezy payment events securely in OpenPanel
**Depends on**: Phase 3 (v1.0 complete - client-side OpenPanel tracking)
**Requirements**: HOOK-01, HOOK-02, HOOK-03, HOOK-04, HOOK-05, HOOK-06, HOOK-07, HOOK-08, HOOK-09, HOOK-10, HOOK-11
**Success Criteria** (what must be TRUE):
  1. Lemon Squeezy webhooks POST to endpoint and receive 200 response
  2. Invalid webhook signatures are rejected with 401 (security verified)
  3. Order_created events appear in OpenPanel with user_name, user_email, subtotal_usd
  4. Subscription_created events appear in OpenPanel as subscription_created_test
**Plans**: 1 plan

Plans:
- [ ] 04-01-PLAN.md - Implement webhook route with HMAC verification and OpenPanel forwarding

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 4. Webhook Endpoint + OpenPanel Integration | 0/1 | Ready | - |
