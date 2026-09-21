import { useEffect } from "react";
import { useMotionValue } from "framer-motion";

// Progress (0->1) through the hero's h-screen height. Hand-rolled rather than
// framer-motion's useScroll(): both the target-ref and window-level variants of
// useScroll left scrollYProgress unready until the user's first real scroll/resize
// event, which (fed into the 3D camera position and the text's opacity transform)
// meant the whole hero rendered blank on initial load. A plain scroll listener has
// no such gap — the starting value is computed synchronously on first render.
//
// Two distances, deliberately different.
//
// SUNSET_VH is how far you scroll to play the sunset and the camera's drift. It
// was 0.6 and read as sluggish — you had to push through it — so it is 0.4.
//
// TEXT_TRACK_VH is the hero copy's own track (see Landing.jsx): a track that tall
// with the copy pinned inside it via position:sticky, so the copy holds still for
// (TEXT_TRACK_VH - 1) viewports while it fades. It did not shrink with the sunset,
// because tying the fade to the faster sunset cleared the headline off the screen
// before anyone had read it, and it was then lengthened — 1.6, 1.9, 2.8 — at the
// request of the person running the project so the headline holds longer, and cut
// back to 2.6 when that hold read as too long. Must match the track's height in
// Landing.jsx.
//
// The copy's track outruns the descent, which forced the exit window below to move
// (see EXIT_START_VH). 2.56 is the floor: the descent ends where the copy unpins,
// at (TEXT_TRACK_VH - 1), and its start cannot precede the sunset's end at
// SUNSET_VH, so a shorter track clamps the exit window short of EXIT_WINDOW_VH —
// and that window's length is the rate match between the dune and the copy printed
// on it, not a preference.
const SUNSET_VH = 0.4;
const TEXT_TRACK_VH = 2.6;

// One viewport height, in the same unit the layout uses: CSS `100vh`, measured.
//
// Not window.innerHeight. On a phone, innerHeight grows and shrinks as the
// browser's address bar slides away and back — which it does precisely while
// someone is scrolling the hero — but `vh` is pinned to the largest viewport and
// does not move. Every track, stage and sticky element in Landing.jsx is sized in
// vh, so dividing by innerHeight made progress jump by the bar's height (~8% of the
// hero's range on an iPhone) at the moment the bar moved, and the camera jumped
// with it.
//
// Cached, because this is read on every scroll event and measuring forces layout.
// Invalidated on resize, which is the only thing that can change what 100vh is.
let viewportPx = null;

function viewportHeight() {
  if (viewportPx !== null) return viewportPx;
  if (typeof document === "undefined" || !document.body) return 800;
  const probe = document.createElement("div");
  probe.style.cssText =
    "position:absolute;top:0;left:0;width:0;height:100vh;visibility:hidden;pointer-events:none";
  document.body.appendChild(probe);
  const measured = probe.offsetHeight;
  probe.remove();
  viewportPx = measured || window.innerHeight || 800;
  return viewportPx;
}

function computeProgress() {
  if (typeof window === "undefined") return 0;
  return Math.min(1, Math.max(0, window.scrollY / (SUNSET_VH * viewportHeight())));
}

function computeTextProgress() {
  if (typeof window === "undefined") return 0;
  const pinDistance = (TEXT_TRACK_VH - 1) * viewportHeight();
  return Math.min(1, Math.max(0, window.scrollY / pinDistance));
}

// The scene does not stop at the hero. It stays pinned behind the section that
// follows and dissolves into the page there, so that there is no boundary to
// transition across — by the time the reader is into "What is BSS?", the canvas
// has already become the page color and simply stops mattering.
//
// Measured from the top of the document in viewport heights. It runs while the
// section below scrolls up over it.
//
// It does not start the moment the sunset finishes (0.4). The canvas stops being
// pinned at the end of the hero copy's track, (TEXT_TRACK_VH - 1) viewports, and
// the descent has to land exactly there — land earlier and the copy below slides
// over a frozen dune; stretch the window to reach it and the dune and the copy
// move at different speeds (see the arithmetic below). So the window keeps its
// length and slides later instead: the scene holds, sunset done, for the stretch
// between 0.4 and the window's start, which is while the headline is still up
// being read.
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
const EXIT_WINDOW_VH = 1.16;
const EXIT_END_VH = TEXT_TRACK_VH - 1;
const EXIT_START_VH = Math.max(SUNSET_VH, EXIT_END_VH - EXIT_WINDOW_VH);

function computeExit() {
  if (typeof window === "undefined") return 0;
  const vh = viewportHeight();
  const start = EXIT_START_VH * vh;
  const end = EXIT_END_VH * vh;
  return Math.min(1, Math.max(0, (window.scrollY - start) / (end - start)));
}

// Shared by both hooks below so a component can subscribe to one phase without
// paying for a second scroll listener it does not read.
//
// Set synchronously in the scroll event, not deferred to a requestAnimationFrame
// of its own. The 3D scene reads this value from inside its render loop, and that
// loop's callback for the coming frame was queued a frame ago — so a callback
// queued *during* the scroll event runs after it, and the scene drew every frame
// from the previous frame's scroll position. Scroll events are dispatched before
// animation callbacks in the same frame, so setting the value here means the scene
// and the page draw from the same position. It is cheap: scrollY does not force
// layout, and the viewport height is cached.
function useScrollDriven(compute) {
  const value = useMotionValue(compute());

  useEffect(() => {
    const update = () => value.set(compute());
    const onResize = () => {
      viewportPx = null;
      update();
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, [value, compute]);

  return value;
}

export function useSceneExitProgress() {
  return useScrollDriven(computeExit);
}

// The hero copy's pin-and-fade, over its own longer track. See TEXT_TRACK_VH.
export function useHeroTextProgress() {
  return useScrollDriven(computeTextProgress);
}

export default function useHeroScrollProgress() {
  return useScrollDriven(computeProgress);
}
