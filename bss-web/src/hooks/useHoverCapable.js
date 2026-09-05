import { useEffect, useState } from "react";

// Whether the device has a real pointer that can hover. A phone does not, so any
// interaction gated on hover simply never happens there — which on the clients
// page meant six motifs that were drawn but never animated.
//
// Defaults to true so a hover-driven component behaves normally during the first
// render on a desktop, and corrects itself in the effect. `matchMedia` is watched
// rather than read once, because a tablet with a keyboard attached can change
// answer mid-session.
export default function useHoverCapable() {
  const [canHover, setCanHover] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;

    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setCanHover(query.matches);
    sync();

    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return canHover;
}
