import { useEffect, useRef } from "react";
import { useMotionValue } from "framer-motion";

// 0 -> 1 as a card crosses the viewport.
//
// The motifs' actors used to move only on hover, which meant they never moved
// at all on touch — no hover, no motion, six static drawings for most visitors.
// Driving them from scroll position instead means every device sees the motion,
// and it plays while the card is being read rather than only when pointed at.
const START_VH = 0.85;
const END_VH = 0.35;

export default function useCardProgress(enabled = true) {
  const ref = useRef(null);
  const progress = useMotionValue(enabled ? 0 : 1);

  useEffect(() => {
    // Reduced motion parks the actor at its finished position: the drawing still
    // reads correctly, it just does not travel.
    if (!enabled) {
      progress.set(1);
      return undefined;
    }

    let raf = null;
    const measure = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh * (START_VH - END_VH);
      if (total <= 0) return;
      const p = (vh * START_VH - rect.top) / total;
      progress.set(Math.min(1, Math.max(0, p)));
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        measure();
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
  }, [enabled, progress]);

  return { ref, progress };
}
