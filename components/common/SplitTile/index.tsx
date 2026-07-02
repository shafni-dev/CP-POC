import type { ReactNode } from "react";
import type { ImageEntry } from "@/lib/sections/types";

type SplitTileProps = {
  /** Background image that fills one half of the tile. */
  image: ImageEntry | null;
  /** Which half the image occupies; the panel (`children`) takes the other. */
  imageSide?: "left" | "right";
  /** CSS colour laid over the image as a tint (token-driven, e.g. a `color-mix`). */
  overlayColor?: string;
  /** Anchor id for in-page navigation. */
  sectionId?: string | null;
  /** Extra classes on the outer `<section>` (vertical rhythm, background). */
  className?: string;
  /** The colour-panel content rendered in the non-image half. */
  children: ReactNode;
};

/**
 * A full-width split tile: a cover background image in one half and a colour
 * panel in the other, sharing a collapsed gutter inside the xlarge container
 * (`.site-container`). `md:items-stretch` matches both halves to the taller
 * one, so the image fills the panel's natural height. `imageSide` mirrors the
 * layout — used by Impact Stats (image left) and Donation (image right).
 */
export function SplitTile({
  image,
  imageSide = "left",
  overlayColor,
  sectionId,
  className = "",
  children,
}: SplitTileProps) {
  const imageCell = (
    <div
      className="relative min-h-[320px] bg-cover bg-center md:min-h-0"
      style={image?.url ? { backgroundImage: `url(${image.url})` } : undefined}
      role="img"
      aria-label={image?.alt ?? undefined}
    >
      {overlayColor && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundColor: overlayColor }}
        />
      )}
    </div>
  );

  const panelCell = <div className="min-w-0">{children}</div>;

  return (
    <section id={sectionId ?? undefined} className={className}>
      <div className="site-container">
        <div className="grid grid-cols-1 md:grid-cols-2 md:items-stretch">
          {imageSide === "left" ? (
            <>
              {imageCell}
              {panelCell}
            </>
          ) : (
            <>
              {panelCell}
              {imageCell}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
