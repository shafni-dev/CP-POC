# Session Summary — Carers Worldwide POC

**Project:** `carers-worldwide` — a Next.js 16 + Contentful base (E25 scaffold) recreating the
[carersworldwide.org](https://carersworldwide.org) homepage as CMS-backed sections.
**Session name:** `git-worktrees-multiagent`
**Date:** 2026-07-02

---

## 1. Goal & context

Recreate the Carers Worldwide homepage as Contentful-backed sections on the E25 scaffold, using
the `/e25-build-component` skill. The architecture (see `components/ARCHITECTURE.md`) uses a
**section registry** dispatched by `__typename`/`type` (switch-case mental model), with per-section
`hydrate` (GraphQL) + `transform` + React component, and **reusable linked entries** (Card, Cta,
Image, Video) shared across sections.

Reference material: `homepage.html` (saved DOM of the live site, a Joomla/YOOtheme UIkit build).

---

## 2. Reusable-component analysis (from `homepage.html`)

The homepage was analyzed to find what repeats and should be built **once** rather than per section.

**Biggest finding — one `Card` pattern drives 4 sections.** The same `el-item` card shape
(media → title → copy → CTA) appears in the Hero slider, Country/Projects cards, Explore slider,
and Latest News — differing only by layout. → Build **one `Card`** with a `frontEndComponent`
variant switch (`media-top`, `media-left`, `linked`, `blog`).

**Reusable primitives identified:**
- **Cta / Button** — `uk-button` variants: `default` (outlined), `primary` (solid), `donate` (pill + heart)
- **Image** — responsive `<picture>` (webp srcset + fallback, width/height, loading)
- **Video** — YouTube-nocookie embed + caption
- **Card** — the 4-variant molecule above
- **SectionHeader** — eyebrow + H2 + intro (Mission, Explore, Latest News)
- **Slider** — carousel shell w/ arrows + dotnav (Hero, Explore)
- **StatItem** — big-number + label (Impact grid + Mission chevron list)
- **SocialLinks** — FB/X/LinkedIn/IG/YouTube row (nav mobile menu + footer)
- **SplitTile** — parallax image + colour panel, mirrored (Impact + Donation CTA)

Global chrome: **Header/Navigation** (desktop + mobile off-canvas), **Footer**, **Donate** button.

---

## 3. `prompts.md` review

Reviewed the existing `prompts.md` (one `/e25-build-component` prompt per section, S1–S11).
Verdict: solid per-section, but **under-specified cross-cutting reuse** and had no build-order for
shared pieces. Fixes applied by rewriting `prompts.md`:

- Added **Section 0 — Shared Components (build FIRST)**: models the reusable Contentful entries
  (Image, Cta, Video, Card w/ 4 variants) + the pure-React primitives (SectionHeader, Slider,
  StatItem, SocialLinks).
- Wired explicit reuse references into each section (e.g. S2/S4/S7/S9 → shared `Card`;
  S3/S7/S9 → `SectionHeader`; S1/S11 → `SocialLinks`).
- Added the **Donate button + social row** to the S1 mobile-menu description (was missing).
- Flagged S6/S8 as the same mirrored split layout.

---

## 4. Problem: Section 1 was run before Section 0

The user ran **Section 1 (Navigation)** before **Section 0** existed. Consequence: Navigation
**inlined its own Donate button** (local `<a>` + duplicated `Heart` SVG) and **omitted the mobile
social row** — because the shared components didn't exist yet. Nothing broken, but off-pattern.

**Decision:** don't re-run S1 (risks regressing the good nav work). Instead: run Section 0, then a
focused **reconcile** of Navigation.

---

## 5. Section 0 completed (by the user)

All 8 shared components built, verified pixel-accurate, production build clean:
- **Contentful content types** (created + published via CMA): `image`, `cta`, `video`, `card`
  (card has `frontEndComponent` variant dropdown + self-references to image/cta).
- **GraphQL fragments** (`lib/contentful/graphql/fragments/`): image, cta, video, card
  (`CARD_FRAGMENT` spreads ImageFields + CtaFields, exports `CARD_FRAGMENT_DEPS`).
- **Types** (`lib/sections/types.ts`): ImageEntry, CtaEntry, VideoEntry, CardEntry, CardVariant,
  CtaVariant, RichTextContent.
- **Mappers** (`lib/contentful/`): image, cta, video, card.
- **Components** (`components/common/`): Image, Cta, Video, Card, RichText, SectionHeader, Slider,
  StatItem, SocialLinks.
- **`/component-preview`** route renders every component/variant with mock data for visual QA.
- Nothing registered in `sectionRegistry` yet (building blocks only).

Brand tokens: `--brand-primary #92278f`, `--brand-accent #f7941d`, Poppins.

---

## 6. Navigation reconcile (done this session)

**Code changes:**
- Swapped Navigation's inline Donate `<a>` + `Heart` → shared **`<Cta variant="donate">`**
  (`components/sections/Navigation/NavigationDefault/index.tsx`).
- Added the mobile social row via shared **`<SocialLinks>`**, pinned to the bottom of the
  off-canvas menu (made the `<aside>` a flex column so `mt-auto` works).
- `NavigationSection` type extended with `socialLinks`; added shared `SocialPlatform` /
  `SocialLinkEntry` types in `lib/sections/types.ts`.
- Added `socialLinks { … }` to the navigation GraphQL query.
- New shared mapper **`lib/contentful/socialLinks.ts`** (`mapSocialLinks`) — flat URL fields →
  ordered `SocialLinkEntry[]`; **the Footer (S11) will reuse this same entry + mapper**.
- Wired `mapSocialLinks` into the navigation hydrate.

**CMS decision (user chose):** create **one shared `socialLinks` entry**, linked from both
Navigation and Footer (over per-section fields or hardcoding) — edit-once, consistent with the
Section-0 reusable-entry philosophy.

**CMS changes** via new re-runnable **`scripts/seed-social-links.mjs`**:
1. Created + published `socialLinks` content type (internalName + 5 optional URL fields).
2. Created + published `social-links-global` entry (the 5 brand URLs).
3. Added a `socialLinks` Link field to the existing `navigation` content type.
4. Linked `social-links-global` onto the `nav-main` navigation entry.

**Verification:** `tsc --noEmit` clean, `eslint` clean, `next build` clean, and a live CDA GraphQL
query confirmed `nav-main.socialLinks` resolves and returns all 5 URLs.

---

## 7. Git commit & push

- Verified `.env.local` (contains `CONTENTFUL_MANAGEMENT_TOKEN`), `.next`, and `node_modules` are
  gitignored — **no secrets committed**.
- Committed everything (scaffold + Section 0 + Section 1 + reconcile + `homepage.html` + `prompts.md`
  + seed scripts) as commit `43d509b` on `main`.
- Added remote `origin` → `git@github.com:shafni-dev/POC-training.git` and pushed `main`
  (tracking `origin/main`).

---

## 8. Parallel-build discussion (multi-agent)

The user wants to build sections 2–11 in parallel across multiple Claude terminals.

**Collision points identified (ranked):**
1. **Shared `home` `flexiblePage` entry** — all sections attach to one entry's `sections` array;
   Contentful optimistic locking (`X-Contentful-Version`) → concurrent appends clobber/409.
2. **`.next` dir + port 3000** during headless-Chrome verification — concurrent builds corrupt
   each other and fight over the port.
3. **`lib/sections/registry.ts`** — every section appends its definition (merge conflict).
4. **`lib/sections/types.ts`** — every section adds its type + unions into `Section` (merge conflict).
5. **`package.json` / lockfile** — concurrent `npm install` races.
6. **Contentful environment activation** — many content-type activations at once can transiently lock.

Per-section component/query/fragment/mapper files **do not** collide — only shared files + shared
CMS entry + shared build.

**Two safe strategies:**
- **A — Sequential** (simplest for 10 sections): one Claude, S2→S11 in order. Zero coordination.
- **B — Parallel with isolation:** one **git worktree per section** (own filesystem, `.next`,
  branch, port), agents build component + content type + sample entry but **defer page-attachment**,
  then a single integration pass merges branches, resolves registry/types append-conflicts, and
  attaches all sections to `home` at once.

**Coordination-by-instruction (if sharing one dir):** give each terminal a lane — don't edit
`registry.ts`/`types.ts` (append to a scratch file instead), distinct dev port, no mid-run
`npm install`, no writes to the shared `home` entry. Caveat: same working directory still races on
`.next`/file writes; true parallelism needs separate worktrees.

**Conductor** (conductor.build, Melty Labs): a macOS app that runs multiple Claude Code agents in
parallel, each in its own git worktree, with a review/merge UI. It solves the **filesystem-isolation
half** (own worktree/`.next`/branch) but **not**: the shared Contentful environment + single `home`
entry, the registry/types merge, or dev-server port assignment — those remain manual.

**DIY equivalent of Conductor** = plain `git worktree`:
```
git worktree add ../poc-s2 -b section-2
```
Each worktree = separate dir sharing one `.git`. Gotchas Conductor hides that a setup script must
handle: `node_modules` isn't shared across worktrees (install or symlink per worktree),
`.env.local` is gitignored (must copy into each worktree), and distinct ports must be assigned.

**Offered but not yet done:** a `scripts/setup-worktrees.sh` (create worktree + branch, copy
`.env.local`, `npm install`, assign port per named section) + a matching integration script (merge
branches, attach all sections to `home` in one ordered pass).

---

## 9. Current state / next steps

- `main` pushed to `github.com:shafni-dev/POC-training`. Scaffold + Section 0 + reconciled
  Section 1 are in and verified.
- `lib/sections/types.ts` now also contains draft types for **HeroSlider (S2)**,
  **MissionStatement (S3)**, and **CountryCards (S4)** — sections in progress.
- **Open decisions:** whether to build S2–S11 sequentially or in parallel (worktrees/Conductor);
  whether to have the assistant generate the worktree setup + integration scripts.
- **Reminders for later sections:** S11 Footer must reuse `social-links-global` + `mapSocialLinks`
  (no second social source); integration must reconcile `registry.ts` + `types.ts` append points.
