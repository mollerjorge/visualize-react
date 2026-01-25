# Testing Patterns

**Analysis Date:** 2026-01-25

## Test Framework

**Runner:**
- Not detected

**Assertion Library:**
- Not detected

**Run Commands:**
```bash
npm run typecheck              # TypeScript validation (only test-related command)
```

## Test File Organization

**Location:**
- Not detected - no test files found in codebase

**Naming:**
- Not applicable - no test files present

**Structure:**
- Not applicable - no test infrastructure in place

## Test Structure

**Suite Organization:**
- Not applicable - testing framework not configured

**Patterns:**
- Not applicable - no test examples available

## Mocking

**Framework:**
- Not detected

**Patterns:**
- Not applicable - no mocking setup found

**What to Mock:**
- Not established

**What NOT to Mock:**
- Not established

## Fixtures and Factories

**Test Data:**
- Not applicable - no test infrastructure

**Location:**
- Not applicable - no test data factories found

## Coverage

**Requirements:**
- None enforced - no coverage tooling detected

**View Coverage:**
- Not applicable

## Test Types

**Unit Tests:**
- Not implemented

**Integration Tests:**
- Not implemented

**E2E Tests:**
- Not applicable - no framework detected

## Common Patterns

**Async Testing:**
- Not established - no test framework present

**Error Testing:**
- Not established - no test framework present

## Development Testing Approach

**Manual Testing Observed:**
- Browser-based manual testing implied by development setup
- Hot reload development: `npm run dev --manual` enables manual refresh
- Browser console for debugging: Components use analytics tracking for user behavior verification
- Mixpanel debug mode enabled: `debug: true` in Mixpanel init (`app/routes/_index.jsx` line 20)

## TypeScript as Quality Tool

**Strict Mode:**
- Enabled in `tsconfig.json`: `"strict": true`
- Provides compile-time type checking across codebase
- Run via: `npm run typecheck`

**Type Coverage:**
- Entry files (`app/entry.server.tsx`, `app/root.tsx`) use full type annotations
- Component files primarily use `.jsx` without TypeScript
- Mixed approach: Only `Marquee.tsx` uses TypeScript among components

---

*Testing analysis: 2026-01-25*
