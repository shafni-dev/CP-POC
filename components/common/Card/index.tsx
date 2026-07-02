/* eslint-disable jsx-a11y/alt-text -- <Image> is our own component; it always renders an alt from the CMS entry */
import Link from "next/link";
import type { ReactNode } from "react";
import type { CardEntry } from "@/lib/sections/types";
import { Image } from "@/components/common/Image";
import { Cta } from "@/components/common/Cta";
import { RichText } from "@/components/common/RichText";

type CardProps = { card: CardEntry; className?: string };

/** Whole-card or inline title, optionally linked. */
function CardTitle({
  title,
  href,
  className,
}: {
  title: string | null;
  href?: string | null;
  className?: string;
}) {
  if (!title) return null;
  if (href) {
    return (
      <Link href={href} className={`${className} hover:text-[var(--brand-accent)] transition-colors`}>
        {title}
      </Link>
    );
  }
  return <span className={className}>{title}</span>;
}

function Eyebrow({ text }: { text: string | null }) {
  if (!text) return null;
  return (
    <p className="mb-2 text-[13px] font-normal uppercase tracking-[2px] text-[var(--brand-accent)] font-[family-name:var(--font-poppins)]">
      {text}
    </p>
  );
}

const HEADING =
  "font-[family-name:var(--font-poppins)] font-semibold text-[var(--brand-primary)]";

/**
 * Shared `el-item` card. Routes on `frontEndComponent` (switch-case) to one of
 * four presentational variants used across Hero, Country Cards, Explore and
 * Latest News.
 */
export function Card({ card, className = "" }: CardProps) {
  switch (card.frontEndComponent) {
    case "media-left":
      return <MediaLeft card={card} className={className} />;
    case "linked":
      return <Linked card={card} className={className} />;
    case "blog":
      return <Blog card={card} className={className} />;
    case "media-top":
    default:
      return <MediaTop card={card} className={className} />;
  }
}

/* image on top, title / body / CTA below (Country Cards) */
function MediaTop({ card, className }: CardProps) {
  return (
    <article className={`flex h-full flex-col ${className}`}>
      {card.image && (
        <Image
          image={card.image}
          className="w-full object-cover"
          sizes="(min-width: 768px) 400px, 100vw"
        />
      )}
      <div className="flex flex-1 flex-col items-start pt-5">
        <Eyebrow text={card.eyebrow} />
        <CardTitle
          title={card.title}
          href={card.titleHref}
          className={`${HEADING} mb-3 text-[22px] uppercase leading-tight`}
        />
        <RichText content={card.body} className="mb-5 text-[16px] leading-relaxed text-[var(--text-default)]" />
        {card.cta && <Cta cta={card.cta} className="mt-auto" />}
      </div>
    </article>
  );
}

/* image left / content right (Hero slide) */
function MediaLeft({ card, className }: CardProps) {
  return (
    <article className={`flex flex-col overflow-hidden md:flex-row ${className}`}>
      {card.image && (
        <div className="md:w-1/2">
          <Image
            image={card.image}
            className="h-full w-full object-cover"
            eager
            sizes="(min-width: 768px) 600px, 100vw"
          />
        </div>
      )}
      <div className="flex flex-col justify-center p-8 md:w-1/2 md:p-12">
        <Eyebrow text={card.eyebrow} />
        <CardTitle
          title={card.title}
          href={card.titleHref}
          className={`${HEADING} mb-4 border-b-2 border-[var(--brand-accent)] pb-3 text-[33px] uppercase leading-[1.05]`}
        />
        <RichText content={card.body} className="mb-6 text-[16px] leading-relaxed text-[var(--text-default)]" />
        {card.cta && <Cta cta={card.cta} />}
      </div>
    </article>
  );
}

/* rounded image + title, whole card is one link, scale-up on hover (Explore) */
function Linked({ card, className }: CardProps) {
  const inner: ReactNode = (
    <>
      {card.image && (
        <div className="overflow-hidden rounded-2xl">
          <Image
            image={card.image}
            className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(min-width: 768px) 300px, 100vw"
          />
        </div>
      )}
      {card.title && (
        <h3 className={`${HEADING} mt-4 text-[18px] uppercase leading-tight transition-colors group-hover:text-[var(--brand-accent)]`}>
          {card.title}
        </h3>
      )}
    </>
  );
  return (
    <Link href={card.titleHref ?? "#"} className={`group block ${className}`}>
      {inner}
    </Link>
  );
}

/* rounded image + title + date meta + "Read more" (Latest News) */
function Blog({ card, className }: CardProps) {
  return (
    <article className={`flex h-full flex-col ${className}`}>
      {card.image && (
        <Link href={card.titleHref ?? "#"} className="block overflow-hidden rounded-2xl">
          <Image
            image={card.image}
            className="aspect-[3/2] w-full object-cover transition-transform duration-300 hover:scale-105"
            sizes="(min-width: 768px) 380px, 100vw"
          />
        </Link>
      )}
      <div className="flex flex-1 flex-col items-start pt-4">
        {card.meta && (
          <p className="mb-2 text-[13px] uppercase tracking-[1px] text-[var(--text-muted)]">
            {card.meta}
          </p>
        )}
        <CardTitle
          title={card.title}
          href={card.titleHref}
          className={`${HEADING} mb-4 text-[19px] leading-snug`}
        />
        <Link
          href={card.titleHref ?? "#"}
          className="mt-auto text-[15px] font-semibold uppercase tracking-[1px] text-[var(--brand-accent)] transition-colors hover:text-[var(--brand-primary)]"
        >
          Read more
        </Link>
      </div>
    </article>
  );
}
