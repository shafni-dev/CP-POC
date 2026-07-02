import type { VideoEntry } from "@/lib/sections/types";

type VideoProps = {
  video: VideoEntry | null | undefined;
  className?: string;
};

/**
 * YouTube (privacy-enhanced, nocookie) embed in a 16:9 responsive frame with a
 * rounded border and an optional caption.
 */
export function Video({ video, className = "" }: VideoProps) {
  if (!video?.youtubeId) return null;
  const title = video.videoTitle ?? "YouTube video player";

  return (
    <figure className={className}>
      <div className="relative aspect-video overflow-hidden rounded-2xl border-2 border-[var(--brand-primary)]">
        <iframe
          className="absolute inset-0 h-full w-full border-0"
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      {video.caption && (
        <figcaption className="mt-3 text-[15px] text-[var(--text-muted)]">
          {video.caption}
        </figcaption>
      )}
    </figure>
  );
}
