# Carers Worldwide — Build Summary

A running log of everything built and fixed in this project: a Next.js + Contentful
recreation of the [carersworldwide.org](https://carersworldwide.org) header/navigation and a
set of shared, reusable components. Work was done on the **E25 Contentful base** using the
`/e25-build-component` skill (Mode B — live-website recreation).

- **Base:** Next.js 16 (App Router, Turbopack) + React 19 + Tailwind v4 + Contentful (GraphQL).
- **CMS:** Contentful space `732gj3i53ay0`, `master` environment.
- **Font:** Poppins (added via `next/font/google`).
- **Brand tokens** (`app/globals.css`): `--brand-primary #92278f`, `--brand-primary-hover #7a1f78`,
  `--brand-accent #f7941d`, `--text-default #333`, `--nav-link #333`, `--nav-link-muted #999`.

---

## 1. Navigation section (site header)

Built the full site header as a CMS-backed section (`navigation` content type,
`frontEndComponent = "Default"`), matching the live site pixel-for-pixel.

### Content model (Contentful)
- **`navigation`** — `frontEndComponent` (dropdown `["Default"]`), `logo` (Asset),
  `logoWidth`/`logoHeight` (Integer), `donateLabel` + `donateHref` (Symbol),
  `items` (Array → `navigationItem`), `internalTitle`.
- **`navigationItem`** — self-nesting: `label`, `href`, `childItems` (Array → `navigationItem`)
  for dropdown children.
- Registered `navigation` as an allowed section on `flexiblePage.sections`.

### Files (six-step recipe)
1. `lib/contentful/graphql/queries/navigation.ts` — hydrate query with nested `childItemsCollection`.
2. `lib/sections/types.ts` — `NavigationSection` + `NavLink`, unioned into `Section`.
3. `lib/sections/definitions/navigation.tsx` — hydrate + transform + render.
4. `components/sections/Navigation/index.tsx` — switch on `frontEndComponent`.
5. `components/sections/Navigation/NavigationDefault/index.tsx` — the header (client component).
6. Registered in `lib/sections/registry.ts`.

### Sample content (seeded + published)
- Uploaded the real logo SVG as a Contentful asset (`asset-cw-logo`).
- Created the full nav tree (9 top-level items + dropdown children), the `nav-main` navigation
  entry, and prepended it to the `home` FlexiblePage.

### Nav tree
Home · Radio 4 Appeal · **About▾** · **Our Work▾** · **Impact▾** · **Get Involved▾** · Blog ·
**Events▾** · Contact. Dropdown children were scraped from the live site's markup
(e.g. About = About Us / Finances / Our Team / Our Story / Reports & Publications /
Supporters & Funders).

### Key design facts (measured from the live site's `theme.css`)
- Nav links: Poppins **600**, 15.5px, uppercase, letter-spacing 1px, `#333`; **active = purple**,
  **hover = orange `#f7941d`**.
- Nav gap between items: **40px**.
- Donate button: Poppins **700**, 15.5px, letter-spacing 1.5px, **44px tall**, purple pill,
  heart icon; pinned **top-right**.
- Dropdowns: appear on hover; content-driven columns (**≤3 links = 1 column**, more = **2 columns**,
  column-major fill); **left-aligned** under most parents, **right-aligned** for the rightmost
  (Events) to avoid overflow.
- Mobile: hamburger → off-canvas slide-in from the right with an accordion (exclusive expand).

---

## 2. Iterative fixes to the Navigation (in order)

1. **Global container spacing** — created a `.site-container` utility. Final version replicates
   the live "xlarge" container exactly: `box-sizing:border-box; max-width:1680px` (1600 content +
   40px padding), auto margins, responsive padding (16 / 30 / 40px). Verified logo/donate offsets
   match live at every viewport (40px @1440, 160px @1920).
2. **Removed caret triangles** from desktop nav links (live has none). Mobile accordion carets kept.
3. **Dropdown font + order** — bumped dropdown links to 16px; switched to **column-major** fill
   (`grid-flow-col` + computed `gridTemplateRows`) to match the live column split.
4. **Donate button** — corrected weight (600→700), size (13→15.5px), height (40→44px), and pinned
   it to the top (right column uses `justify-between`, so donate pins top and nav pins bottom,
   aligned with the logo baseline).
5. **Hover colour → orange** — nav links, dropdown links, and mobile child links now hover to
   `--brand-accent` (`#f7941d`); active stays purple.
6. **Heart icon** — replaced with the live site's exact `heart.svg` path.
7. **Dropdown gap** — removed the `pt-4` hover-bridge so the panel sits flush under the nav
   (hover stays active because the panel is a descendant of the `group` `<li>`).
8. **Orange line placement (final)** — the orange line was briefly a full-nav-width underline;
   corrected so it is the **dropdown panel's top border** only (`border-t-[3px]
   border-[var(--brand-accent)]`), spanning the panel width and aligned with each dropdown.

### Non-issues clarified
- A hydration-mismatch warning in dev (`cz-shortcut-listen` on `<body>`) is caused by the
  **ColorZilla browser extension**, not the app. `GET /.well-known/.../com.chrome.devtools.json 404`
  is benign Chrome DevTools probing. The app hydrates correctly.

---

## 3. Section 0 — Shared reusable components

Built the foundational component library that Sections 1–11 will consume.

### Contentful content types (created + published via CMA)
- **`image`** — `asset` (Asset), `alt`, `loading` (`eager`|`lazy`), `internalTitle`.
- **`cta`** — `label`, `href`, `variant` (`default`|`primary`|`donate`), `ariaLabel`,
  `target` (`_self`|`_blank`).
- **`video`** — `youtubeId`, `videoTitle`, `caption`, `internalTitle`.
- **`card`** — `frontEndComponent` (`media-top`|`media-left`|`linked`|`blog`), `image` (→image),
  `eyebrow`, `title`, `titleHref`, `body` (**RichText**), `meta`, `cta` (→cta), `internalTitle`.

### GraphQL fragments (`lib/contentful/graphql/fragments/`)
`image.ts`, `cta.ts`, `video.ts`, `card.ts`. `CARD_FRAGMENT` spreads `ImageFields` + `CtaFields`
and exports `CARD_FRAGMENT_DEPS` so section hydrate queries can compose them.

### Shared types (`lib/sections/types.ts`)
`ImageEntry`, `CtaEntry` (+`CtaVariant`), `VideoEntry`, `CardEntry` (+`CardVariant`),
`RichTextContent`.

### Mappers (`lib/contentful/`)
`image.ts`, `cta.ts`, `video.ts`, `card.ts` (card composes the image/cta mappers).

### Contentful-backed components (`components/common/`)
- **Image** — responsive `<picture>`: webp `srcset` via the Contentful Images API + jpeg/png
  fallback, explicit width/height, alt, loading. Only transforms `ctfassets.net` URLs (raw `<img>`
  for SVG/external).
- **Cta** — variants `default` (outlined orange → purple hover), `primary` (solid purple),
  `donate` (purple pill + heart). Internal `next/link` vs external `<a>`.
- **Video** — YouTube-nocookie 16:9 embed, rounded purple border, optional caption.
- **Card** — switch-case on `frontEndComponent` → `media-top`, `media-left`, `linked`
  (whole-card link + hover scale), `blog`.
- **RichText** — shared `@contentful/rich-text-react-renderer` wrapper.

### Pure-UI primitives (`components/common/`)
- **SectionHeader** — eyebrow + H2 + orange divider + optional intro, `left`/`center` align.
- **Slider** — client carousel: autoplay, `pauseOnHover`, prev/next arrows, dot pagination,
  `slidesPerView` (1 for Hero, 3–4 for Explore).
- **StatItem** — `grid` (large stacked number/label, Impact) and `inline` (chevron row, Mission).
- **SocialLinks** — inline-SVG icon row (Facebook, X/Twitter, LinkedIn, Instagram, YouTube),
  configurable size.

### Dependencies added
`@contentful/rich-text-react-renderer`, `@contentful/rich-text-types` (for Card RichText bodies
and future RTE fields).

### Preview / QA route
`app/component-preview/page.tsx` — a static route rendering every component and variant with mock
data, used for visual QA. Safe to keep as a living reference or delete anytime.

The Navigation header was refactored to consume the shared `Cta` (donate) and imports
`SocialLinks` (for the mobile menu/footer).

---

## Verification approach (throughout)

- **Measured, not eyeballed:** headless-Chrome scripts read computed styles and element geometry
  from both the live site and localhost, then diffed them (container offsets, nav gaps, donate
  button metrics, hover colours, dropdown positions).
- **Forced `:hover`** via CDP `CSS.forcePseudoState` to reliably screenshot CSS-only dropdown
  hover states (synthetic mouse-hover drops during capture).
- Every change gated on `npx tsc --noEmit`, `eslint`, and `npm run build` — all clean.
- Delivery-GraphQL probes confirmed published content resolves end-to-end.

## Current status
- Navigation: pixel-matched to live (toolbar, logo, nav spacing/typography, dropdowns, donate,
  mobile menu), including the final orange-line-on-dropdown fix.
- Section 0 shared components: built, visually QA'd, build clean.
- Not yet built: Sections 1–11 (they will link the shared entries and compose the components per
  `components/ARCHITECTURE.md`).
