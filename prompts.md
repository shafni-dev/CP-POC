Section 0 — Shared Components (build FIRST)
/e25-build-component — build the shared reusable components before any section that consumes them
Reference DOM: see homepage.html in the project root.
Build these once so Sections 1–11 reference them instead of re-implementing:

Reusable Contentful entries (linked references + GraphQL fragments under lib/contentful/graphql/fragments/):
- **Image** — responsive `<picture>`: webp `srcset` + jpeg/png fallback, explicit width/height, alt, loading (eager|lazy). Used by nearly every section.
- **Cta / Button** — `uk-button` with variants: `default` (outlined ghost, used inside cards), `primary` (solid, toolbar Donate), `donate` (branded purple Donate). Props: label, href, variant, ariaLabel, target.
- **Video** — YouTube (nocookie) embed wrapper: iframe src, title, rounded border, optional caption.
- **Card** — the shared `el-item` card molecule used by Hero, Country Cards, Explore, and Latest News. Fields: image (Image), eyebrow (optional), title, titleHref (optional), body (optional), meta/date (optional), cta (Cta, optional). Frontend Component variants (switch-case):
  - `media-top` — image on top, title/body/CTA below (Country Cards)
  - `media-left` — image left / content right (Hero slide)
  - `linked` — rounded image + title, whole card is one link, scale-up hover (Explore)
  - `blog` — rounded image + title + date meta + "Read more" (Latest News)

Reusable React presentational primitives (pure UI, no CMS entry needed — under components/):
- **SectionHeader** — eyebrow (uk-text-lead) + H2 + optional intro paragraph(s). Props: eyebrow, heading, intro, align (left|center). Used by Mission, Explore, Latest News.
- **Slider** — carousel shell: uk-slider container, prev/next slidenav arrows, dotnav pagination, autoplay/interval/pauseOnHover options. Takes card children. Used by Hero and Explore.
- **StatItem** — big number + label unit. Props: value, label, size (h1 grid | inline chevron). Used by Impact stats and the Mission chevron list.
- **SocialLinks** — icon row (Facebook, Twitter/X, LinkedIn, Instagram, YouTube) with configurable icon size. Used by Nav mobile menu and Footer.

Section 1 — Navigation
/e25-build-component — build the Navigation section from homepage.html
Content Model: navigation | Frontend Component: Default
Reference DOM: see homepage.html in the project root. Target section: `<header>` elements.
Design:
- Top toolbar: right-aligned purple Donate CTA button
- Logo: /images/CarersWorldwide_Logo.svg (260×122), left-aligned
- Nav links right: Home, Radio 4 Appeal, About▾, Our Work▾, Impact▾, Get Involved▾, Blog, Events▾, Contact
- Dropdowns: 2-column grid, 480–500px wide, appear on hover
- Mobile: hamburger → off-canvas slide-in menu with accordion nav. The mobile menu ALSO contains a Donate button and the social-icons row (Facebook, Twitter, LinkedIn, Instagram, YouTube) below the nav.
- Brand purple: #92278f | Container: xlarge | White background
- Reuse shared Cta component for the Donate button and SocialLinks for the mobile social-icons row.

Section 2 — Hero Slider
/e25-build-component — build the HeroSlider section from homepage.html
Content Model: heroSlider | Frontend Component: Split Image Left / Content Right
Reference DOM: see homepage.html in the project root. Target section: the element with class "homeheroslides".
Design:
- Full-width auto-playing slider (5s interval, no pause on hover), 6 slides
- Each slide: image left (50% width, object-cover), content right (50%)
- Content: optional eyebrow text, H2 with divider underline, body paragraph, ghost CTA button
- Dark/purple card background on content side
- Slide nav arrows bottom-left, light coloured
- Reuse shared Slider component for the carousel shell, and shared Card component (variant `media-left`) for each slide. Cards compose shared Cta and Image.

Section 3 — Mission Statement
/e25-build-component — build the MissionStatement section from homepage.html
Content Model: missionStatement | Frontend Component: Default
Reference DOM: see homepage.html in the project root. Target section: the element immediately following "homeheroslides" containing "We Are Committed To".
Design:
- Muted grey background (uk-section-muted)
- Left col (3/5 width): eyebrow text "We Are Committed To", H2 "Changing the lives of carers", 3 body paragraphs
- Right col (2/5 width): chevron bullet list (6 stats e.g. "92% of family carers worry about money")
- Stats use <strong> for the number, plain text for label
- Container: large
- Reuse shared SectionHeader for the eyebrow + H2 + intro, and shared StatItem (chevron/inline variant) for each of the 6 stats.

Section 4 — Country Cards
/e25-build-component — build the CountryCards section from homepage.html
Content Model: countryCards | Frontend Component: Three Column Cards
Reference DOM: see homepage.html in the project root. Target section: the element containing the "Bangladesh", "India", and "Nepal" cards.
Design:
- White background, 3 equal columns (Bangladesh, India, Nepal)
- Each card: image top (960×600), H3 title as link, body text, "View Projects" ghost button
- Cards match height (uk-grid-match), primary colour card background
- Reuse shared Card component (variant `media-top`); cards compose shared Image and Cta.
- Container: xlarge

Section 5 — Spending & Video
/e25-build-component — build the SpendingAndVideo section from homepage.html
Content Model: spendingAndVideo | Frontend Component: Pie Chart Left / Video Right
Reference DOM: see homepage.html in the project root. Target section: the element containing the text "How we spend your money".
Design:
- White background, 2 equal columns
- Left: H2 "How we spend your money", body text, SVG pie chart (/images/pie-chart24.svg) beside legend (India 55% orange, Nepal 5% purple, Bangladesh 40% grey)
- Right: rounded YouTube embed (iframe, 560×315) + caption text below
- Container: xlarge
- Reuse shared Video component for the YouTube embed.

Section 6 — Impact Stats
/e25-build-component — build the ImpactStats section from homepage.html
Content Model: impactStats | Frontend Component: Parallax Image Left / Stats Right
Reference DOM: see homepage.html in the project root. Target section: the element with class "impactblock".
Design:
- Full bleed, 2 halves: left = parallax background image (/images/impact-parallax2.jpg) with purple overlay (rgba 146,39,143,0.1)
- Right = purple tile background (uk-tile-primary), H2 "Our Impact" with divider
- 3 stat rows: large H1 number + lead text label (46,775 Carers Lives Changed / +47,252 People They Care For / +185,637 Family Members)
- "Latest Report" ghost CTA button below stats
- Container: xlarge
- Shares the split image + colour-panel layout with Section 8 (mirrored) — factor a common SplitTile layout if convenient.
- Reuse shared StatItem (H1/grid variant) for the 3 stat rows and shared Cta for the "Latest Report" button.

Section 7 — Explore Slider
/e25-build-component — build the ExploreSlider section from homepage.html
Content Model: exploreSlider | Frontend Component: Category Cards Slider
Reference DOM: see homepage.html in the project root. Target section: the element with class "explore".
Design:
- White background, centre-aligned
- Eyebrow "Explore", H2 "Carers Worldwide"
- Horizontal slider (dotnav pagination), 6 cards per slide at desktop (1-3 visible)
- Each card: rounded image (600×310), H4 title, full card is a link with scale-up hover transition
- Cards: About, Our Work, Impact, Contact, Donate, Get Involved
- Container: large
- Reuse shared SectionHeader (centered) for the eyebrow + H2, shared Slider for the carousel, and shared Card component (variant `linked`) for each card. Cards compose shared Image.

Section 8 — Donation CTA
/e25-build-component — build the DonationCTA section from homepage.html
Content Model: donationCTA | Frontend Component: Split Content Left / Image Right
Reference DOM: see homepage.html in the project root. Target section: the element containing the text "Make a Donation".
Design:
- Full bleed, 2 halves
- Left: purple tile bg, H2 "Make a Donation" with divider, H3 subheading, body paragraph, Donate ghost button, small photo credit text
- Right: parallax background image (/images/BANG-COM.jpg), top-center, horizontal parallax on scroll
- Container: xlarge
- Shares the split image + colour-panel layout with Section 6 (mirrored) — reuse the same SplitTile layout if factored.
- Reuse shared Cta component for the Donate button.

Section 9 — Latest News
/e25-build-component — build the LatestNews section from homepage.html
Content Model: latestNews | Frontend Component: Three Column Blog Cards
Reference DOM: see homepage.html in the project root. Target section: the element containing the text "Latest News".
Design:
- Muted grey background, centre-aligned
- Eyebrow "Blog", H2 "Latest News"
- 3-column grid (dividers between columns), grid-match height
- Each card: rounded image top (640×350, scale-up hover), H5 title as link, date meta text, "Read more" ghost button
- Container: xlarge
- Pulls from latest blog entries (dynamic, linked content references)
- Reuse shared SectionHeader (centered) for the eyebrow + H2, and shared Card component (variant `blog`) for each entry. Cards compose shared Image and Cta.

Section 10 — Newsletter Signup
/e25-build-component — build the NewsletterSignup section from homepage.html
Content Model: newsletterSignup | Frontend Component: Default
Reference DOM: see homepage.html in the project root. Target section: the element with id "commit-to-carers" inside the footer.
Design:
- Primary (purple) background, uk-section-small
- H3 "Join our Mailing List", body paragraph explaining Commit to Carers newsletter
- "Subscribe" ghost button that opens a UIKit modal
- Modal contains: Brevo embedded form (first name + email + opt-in checkbox + reCAPTCHA + submit)
- Container: large
- Reuse shared Cta component for the "Subscribe" button.

Section 11 — Footer
/e25-build-component — build the Footer section from homepage.html
Content Model: footer | Frontend Component: Default
Reference DOM: see homepage.html in the project root. Target section: the `<footer>` element.
Design:
- White background, 3-column top row:
  Col 1: Logo (/images/CarersWorldwide_Logo.svg) + social icon links (Facebook, LinkedIn, Instagram, YouTube)
  Col 2: Contact list — phone (+44 7745 608438), email, address (30 Lodgefield, Welwyn Garden City, AL7 1SD) with SVG icons
  Col 3: Charity numbers (Registered Charity 1150214, Company 08083816, CW India Trust 986)
- Bottom row: legal links (Site Map, Privacy Policy, Cookie Policy, Env. Policy), copyright, partner logos (Ashoka, IACO), Fundraising Regulator badge
- Container: xlarge
- Reuse shared SocialLinks for the social icon row, and shared Image component for the logo and all partner/badge logos.