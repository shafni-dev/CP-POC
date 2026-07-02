import type { LatestNewsSection } from "@/lib/sections/types";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Card } from "@/components/common/Card";

type ThreeColumnBlogCardsProps = { section: LatestNewsSection };

/**
 * Latest News (source: `.uk-section-muted` + `.uk-container-xlarge`). A centered
 * eyebrow + H2 header over three equal-height blog cards
 * (`uk-child-width-1-3@m uk-grid-divider uk-grid-match`). Each card is a shared
 * `card` entry rendered with the `blog` variant: rounded image top (640×350,
 * scale-up on hover), H5 title link, date meta, and a ghost "Read more" CTA.
 *
 * The vertical dividers between columns reproduce `uk-grid-divider`: the grid
 * bleeds its column padding with a negative margin, each column pads 30px, and
 * the 2nd/3rd columns carry a 2px dashed left border (rgba(0,0,0,.1)) centered
 * in that 60px gap.
 */
export function ThreeColumnBlogCards({ section }: ThreeColumnBlogCardsProps) {
  if (!section.cards.length) return null;

  return (
    <section
      id={section.sectionId ?? undefined}
      className="bg-[var(--bg-muted)] py-14 md:py-20"
    >
      <div className="site-container">
        {section.heading && (
          <SectionHeader
            eyebrow={section.eyebrow}
            heading={section.heading}
            align="center"
            divider={false}
            className="mb-10 md:mb-[50px]"
          />
        )}
        <div className="grid grid-cols-1 gap-y-12 md:grid-cols-3 md:-mx-[30px] md:gap-y-0">
          {section.cards.map((card, i) => (
            <div
              key={card.id}
              className={`flex md:px-[30px] ${
                i > 0
                  ? "md:border-l-2 md:border-dashed md:border-[var(--border-divider)]"
                  : ""
              }`}
            >
              <Card card={card} className="w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
