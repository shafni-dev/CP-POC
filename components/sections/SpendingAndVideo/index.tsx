import type { SpendingAndVideoSection } from "@/lib/sections/types";
import { PieChartLeftVideoRight } from "./PieChartLeftVideoRight";

type SpendingAndVideoProps = { section: SpendingAndVideoSection };

export function SpendingAndVideo({ section }: SpendingAndVideoProps) {
  switch (section.frontEndComponent) {
    case "Pie Chart Left / Video Right":
      return <PieChartLeftVideoRight section={section} />;
    default:
      return <PieChartLeftVideoRight section={section} />;
  }
}
