# Technology Stack

**Analysis Date:** 2026-01-25

## Languages

**Primary:**
- TypeScript 5.1.6 - Full codebase with strict mode enabled
- JSX/TSX - React components

**Secondary:**
- JavaScript - Legacy component files (.jsx) still used alongside TypeScript

## Runtime

**Environment:**
- Node.js >=18.0.0 (enforced via `engines` in package.json)

**Package Manager:**
- npm (package-lock.json present)
- Lockfile: `package-lock.json` tracked and maintained

## Frameworks

**Core:**
- Remix 2.2.0 - Full-stack React framework with SSR and file-based routing
  - `@remix-run/react` - React integration
  - `@remix-run/node` - Server runtime
  - `@remix-run/serve` - Production server
  - `@remix-run/css-bundle` - CSS bundling
- React 18.2.0 - UI framework
- React DOM 18.2.0 - DOM rendering

**Styling:**
- Tailwind CSS 3.3.5 - Utility-first CSS framework
  - Configured in `tailwind.config.js`
  - Content paths: `./app/**/*.{js,jsx,ts,tsx}`
  - Custom theme with dark colors (`body-1`, `body-2`, `bg-dark-1`, `light-1`, `purple-1`, `purple-2`)
  - Custom font: Thiccboi (loaded via Tailwind config)
  - Animation keyframes for marquee component

**UI Components:**
- Headless UI 1.7.17 - Unstyled, accessible components (Dialog, Popover, Transition)

**Animations:**
- React Spring 9.7.3 - Animation library for smooth transitions
  - Used for Hero animations, info section trails, marquee scrolling

**Media:**
- yet-another-react-lightbox 3.15.2 - Image/video lightbox gallery
  - Video plugin included for video playback in modal

## Key Dependencies

**Critical:**
- clsx 2.0.0 - Conditional CSS class joining utility
- isbot 3.6.8 - Bot detection for SSR optimization

**Analytics & Tracking:**
- mixpanel-browser 2.48.1 - Mixpanel analytics client
  - Initialized in `app/routes/_index.jsx` with token `fa22af7fecb1e5b8d0c88bd7111c0c63`
  - Tracks: pageviews, button clicks, pricing interactions
  - Persists data to localStorage
- @vercel/analytics 1.1.1 - Vercel Web Analytics integration

## Configuration

**Environment:**
- TypeScript strict mode enabled
- JSX transform: `react-jsx` (automatic JSX runtime)
- Module resolution: Bundler
- Target: ES2022
- Path aliases: `~/*` → `./app/*` (configured in tsconfig.json)

**Build:**
- Build output: `/build` directory (SSR + client bundles)
- Entry points:
  - `app/entry.server.tsx` - Server-side rendering
  - `app/entry.client.tsx` - Client hydration
  - `app/root.tsx` - App shell and meta tags

**Styling Configuration:**
- No separate CSS preprocessor (Tailwind directly)
- CSS bundle included via Remix CSS Bundle plugin

## Platform Requirements

**Development:**
- Node.js >=18.0.0
- npm for dependency management
- Terminal access for dev server (`npm run dev`)

**Production:**
- Node.js >=18.0.0 runtime
- Built artifacts in `/build` directory
- Served via `remix-serve` or compatible Node.js HTTP server
- SSR capable environment (needs Node runtime, not static hosting)

## Scripts

```bash
npm run dev        # Start dev server with manual reload
npm run build      # Production build (Remix)
npm start          # Run production server (requires build first)
npm run typecheck  # TypeScript type checking (tsc)
```

---

*Stack analysis: 2026-01-25*
