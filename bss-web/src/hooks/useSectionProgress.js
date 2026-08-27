import { useEffect, useRef } from "react";
import { useMotionValue } from "framer-motion";

// Progress (0->1) as a section travels through the viewport, without pinning it.
// The whole schedule stays readable at once; the playhead is a reading aid, not
// something the visitor has to scrub through to reach the content. Hand-rolled
// for the same reason as useHeroScrollProgress: framer's useScroll reports
// nothing until the first real scroll or resize event, which would leave the
// playhead parked at 0 on load.
//
// The two constants are a pacing pair, tuned against the rendered section:
// START_VH is where progress begins (the section's top crossing 20% of the
// viewport), and the GAP between them sets the speed. Starting at the viewport's
// bottom edge means the playhead is already past week 0 before the first row is
// on screen, so it never points at the row being read; starting too close to the
// top leaves it parked, then racing. A wider gap subtracts more travel and moves
// faster, a narrower gap moves slower — 0.2/0.7 is the middle ground.
const START_VH = 0.2;
const END_VH = 0.7;

function computeProgress(el) {
  if (!el || typeof window === "undefined") return 0;
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight;
  const startY = vh * START_VH;
  const total = rect.height - vh * (END_VH - START_VH);
  // A section shorter than the travel window has no room to scrub through;
  // treat it as complete rather than dividing by zero or a negative.
  if (total <= 0) return rect.top <= startY ? 1 : 0;
  return Math.min(1, Math.max(0, (startY - rect.top) / total));
}

export default function useSectionProgress() {
  const ref = useRef(null);
  const progress = useMotionValue(0);

  useEffect(() => {
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        progress.set(computeProgress(ref.current));
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

  return { ref, progress };
}
