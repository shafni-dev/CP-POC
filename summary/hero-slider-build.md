# HeroSlider Section — Build & Pixel-Perfect Match Summary

**Task:** Build the **HeroSlider** section (`/e25-build-component`) from `homepage.html`
(target element `.homeheroslides`) on the Carers Worldwide Contentful + Next.js base, then
match it pixel-perfectly to the live site (`https://carersworldwide.org/`).

- **Content Model:** `heroSlider`
- **Frontend Component (variant):** `Split Image Left / Content Right`
- **Base detected:** Contentful (`lib/contentful/` present; `CONTENTFUL_*` env vars)
- **Design:** full-width auto-playing slider (5s interval, no pause on hover), 6 slides.
  Each slide = image left (50%, object-cover) + purple content panel right (50%) with
  optional eyebrow, H2 + orange divider underline, body paragraph, ghost CTA. Light nav
  arrows at bottom-left.
- **Reuse mandate:** shared `Slider` (carousel shell) + shared `Card` (`media-left` variant),
  Cards composing shared `Cta` + `Image`.

---

## Architecture recap (how a section renders)

`app/[[...slug]]/page.tsx` → `getFlexiblePageBySlug()` fetches the page + section **stubs**
(`__typename` + `sys.id`) in one query → each section's `SectionDefinition.hydrate(id)` runs a
**second** GraphQL query for its full data → `SectionsRenderer` dispatches each section to its
component via the `sectionRegistry`. Variant routing inside a section uses a **switch-case** on
`frontEndComponent`. Colors come from CSS variables in `app/globals.css` (never raw hex).

Six-step recipe: (1) GraphQL query, (2) section type, (3) transform/definition,
(4) component, (5) definition export, (6) register in `registry.ts`.

---

## Content model (Contentful)

Created the `heroSlider` content type (camelCase id) and published it:

| Field | Type | Notes |
| --- | --- | --- |
| `internalTitle` | Symbol | displayField |
| `frontEndComponent` | Symbol | dropdown `["Split Image Left / Content Right"]` |
| `sectionId` | Symbol | anchor id |
| `slides` | Array of Links → Entry | `linkContentType: ["card"]` |

**Reused existing content types** (already in the space): `card` (with the `media-left`
`frontEndComponent` choice already valid), `cta`, `image`, `flexiblePage`.

- Added `heroSlider` to `flexiblePage.sections` `items.validations[].linkContentType` (published).
- Added `ghost-accent` to the `cta` content type's `variant` `in` validation (published).
  (My script also added `ghost-light`, harmless; a concurrent build later removed the
  `ghost-light` TS variant but kept `ghost-accent`.)

### Sample content (created + published)
Per slide: 1 **Asset** (fetched from the live YOOtheme cache URLs) + 1 `image` entry + 1 `cta`
entry (`ghost-accent`) + 1 `card` entry (`media-left`). Plus one `heroSlider` entry
(`hs-home-hero`) linking all 6 cards. Attached to the `home` page's `sections` (after
Navigation) and published.

Deterministic ids (re-runnable): `hs-asset-{1..6}`, `hs-image-{1..6}`, `hs-cta-{1..6}`,
`hs-card-{1..6}`, `hs-home-hero`.

The 6 slides (from `.homeheroslides` in `homepage.html`):

1. eyebrow "Jo Whiley Presents our" — **BBC Radio 4 Appeal** → `/bbc-radio-4-appeal`
2. **Our Impact** → `/impact`
3. **Hear us on the BBC World Service** → `/blog/carers-worldwide-featured-on-bbc-world-service`
4. **Sadhona's Story** → `/blog/from-isolation-to-independence-sadhonas-story`
5. **Carers Worldwide Model** → `/about-us/#model`
6. **Commit To Carers In 2026** → `/carers-charter`

---

## Files touched (code)

**New:**
- `lib/contentful/graphql/queries/heroSlider.ts` — `HERO_SLIDER_BY_ID` hydrate query, spreads the
  shared `CardFields` fragment + its deps (`IMAGE_FRAGMENT`, `CTA_FRAGMENT`).
- `lib/sections/definitions/heroSlider.tsx` — `hydrate` (reuses `mapCard`) + `render` +
  `heroSliderDefinition` (`contentfulTypename: "HeroSlider"`, `type: "heroSlider"`).
- `components/sections/HeroSlider/index.tsx` — switch-case router on `frontEndComponent`.
- `components/sections/HeroSlider/SplitImageLeftContentRight/index.tsx` — renders the shared
  `Slider` with one `Card` (`media-left`) per slide.

**Edited:**
- `lib/sections/types.ts` — added `HeroSliderSection` + union; added `ghost-accent` to `CtaVariant`.
- `lib/sections/registry.ts` — registered `heroSliderDefinition`.
- `lib/contentful/cta.ts` — added `ghost-accent` to the mapper's allowed `VARIANTS`.
- `components/common/Cta/index.tsx` — added the `ghost-accent` variant (orange-outline pill,
  white uppercase text).
- `components/common/Card/index.tsx` — restyled the `media-left` variant to the purple hero panel.
- `components/common/Slider/index.tsx` — added props to make the shared shell configurable for
  the hero (defaults preserve existing "sides + dots" behavior for other sections):
  `navPlacement` (`"sides" | "bottom-left"`), `navVariant` (`"solid" | "light"`), `showDots`,
  `durationMs`, `easing`, `itemGapClass`; plus a thin tall chevron for the light variant.

---

## Pixel-perfect pass (measured against live)

Extracted the live site's exact computed styles and transition timing via a headless-Chrome
CDP script (not eyeballing). Scratchpad tools written:
- `inspect.mjs` — dumps `getComputedStyle` for the live hero's key elements.
- `measure-transition.mjs` — samples the slider `transform` over time to derive duration/easing.
- `shot2.mjs` — screenshot tool that scrolls to top and uses **absolute** clip coordinates
  (the skill's `shot.mjs` uses viewport-relative coords and produced a blank capture when the
  page was scrolled).

### Live values that were matched

| Element | Live value | Applied |
| --- | --- | --- |
| Slide transition | **1125ms, `ease`**, one 1650px slide | `durationMs={1125}` `easing="ease"` (inline `transition`) |
| Card | 1600×533, border-radius 10px, bg `rgb(146,39,143)` | `md:min-h-[533px] rounded-[10px] bg-[var(--brand-primary)]` |
| Content padding | 70px | `md:p-[70px]` (mobile `px-8 py-10`) |
| Eyebrow (`el-meta`) | 18px / weight 400 / tracking 4px / uppercase / white | `text-[18px] font-normal tracking-[4px] uppercase text-white` |
| H2 (`el-title`) | **52px** / weight 700 / uppercase / white, Poppins | `text-[52px] font-bold uppercase` |
| Divider | border-bottom 2px `rgb(247,148,29)`, pb ~10px | `border-b-2 border-[var(--brand-accent)] pb-[10px]` |
| Body | 20px / line-height 30px / white / **Poppins** | `text-[20px] leading-[30px]`, content panel set to Poppins |
| Spacing | title→body 40px, body→button 20px | `mt-10` on body, `mt-5` on CTA, `[&_p]:mb-5` |
| Button (CTA) | **auto-width** (~203px), px 30, radius 40 (pill), border 2px orange, white text, weight 700, tracking 1.5px, uppercase | `ghost-accent` + `self-start` |
| Nav arrows | 40×40px, radius 5px, bg purple 90%, thin (1.4) white chevron @70%, 20px inset, 10px gap | light variant: `h-10 w-10 rounded-[5px] bg-[var(--brand-primary)]/90 text-white/70`, `bottom-5 left-5 gap-[10px]` |
| Section padding | 0 | removed vertical padding |
| Slide gap at rest | card = full 1600px | `itemGapClass="px-0"` |

### Issues found & fixed during this pass
1. **Scroll duration/speed** — was 500ms `ease-in-out`; now 1125ms `ease` (measured).
2. **Pill button width** — was stretching full-width (flex-column stretches children); fixed with
   `self-start` so it fits its text; also matched `px-[30px]` / `tracking-[1.5px]`.
3. **Next/prev arrows** — were 48px / `rounded-10` / 85% / thick chevrons; rebuilt to 40px /
   `rounded-5` / purple-90% / thin tall white-70% chevrons, 20px inset, 10px gap.
4. **Heading size** 34→52px, **eyebrow** 15→18px & weight 500→400 & tracking 2→4px,
   **padding** 56/48→70px, **body** 17→20px + Poppins, **card min-height** 500→533,
   removed section vertical padding, card full-width at rest.

### CTA hover (final correction requested)
`ghost-accent` hover = **border → white, text → gold/orange (accent), fill → transparent**:

```
"ghost-accent":
  "px-[30px] rounded-full font-bold uppercase tracking-[1.5px] border-2
   border-[var(--brand-accent)] bg-transparent text-white
   hover:border-white hover:text-[var(--brand-accent)]"
```

(Earlier version incorrectly filled orange / turned text white on hover.)

---

## Verification

- `npx tsc --noEmit` — clean.
- `npm run lint` — clean (only pre-existing `shot.mjs` template warnings, not our code).
- Delivery GraphQL confirmed all 6 slides + `ghost-accent` CTAs + published images resolve, and
  the home page section order: **Navigation → HeroSlider → MissionStatement → CountryCards**.
- Screenshots at 1920px (slide clip ≈ 534px vs live 533) and 430px (mobile stacks image-over-
  content). Side-by-side vs the live "Our Impact" slide confirms heading, orange divider, body,
  auto-width orange-pill CTA, and thin white chevrons on purple squares all align.

### Intentional deviation
The live UIkit slider shows ~160px peeks of adjacent slides at the container edges; this build
renders one full 50/50 card per view (per the task spec: image 50% / content 50%, full width),
rather than reproducing UIkit's centered-peek mode.

---

## Notes / gotchas

- The repo was being edited **concurrently** by a parallel section build (MissionStatement,
  CountryCards, a `card` `surface` prop, `ghost-light` added then removed). All shared-component
  changes here are **additive with safe defaults**, and each edit re-read the file first.
- The `Card` `media-left` variant is used only by the hero and its own comment flags it as the
  "(Hero slide)" variant — safe to style for the purple hero panel.
- `shot.mjs` (skill tool) doesn't add `scrollY` to clip coordinates → blank capture on a scrolled
  page. Use `scratchpad/shot2.mjs` (absolute coords + scroll-to-top) for reliable clips.
- CMS orchestration is idempotent via deterministic PUT ids — `scratchpad/build-hero.mjs` can be
  re-run safely.
