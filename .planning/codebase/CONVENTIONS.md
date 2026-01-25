# Coding Conventions

**Analysis Date:** 2026-01-25

## Naming Patterns

**Files:**
- PascalCase for components: `Header.jsx`, `Button.jsx`, `Modal.jsx`, `Container.jsx`
- camelCase for hooks: `useOnScreen.jsx`
- Index route uses convention: `_index.jsx`
- TypeScript files: `.tsx` extension (e.g., `root.tsx`, `Marquee.tsx`); JSX files: `.jsx`

**Functions:**
- Named exports for components: `export function Header()` in `app/components/Header.jsx`, `export function Container()`
- Default exports for components: `export default function Button()`, `export default function Modal()`
- Private/internal functions: camelCase, no export prefix: `function MobileNavIcon()`, `function MobileNavigation()` in `app/components/Header.jsx`
- Hook functions: camelCase with `use` prefix: `useOnScreen(ref)` in `app/hooks/useOnScreen.jsx`

**Variables:**
- State variables: camelCase with descriptive names: `isOpen`, `setIsModalOpen`, `isIntersecting`, `setIntersecting`
- Constants (module-level data): camelCase, all caps for all-uppercase acronyms: `testimonials`, `navigation`, `logos`, `Pricings`
- Local variables: camelCase: `email`, `loading`, `title`, `isInView`, `isScrolledIntoView`
- Boolean variables/states: prefix with `is` or `open`: `isOpen`, `isInView`, `open`, `isIntersecting`
- Refs: camelCase suffix with `ref`: `whatIsInsideref`, `infosRef` (inconsistent casing observed in `app/components/WhatIsInside.jsx`)
- HTML elements: lowercase with camelCase for JS references: `document.getElementById("hero-video")`

**Types:**
- Function parameters destructured: `{ open }`, `{ className, ...props }`, `{ isOpen, setIsOpen }`
- Props objects follow destructuring pattern throughout

## Code Style

**Formatting:**
- No Prettier config file found; using project defaults
- Line length: Observed files use flexible line lengths
- Indentation: 2 spaces (observed in components and config files)
- Semicolons: Generally used; some files omit (JSX files inconsistent)

**Linting:**
- ESLint extends Remix config: `@remix-run/eslint-config` + `@remix-run/eslint-config/node` (`.eslintrc.cjs`)
- TypeScript strict mode enabled in `tsconfig.json`

## Import Organization

**Order:**
1. React and framework imports: `import React from "react"`, `import { track } from "@vercel/analytics"`
2. Framework-specific imports: `import { Link } from "@remix-run/react"`, `import type { LinksFunction }`
3. UI library imports: `import { Fragment } from "react"`, `import { Popover, Transition } from "@headlessui/react"`
4. Utility imports: `import clsx from "clsx"`, `import mixpanel from "mixpanel-browser"`
5. Local component imports: `import { Container } from "./Container"`, `import Button from "./Button"`
6. Asset/image imports: `import logo from "../images/logo.webp"`, `import stars from "../images/stars.png"`
7. Path aliases used: `import Marquee from "~/components/Marquee"` and `import { Container } from "./Container"`

**Path Aliases:**
- `~/*` maps to `./app/*` per `tsconfig.json` baseUrl configuration
- Used selectively (observed in `_index.jsx` but not consistently)

## Error Handling

**Patterns:**
- Try-catch blocks for async operations: `try { let response = await fetch(...) } catch (error) { alert(...) } finally { setLoading(false) }` in `app/components/Modal.jsx`
- Error alerts to user: `alert("Sorry, there was an issue: " + error)` or `alert("Sorry, we couldn't subscribe you.")`
- Console error logging for server-side rendering: `console.error(error)` in `app/entry.server.tsx` (lines 79, 129)
- Conditional error handling: Only log if shell already rendered (onError callbacks check `shellRendered` flag)
- Error objects from promises: Passed to reject/onError callbacks without explicit typing beyond `error: unknown`

## Logging

**Framework:** console (built-in) with analytics integrations

**Patterns:**
- Analytics tracking: `track("Click", { name: "Overview" })` from Vercel Analytics in `app/components/Header.jsx`
- Mixpanel tracking: `mixpanel.track("Click", { navbar: "Overview" })` for user events
- Dual analytics approach: Both Vercel and Mixpanel tracked for same events
- Debug logs: `debug: true` in Mixpanel init config in `app/routes/_index.jsx`
- No console.log statements observed in component code

## Comments

**When to Comment:**
- Gradient overlay explanations: `{/* Gradient Overlay - Left */}` in `app/components/Marquee.tsx`
- State logic explanations: `// Partially visible elements return true:` in `app/components/Hero.jsx`
- Event handler notes: `// The backdrop, rendered as a fixed sibling to the panel container` in `app/components/Modal.jsx`
- Remix framework guidance: JSDoc comments explaining file purpose in entry files

**JSDoc/TSDoc:**
- Not extensively used in components
- Framework-provided JSDoc types used: `@type {import('tailwindcss').Config}` in `tailwind.config.js`

## Function Design

**Size:** Functions kept relatively small; components typically 40-200 lines

**Parameters:**
- Destructured props common: `function MobileNavIcon({ open })`, `export function Container({ className, ...props })`
- Rest parameters used: `{ className, ...props }` spread to underlying elements
- Optional parameters with defaults: `cn = ""` in `Button.jsx`, component props without defaults when required

**Return Values:**
- JSX elements (React components)
- Booleans from hooks: `return isIntersecting` in `useOnScreen.jsx`
- Arrays from hooks: None observed
- Objects/data structures: Used in animation config objects

## Module Design

**Exports:**
- Default exports for single-component files: `export default function Button()`, `export default function Modal()`
- Named exports for multi-component/utility files: `export function Header()`, `export function Container()`
- Mixed approach in routes: `export const meta = () => {...}` and `export default function Index()` in `app/routes/_index.jsx`

**Barrel Files:**
- No barrel files (`index.js`) observed in directory structure
- Direct imports from component files: `import { Header } from "../components/Header"`

---

*Convention analysis: 2026-01-25*
