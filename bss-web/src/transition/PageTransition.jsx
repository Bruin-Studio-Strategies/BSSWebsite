import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocation } from "react-router-dom";

import logo from "../assets/logo-plain.png";
import { GateContext } from "./sceneGate.js";

// A cross-fade between pages, and separately a loading screen for the hero. Two
// plain things that do not know about each other.
//
// **Both pages are on screen at once.** `mode="wait"` — the obvious way to write
// this, and what was here before — is out, *then* in: it unmounts the old page
// before mounting the new one, so there is necessarily a stretch in the middle
// with nothing on screen. However short the durations, it reads as a fade to
// blank gradient, a pause, and a separate fade back. The two pages are stacked in
// the same CSS grid cell instead, so the outgoing one is still there fading down
// while the incoming one is fading up. One dissolve, no gap.
//
// The scroll reset is instant and happens at the moment of navigation. It used to
// run with `behavior: "smooth"`, which animated *during* the fade, so the
// outgoing page visibly slid upward as it dissolved.

const EASE = [0.16, 1, 0.3, 1];
const FADE = 0.34;

const GRADIENT_BG = "linear-gradient(#3D3C95, 20%, #0a0d3d)";

// How long a load has to run before it admits to being one. Under this, a spinner
// is a flash of anxiety on a machine that was fine.
const PATIENCE_MS = 450;

// Once the loading screen is up it stays up this long, so a hero that reports
// itself ready almost immediately cannot make it blink — what shows through a
// blink is the flat stand-in underneath, which is the old 2024 hero.
const MIN_COVER_MS = 700;

// A gate that never opens must not trap the page: a WebGL context that dies
// mid-compile would otherwise leave the loading screen up forever.
const GATE_TIMEOUT_MS = 9000;

function LoadingScreen({ visible, held, reduced }) {
  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          // Portaled to <body> because the hero's container carries a CSS
          // mask-image, and Chromium mis-composites a position:fixed sibling
          // beneath a masked element in the same subtree whatever the z-index says.
          className="pointer-events-none fixed inset-0 z-[999] flex flex-col items-center justify-center gap-6"
          style={{ background: GRADIENT_BG }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.15 : 0.45, ease: EASE }}
        >
          <motion.div
            className="flex flex-col items-center gap-6"
            initial={false}
            animate={{ opacity: held ? 1 : 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <motion.img
              src={logo}
              alt=""
              className="h-16 w-16 sm:h-20 sm:w-20"
              animate={reduced ? { rotate: 0 } : { rotate: 360 }}
              transition={reduced ? undefined : { duration: 1.4, repeat: Infinity, ease: "linear" }}
            />
            <div className="h-1 w-40 overflow-hidden rounded-full bg-white/15 sm:w-48">
              <motion.div
                className="h-full w-1/3 rounded-full bg-white/80"
                animate={reduced ? { x: "0%" } : { x: ["-100%", "300%"] }}
                transition={
                  reduced ? undefined : { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
                }
              />
            </div>
          </motion.div>

          <span className="sr-only" role="status">
            {held ? "Loading" : ""}
          </span>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default function PageTransition({ children }) {
  const location = useLocation();
  const reduced = !!useReducedMotion();

  // At navigation, not on exit-complete: the outgoing page is still visible
  // through the dissolve, so waiting would mean the incoming one spends the whole
  // fade sitting at the old page's scroll offset.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const [gateCount, setGateCount] = useState(0);
  const [floorHeld, setFloorHeld] = useState(true);
  const [held, setHeld] = useState(false);
  const gatesTimedOut = useRef(false);

  const registerGate = useCallback(() => {
    setGateCount((n) => n + 1);
    return () => setGateCount((n) => Math.max(0, n - 1));
  }, []);

  const gated = gateCount > 0 && !gatesTimedOut.current;
  const loading = gated || floorHeld;

  // Arming and expiring the floor are separate effects on purpose. Doing both in
  // one, keyed on the gate, meant that the moment the gate opened its cleanup
  // cancelled the pending timer and the branch that would have started a new one
  // was skipped — so the flag stuck on and the loading screen never left.
  useEffect(() => {
    if (gated) setFloorHeld(true);
  }, [gated]);

  useEffect(() => {
    if (!floorHeld) return undefined;
    const id = setTimeout(() => setFloorHeld(false), MIN_COVER_MS);
    return () => clearTimeout(id);
  }, [floorHeld]);

  useEffect(() => {
    if (!gated) {
      setHeld(false);
      return undefined;
    }
    const id = setTimeout(() => setHeld(true), PATIENCE_MS);
    return () => clearTimeout(id);
  }, [gated]);

  useEffect(() => {
    if (gateCount === 0) return undefined;
    const id = setTimeout(() => {
      gatesTimedOut.current = true;
      setGateCount(0);
    }, GATE_TIMEOUT_MS);
    return () => clearTimeout(id);
  }, [gateCount]);

  return (
    <GateContext.Provider value={registerGate}>
      <LoadingScreen visible={loading} held={held} reduced={reduced} />
      {/* One grid cell, every page in it. Stacking is what allows the old and new
          pages to overlap during the dissolve; the cell also takes the height of
          the taller of the two, so nothing collapses mid-transition. */}
      <div className="grid grid-cols-1 grid-rows-1">
        <AnimatePresence initial={false}>
          <motion.div
            key={location.pathname}
            style={{ gridArea: "1 / 1" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : FADE, ease: EASE }}
          >
            {children(location)}
          </motion.div>
        </AnimatePresence>
      </div>
    </GateContext.Provider>
  );
}
