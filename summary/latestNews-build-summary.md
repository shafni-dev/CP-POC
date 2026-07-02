# Section 9 — Latest News: Build Summary

Built with the `/e25-build-component` skill on the **Contentful + Next.js** base
(`carers-worldwide`). Recreation POC from `homepage.html` (the "Latest News" blog cards),
domain `carersworldwide.org`.

- **Content type:** `latestNews` (new)
- **Frontend component (variant):** `Three Column Blog Cards`
- **Container:** xlarge (`.site-container`)

## Design recreated
- Muted grey background (`--bg-muted`), centre-aligned header.
- Eyebrow "Blog" + H2 "Latest News" via the shared **`SectionHeader`** (`align="center"`,
  no divider).
- 3-column grid with **vertical dividers** between columns (`uk-grid-divider`) and
  **grid-match** equal heights: the grid bleeds its column padding with `md:-mx-[30px]`,
  each column pads `md:px-[30px]`, and the 2nd/3rd columns carry a left border
  (`--border-divider`) centred in the 60px gap.
- Each card = shared **`Card`** `blog` variant: rounded image top (640×350, `aspect-[64/35]`,
  scale-up on hover), H5 title as a link, date meta text, and a ghost "Read more" CTA.
  Cards compose the shared **`Image`** and **`Cta`** components.

## Content model (Contentful)
- **`latestNews`** — `internalTitle`, `frontEndComponent` (dropdown `["Three Column Blog Cards"]`),
  `eyebrow`, `heading`, `sectionId`, `cards` (Array → `card`). Created + published.
- Registered `latestNews` as an allowed section on `flexiblePage.sections`.
- **Reused** the shared `card` (blog variant), `image`, and `cta` types — no new child types.

## Files (six-step recipe)
1. `lib/contentful/graphql/queries/latestNews.ts` — hydrate query (spreads `...CardFields`).
2. `lib/sections/types.ts` — added `LatestNewsSection`, unioned into `Section`.
3. `lib/contentful/card.ts` mapper reused (no change).
4. `components/sections/LatestNews/index.tsx` — switch router;
   `components/sections/LatestNews/ThreeColumnBlogCards/index.tsx` — the variant.
5. `lib/sections/definitions/latestNews.tsx` — `SectionDefinition` (hydrate + render).
6. Registered `latestNewsDefinition` in `lib/sections/registry.ts`.

Also updated the shared **`Card` `blog` variant** (`components/common/Card/index.tsx`) to match
the reference: image aspect `64/35` (was `3/2`), title→meta→CTA order, non-uppercase date meta,
and a ghost "Read more" rendered via the shared `Cta` (synthesised when the card has no CTA).
Added `--border-divider: #e5e5e5` token to `app/globals.css`.

## Sample entry (published)
- `ln-latest-news` (latestNews) → 3 cards (`ln-card-1..3`) → 3 image entries → 3 assets
  (blog photos fetched from `carersworldwide.org`). Appended to the `home` flexiblePage and
  published.

## Verification
- `npx tsc --noEmit` clean; `npm run lint` clean (only pre-existing skill-script warnings).
- Delivery GraphQL resolves `latestNews` with all 3 cards + images (640×350).
- Rendered + clipped `#latest-news` at 1920px in headless Chrome (`/tmp/ln-final.png`):
  clipped section 1920×719, matching the reference layout — header, dividers, images,
  bottom-aligned ghost buttons.
- Note: card images are `loading="lazy"` (correct for a below-the-fold section); the
  verification screenshot temporarily forced eager to capture them, then reverted.
