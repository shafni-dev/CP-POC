import type { CountryCardsSection } from "@/lib/sections/types";
import { ThreeColumnCards } from "./ThreeColumnCards";

type CountryCardsProps = { section: CountryCardsSection };

export function CountryCards({ section }: CountryCardsProps) {
  switch (section.frontEndComponent) {
    case "Three Column Cards":
      return <ThreeColumnCards section={section} />;
    default:
      return <ThreeColumnCards section={section} />;
  }
}
