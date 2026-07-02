# Section 6 — Impact Stats: Build Summary

Built with the `/e25-build-component` skill on the **Contentful + Next.js** base
(`carers-worldwide`). Recreation POC from `homepage.html` (`.impactblock`, Section 6).

- **Content type:** `impactStats`
- **Frontend component (variant):** `Parallax Image Left / Stats Right`
- **Reuses:** `Image`, `Stat`, `Cta` content types; shared `StatItem` (`grid` size),
  shared `Cta` (`ghost-accent` variant), new shared `SplitTile` layout.

---

## 1. Reference & requirements

Target `.impactblock` in `homepage.html` (~lines 871–1016):
- `uk-container-xlarge`, `uk-grid-collapse`, two `uk-width-1-2@m` halves, `uk-grid-item-match`.
- **Left half:** cover background `/images/impact-parallax2.jpg` (`uk-parallax bgy`) with a
  `rgba(146,39,143,0.1)` purple overlay (`uk-position-cover`).
- **Right half:** `uk-tile-primary` (purple) panel — `uk-heading-small uk-heading-divider`
  "Our Impact", then three `el-item` rows (`uk-h1` number + `uk-text-lead` label:
  46,775 / +47,252 / +185,637), then a `uk-button-default` "Latest Report" button.

Section 8 (`Make a Donation`) shares this split image + colour-panel layout **mirrored**
(image right), so the layout was factored into a reusable `SplitTile`.

## 2. Content model (CMS)

Created + published content type `impactStats` and allowed it as a `flexiblePage.sections`
link type. Fields (camelCase):
`internalTitle`, `frontEndComponent` (dropdown), `sectionId`, `heading`,
`image` (→ `image` entry), `stats` (Array → `stat` entries), `cta` (→ `cta` entry).

Sample entries created + published: asset `impactParallax2` (fetched from the live site),
`impactImage`, `impactStat1/2/3`, `impactReportCta` (variant `ghost-accent`, opens the PDF in
a new tab), and section `impactStatsHome`. Inserted into the `home` page between
`cc-section-countrycards` and `dc-section-donation`.

## 3. Six-step recipe (files)

1. **GraphQL** — `lib/contentful/graphql/queries/impactStats.ts` (spreads `ImageFields` + `CtaFields`).
2. **Type** — `ImpactStatsSection` added to `lib/sections/types.ts` + `Section` union.
3. **Transform** — `lib/sections/definitions/impactStats.tsx` (`mapImage` + `mapCta`, maps stats).
4. **Component** — `components/sections/ImpactStats/index.tsx` (switch) +
   `ParallaxImageStats/index.tsx` (variant).
5. **Definition** — exported in the definition file above.
6. **Register** — appended `impactStatsDefinition` to `lib/sections/registry.ts`.

Shared additions:
- `components/common/SplitTile/index.tsx` — full-width split tile (cover image half + colour
  panel half), `imageSide` prop mirrors the layout for Section 8, `overlayColor` token-driven.
- `components/common/StatItem/index.tsx` — added a `tone="light"` option to the `grid` size
  (white number + label) for use on the purple panel; label bumped to lead size (19px).

## 4. Theming / decisions

- Overlay `rgba(146,39,143,0.1)` expressed as
  `color-mix(in srgb, var(--brand-primary) 10%, transparent)` — no hex literal.
- Panel `bg-[var(--brand-primary)]`, white text; heading divider is a translucent white rule.
- **Parallax** is rendered as a static `bg-cover bg-center` (no client JS, per the skill's
  no-JS preference). A scroll/`bg-fixed` parallax could be layered on later if desired.

## 5. Verify

- `npx tsc --noEmit` clean; `eslint` clean on all new/changed files.
- Delivery GraphQL resolves the section, stats, image asset and CTA.
- Rendered at 1920 and clipped `#impact` — matches the design: equal-height halves, purple
  panel, "OUR IMPACT" + divider, three large white stats, orange ghost "LATEST REPORT" pill.

## 6. Pixel-perfect QA vs live site (carersworldwide.org)

Extracted the live block's computed styles via headless Chrome (CDP) and matched them. The
build's `#impact` clip is now **1920×700**, identical to the live section height.

**Code fixes (styling):**
- Heading → **52px** Poppins 700, `leading-[1.05]`, `mb-[40px]`, `pb-[10px]`, divider
  **2px `--brand-accent` (orange)** — was 38px with a white divider.
- Stat number (StatItem `grid`) → **44px** Poppins **700** (`font-bold`), `leading-[1.2]`.
- Stat label (StatItem `grid`) → **18px** Poppins **400, UPPERCASE, `tracking-[4px]`**,
  `leading-[1.5]`, `mt-[10px]`, white — was 19px Roboto, sentence case, no tracking.
- Tile padding → **70px** all sides (`md:p-[70px]`), content **top-aligned** (removed
  `justify-center`) — was 60/64px, centred.
- Stat row gap → **50px** (`gap-[50px]`); "Latest Report" wrapper `mt-[40px]`.
- Outer section `pb-[80px]` / top flush — matches the live section's 0 / 80px padding.
- The shared `Cta` `ghost-accent` already matched the live button (15.5px/700, 1.5px tracking,
  pill, orange border, white text) — no change.

**CMS fixes (content):** stat values corrected to `+ 47,252` and `+ 185,637` (space after the
`+`, matching the live copy).
