"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

type SliderProps = {
  children: ReactNode[];
  /** Items visible per page. Hero = 1, Explore = 3–4. */
  slidesPerView?: number;
  autoplay?: boolean;
  /** Autoplay interval in ms. */
  interval?: number;
  pauseOnHover?: boolean;
  className?: string;
  ariaLabel?: string;
  /**
   * Arrow placement. "sides" = buttons vertically centered on each edge of the
   * track (Explore). "bottom-left" = the two arrows grouped below the track on
   * the left (Hero).
   */
  navPlacement?: "sides" | "bottom-left";
  /** Arrow styling. "solid" = white circle w/ brand color; "light" = purple square w/ thin white chevron. */
  navVariant?: "solid" | "light";
  /**
   * When true (with `navPlacement="sides"`), the arrows sit just *outside* the
   * track and only appear at `lg`+ — matching the live "center-…-out" slidenav.
   */
  arrowsOutset?: boolean;
  /** Whether to render the dot pagination below the track. */
  showDots?: boolean;
  /** Slide transition duration in ms. */
  durationMs?: number;
  /** CSS transition timing function for the slide. */
  easing?: string;
  /** Utility classes controlling the horizontal gap padding on each slide. */
  itemGapClass?: string;
};

function Arrow({ dir, variant }: { dir: "prev" | "next"; variant: "solid" | "light" }) {
  if (variant === "light") {
    // tall, thin chevron (matches the live UIkit slidenav icon)
    return (
      <svg width="14" height="24" viewBox="0 0 14 24" fill="none" aria-hidden="true">
        <polyline
          points={dir === "prev" ? "12.775,1 1.225,12 12.775,23" : "1.225,1 12.775,12 1.225,23"}
          stroke="currentColor"
          strokeWidth="1.4"
          fill="none"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path
        d={dir === "prev" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Carousel shell: a horizontal track of slides with prev/next arrows, dot
 * pagination and optional autoplay (pauseOnHover). One "page" advances by
 * `slidesPerView` items. Used by Hero and Explore.
 */
export function Slider({
  children,
  slidesPerView = 1,
  autoplay = false,
  interval = 5000,
  pauseOnHover = true,
  className = "",
  ariaLabel = "Carousel",
  navPlacement = "sides",
  navVariant = "solid",
  arrowsOutset = false,
  showDots = true,
  durationMs = 500,
  easing = "ease-in-out",
  itemGapClass = "px-2 first:pl-0 last:pr-0",
}: SliderProps) {
  const count = children.length;
  const pages = Math.max(1, Math.ceil(count / slidesPerView));
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (next: number) => setPage(((next % pages) + pages) % pages),
    [pages]
  );

  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (!autoplay || paused || pages <= 1) return;
    timer.current = setInterval(() => setPage((p) => (p + 1) % pages), interval);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [autoplay, paused, pages, interval]);

  const itemBasis = useMemo(() => `${100 / slidesPerView}%`, [slidesPerView]);

  const arrowClass =
    navVariant === "light"
      ? "rounded-[5px] bg-[var(--brand-primary)]/90 text-white/70 transition-colors hover:bg-[var(--brand-primary)] hover:text-white"
      : "rounded-full bg-white/90 text-[var(--brand-primary)] shadow-md transition-colors hover:bg-white";

  return (
    <div
      className={`relative ${className}`}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
    >
      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex"
            style={{
              transform: `translateX(-${page * 100}%)`,
              transition: `transform ${durationMs}ms ${easing}`,
            }}
          >
            {children.map((child, i) => (
              <div key={i} className={`shrink-0 ${itemGapClass}`} style={{ flexBasis: itemBasis, maxWidth: itemBasis }}>
                {child}
              </div>
            ))}
          </div>
        </div>

        {pages > 1 && navPlacement === "sides" && (
          <>
            <button
              type="button"
              aria-label="Previous"
              onClick={() => go(page - 1)}
              className={`absolute top-1/2 z-10 h-10 w-10 -translate-y-1/2 items-center justify-center ${
                arrowsOutset ? "hidden lg:flex -left-[45px]" : "flex left-2"
              } ${arrowClass}`}
            >
              <Arrow dir="prev" variant={navVariant} />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => go(page + 1)}
              className={`absolute top-1/2 z-10 h-10 w-10 -translate-y-1/2 items-center justify-center ${
                arrowsOutset ? "hidden lg:flex -right-[45px]" : "flex right-2"
              } ${arrowClass}`}
            >
              <Arrow dir="next" variant={navVariant} />
            </button>
          </>
        )}

        {pages > 1 && navPlacement === "bottom-left" && (
          <div className="absolute bottom-5 left-5 z-10 flex items-center gap-[10px]">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => go(page - 1)}
              className={`flex h-10 w-10 items-center justify-center ${arrowClass}`}
            >
              <Arrow dir="prev" variant={navVariant} />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => go(page + 1)}
              className={`flex h-10 w-10 items-center justify-center ${arrowClass}`}
            >
              <Arrow dir="next" variant={navVariant} />
            </button>
          </div>
        )}
      </div>

      {pages > 1 && (
        <>
          {showDots && (
            <ul className="mt-6 flex items-center justify-center gap-2">
              {Array.from({ length: pages }).map((_, i) => (
                <li key={i}>
                  <button
                    type="button"
                    aria-label={`Go to slide ${i + 1}`}
                    aria-current={i === page}
                    onClick={() => go(i)}
                    className={`block h-2.5 w-2.5 rounded-full transition-colors ${
                      i === page ? "bg-[var(--brand-primary)]" : "bg-[var(--brand-primary)]/30"
                    }`}
                  />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
