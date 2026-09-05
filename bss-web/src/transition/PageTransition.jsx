import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocation } from "react-router-dom";

import logo from "../assets/logo-plain.png";
import { GateContext } from "./sceneGate.js";

// A fade between pages, and separately a loading screen for the hero. Two plain
// things that do not know about each other.
//
// The one non-obvious bit is the scroll reset: it has to be instant, and it has
// to happen on exit-complete. It used to run with `behavior: "smooth"` on every
// pathname change, which animated *during* the fade, so the outgoing page visibly
// slid upward as it dissolved. That, not the fade, was what looked broken.

const EASE = [0.16, 1, 0.3, 1];
const FADE = 0.22;

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
      <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : FADE, ease: EASE }}
        >
          {children(location)}
        </motion.div>
      </AnimatePresence>
    </GateContext.Provider>
  );
}
