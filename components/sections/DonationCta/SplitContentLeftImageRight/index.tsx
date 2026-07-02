import type { DonationCtaSection } from "@/lib/sections/types";
import { RichText } from "@/components/common/RichText";
import { Cta } from "@/components/common/Cta";
import { ParallaxImage } from "../ParallaxImage";

type Props = { section: DonationCtaSection };

/**
 * Split Content Left / Image Right — a full-bleed two-half band inside the
 * xlarge container (no gutter between halves, matched heights, 10px rounded
 * outer corners). Left: a purple `uk-tile-primary` panel, vertically centred,
 * with a white H2 + orange divider, an H3 subheading, body copy, a ghost
 * Donate button, and a small photo-credit line. Right: a parallax background
 * image (top-center, horizontal scroll parallax).
 *
 * Type scale, colours and the uniform 20px vertical rhythm are matched to the
 * live carersworldwide.org "Make a Donation" block (Poppins throughout; H2 52,
 * H3 34, body 16.5; 70px tile padding). Mirrors homepage.html.
 */
export function SplitContentLeftImageRight({ section }: Props) {
  const { sectionId, heading, subheading, body, cta, photoCredit, image } =
    section;

  return (
    <section id={sectionId ?? undefined} className="bg-[var(--background)]">
      <div className="site-container">
        <div className="grid grid-cols-1 items-stretch overflow-hidden rounded-[10px] md:grid-cols-2">
          {/* Left — purple content tile */}
          <div className="flex items-center bg-[var(--brand-primary)] px-[30px] py-[50px] text-white font-[family-name:var(--font-poppins)] sm:px-[40px] md:px-[70px] md:py-[70px]">
            <div className="w-full">
              {heading && (
                <h2 className="border-b-2 border-[var(--brand-accent)] pb-[10px] text-[38px] font-bold uppercase leading-[1.1] md:text-[52px] md:leading-[1.05]">
                  {heading}
                </h2>
              )}
              {subheading && (
                <h3 className="mt-[20px] text-[26px] font-bold leading-[1.4] md:text-[34px]">
                  {subheading}
                </h3>
              )}
              {body && (
                <div className="mt-[20px] text-[16.5px] leading-[1.5] [&_p]:mb-[20px] [&_p:last-child]:mb-0">
                  <RichText content={body} />
                </div>
              )}
              {cta && (
                <div className="mt-[20px]">
                  <Cta cta={cta} showHeart />
                </div>
              )}
              {photoCredit && (
                <p className="mt-[20px] text-[13px] leading-[1.5] text-white">
                  {photoCredit}
                </p>
              )}
            </div>
          </div>

          {/* Right — parallax image tile */}
          <div className="min-h-[320px] md:min-h-0">
            {image.url && (
              <ParallaxImage
                src={image.url}
                alt={image.alt}
                bgx={50}
                className="min-h-[320px]"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
