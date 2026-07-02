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
};

function Arrow({ dir }: { dir: "prev" | "next" }) {
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

  return (
    <div
      className={`relative ${className}`}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
    >
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${page * 100}%)` }}
        >
          {children.map((child, i) => (
            <div key={i} className="shrink-0 px-2 first:pl-0 last:pr-0" style={{ flexBasis: itemBasis, maxWidth: itemBasis }}>
              {child}
            </div>
          ))}
        </div>
      </div>

      {pages > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous"
            onClick={() => go(page - 1)}
            className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[var(--brand-primary)] shadow-md transition-colors hover:bg-white"
          >
            <Arrow dir="prev" />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => go(page + 1)}
            className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[var(--brand-primary)] shadow-md transition-colors hover:bg-white"
          >
            <Arrow dir="next" />
          </button>

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
        </>
      )}
    </div>
  );
}
