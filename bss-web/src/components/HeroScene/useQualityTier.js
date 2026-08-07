import { useEffect, useState } from "react";

// Segment counts are the ceiling from the plan (~60x40) on desktop,
// scaled down on smaller viewports since mobile GPUs are the tightest constraint.
const TIERS = {
  low: [22, 14],
  mid: [40, 26],
  high: [58, 38],
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
