# Build Summary — MissionStatement Section

> Section 3 of the Carers Worldwide homepage recreation, built end-to-end with the
> `/e25-build-component` skill on the E25 **Contentful** Next.js base, then QA'd
> pixel-perfect against the live `carersworldwide.org` site.

---

## 1. Task

Build the **MissionStatement** section from `homepage.html` (the "We Are Committed To"
block immediately after `homeheroslides`).

- **Content model:** `missionStatement`
- **Frontend component (variant):** `Default`
- **Design brief:**
  - Muted grey background (`uk-section-muted`)
  - Left column (3/5 width): eyebrow "We Are Committed To", H2 "Changing the lives of
    carers", 3 body paragraphs
  - Right column (2/5 width): chevron bullet list of 6 stats (e.g. "92% of family carers
    worry about money"); each stat uses `<strong>` for the number + plain text for the label
  - Container: large
  - **Reuse** the shared `SectionHeader` (eyebrow + H2 + intro) and shared `StatItem`
    (chevron / inline variant) for each of the 6 stats.

---

## 2. Base & architecture

- **CMS detected:** Contentful (`lib/contentful/` present; `CONTENTFUL_*` env vars).
- **Data flow:** catch-all route `app/[[...slug]]/page.tsx` → `FlexiblePage` query fetches
  section **stubs** → each section's `hydrate(id)` runs a second GraphQL query → typed
  `Section` → `SectionsRenderer` dispatches to a component via the **section registry**
  (`lib/sections/registry.ts`, a switch-case-as-data lookup table).
- **Variant routing:** each section's `index.tsx` routes on `frontEndComponent` with a
  `switch`.
- Canonical reference: `components/ARCHITECTURE.md`.

---

## 3. Content model (Contentful CMA)

Two new content types were created + published, and the page's `sections` field was
extended to allow the new type.

### New child type: `stat`
| Field | ID | Type |
|---|---|---|
| Internal Title | `internalTitle` | Symbol (displayField, required) |
| Value | `value` | Symbol (required) |
| Label | `label` | Symbol (required) |

### New type: `missionStatement`
| Field | ID | Type |
|---|---|---|
| Internal Title | `internalTitle` | Symbol (displayField, required) |
| Front End Component | `frontEndComponent` | Symbol, validation `in: ["Default"]` |
| Eyebrow | `eyebrow` | Symbol |
| Heading | `heading` | Symbol (required) |
| Body | `body` | RichText |
| Stats | `stats` | Array of Links → `stat` |

### Registration
- Added `missionStatement` to `flexiblePage.sections` `items.validations[].linkContentType`
  → `['navigation', 'missionStatement']`. Content type + page re-published.

> Design decision: repeating stat rows modeled as an **Array of Links to a small `stat`
> child content type** (Contentful has no inline group type), mirroring the existing
> navigation → navigationItem pattern.

---

## 4. Code (six-step recipe)

| Step | File | What |
|---|---|---|
| 1. GraphQL | `lib/contentful/graphql/queries/missionStatement.ts` | Per-type hydrate query (`missionStatement(id,preview,locale)` + `statsCollection`) |
| 2. Type | `lib/sections/types.ts` | Added `StatEntry`, `MissionStatementSection`; unioned into `Section` |
| 3. Transform | `lib/sections/definitions/missionStatement.tsx` | `hydrate()` maps raw node → typed section; exports `missionStatementDefinition` |
| 4. Component | `components/sections/MissionStatement/index.tsx` (switch router) + `.../MissionStatementDefault/index.tsx` | Renders the layout |
| 5. Definition | (same as step 3) | `{ contentfulTypename: "MissionStatement", type: "missionStatement", hydrate, render }` |
| 6. Register | `lib/sections/registry.ts` | Appended `missionStatementDefinition` |

**Reused (not rebuilt):** shared `SectionHeader`, shared `StatItem` (`size="inline"`),
shared `RichText` for the body.

---

## 5. Sample content (published)

- 6 `stat` entries (`missionStat1`…`missionStat6`) with the real homepage numbers/labels:
  - 92% — of family carers worry about money
  - 87% — of family carers in Hazaribagh, India are unemployed
  - 89% — of family carers suffer from anxiety or depression
  - 68% — of family carers in Kathmandu Valley, Nepal feel isolated
  - 48% — of family carers worry about their own health
  - 95% — of family carers in Savar, Bangladesh have a health issue or disability
- 1 `missionStatement` entry (`missionStatementHome`) with eyebrow, heading, 3-paragraph
  RichText body, and the 6 stat links; `frontEndComponent = "Default"`.
- Appended to the `home` page (`slug: /`) sections list. All entries published.

---

## 6. QA — this was the critical part

### The problem with the first pass
The initial build was declared "matches the brief" **without a real visual comparison**.
The `homepage.html` reference is **unstyled markup** — its Joomla/YOOtheme CSS lives on the
server, so rendering the file locally produced a plain, single-column, black-on-white page.
The first screenshot only confirmed *content/structure*, not the *design*. The user flagged
"many mismatches."

### Proper QA method
1. Found the live site from `homepage.html`'s canonical tag → `https://carersworldwide.org/`.
2. The section is behind a UIkit **scrollspy** fade-in (`opacity:0` until scrolled into
   view), so the stock `shot.mjs` (which never scrolls) captured a blank band. Wrote a
   custom CDP screenshot script (`scratchpad/shot-live.mjs`) that forces scrollspy elements
   visible + disables animations before clipping.
3. Wrote `scratchpad/styles.mjs` to extract **computed styles** from the live DOM
   (font-family, size, weight, line-height, color, spacing, column widths, container).
4. Diffed live vs build, fixed, re-rendered, re-compared.

### Live computed-style reference (the source of truth)
- Section: `bg #f8f6f6`, padding **80px** top/bottom
- Container (`uk-container-large`): content **1400px**, padding `0 40px`
- Grid: left **812px** / **70px** gutter / right **518px** (58% / 37% of 1400)
- Eyebrow: 18px / 400 / uppercase / letter-spacing 4px / `#92278f` / Poppins
- H2: **38px / 700** / uppercase / `#333` / line-height 1.15 / Poppins
- Body p: 16.5px / 400 / `#333` / line-height 1.5 / Poppins / margin-bottom 20px
- Stat `<strong>`: 16.5px / **700** / `#333` / Poppins
- Stat label: 16.5px / 400 / `#333` / Poppins

### Mismatches found & fixed
| # | Issue | Was | Fixed to |
|---|---|---|---|
| 1 | H2 color | purple `--brand-primary` | `--text-default` (#333) |
| 2 | H2 size/weight/leading | 33px / 600 / 1.05 | 38px / 700 / 1.15 |
| 3 | Body font | Roboto (default) | Poppins |
| 4 | Body width | `max-w-[70ch]` (wrong wrapping) | fills column |
| 5 | Body size / para gap | 16px / 16px | 16.5px / 20px |
| 6 | Stat number color | purple | #333 |
| 7 | Stat number size | 22px | 16.5px (bold, same size as label) |
| 8 | Stat font | Roboto | Poppins |
| 9 | Stat markup | two spans + 12px gap | `<strong>value</strong> label` inline (matches live DOM) |
| 10 | Section padding | 60px | 80px |
| 11 | Container | `max-w-1600 px-15` | `max-w-1480 px-40` → 1400 content |
| 12 | Columns | `w-3/5` `w-2/5` | `w-[58%]` `w-[37%]` + `gap-[70px]` (real UIkit grid math) |

**Root cause:** the shared `SectionHeader` and `StatItem` (inline) were scaffold **stubs**
with guessed typography (purple headings, wrong sizes/fonts). Since MissionStatement is
their only consumer (verified via grep), the fix corrected their tokens to the real design
system rather than overriding per-section.

### Key measurements decoded
- **Box model:** to get 1400 content + 40px padding each side with `border-box`, the
  container is `max-w-[1480px] px-[40px]` (not `max-w-[1400px]`, which would yield 1320
  content).
- **UIkit grid math:** the grid has `margin-left:-70px` and children `padding-left:70px`,
  so children are 60%/40% of **1470** (1400 + 70) → 882 / 588 bounding, giving 812 / 518
  content with a 70px gutter. Reproduced as `w-[58%]` / `w-[37%]` + `gap-[70px]`.

### Files touched during QA
- `components/common/SectionHeader/index.tsx` (H2 + intro tokens)
- `components/common/StatItem/index.tsx` (inline variant)
- `components/sections/MissionStatement/MissionStatementDefault/index.tsx` (container,
  columns, body paragraph spacing)

---

## 7. Verification result

- `npx tsc --noEmit` — clean.
- `npm run lint` — clean for app code (the only 3 warnings are pre-existing, in the skill's
  bundled `shot.mjs`, not this code).
- Rendered at 1920px: clipped section **488px** tall vs live **489px**. Body copy and stat
  labels wrap at the **identical break points**; colors, weights, fonts, and spacing match.

---

## 8. Open item / intentional deviation

- **Background color:** live is `#f8f6f6`; kept the repo token `--bg-muted` (`#f5f5f5`) per
  the "use CSS vars, not hex" convention. Imperceptible difference — can add an exact token
  if byte-perfect background is required.
- **Container "large":** UIkit `uk-container-large` on this site = 1400px content, so used
  `max-w-[1480px]` (content 1400) rather than the generic 1600px.

---

## 9. Artifacts (scratchpad)

- `scratchpad/shot-live.mjs` — headless-Chrome screenshotter that forces UIkit scrollspy
  elements visible before clipping.
- `scratchpad/styles.mjs` — computed-style extractor for the live section.
- `/tmp/mission-build.png` — final build render.
- `/tmp/mission-live.png` — live reference render.
