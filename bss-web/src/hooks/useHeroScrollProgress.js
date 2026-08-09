import { useEffect } from "react";
import { useMotionValue } from "framer-motion";

// Progress (0->1) through the hero's h-screen height. Hand-rolled rather than
// framer-motion's useScroll(): both the target-ref and window-level variants of
// useScroll left scrollYProgress unready until the user's first real scroll/resize
// event, which (fed into the 3D camera position and the text's opacity transform)
// meant the whole hero rendered blank on initial load. A plain scroll listener has
// no such gap — the starting value is computed synchronously on first render.
// The hero (see Landing.jsx) sits inside a "sticky" wrapper: a tall outer track
// (TRACK_HEIGHT_VH * 100vh) with the actual hero pinned via position:sticky
// inside it, so it stays fully on screen — sky included — for the whole
// animation instead of scrolling away mid-sequence like plain in-flow content
// would. The sticky element releases once you've scrolled past
// (TRACK_HEIGHT_VH - 1) viewport-heights, so that's the scroll distance progress
// maps across. Must match the outer track's height in Landing.jsx.
const TRACK_HEIGHT_VH = 1.6;

function computeProgress() {
  if (typeof window === "undefined") return 0;
  const innerHeight = window.innerHeight || 800;
  const pinDistance = (TRACK_HEIGHT_VH - 1) * innerHeight;
  return Math.min(1, Math.max(0, window.scrollY / pinDistance));
}

export default function useHeroScrollProgress() {
  const progress = useMotionValue(computeProgress());

  useEffect(() => {
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        progress.set(computeProgress());
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

  return progress;
}
