import type { VideoEntry } from "@/lib/sections/types";

export type RawVideo = {
  sys: { id: string };
  youtubeId?: string | null;
  videoTitle?: string | null;
  caption?: string | null;
} | null;

export function mapVideo(raw: RawVideo): VideoEntry | null {
  if (!raw) return null;
  return {
    id: raw.sys.id,
    youtubeId: raw.youtubeId ?? null,
    videoTitle: raw.videoTitle ?? null,
    caption: raw.caption ?? null,
  };
}
