import type { ReactNode } from "react";
import type {
  SpendingAndVideoSection,
  LegendColor,
} from "@/lib/sections/types";
import { RichText } from "@/components/common/RichText";
import { Video } from "@/components/common/Video";

type PieChartLeftVideoRightProps = { section: SpendingAndVideoSection };

const LEGEND_COLOR_VAR: Record<LegendColor, string> = {
  orange: "var(--chart-orange)",
  purple: "var(--chart-purple)",
  grey: "var(--chart-grey)",
};

/**
 * Renders the video caption as the source does: the story line, then a
 * "Video credit" line with the @handle turned into an orange Instagram link.
 * Falls back to plain text when the expected structure isn't present.
 */
function renderCaption(text: string): ReactNode {
  const creditIdx = text.indexOf("Video credit:");
  const story = (creditIdx >= 0 ? text.slice(0, creditIdx) : text).trim();
  const credit = creditIdx >= 0 ? text.slice(creditIdx).trim() : "";

  const handleMatch = credit.match(/@(\w+)/);
  const creditNode = handleMatch ? (
    <>
      {credit.slice(0, handleMatch.index)}
      <a
        href={`https://www.instagram.com/${handleMatch[1]}/`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[var(--chart-orange)] hover:underline"
      >
        {handleMatch[0]}
      </a>
      {credit.slice((handleMatch.index ?? 0) + handleMatch[0].length)}
    </>
  ) : (
    credit
  );

  return (
    <>
      {story && <p>{story}</p>}
      {credit && <p className="mt-[16px]">{creditNode}</p>}
    </>
  );
}

/**
 * "How we spend your money" — white band, xlarge container, two equal columns.
 * Left: uppercase H2 + intro copy, then a pie-chart SVG beside a colour-coded
 * legend (India / Nepal / Bangladesh). Right: the shared rounded YouTube embed
 * with a two-line caption below. Centred on mobile, left-aligned from `md`.
 * Type sizes/colours matched to the live carersworldwide.org section.
 */
export function PieChartLeftVideoRight({
  section,
}: PieChartLeftVideoRightProps) {
  const { sectionId, heading, body, chart, legend, video } = section;

  return (
    <section id={sectionId ?? undefined} className="bg-white py-12 md:py-16">
      <div className="site-container">
        <div className="flex flex-col gap-[40px] md:flex-row md:items-start md:gap-[40px]">
          {/* Left: heading + intro + pie chart / legend */}
          <div className="flex flex-col text-center md:flex-1 md:text-left">
            {heading && (
              <h2 className="text-[30px] font-bold uppercase leading-[1.15] text-[var(--text-default)] font-[family-name:var(--font-poppins)] md:text-[38px]">
                {heading}
              </h2>
            )}

            <RichText
              content={body}
              className="mt-[20px] text-[16.5px] leading-[1.5] text-[var(--text-default)] font-[family-name:var(--font-poppins)] [&_p]:mb-[20px] [&_p:last-child]:mb-0"
            />

            {chart?.url && (
              <div className="mt-[40px] flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
                <div className="w-full max-w-[320px] sm:w-1/2 sm:max-w-[363px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={chart.url}
                    alt={chart.alt ?? ""}
                    width={chart.width ?? 600}
                    height={chart.height ?? 592}
                    className="h-auto w-full"
                  />
                </div>

                {legend.length > 0 && (
                  <ul className="flex-1 space-y-5">
                    {legend.map((item) => (
                      <li
                        key={item.id}
                        className="text-[24px] font-bold leading-[1.5] font-[family-name:var(--font-poppins)]"
                        style={{ color: LEGEND_COLOR_VAR[item.color] }}
                      >
                        {item.label} {item.percentage}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Right: rounded YouTube embed + caption (shared Video component) */}
          <div className="md:flex-1">
            <Video video={video ? { ...video, caption: null } : null} />
            {video?.caption && (
              <div className="mt-[40px] text-center text-[16.5px] leading-[1.5] text-[var(--text-default)] font-[family-name:var(--font-poppins)] md:text-left">
                {renderCaption(video.caption)}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
