import type { NavigationSection } from "@/lib/sections/types";
import { NavigationDefault } from "./NavigationDefault";

type NavigationProps = { section: NavigationSection };

export function Navigation({ section }: NavigationProps) {
  switch (section.frontEndComponent) {
    case "Default":
      return <NavigationDefault section={section} />;
    default:
      return <NavigationDefault section={section} />;
  }
}
