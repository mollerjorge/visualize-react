# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Dev server with manual reload
npm run build      # Production build
npm start          # Production server (requires build first)
npm run typecheck  # TypeScript validation
```

## Architecture

Remix v2 marketing site for React education product. SSR with client hydration.

**Stack:** Remix, React 18, TypeScript, Tailwind CSS, React Spring (animations), Headless UI

**Structure:**
- `app/routes/_index.jsx` - Single landing page
- `app/components/` - UI components (Header, Hero, Pricing, Modal, etc.)
- `app/hooks/useOnScreen.jsx` - Intersection Observer for scroll detection
- `app/root.tsx` - App shell with meta/links

**Key patterns:**
- Exit-intent Modal triggers on mouseleave, integrates with Lemon Squeezy for email capture
- Marquee component uses React Spring for infinite scroll animation
- Dual analytics: Vercel Analytics + Mixpanel
- Path alias: `~/*` → `./app/*`

**Styling:** Tailwind with custom dark theme (body-1, body-2, bg-dark-1, purple accents), Thiccboi font
