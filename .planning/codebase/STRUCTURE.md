# Codebase Structure

**Analysis Date:** 2026-01-25

## Directory Layout

```
/Users/jorgemoller/projects/visualize-react/
├── app/                              # Application source code
│   ├── routes/                       # Remix route definitions
│   │   └── _index.jsx               # Landing page (GET /)
│   ├── components/                   # Reusable UI components
│   │   ├── Header.jsx               # Sticky navigation + mobile menu
│   │   ├── Hero.jsx                 # Hero section with video
│   │   ├── TheProblem.jsx           # Problem statement section
│   │   ├── WhatIsInside.jsx         # Feature showcase section
│   │   ├── Why.jsx                  # Benefits section
│   │   ├── Testimonials.jsx         # User testimonials grid
│   │   ├── TestimonialCard.jsx      # Single testimonial card
│   │   ├── Pricing.jsx              # Pricing tiers + comparison
│   │   ├── Bonus.jsx                # Bonus offer section
│   │   ├── Footer.jsx               # Footer with links
│   │   ├── Modal.jsx                # Exit-intent email capture
│   │   ├── Button.jsx               # CTA button component
│   │   ├── Container.jsx            # Responsive width wrapper
│   │   ├── Marquee.tsx              # Scrolling logo carousel
│   ├── hooks/                        # Custom React hooks
│   │   └── useOnScreen.jsx          # Intersection Observer hook
│   ├── images/                       # Static image assets
│   │   ├── infographics/            # Infographic images
│   │   ├── profiles/                # Testimonial avatars
│   │   ├── testimonials/            # Testimonial graphics
│   │   ├── videos/                  # Video thumbnails
│   │   ├── logo.webp                # Site logo
│   │   ├── stars.png                # Star ratings
│   │   ├── star-1.svg               # Decorative stars
│   │   ├── star-2.svg               # Decorative stars
│   │   ├── pricing-comments.webp    # Pricing section BG
│   │   ├── interview-bg.webp        # Modal background
│   │   ├── questions-cover.webp     # Ebook cover image
│   │   ├── silver_medal.webp        # Pricing badge
│   │   ├── glass_trophy.webp        # Pricing badge
│   │   ├── gold_medal.webp          # Pricing badge
│   ├── fonts/                        # Custom font files (Thiccboi)
│   ├── subtitles/                   # Video captions (.vtt files)
│   ├── root.tsx                     # App shell, document head, meta
│   ├── entry.server.tsx             # SSR handler, bot detection
│   ├── entry.client.tsx             # Client hydration entry
│   └── tailwind.css                 # Tailwind directives
├── public/                           # Static assets
│   ├── build/                        # Compiled Remix output (generated)
│   ├── intro.mp4                    # Hero video intro
│   ├── [video-name].m4v             # Course videos
│   ├── react-interview-q&a.pdf      # Downloadable ebook
│   ├── favicon.ico                  # Site favicon
│   ├── twitter-card.png             # OG image
│   ├── robots.txt                   # Search engine directives
│   ├── sitemap.xml                  # XML sitemap
├── build/                            # Server build output (generated)
│   └── index.js                     # Compiled Remix server
├── .cache/                           # Remix cache (generated)
├── node_modules/                     # Dependencies (generated)
├── remix.config.js                  # Remix configuration
├── remix.env.d.ts                   # TypeScript definitions
├── tsconfig.json                    # TypeScript config with path alias
├── tailwind.config.js               # Tailwind theme extension
├── package.json                     # Dependencies + scripts
├── package-lock.json                # Locked versions
└── CLAUDE.md                        # Project instructions
```

## Directory Purposes

**`app/`**
- Purpose: All application source code (routes, components, hooks, styles)
- Contains: JSX/TSX files, asset imports, and entry points
- Key files: `root.tsx` (app shell), `_index.jsx` (main route)

**`app/routes/`**
- Purpose: Remix file-based routing
- Contains: One file per route (currently only `_index.jsx`)
- Pattern: Filename determines route structure (`_index.jsx` → `/`)

**`app/components/`**
- Purpose: Reusable UI sections
- Contains: 14 component files (Header, Hero, Pricing, etc.)
- Pattern: One component per file, named as PascalCase

**`app/hooks/`**
- Purpose: Custom React hooks for reusable logic
- Contains: `useOnScreen.jsx` (IntersectionObserver wrapper)

**`app/images/`**
- Purpose: Image assets organized by type
- Subdirs: `infographics/`, `profiles/`, `testimonials/`, `videos/`
- Format: `.webp`, `.svg`, `.png` (optimized for web)

**`app/fonts/`**
- Purpose: Custom font files (Thiccboi typeface)
- Referenced in: `tailwind.config.js` (fontFamily.thiccboi)

**`app/subtitles/`**
- Purpose: Video caption files (.vtt format)
- Used in: Hero video element (English captions)

**`public/`**
- Purpose: Static files served directly (not processed by Remix)
- Contains: Videos, PDFs, images, robots.txt, sitemap.xml
- Videos: Stored in root for CDN-friendly delivery

**`build/`**
- Purpose: Generated Remix server bundle (production)
- Generated: By `npm run build`
- Committed: No (gitignored)

**`.cache/`**
- Purpose: Remix build cache
- Generated: By Remix compiler
- Committed: No (gitignored)

## Key File Locations

**Entry Points:**
- `app/root.tsx`: Document shell with meta, Links, Scripts, Outlet
- `app/entry.server.tsx`: HTTP request handler with SSR logic
- `app/entry.client.tsx`: Browser hydration entry

**Configuration:**
- `remix.config.js`: Remix settings (currently default)
- `tsconfig.json`: TypeScript config with `~/*` path alias
- `tailwind.config.js`: Custom colors, fonts, animations
- `package.json`: Dependencies and build scripts

**Core Logic:**
- `app/routes/_index.jsx`: Landing page + modal state + analytics init
- `app/components/Modal.jsx`: Email capture + Lemon Squeezy integration
- `app/components/Header.jsx`: Navigation + mobile menu (Headless UI Popover)
- `app/components/Hero.jsx`: Hero section + video lazy load

**Testing:**
- No test files present (testing not set up)

## Naming Conventions

**Files:**
- Components: PascalCase (e.g., `Header.jsx`, `Modal.jsx`)
- Hooks: camelCase with `use` prefix (e.g., `useOnScreen.jsx`)
- Routes: Remix convention (e.g., `_index.jsx`)
- Images: kebab-case (e.g., `pricing-comments.webp`, `silver_medal.webp`)

**Directories:**
- Feature directories: kebab-case (e.g., `app/components/`, `app/routes/`)
- Asset subdirs: plural (e.g., `images/`, `fonts/`, `subtitles/`)

**Class/Component Names:**
- Components: PascalCase exported as named or default export
- Example: `export function Header() {}`, `export default function Modal() {}`

## Where to Add New Code

**New Feature:**
- Primary code: `app/components/[FeatureName].jsx`
- If needed state: Lift to `app/routes/_index.jsx` and pass as props
- Tests: Create `app/components/[FeatureName].test.tsx` (not currently used)

**New Component/Module:**
- Implementation: `app/components/[ComponentName].jsx`
- Export: Named export preferred (e.g., `export function ComponentName() {}`)
- Styling: Use Tailwind classes directly in JSX

**Utilities:**
- Shared helpers: Create `app/utils/[name].js` if needed (currently no utils dir)
- Custom hooks: Add to `app/hooks/[hookName].jsx`

**Styling:**
- Global styles: Add to `app/tailwind.css`
- Theme tokens: Extend in `tailwind.config.js`
- Component styles: Inline Tailwind classes (no CSS modules)

**Animations:**
- New keyframes: Add to `tailwind.config.js` under `theme.extend.keyframes`
- New animations: Reference keyframes in `theme.extend.animation`
- React Spring: Use in components that need JS-based animations (see Hero.jsx)

## Special Directories

**`app/images/`:**
- Purpose: Image assets organized by content type
- Generated: No
- Committed: Yes (part of source)
- Subdirs: `infographics/`, `profiles/`, `testimonials/`, `videos/`
- Access: Import as `import logo from "../images/logo.webp"`

**`build/` & `.cache/`:**
- Purpose: Build artifacts and compilation cache
- Generated: By Remix build process
- Committed: No (gitignored)
- Cleanup: `npm run build` regenerates on each build

**`public/build/`:**
- Purpose: Client-side JS and CSS bundles (Remix output)
- Generated: By `npm run build`
- Committed: No (gitignored)
- Content: Hydration scripts for React

**`public/` (root files):**
- Purpose: Static files served directly (videos, PDFs, etc.)
- Committed: Yes (source files)
- Examples: `intro.mp4`, `react-interview-q&a.pdf`, `twitter-card.png`

---

*Structure analysis: 2026-01-25*
