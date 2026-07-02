import type { HeroSliderSection } from "@/lib/sections/types";
import { SplitImageLeftContentRight } from "./SplitImageLeftContentRight";

type HeroSliderProps = { section: HeroSliderSection };

/**
 * Full-width auto-playing hero carousel. Routes on `frontEndComponent`
 * (switch-case) to a presentational variant. See `components/ARCHITECTURE.md`.
 */
export function HeroSlider({ section }: HeroSliderProps) {
  switch (section.frontEndComponent) {
    case "Split Image Left / Content Right":
      return <SplitImageLeftContentRight section={section} />;
    default:
      return <SplitImageLeftContentRight section={section} />;
  }
}
