"use client";

import { useEffect, useRef } from "react";

type ParallaxImageProps = {
  src: string;
  alt?: string | null;
  /** Total horizontal travel in px (matches UIkit `uk-parallax="bgx"`). */
  bgx?: number;
  className?: string;
};

/**
 * Full-cover background image with a horizontal parallax tied to scroll,
 * reproducing the source's `uk-parallax="bgx: -50; easing: 0"` on the
 * donation image tile. The background is anchored top-center and its
 * horizontal position eases linearly from +bgx/2 to -bgx/2 as the element
 * travels through the viewport. Respects `prefers-reduced-motion`.
 */
export function ParallaxImage({
  src,
  alt,
  bgx = 50,
  className = "",
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      // progress: 0 when the element's top hits the bottom of the viewport,
      // 1 when its bottom leaves the top — clamped to [0, 1].
      const progress = (vh - rect.top) / (vh + rect.height);
      const clamped = Math.min(1, Math.max(0, progress));
      const offset = (0.5 - clamped) * bgx; // +bgx/2 → -bgx/2
      el.style.backgroundPositionX = `calc(50% + ${offset.toFixed(1)}px)`;
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [bgx]);

  return (
    <div
      ref={ref}
      role="img"
      aria-label={alt ?? undefined}
      className={`h-full w-full bg-cover bg-[position:top_center] bg-no-repeat ${className}`}
      style={{ backgroundImage: `url(${src})` }}
    />
  );
}
