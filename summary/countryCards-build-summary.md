# Section 4 — Country Cards: Build Summary

Built with the `/e25-build-component` skill on the **Contentful + Next.js** base
(`carers-worldwide`). Recreation POC from `homepage.html` (the "Bangladesh / India / Nepal"
project cards), matched against the live site (`carersworldwide.org`).

- **Content type:** `countryCards`
- **Frontend component (variant):** `Three Column Cards`
- **Reuses:** shared `Card` (variant `media-top`), shared `Image`, shared `Cta`.

---

## 1. Reference & requirements

Target section in `homepage.html` (~lines 658–789):
- Container `uk-container-xlarge`; grid `uk-child-width-1-3@m uk-grid-match` (3 equal columns, matched height).
- Each card `uk-card uk-card-primary` (**purple** background) with `uk-card-media-top` image (960×600),
  `uk-h3` title as link, body copy, and a `uk-button-default` "View Projects" ghost button.

Design decisions confirmed with the user along the way:
- **Card style:** purple cards, white text, ghost CTA (chosen over the scaffold's default white media-top look).
- **CTA:** must be the **same variant as the hero** — a gold/orange **pill** (`ghost-accent`), not a white square.
- **CTA hover:** border → white, text → gold/orange, fill stays transparent (border+text swap).
- **Card corners:** rounded `10px` (matching the hero card).
- **Card hover:** a **colour overlay** fades over the image (no zoom, no lift) — 50% brand-purple tint.
- **Images:** the real Carers Worldwide photos (not placeholders).

---

## 2. Architecture context (how sections work here)

- Catch-all route `app/[[...slug]]/page.tsx` → `getFlexiblePageBySlug` fetches page + section **stubs**
  (`__typename` + `sys.id`) in one query.
- Each section is **hydrated** by a second query via its `SectionDefinition.hydrate(id)`.
- `lib/sections/registry.ts` maps `contentfulTypename` → definition (server) and `type` → component (render).
- Variant routing inside a section component is a **switch-case** on `frontEndComponent`.
- Six-step recipe: Contentful model → GraphQL query → section type → component → definition → register.
- Theming via CSS vars in `app/globals.css` (`--brand-primary #92278f`, `--brand-accent #f7941d`, etc.).
- `.site-container` = the "xlarge" container (max 1600 content + 40px gutters).

> Note: this build ran concurrently with other section builds (heroSlider, missionStatement),
> which also touched shared files (`types.ts`, `registry.ts`, `Card`, `Cta`). Edits were made
> surgically with re-reads to avoid clobbering. A concurrent agent added a `ghost-accent` CTA
> variant (the hero pill) — which we then reused here.

---

## 3. CMS changes (Contentful, space `732gj3i53ay0`, env `master`)

- **Created + published** content type `countryCards`:
  - `internalTitle` (Symbol, displayField), `frontEndComponent` (Symbol, `in: ["Three Column Cards"]`),
    `sectionId` (Symbol), `cards` (Array → Link → `card`).
- **Registered** `countryCards` on `flexiblePage.sections` items `linkContentType` allow-list.
- **CTA variants:** added a `ghost-light` variant early, then **removed it** once we standardised on
  the hero's `ghost-accent`. Final `cta.variant` validation: `default | primary | donate | ghost-accent`.
- **Sample entries** (fixed, re-runnable ids), all published to `en-US`:
  - Assets `cc-asset-{bangladesh,india,nepal}` (960×600).
  - `cc-img-*` (image), `cc-cta-*` (cta, variant `ghost-accent`, label "View Projects"),
    `cc-card-*` (card, variant `media-top`).
  - `cc-section-countrycards` (countryCards, `sectionId: country-projects`).
  - Appended the section to the **home** page (slug `/`) and republished.
- **Real images:** the three assets were later re-pointed from placeholder images (picsum) to the actual
  live-site JPEGs and reprocessed/republished — **CMS-only change**, no code:
  - `.../cache/0b/bangladesh-0bec62ed.jpeg`
  - `.../cache/fc/india-fcec5f85.jpeg`
  - `.../cache/8a/nepal-8ad70300.jpeg`

---

## 4. Code changes

### `lib/sections/types.ts`
- `CtaVariant` — added `ghost-accent` (kept), removed `ghost-light`.
- Added `CountryCardsSection` type and added it to the `Section` union.

### `lib/contentful/graphql/queries/countryCards.ts` (new)
- Hydrate query `COUNTRY_CARDS_BY_ID`: spreads `...CardFields` + `CARD_FRAGMENT_DEPS` (Image + Cta),
  selects `frontEndComponent`, `sectionId`, `cardsCollection(limit:6)`.

### `lib/sections/definitions/countryCards.tsx` (new)
- `hydrate()` maps the response via `mapCard`; exports `countryCardsDefinition`
  (`contentfulTypename: "CountryCards"`, `type: "countryCards"`).

### `components/sections/CountryCards/index.tsx` (new)
- Switch-case router on `frontEndComponent` → `ThreeColumnCards`.

### `components/sections/CountryCards/ThreeColumnCards/index.tsx` (new)
- White `<section id={sectionId}>` + `.site-container` + `grid grid-cols-1 gap-[30px] md:grid-cols-3`.
- Maps cards through `<Card card surface="primary" />`.

### `lib/sections/registry.ts`
- Imported + appended `countryCardsDefinition`.

### `components/common/Card/index.tsx` (shared — `MediaTop` variant)
- Added a `surface?: "default" | "primary"` prop (default unchanged; `primary` = country-card look).
- `primary` treatment:
  - Article: `group overflow-hidden rounded-[10px] bg-[var(--brand-primary)]`.
  - Title: Title-Case (no uppercase), `text-[34px] font-bold` Poppins, white.
  - Body: `text-[18px] leading-[1.7]` white; body padding `p-[40px]`.
  - **Image hover overlay:** image wrapped in `relative overflow-hidden`; overlay
    `span` `bg-[var(--brand-primary)]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300`.
- `default` surface output left identical to before (safe for other consumers).

### `components/common/Cta/index.tsx` (shared)
- `ghost-accent` (hero pill) reused for the CTA. Hover corrected to:
  `border-[var(--brand-accent)] text-white hover:border-white hover:text-[var(--brand-accent)]`
  (transparent fill, border+text swap). `ghost-light` removed.

### `lib/contentful/cta.ts`
- `mapCta` VARIANTS updated (added `ghost-accent`, removed `ghost-light`).

### `app/layout.tsx`
- Poppins already loads weight `700` (used by the bold Title-Case headings).

---

## 5. Iteration log (what changed and why)

1. **Initial build** — purple cards, white text, but with a **white square ghost CTA** and **uppercase** titles.
2. **User feedback (fonts + CTA):** CTA must match the hero → switched to `ghost-accent` gold pill;
   titles → Title-Case, bold, larger; body copy enlarged; padding to 40px. Removed unused `ghost-light`.
3. **User feedback (hover + corners):** added `rounded-[10px]` to cards; set CTA hover to the
   white-border / gold-text / transparent-fill swap (per the user's exact spec).
4. **User feedback (images):** replaced random placeholder photos with the real live-site images
   (CMS asset swap only).
5. **Card hover:** first added an image-zoom → user said the live effect is different → replaced with a
   **purple colour overlay that fades in on hover** (verified via a simulated mouse-hover screenshot).

---

## 6. Verification

- `npx tsc --noEmit` — clean throughout.
- `npm run lint` — clean (only pre-existing warnings in the skill's own `shot.mjs`).
- Delivery GraphQL — section resolves with all 3 cards, 960×600 ctfassets images, `ghost-accent` CTAs, RTE bodies.
- Headless-Chrome screenshots (custom CDP scripts `shot.mjs` / `hover_shot.mjs`):
  - Section clipped at 1920px = **1920×~815**; 3 equal purple cards, matched height, rounded corners.
  - Hover capture confirmed the per-card overlay (hovered Bangladesh darkened, India/Nepal normal).

### Known caveat
The user's live crop shows **wider cards** than ours because this scaffold caps the `xlarge` container at
**1600px content** (`.site-container` in `app/globals.css`). Per-card proportions match; making cards
physically wider is a site-wide container change, not a section change.

---

## 7. Side discussion — "does Claude have a live browser subagent (like Antigravity)?"

- Claude Code has **no feature literally named "browser subagent"**, but achieves the same via:
  1. **Claude in Chrome** (`claude --chrome` / `/chrome`) — drives your real browser with your session.
  2. **Playwright MCP** — `claude mcp add playwright -- npx -y @playwright/mcp@latest` (headless, CI-friendly).
  3. **Chrome DevTools MCP** — deep debugging (network, perf, memory, console).
- **Subagents** (Agent tool / custom agent types) can be scoped to just the browser MCP tools → a dedicated
  "visual-verify" browser agent in its own context.
- **Figma MCP** = design context/screenshots (not a browser); live browser = the running app.
- The **Anthropic API** has a separate `computer-use` tool for full desktop control.
- In this session the "browser agent" was done manually via headless-Chrome CDP scripts; Playwright MCP or
  Claude in Chrome would make that first-class (real click/hover/assert instead of hand-written CDP).

---

## 8. Files touched

**New**
- `lib/contentful/graphql/queries/countryCards.ts`
- `lib/sections/definitions/countryCards.tsx`
- `components/sections/CountryCards/index.tsx`
- `components/sections/CountryCards/ThreeColumnCards/index.tsx`

**Modified**
- `lib/sections/types.ts`
- `lib/sections/registry.ts`
- `lib/contentful/cta.ts`
- `components/common/Card/index.tsx`
- `components/common/Cta/index.tsx`

**CMS**
- Content type `countryCards` (created); `flexiblePage.sections` (allow-list); `cta` (variant validation).
- Entries/assets: `cc-asset-*`, `cc-img-*`, `cc-cta-*`, `cc-card-*`, `cc-section-countrycards`; home page updated.
