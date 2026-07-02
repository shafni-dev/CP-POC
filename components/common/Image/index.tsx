import type { ImageEntry } from "@/lib/sections/types";

type ImageProps = {
  image: ImageEntry | null | undefined;
  className?: string;
  /** `sizes` attribute for the webp source. */
  sizes?: string;
  /** Candidate widths for the webp srcset. */
  widths?: number[];
  /** Force eager loading (e.g. above-the-fold hero). Defaults to the entry's `loading`. */
  eager?: boolean;
};

const toAbsolute = (url: string) => (url.startsWith("//") ? `https:${url}` : url);

const withParams = (url: string, params: string) => {
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}${params}`;
};

/**
 * Responsive image rendered as <picture>: a webp `srcset` (via the Contentful
 * Images API) plus a jpeg/png fallback `<img>` with explicit width/height, alt
 * and loading. SVGs are emitted as a plain <img> (no rasterisation).
 */
export function Image({
  image,
  className,
  sizes = "(min-width: 1200px) 1200px",
  widths = [768, 1024, 1200],
  eager,
}: ImageProps) {
  if (!image?.url) return null;

  const base = toAbsolute(image.url);
  const isSvg = image.contentType === "image/svg+xml" || base.endsWith(".svg");
  // The webp `srcset` is generated via the Contentful Images API, so only
  // transform ctfassets URLs; anything else (or an SVG) renders as a plain img.
  const isContentful = base.includes("ctfassets.net");
  const loading = (eager ?? image.loading === "eager") ? "eager" : "lazy";
  const alt = image.alt ?? "";
  const width = image.width ?? undefined;
  const height = image.height ?? undefined;

  if (isSvg || !isContentful) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={base}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        className={className}
      />
    );
  }

  const largest = widths[widths.length - 1];
  const webpSrcSet = widths
    .map((w) => `${withParams(base, `fm=webp&w=${w}&q=80`)} ${w}w`)
    .join(", ");
  const fallback = withParams(base, `fm=jpg&w=${largest}&q=80`);

  return (
    <picture>
      <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
      <img
        src={fallback}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        className={className}
      />
    </picture>
  );
}
