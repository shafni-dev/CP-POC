import type { MissionStatementSection } from "@/lib/sections/types";
import { MissionStatementDefault } from "./MissionStatementDefault";

type MissionStatementProps = { section: MissionStatementSection };

export function MissionStatement({ section }: MissionStatementProps) {
  switch (section.frontEndComponent) {
    case "Default":
      return <MissionStatementDefault section={section} />;
    default:
      return <MissionStatementDefault section={section} />;
  }
}
