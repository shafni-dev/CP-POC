import type { VideoEntry } from "@/lib/sections/types";

type VideoProps = {
  video: VideoEntry | null | undefined;
  className?: string;
};

/**
 * YouTube (privacy-enhanced, nocookie) embed in a 16:9 responsive frame with
 * subtly rounded corners and an optional caption. Mirrors the source site's
 * `.videoborderrounded` treatment (rounded, no visible border).
 */
export function Video({ video, className = "" }: VideoProps) {
  if (!video?.youtubeId) return null;
  const title = video.videoTitle ?? "YouTube video player";

  return (
    <figure className={className}>
      <div className="relative aspect-video overflow-hidden rounded-lg">
        <iframe
          className="absolute inset-0 h-full w-full border-0"
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      {video.caption && (
        <figcaption className="mt-[40px] text-[16.5px] leading-[1.5] text-[var(--text-default)] font-[family-name:var(--font-poppins)]">
          {video.caption}
        </figcaption>
      )}
    </figure>
  );
}
