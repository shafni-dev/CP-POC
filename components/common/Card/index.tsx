/* eslint-disable jsx-a11y/alt-text -- <Image> is our own component; it always renders an alt from the CMS entry */
import Link from "next/link";
import type { ReactNode } from "react";
import type { CardEntry } from "@/lib/sections/types";
import { Image } from "@/components/common/Image";
import { Cta } from "@/components/common/Cta";
import { RichText } from "@/components/common/RichText";

type CardSurface = "default" | "primary";
type CardProps = { card: CardEntry; className?: string; surface?: CardSurface };

/** Whole-card or inline title, optionally linked. */
function CardTitle({
  title,
  href,
  className,
  hover = true,
}: {
  title: string | null;
  href?: string | null;
  className?: string;
  /** Colour-shift the link on hover (matches most cards). Blog titles stay static. */
  hover?: boolean;
}) {
  if (!title) return null;
  if (href) {
    return (
      <Link
        href={href}
        className={`${className} ${
          hover ? "hover:text-[var(--brand-accent)] transition-colors" : ""
        }`}
      >
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

/**
 * Shared `el-item` card. Routes on `frontEndComponent` (switch-case) to one of
 * four presentational variants used across Hero, Country Cards, Explore and
 * Latest News.
 */
export function Card({ card, className = "", surface = "default" }: CardProps) {
  switch (card.frontEndComponent) {
    case "media-left":
      return <MediaLeft card={card} className={className} />;
    case "linked":
      return <Linked card={card} className={className} />;
    case "blog":
      return <Blog card={card} className={className} />;
    case "media-top":
    default:
      return <MediaTop card={card} className={className} surface={surface} />;
  }
}

/**
 * image on top, title / body / CTA below (Country Cards).
 * `surface="primary"` renders the whole card on brand purple with light text —
 * the image bleeds to the top edges and the body gets uk-card-body padding.
 */
function MediaTop({ card, className, surface = "default" }: CardProps) {
  const isPrimary = surface === "primary";
  const poppins = "font-[family-name:var(--font-poppins)]";
  // Country-card look: Title-case bold Poppins on purple, larger body copy.
  const headingClass = isPrimary
    ? `${poppins} mb-6 text-[34px] font-bold leading-[1.1] text-white`
    : `${poppins} mb-3 text-[22px] font-semibold uppercase leading-tight text-[var(--brand-primary)]`;
  const bodyClass = isPrimary
    ? "mb-7 text-[18px] leading-[1.7] text-white"
    : "mb-5 text-[16px] leading-relaxed text-[var(--text-default)]";
  return (
    <article
      className={`flex h-full flex-col ${
        isPrimary ? "group overflow-hidden bg-[var(--brand-primary)]" : ""
      } ${className}`}
    >
      {card.image &&
        (isPrimary ? (
          // colour overlay fades over the image on card hover
          <div className="relative overflow-hidden">
            <Image
              image={card.image}
              className="aspect-[8/5] w-full object-cover"
              sizes="(min-width: 768px) 400px, 100vw"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[var(--brand-primary)]/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          </div>
        ) : (
          <Image
            image={card.image}
            className="w-full object-cover"
            sizes="(min-width: 768px) 400px, 100vw"
          />
        ))}
      <div className={`flex flex-1 flex-col items-start ${isPrimary ? "p-[40px]" : "pt-5"}`}>
        <Eyebrow text={card.eyebrow} />
        <CardTitle title={card.title} href={card.titleHref} className={headingClass} />
        <RichText content={card.body} className={bodyClass} />
        {card.cta && <Cta cta={card.cta} className="mt-auto" />}
      </div>
    </article>
  );
}

/* image left / content right, purple content panel (Hero slide) */
function MediaLeft({ card, className }: CardProps) {
  return (
    <article
      className={`flex flex-col overflow-hidden rounded-[10px] md:min-h-[471px] md:flex-row ${className}`}
    >
      {card.image && (
        <div className="md:w-1/2">
          <Image
            image={card.image}
            className="h-full min-h-[280px] w-full object-cover md:min-h-full"
            eager
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>
      )}
      {/* content side — brand-purple card, light text (uk-card-primary) */}
      <div className="flex flex-col justify-center bg-[var(--brand-primary)] px-8 py-10 text-white font-[family-name:var(--font-poppins)] md:w-1/2 md:p-[70px]">
        {card.eyebrow && (
          <p className="mb-0 text-[18px] font-normal uppercase leading-[1.5] tracking-[4px] text-white">
            {card.eyebrow}
          </p>
        )}
        {card.title && (
          <h2 className="mb-0 border-b-2 border-[var(--brand-accent)] pb-[10px] text-[52px] font-bold uppercase leading-[1.05]">
            {card.title}
          </h2>
        )}
        <RichText
          content={card.body}
          className="mt-10 text-[20px] leading-[30px] text-white [&_p]:mb-5 [&_p:last-child]:mb-0"
        />
        {card.cta && <Cta cta={card.cta} className="mt-5 self-start" />}
      </div>
    </article>
  );
}

/* rounded image + title, whole card is one link, scale-up on hover (Explore) */
function Linked({ card, className }: CardProps) {
  const inner: ReactNode = (
    <>
      {card.image && (
        <div className="overflow-hidden rounded-[8px]">
          <Image
            image={card.image}
            className="aspect-[600/310] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            sizes="(min-width: 1024px) 427px, (min-width: 640px) 50vw, 100vw"
          />
        </div>
      )}
      {card.title && (
        <h3 className="mt-5 text-center text-[20px] font-bold uppercase leading-[1.4] tracking-[2px] text-[var(--text-default)] font-[family-name:var(--font-poppins)] transition-colors group-hover:text-[var(--brand-primary)]">
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

/**
 * rounded image top + title link + date meta + ghost "Read more" CTA (Latest News).
 * Matches the live theme: 8px-rounded image that scales to 1.1 on hover, a bold
 * dark 24px title link (no colour-shift), an uppercase grey date meta, and the
 * shared pill `ghost` Cta. Content flows top-aligned (buttons are NOT stretched
 * to the card bottom — they sit a fixed 20px below the meta, as on the live site).
 */
function Blog({ card, className }: CardProps) {
  return (
    <article className={`flex h-full flex-col ${className}`}>
      {card.image && (
        <Link
          href={card.titleHref ?? "#"}
          className="group block overflow-hidden rounded-[8px]"
        >
          <Image
            image={card.image}
            className="aspect-[64/35] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            sizes="(min-width: 768px) 640px, 100vw"
          />
        </Link>
      )}
      <div className="flex flex-col items-start">
        <CardTitle
          title={card.title}
          href={card.titleHref}
          hover={false}
          className="mt-5 text-[24px] font-bold leading-[1.4] text-[var(--text-default)] font-[family-name:var(--font-poppins)]"
        />
        {card.meta && (
          <p className="mt-[10px] text-[13px] font-normal uppercase leading-[1.4] tracking-[1px] text-[var(--text-meta)] font-[family-name:var(--font-poppins)]">
            {card.meta}
          </p>
        )}
        <Cta
          cta={
            card.cta ?? {
              id: `${card.id}-readmore`,
              label: "Read more",
              href: card.titleHref,
              variant: "ghost",
              ariaLabel: null,
              target: "_self",
            }
          }
          className="mt-5"
        />
      </div>
    </article>
  );
}
