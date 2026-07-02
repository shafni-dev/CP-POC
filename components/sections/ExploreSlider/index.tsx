import type { ExploreSliderSection } from "@/lib/sections/types";
import { CategoryCardsSlider } from "./CategoryCardsSlider";

type ExploreSliderProps = { section: ExploreSliderSection };

/**
 * Centered "Explore" section: eyebrow + H2 over a horizontal slider of linked
 * category cards. Routes on `frontEndComponent` (switch-case) to a
 * presentational variant. See `components/ARCHITECTURE.md`.
 */
export function ExploreSlider({ section }: ExploreSliderProps) {
  switch (section.frontEndComponent) {
    case "Category Cards Slider":
      return <CategoryCardsSlider section={section} />;
    default:
      return <CategoryCardsSlider section={section} />;
  }
}
