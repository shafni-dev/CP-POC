import type { MissionStatementSection } from "@/lib/sections/types";
import { SectionHeader } from "@/components/common/SectionHeader";
import { StatItem } from "@/components/common/StatItem";
import { RichText } from "@/components/common/RichText";

type MissionStatementDefaultProps = { section: MissionStatementSection };

/**
 * Mission Statement — muted grey band, large container. Left column (3/5)
 * holds the eyebrow + heading + intro copy via the shared SectionHeader; the
 * right column (2/5) is a chevron stat list built from the shared StatItem
 * (inline variant). Mirrors homepage.html's "We Are Committed To" section.
 */
export function MissionStatementDefault({
  section,
}: MissionStatementDefaultProps) {
  const { eyebrow, heading, body, stats } = section;

  return (
    <section className="bg-[var(--bg-muted)] py-[80px]">
      <div className="mx-auto w-full max-w-[1480px] px-[40px]">
        <div className="flex flex-col gap-[40px] md:flex-row md:gap-[70px]">
          <div className="md:w-[58%]">
            <SectionHeader
              eyebrow={eyebrow}
              heading={heading}
              divider={false}
              intro={
                <RichText
                  content={body}
                  className="[&_p]:mb-5 [&_p:last-child]:mb-0"
                />
              }
            />
          </div>

          {stats.length > 0 && (
            <div className="md:w-[37%]">
              <ul className="flex flex-col gap-[26px]">
                {stats.map((stat) => (
                  <li key={stat.id}>
                    <StatItem
                      value={stat.value}
                      label={stat.label}
                      size="inline"
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
