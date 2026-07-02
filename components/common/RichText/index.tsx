import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import type { RichTextContent } from "@/lib/sections/types";

type RichTextProps = {
  content: RichTextContent;
  className?: string;
};

/**
 * Renders a Contentful Rich Text field (`body { json }`). Shared so every
 * section renders RTE copy the same way. Returns null when empty.
 */
export function RichText({ content, className }: RichTextProps) {
  if (!content?.json) return null;
  return <div className={className}>{documentToReactComponents(content.json)}</div>;
}
