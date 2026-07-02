import type { ImpactStatsSection } from "@/lib/sections/types";
import { ParallaxImageStats } from "./ParallaxImageStats";

type ImpactStatsProps = { section: ImpactStatsSection };

export function ImpactStats({ section }: ImpactStatsProps) {
  switch (section.frontEndComponent) {
    case "Parallax Image Left / Stats Right":
      return <ParallaxImageStats section={section} />;
    default:
      return <ParallaxImageStats section={section} />;
  }
}
