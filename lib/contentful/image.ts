import type { ImageEntry } from "@/lib/sections/types";

export type RawImage = {
  sys: { id: string };
  alt?: string | null;
  loading?: string | null;
  asset?: {
    url?: string | null;
    title?: string | null;
    description?: string | null;
    width?: number | null;
    height?: number | null;
    contentType?: string | null;
  } | null;
} | null;

export function mapImage(raw: RawImage): ImageEntry | null {
  if (!raw || !raw.asset?.url) return null;
  return {
    id: raw.sys.id,
    url: raw.asset.url,
    alt: raw.alt ?? raw.asset.description ?? raw.asset.title ?? "",
    width: raw.asset.width ?? null,
    height: raw.asset.height ?? null,
    contentType: raw.asset.contentType ?? null,
    loading: raw.loading === "eager" ? "eager" : "lazy",
  };
}
