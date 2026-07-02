/* eslint-disable jsx-a11y/alt-text -- <Image> is our own component; it renders alt internally */
import { BLOCKS, type Document } from "@contentful/rich-text-types";
import type { CardEntry, CtaEntry, ImageEntry, VideoEntry } from "@/lib/sections/types";
import { Image } from "@/components/common/Image";
import { Cta } from "@/components/common/Cta";
import { Video } from "@/components/common/Video";
import { Card } from "@/components/common/Card";
import { SectionHeader } from "@/components/common/SectionHeader";
import { StatItem } from "@/components/common/StatItem";
import { SocialLinks } from "@/components/common/SocialLinks";
import { Slider } from "@/components/common/Slider";

export const dynamic = "force-static";

const PHOTO = "https://carersworldwide.org/templates/yootheme/cache/0c/hero-impact-0cda0fe8.jpeg";
const PHOTO2 = "https://carersworldwide.org/templates/yootheme/cache/c9/bbc-2-c9e63d61.jpeg";

const img = (url: string, alt: string): ImageEntry => ({
  id: url,
  url,
  alt,
  width: 1200,
  height: 800,
  contentType: "image/jpeg",
  loading: "lazy",
});

const doc = (text: string): { json: Document } => ({
  json: {
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content: [
      {
        nodeType: BLOCKS.PARAGRAPH,
        data: {},
        content: [{ nodeType: "text", value: text, marks: [], data: {} }],
      },
    ],
  },
});

const cta = (label: string, variant: CtaEntry["variant"]): CtaEntry => ({
  id: label,
  label,
  href: "#",
  variant,
  ariaLabel: null,
  target: "_self",
});

const card = (over: Partial<CardEntry>): CardEntry => ({
  id: Math.random().toString(),
  frontEndComponent: "media-top",
  image: img(PHOTO, "Carers"),
  eyebrow: null,
  title: "Card Title",
  titleHref: "#",
  body: null,
  meta: null,
  cta: null,
  ...over,
});

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-black/10 py-12">
      <p className="mb-6 text-[13px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
        {title}
      </p>
      {children}
    </section>
  );
}

export default function ComponentPreview() {
  return (
    <main className="site-container py-12 font-[family-name:var(--font-poppins)]">
      <h1 className="text-[28px] font-bold text-[var(--brand-primary)]">
        Section 0 — Shared Components
      </h1>

      <Row title="Image — responsive picture">
        <div className="max-w-[480px]">
          <Image image={img(PHOTO, "Two carers hold hands")} className="w-full rounded-2xl object-cover" />
        </div>
      </Row>

      <Row title="Cta — default / primary / donate">
        <div className="flex flex-wrap items-center gap-4">
          <Cta cta={cta("Find out more", "default")} />
          <Cta cta={cta("Submit", "primary")} />
          <Cta cta={cta("Donate", "donate")} />
        </div>
      </Row>

      <Row title="SectionHeader — left / center">
        <div className="grid gap-12 md:grid-cols-2">
          <SectionHeader
            eyebrow="We Are Committed To"
            heading="Changing the lives of carers"
            intro={<p>Carers Worldwide works exclusively with unpaid family carers in developing countries.</p>}
          />
          <SectionHeader
            align="center"
            eyebrow="Our Impact"
            heading="Carers Lives Changed"
            intro={<p>Measurable change across India, Nepal and Bangladesh.</p>}
          />
        </div>
      </Row>

      <Row title="StatItem — grid (impact)">
        <div className="grid grid-cols-3 gap-8">
          <StatItem value="46,775" label="Carers reached directly" />
          <StatItem value="+ 47,252" label="Family members supported" />
          <StatItem value="+ 185,637" label="People impacted overall" />
        </div>
      </Row>

      <Row title="StatItem — inline (chevron / mission)">
        <div className="flex flex-col gap-3">
          <StatItem size="inline" value="46,775" label="carers reached" />
          <StatItem size="inline" value="10" label="years of impact" />
        </div>
      </Row>

      <Row title="Card — media-top (Country)">
        <div className="grid grid-cols-3 gap-8">
          {["India", "Nepal", "Bangladesh"].map((c) => (
            <Card
              key={c}
              card={card({
                frontEndComponent: "media-top",
                title: c,
                body: doc(`Our work in ${c} supports carers with training, healthcare and income.`),
                cta: cta("Find out more", "default"),
              })}
            />
          ))}
        </div>
      </Row>

      <Row title="Card — media-left (Hero slide)">
        <Card
          card={card({
            frontEndComponent: "media-left",
            eyebrow: "Jo Whiley Presents Our",
            title: "BBC Radio 4 Appeal",
            image: img(PHOTO2, "BBC Radio 4"),
            body: doc("Don't miss our BBC Radio 4 Appeal, aired on Sunday with repeat broadcasts."),
            cta: cta("Find out more", "default"),
          })}
          className="border border-black/10"
        />
      </Row>

      <Row title="Card — linked (Explore)">
        <div className="grid grid-cols-4 gap-6">
          {["About Us", "Our Work", "Impact", "Get Involved"].map((c) => (
            <Card key={c} card={card({ frontEndComponent: "linked", title: c })} />
          ))}
        </div>
      </Row>

      <Row title="Card — blog (Latest News)">
        <div className="grid grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <Card
              key={n}
              card={card({
                frontEndComponent: "blog",
                title: "From isolation to independence: Sadhona's story",
                meta: "12 June 2026",
              })}
            />
          ))}
        </div>
      </Row>

      <Row title="Slider — slidesPerView 3, autoplay">
        <Slider slidesPerView={3} autoplay ariaLabel="Explore">
          {["About Us", "Our Work", "Impact", "Get Involved", "Blog", "Events"].map((c) => (
            <Card key={c} card={card({ frontEndComponent: "linked", title: c })} />
          ))}
        </Slider>
      </Row>

      <Row title="Video — YouTube nocookie">
        <div className="max-w-[640px]">
          <Video
            video={
              {
                id: "v",
                youtubeId: "BFQgbzz_gCg",
                videoTitle: "Carers Worldwide",
                caption: "Hear us on the BBC World Service",
              } satisfies VideoEntry
            }
          />
        </div>
      </Row>

      <Row title="SocialLinks">
        <SocialLinks
          size={22}
          links={[
            { platform: "facebook", href: "https://facebook.com/CarersWorldwide" },
            { platform: "twitter", href: "https://twitter.com/CarersWorldwide" },
            { platform: "linkedin", href: "https://linkedin.com/company/carers-worldwide" },
            { platform: "instagram", href: "https://instagram.com/carersworldwide" },
            { platform: "youtube", href: "https://youtube.com" },
          ]}
        />
      </Row>
    </main>
  );
}
