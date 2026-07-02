# Section 8 — Donation CTA: Build Summary

Built with the `/e25-build-component` skill on the **Contentful + Next.js** base
(`carers-worldwide`). Recreation POC from `homepage.html` (the "Make a Donation" block),
matched against the live site (`carersworldwide.org`).

- **Content type:** `donationCta`
- **Frontend component (variant):** `Split Content Left / Image Right`
- **Reuses:** shared `Cta` (variant `ghost-accent` + `showHeart`), shared `RichText`,
  the `.site-container` (xlarge) gutter, brand CSS tokens.

---

## 1. Reference & requirements

Target section in `homepage.html` (~lines 1264–1305):
- Container `uk-container-xlarge`; grid `uk-grid-collapse` (two flush halves, matched heights).
- **Left** (`uk-tile-primary`, `uk-flex uk-flex-middle`): H2 "Make a Donation" (`uk-heading-divider`),
  H3 subheading, body paragraph, a ghost `Donate` button, small photo-credit line.
- **Right** (`uk-tile-xlarge`, `uk-background-cover uk-background-top-center`): parallax background
  image `/images/BANG-COM.jpg` with `uk-parallax="bgx: -50; easing: 0"` (horizontal parallax on scroll).
- Shares the split image + colour-panel layout with **Section 6 "Our Impact"** (mirrored:
  image-left / panel-right). No `SplitTile` had been factored out, so this was built standalone.

Verified against the live site (`.mutedblockbottom.uk-padding-remove-bottom` clip). Live details
picked up that the static DOM didn't show:
- Tiles form a **rounded band** (~10px, matching the hero + country cards `rounded-[10px]`).
- The Donate button carries a **heart icon** (orange-outline pill, white uppercase text + ♥).
- H3 is **bold ~30px**; body copy **~18px**.

---

## 2. CMS changes (Contentful, space `732gj3i53ay0`, env `master`)

- **Created + published** content type `donationCta`:
  - `internalTitle` (Symbol, displayField), `frontEndComponent` (Symbol,
    `in: ["Split Content Left / Image Right"]`), `sectionId` (Symbol), `heading` (Symbol),
    `subheading` (Symbol), `body` (RichText), `cta` (Link → `cta`), `photoCredit` (Symbol),
    `image` (Link → Asset).
- **Registered** `donationCta` on `flexiblePage.sections` items `linkContentType` allow-list.
- **Sample entries** (fixed, re-runnable ids), all published to `en-US`:
  - Asset `dc-asset-bang-com` — fetched from `https://carersworldwide.org/images/BANG-COM.jpg`.
  - `dc-cta-donate` (cta, variant `ghost-accent`, label "Donate", href `/donate`,
    aria-label "click here to make a donation").
  - `dc-section-donation` (donationCta, `sectionId: make-a-donation`).
  - Appended the section to the **home** page (slug `/`) and republished.

---

## 3. Code changes (six-step recipe)

### New
- `lib/contentful/graphql/queries/donationCta.ts` — hydrate query `DONATION_CTA_BY_ID`
  (spreads `CTA_FRAGMENT`; selects heading/subheading/body(json)/cta/photoCredit/image).
- `lib/sections/definitions/donationCta.tsx` — `hydrate()` maps the node (reuses `mapCta`);
  exports `donationCtaDefinition` (`contentfulTypename: "DonationCta"`, `type: "donationCta"`).
- `components/sections/DonationCta/index.tsx` — switch-case router on `frontEndComponent`.
- `components/sections/DonationCta/SplitContentLeftImageRight/index.tsx` — the variant:
  `.site-container` → `grid md:grid-cols-2 items-stretch overflow-hidden rounded-[10px]`;
  left purple tile (white H2 + orange divider, H3, RTE body, `<Cta showHeart />`, photo credit),
  right `<ParallaxImage />`.
- `components/sections/DonationCta/ParallaxImage/index.tsx` — `"use client"` background-image div;
  eases `backgroundPositionX` from `calc(50% + 25px)` → `calc(50% − 25px)` across the element's
  viewport travel (rAF-throttled scroll/resize; `bgx=50`; respects `prefers-reduced-motion`).

### Modified (shared)
- `lib/sections/types.ts` — added `DonationCtaSection` + union member.
- `lib/sections/registry.ts` — imported + appended `donationCtaDefinition`.
- `components/common/Cta/index.tsx` — added an additive `showHeart?: boolean` prop so the
  `ghost-accent` Donate button can carry the heart icon (the heart already renders for the
  `donate` variant; `showHeart` extends it to others without affecting existing consumers).

> Built concurrently with other section agents (exploreSlider, spendingAndVideo, newsletterSignup),
> which also touched `types.ts`, `registry.ts`, and `Cta`. Edits were surgical with re-reads to
> avoid clobbering; the page `sections` append re-fetched fresh before writing.

---

## 4. Verification

- `npx tsc --noEmit` — clean for this section (only unrelated in-progress error in a concurrent
  agent's `NewsletterSignup/BrevoForm`).
- `npm run lint` — clean on all new files.
- Headless-Chrome (`shot.mjs`) at 1920px — section clips to **1920×536**; rounded two-half band,
  purple content tile left + parallax photo right, matched heights, flush seam (measured
  left `160→960`, right `960→1760`, zero gap).
- Parallax confirmed live: `backgroundPositionX` `calc(50% + 25px)` → `calc(50% + 0.6px)` on scroll.
- Visual match vs live `carersworldwide.org` donation block: rounded corners, heart + DONATE ghost
  pill, bold H3, 18px body with identical two-line wrap.

## 4b. Pixel-perfect QA pass (computed-style diff vs live)

Extracted `getComputedStyle` for every element in the live donation block and diffed against the
local build; every gap found was **code-related** (component styling — the CMS content was already
correct). Fixes applied to `SplitContentLeftImageRight`:

| Element | Was | Now (matches live) |
| --- | --- | --- |
| Section | `bg-[var(--bg-muted)]`, `py-[40px]` (536px tall) | `bg-[var(--background)]` white, no padding (**1920×447**) |
| Tile padding-x | 60px | **70px** (all sides 70 → 660px content) |
| Tile font | body/credit inherited Roboto | **Poppins** on the whole tile |
| H2 | 38px / lh 1.15 / pb 16px | **52px / lh 1.05 / pb 10px** (box 660×67) |
| H3 | 30px / lh 1.25 | **34px / lh 1.4** (box 660×48) |
| Body | 18px / lh 1.7 / Roboto | **16.5px / lh 1.5 / Poppins** |
| Photo credit | `text-white/70`, `mt-8` (32px) | **`text-white`, mt 20px** |
| Vertical rhythm | mixed (mt-4/5/6/8) | uniform **20px** between every block |

Colours were already correct (tile `#92278f`, divider/border `#f7941d`, verified as
`rgb(146,39,143)` / `rgb(247,148,29)` on both). Mobile keeps a scaled-down type ramp (H2 38 / H3 26)
that grows to the live desktop values at `md`.

**Residual (intentional):** the Donate button measures 161×44 vs live 147×44 — the +14px width
comes from the shared `Cta` `ghost-accent` padding (`px-[30px]` + 16px heart) vs the live
`pl-50/pr-20` + 20px background-heart. Height is exact; the brief mandates reusing the shared `Cta`,
so the variant's padding was left untouched rather than forking a donation-only button.

## 5. Files touched

**New:** query, definition, `DonationCta/{index, SplitContentLeftImageRight/index, ParallaxImage/index}`.
**Modified:** `lib/sections/types.ts`, `lib/sections/registry.ts`, `components/common/Cta/index.tsx`.
**CMS:** content type `donationCta`; `flexiblePage.sections` allow-list; entries/asset
`dc-asset-bang-com`, `dc-cta-donate`, `dc-section-donation`; home page updated.
