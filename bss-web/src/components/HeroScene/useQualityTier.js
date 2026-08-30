import { useEffect, useState } from "react";

// Segment counts are scaled down on smaller viewports since mobile GPUs are the
// tightest constraint. The width counts are tied to TERRAIN_WIDTH: the field is 44
// units across and these keep cells at roughly 0.45 units square, matching the
// depth resolution. Widen the terrain again and these have to move with it, or the
// mesh stretches and the wireframe stops reading as a square grid.
const TIERS = {
  low: [37, 20],
  mid: [68, 38],
  high: [98, 55],
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
