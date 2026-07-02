import type { ImpactStatsSection } from "@/lib/sections/types";
import { SplitTile } from "@/components/common/SplitTile";
import { StatItem } from "@/components/common/StatItem";
import { Cta } from "@/components/common/Cta";

type ParallaxImageStatsProps = { section: ImpactStatsSection };

// brand purple at 10% — matches the source overlay rgba(146, 39, 143, 0.1),
// expressed via the token so no hex literal lives in the component.
const IMAGE_OVERLAY = "color-mix(in srgb, var(--brand-primary) 10%, transparent)";

/**
 * Impact Stats — a split tile with the cover image on the left (source uses a
 * `uk-parallax` background) and a purple `uk-tile-primary` colour panel on the
 * right: "Our Impact" heading with a light divider, three large stat rows
 * (shared StatItem `grid`/`light`), and the "Latest Report" ghost CTA.
 * Mirrors homepage.html's `.impactblock` (Section 6).
 */
export function ParallaxImageStats({ section }: ParallaxImageStatsProps) {
  const { heading, image, stats, cta, sectionId } = section;

  return (
    <SplitTile
      image={image}
      imageSide="left"
      overlayColor={IMAGE_OVERLAY}
      sectionId={sectionId}
      className="pb-[80px]"
    >
      <div className="flex h-full flex-col bg-[var(--brand-primary)] p-8 text-white md:p-[70px]">
        {heading && (
          <h2 className="mb-[40px] border-b-2 border-[var(--brand-accent)] pb-[10px] text-[52px] font-bold uppercase leading-[1.05] font-[family-name:var(--font-poppins)]">
            {heading}
          </h2>
        )}

        {stats.length > 0 && (
          <div className="flex flex-col gap-[50px]">
            {stats.map((stat) => (
              <StatItem
                key={stat.id}
                value={stat.value}
                label={stat.label}
                size="grid"
                tone="light"
              />
            ))}
          </div>
        )}

        {cta && (
          <div className="mt-[40px]">
            <Cta cta={cta} />
          </div>
        )}
      </div>
    </SplitTile>
  );
}
