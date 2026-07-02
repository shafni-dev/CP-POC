import type { NewsletterSignupSection } from "@/lib/sections/types";
import { NewsletterSignupDefault } from "./NewsletterSignupDefault";

type NewsletterSignupProps = { section: NewsletterSignupSection };

export function NewsletterSignup({ section }: NewsletterSignupProps) {
  switch (section.frontEndComponent) {
    case "Default":
      return <NewsletterSignupDefault section={section} />;
    default:
      return <NewsletterSignupDefault section={section} />;
  }
}
