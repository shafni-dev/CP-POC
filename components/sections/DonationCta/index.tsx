import type { DonationCtaSection } from "@/lib/sections/types";
import { SplitContentLeftImageRight } from "./SplitContentLeftImageRight";

type DonationCtaProps = { section: DonationCtaSection };

export function DonationCta({ section }: DonationCtaProps) {
  switch (section.frontEndComponent) {
    case "Split Content Left / Image Right":
      return <SplitContentLeftImageRight section={section} />;
    default:
      return <SplitContentLeftImageRight section={section} />;
  }
}
