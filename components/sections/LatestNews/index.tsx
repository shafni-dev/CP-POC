import type { LatestNewsSection } from "@/lib/sections/types";
import { ThreeColumnBlogCards } from "./ThreeColumnBlogCards";

type LatestNewsProps = { section: LatestNewsSection };

export function LatestNews({ section }: LatestNewsProps) {
  switch (section.frontEndComponent) {
    case "Three Column Blog Cards":
      return <ThreeColumnBlogCards section={section} />;
    default:
      return <ThreeColumnBlogCards section={section} />;
  }
}
