import { useEffect, useRef } from "react";
import { useMotionValue } from "framer-motion";

// Progress (0->1) across exactly the same scroll distance a CSS `sticky top-24`
// element pins for inside a taller track: 0 when the track's top reaches the pin
// point (viewport top + PIN_OFFSET), 1 when the track's bottom reaches the bottom
// edge of the pinned element itself. That's `track.height - pinned.height` of scroll
// distance, NOT `track.height - innerHeight` — using viewport height there (an
// earlier version of this hook did) desyncs from the real release point on any
// viewport where the pinned element isn't exactly as tall as the screen, finishing
// the animation early and leaving it idling for the rest of the scroll. Hand-rolled
// (not framer's useScroll) for the same reason as useHeroScrollProgress — its
// scrollYProgress stays unready until the first real scroll/resize event.
const PIN_OFFSET = 96; // matches the sticky column's top-24 offset in Process.jsx

function computeProgress(trackEl, pinnedEl) {
  if (!trackEl || !pinnedEl || typeof window === "undefined") return 0;
  const trackRect = trackEl.getBoundingClientRect();
  const pinnedHeight = pinnedEl.getBoundingClientRect().height;
  const total = trackRect.height - pinnedHeight;
  if (total <= 0) return 1;
  const scrolled = PIN_OFFSET - trackRect.top;
  return Math.min(1, Math.max(0, scrolled / total));
}

export default function useSectionScrollProgress() {
  const trackRef = useRef(null);
  const pinnedRef = useRef(null);
  const progress = useMotionValue(0);

  useEffect(() => {
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        progress.set(computeProgress(trackRef.current, pinnedRef.current));
        raf = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [progress]);

  return { trackRef, pinnedRef, progress };
}
