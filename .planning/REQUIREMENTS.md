# Requirements: v1.1 Lemon Squeezy Webhooks

**Defined:** 2026-01-27
**Core Value:** Track purchases in OpenPanel for conversion measurement

## v1 Requirements

### Webhook Endpoint

- [ ] **HOOK-01**: Webhook route at `/api/v1/integrations/lemon-squeezy-webhook/:id`
- [ ] **HOOK-02**: HMAC-SHA256 signature verification with timing-safe comparison
- [ ] **HOOK-03**: Return 401 for invalid signatures

### Event Processing

- [ ] **HOOK-04**: Filter for `order_created` events
- [ ] **HOOK-05**: Filter for `subscription_created` events (test)
- [ ] **HOOK-06**: Extract user_name, user_email, subtotal_usd from payload

### OpenPanel Integration

- [ ] **HOOK-07**: Send `order_created` event to OpenPanel server-side API
- [ ] **HOOK-08**: Send `subscription_created_test` event to OpenPanel server-side API
- [ ] **HOOK-09**: Include user_name, user_email, subtotal_usd as event properties

### Configuration

- [ ] **HOOK-10**: Environment variable for webhook signing secret
- [ ] **HOOK-11**: Environment variable for OpenPanel client secret

## Out of Scope

| Feature | Reason |
|---------|--------|
| All Lemon Squeezy event types | Only order_created and subscription_created needed for now |
| Idempotency/deduplication | Duplicate events acceptable for MVP |
| Async queue processing | Direct processing sufficient for volume |
| Database storage of events | Analytics in OpenPanel is the source of truth |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| HOOK-01 | TBD | Pending |
| HOOK-02 | TBD | Pending |
| HOOK-03 | TBD | Pending |
| HOOK-04 | TBD | Pending |
| HOOK-05 | TBD | Pending |
| HOOK-06 | TBD | Pending |
| HOOK-07 | TBD | Pending |
| HOOK-08 | TBD | Pending |
| HOOK-09 | TBD | Pending |
| HOOK-10 | TBD | Pending |
| HOOK-11 | TBD | Pending |

**Coverage:** 11/11 requirements (100% after roadmap)

---
*Requirements defined: 2026-01-27*
