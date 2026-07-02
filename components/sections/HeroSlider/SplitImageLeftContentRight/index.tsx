import { Slider } from "@/components/common/Slider";
import { Card } from "@/components/common/Card";
import type { HeroSliderSection } from "@/lib/sections/types";

type Props = { section: HeroSliderSection };

/**
 * Each slide is a shared `media-left` Card (image left / purple content panel
 * right). Autoplays every 5s and never pauses on hover; the light arrows sit
 * at the bottom-left over the slide.
 */
export function SplitImageLeftContentRight({ section }: Props) {
  if (!section.slides.length) return null;

  return (
    <section id={section.sectionId ?? undefined}>
      <div className="site-container">
        <Slider
          autoplay
          interval={5000}
          durationMs={1125}
          easing="ease"
          pauseOnHover={false}
          slidesPerView={1}
          navPlacement="bottom-left"
          navVariant="light"
          showDots={false}
          itemGapClass="px-0"
          ariaLabel="Featured highlights"
        >
          {section.slides.map((card) => (
            <Card
              key={card.id}
              card={{ ...card, frontEndComponent: "media-left" }}
            />
          ))}
        </Slider>
      </div>
    </section>
  );
}
