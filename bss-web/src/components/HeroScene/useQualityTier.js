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
// `dpr` is the ceiling on the backing store. A modern phone reports a device
// pixel ratio of 3, so every step of this cap is a large change in fragments: at
// 1.5 an iPhone 14 renders 589x1278 (750k pixels), at 1.25 it renders 491x1065
// (520k) — 30% less work per frame for the whole scene. The terrain fills the
// frame, so it pays that cost on every pixel.
//
// `antialias` is MSAA, which multiplies that pixel cost again and is the first
// thing to drop on a small screen: at this density the terrain's wireframe is
// already under a pixel per line, and the tiled GPUs in phones pay more for MSAA
// than desktop parts do.
const TIERS = {
  low: { segments: [56, 32], dpr: [1, 1.25], antialias: false },
  mid: { segments: [84, 46], dpr: [1, 1.5], antialias: true },
  high: { segments: [98, 55], dpr: [1, 1.5], antialias: true },
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
