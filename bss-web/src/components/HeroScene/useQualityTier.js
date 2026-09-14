import { useEffect, useState } from "react";

// What the scene costs is decided here, per viewport. Three things move together,
// and the last two matter more on a phone than the first: geometry is cheap next
// to the number of pixels the fragment shader has to fill.
//
// Segment counts are tied to TERRAIN_WIDTH: the field is 44 units across and
// these keep cells at roughly 0.45 units square, matching the depth resolution.
// Widen the terrain again and these have to move with it, or the mesh stretches
// and the wireframe stops reading as a square grid.
//
// `dprSteps` is the ceiling on the backing store, as a ladder from best to
// cheapest. A modern phone reports a device pixel ratio of 3, so every step is a
// large change in fragments: at 1.5 an iPhone 14 renders 589x1278 (750k pixels),
// at 1.25 it renders 491x1065 (520k), at 1 it renders 393x852 (335k). The terrain
// fills the frame, so it pays that cost on every pixel.
//
// The scene starts on the first step and HeroScene walks down the ladder when
// the frame rate cannot hold (see the PerformanceMonitor there). A tier chosen by
// viewport width cannot know the phone is in Low Power Mode, which caps
// requestAnimationFrame at 30fps and throttles the GPU with it — measuring is the
// only way to find that out.
//
// `antialias` is MSAA, on for every tier. It multiplies that pixel cost again,
// and the tiled GPUs in phones pay more for it than desktop parts do — but
// without it the terrain's wireframe and the dune crests stair-step visibly, and
// the person running this project ruled it a must. Cost is recovered from the
// DPR ladder and the 30fps fallback instead, never by dropping this.
//
// `lambert` swaps the terrain's MeshStandardMaterial for MeshLambertMaterial. At
// roughness 0.85 the standard material's specular term is nearly invisible, and
// it is the most expensive thing the fragment shader does. Decided per tier at
// mount and never switched live: a material swap compiles a new shader, which is
// a visible hitch on a phone mid-scroll.
//
// `mediump` runs the terrain's and the far ridge's fragment shaders at medium
// precision (see precision.js). Fixed per tier for the same compile reason.
const TIERS = {
  low: { segments: [56, 32], dprSteps: [1.25, 1, 0.8], antialias: true, lambert: true, mediump: true },
  mid: { segments: [84, 46], dprSteps: [1.5, 1.25, 1], antialias: true, lambert: false, mediump: false },
  high: { segments: [98, 55], dprSteps: [1.5, 1.25, 1], antialias: true, lambert: false, mediump: false },
};

function getTier() {
  if (typeof window === "undefined") return "high";
  const w = window.innerWidth;
  if (w < 576) return "low";
  if (w < 960) return "mid";
  return "high";
}

export default function useQualityTier() {
  const [tier, setTier] = useState(getTier);

  useEffect(() => {
    let frame;
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setTier(getTier()));
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);

  return TIERS[tier];
}
