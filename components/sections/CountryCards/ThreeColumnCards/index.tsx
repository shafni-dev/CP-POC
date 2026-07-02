import type { CountryCardsSection } from "@/lib/sections/types";
import { Card } from "@/components/common/Card";

type ThreeColumnCardsProps = { section: CountryCardsSection };

/**
 * Three equal-width country cards on a white section (source: `.homeprojects`,
 * `uk-child-width-1-3@m uk-grid-match`). Each card is a shared `card` entry
 * rendered with the `media-top` variant on the brand-primary surface: image
 * top (960×600), H3 title link, body, and a "View Projects" ghost CTA.
 * `uk-grid-match` → the grid stretches every card to the tallest in the row.
 */
export function ThreeColumnCards({ section }: ThreeColumnCardsProps) {
  if (!section.cards.length) return null;

  return (
    <section id={section.sectionId ?? undefined} className="bg-white py-12 md:py-16">
      <div className="site-container">
        <div className="grid grid-cols-1 gap-[30px] md:grid-cols-3">
          {section.cards.map((card) => (
            <Card key={card.id} card={card} surface="primary" />
          ))}
        </div>
      </div>
    </section>
  );
}
