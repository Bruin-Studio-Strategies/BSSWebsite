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

// The scene does not stop at the hero. It stays pinned behind the section that
// follows and dissolves into the page there, so that there is no boundary to
// transition across — by the time the reader is into "What is BSS?", the canvas
// has already become the page color and simply stops mattering.
//
// Measured from the top of the document in viewport heights. It starts as the
// sunset finishes (the hero sequence ends at 0.6) and runs while the section
// below scrolls up over it.
//
// The end is arithmetic, not taste. The section below scrolls 1:1 with the wheel;
// the landscape's apparent speed is set by how far the camera falls and how close
// the thing it is falling past is. At a 45-degree vertical field of view a surface
// at distance d rises 1.207 * dy / d screen-heights when the camera drops dy. The
// camera drops 5.2 and the ridge face it lands on sits 6.2 to 4.6 away, mean 5.4:
//
//   1.207 * 5.2 / 5.4 = 1.16 screen-heights of apparent travel
//
// So the window has to be ~1.16 viewports long for the dune and the copy to move
// together. At 0.82 the dune ran 1.4x faster than the text and the two layers
// visibly slid against each other — no amount of easing or lag-tuning touches
// that, because it is a rate mismatch, not a timing one. Change the drop, the
// ridge distance, or the field of view and this has to be recomputed.
const EXIT_START_VH = 0.6;
const EXIT_END_VH = 1.76;

function computeExit() {
  if (typeof window === "undefined") return 0;
  const innerHeight = window.innerHeight || 800;
  const start = EXIT_START_VH * innerHeight;
  const end = EXIT_END_VH * innerHeight;
  return Math.min(1, Math.max(0, (window.scrollY - start) / (end - start)));
}

// Shared by both hooks below so a component can subscribe to one phase without
// paying for a second scroll listener it does not read.
function useScrollDriven(compute) {
  const value = useMotionValue(compute());

  useEffect(() => {
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        value.set(compute());
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
  }, [value, compute]);

  return value;
}

export function useSceneExitProgress() {
  return useScrollDriven(computeExit);
}

export default function useHeroScrollProgress() {
  return useScrollDriven(computeProgress);
}
