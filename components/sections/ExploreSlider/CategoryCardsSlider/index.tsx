import { SectionHeader } from "@/components/common/SectionHeader";
import { Slider } from "@/components/common/Slider";
import { Card } from "@/components/common/Card";
import type { ExploreSliderSection } from "@/lib/sections/types";

type Props = { section: ExploreSliderSection };

/**
 * White, centre-aligned "Explore" section (source: `.explore`, a UIkit
 * `uk-slider` in a `uk-container-large` = 1400px content). A shared centered
 * `SectionHeader` (eyebrow + H2) sits above a horizontal slider showing three
 * linked cards per page at desktop. Each slide is a shared `linked` Card:
 * rounded 600×310 image + centered H4 title, the whole card a link with a
 * scale-up hover transition.
 *
 * Cards are 427px wide with a 60px gutter (dashed divider centred in each gap,
 * matching `uk-grid-divider`). The slider track is pulled 30px past the 1400px
 * container on each side (`lg:-mx-[30px]`) so, with a symmetric 30px item pad,
 * the three visible cards stay equal-width and flush to the container edges.
 * Light slidenav arrows sit just outside the track and only show at `lg`+.
 */
export function CategoryCardsSlider({ section }: Props) {
  if (!section.cards.length) return null;

  return (
    <section
      id={section.sectionId ?? undefined}
      className="bg-white py-12 md:py-16"
    >
      <div className="mx-auto w-full max-w-[1480px] px-4 sm:px-[30px] lg:px-10">
        <SectionHeader
          eyebrow={section.eyebrow}
          heading={section.heading}
          align="center"
          divider={false}
          className="mb-10"
        />
        <div className="lg:-mx-[30px]">
          <Slider
            slidesPerView={3}
            navPlacement="sides"
            navVariant="light"
            arrowsOutset
            showDots
            itemGapClass="px-[30px] border-l border-dashed border-[#e0e0e0] first:border-l-0"
            ariaLabel="Explore Carers Worldwide"
          >
            {section.cards.map((card) => (
              <Card
                key={card.id}
                card={{ ...card, frontEndComponent: "linked" }}
              />
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}
