import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import { useLocation } from "react-router-dom";

import logo from "../assets/logo-plain.png";
import { GateContext } from "./sceneGate.js";

// A short fade, and nothing else. What made the old one feel wrong was never the
// fade itself:
//
//   - it ran in `AnimatePresence mode="wait"` at 0.5s each way, so a navigation
//     spent most of a second on an empty gradient;
//   - `scrollToTop` used `behavior: "smooth"` and ran *during* the fade, so the
//     outgoing page visibly slid upward as it dissolved;
//   - on the landing page the 3D scene's own splash then arrived on top at z-999
//     after the fade had already started, and left on its own separate timing.
//
// So the fade stays and the three faults go. The swap happens against a deferred
// location while nothing is on screen, the scroll reset is instant because there
// is nothing to watch it, and a page that needs time holds the fade rather than
// running a second transition after it.
//
// There is one moving part, not two. The thing that fades is a full-bleed panel
// painted in the body's own gradient, so fading it up is indistinguishable from
// fading the content out — and because it is already up at the moment the new
// route mounts, a page that needs to load simply keeps it there. Fading the
// content separately would mean the overlay had to fade in *after* the incoming
// hero was already on screen, which is the wrong way round and is what made the
// loading screen disappear.

const EASE = [0.16, 1, 0.3, 1];

// Covering is quicker than revealing: covering answers a click and wants to keep
// up with it, revealing is an arrival and can be watched. Together they are about
// three quarters of a second — slow enough to read as a transition rather than a
// repaint, short enough that clicking through the nav never feels held up.
const OUT = 0.26;
const IN = 0.46;

// Until the terrain has painted there is nothing to show, so the landing page is
// covered by its own gradient rather than by a blank white flash.
const GRADIENT_BG = "linear-gradient(#3D3C95, 20%, #0a0d3d)";

// How long the wait has to run before it admits to being a wait. Under this, a
// spinner is a flash of anxiety on a machine that was fine.
const PATIENCE_MS = 450;

// A gate that never opens must not trap the page — a WebGL context that dies
// mid-compile would otherwise leave the gradient up forever.
const GATE_TIMEOUT_MS = 9000;

// Once the veil is up it stays up this long at minimum. Without a floor, a hero
// that reports itself ready a few milliseconds after mounting makes the veil
// blink — up and straight back down — and what shows through in that blink is
// whatever stand-in was on screen underneath, which on the landing page is the
// old flat hero the redesign replaced.
const MIN_COVER_MS = 700;

function Veil({ visible, held, reduced, onCovered }) {
  return createPortal(
    <motion.div
      // Portaled to <body> because the hero's container carries a CSS mask-image,
      // and Chromium mis-composites a position:fixed sibling beneath a masked
      // element in the same subtree whatever the z-index says.
      className="pointer-events-none fixed inset-0 z-[999] flex flex-col items-center justify-center gap-6"
      style={{ background: GRADIENT_BG }}
      // Mounts covered: the first paint of any visit is the gradient, and the
      // page is revealed from under it once there is something worth revealing.
      initial={{ opacity: 1 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: reduced ? 0.12 : visible ? OUT : IN, ease: EASE }}
      onAnimationComplete={() => {
        if (visible) onCovered();
      }}
      aria-hidden={!visible}
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
            transition={reduced ? undefined : { duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>

      <span className="sr-only" role="status">
        {held ? "Loading" : ""}
      </span>
    </motion.div>,
    document.body
  );
}

/**
 * Wraps the routes. `children` is called with a deferred location, so the swap
 * happens while the page is faded out rather than in front of the visitor.
 */
export default function PageTransition({ children }) {
  const location = useLocation();
  const reduced = !!useReducedMotion();

  const [displayLocation, setDisplayLocation] = useState(location);
  const [leaving, setLeaving] = useState(false);
  const [held, setHeld] = useState(false);

  const [gateCount, setGateCount] = useState(0);
  const gatesTimedOut = useRef(false);

  // The overlay is up from the first paint and stays up for one frame, which is
  // the window a page has to register a gate in. Without that hold there is no
  // commit in which the overlay is both mounted and covering, so a hero that
  // needs three seconds to compile would show three seconds of empty gradient
  // with no loading screen over it.
  const [openingHold, setOpeningHold] = useState(true);
  useEffect(() => {
    const id = requestAnimationFrame(() => setOpeningHold(false));
    return () => cancelAnimationFrame(id);
  }, []);

  const registerGate = useCallback(() => {
    setGateCount((n) => n + 1);
    return () => setGateCount((n) => Math.max(0, n - 1));
  }, []);

  const gated = gateCount > 0 && !gatesTimedOut.current;

  // Held from the moment the veil goes up. Cleared by its own timer rather than
  // by the gate, so a fast release cannot shorten it.
  const [floorHeld, setFloorHeld] = useState(true);
  // Covered while leaving as well, so the veil is already up at the moment the
  // incoming route mounts. That is what lets a page with a gate simply keep it
  // there instead of fading a loading screen in over its own half-drawn hero.
  const covering = openingHold || gated || leaving || floorHeld;

  // A new pathname fades the page out. Comparing pathnames rather than location
  // objects keeps a query-string or hash change from triggering one.
  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) setLeaving(true);
  }, [location, displayLocation]);

  const handleCovered = useCallback(() => {
    if (!leaving) return;
    setDisplayLocation(location);
    // Instant. Smooth scrolling used to run while the pages were cross-fading, so
    // the outgoing page slid upward as it dissolved. There is nothing to watch it
    // now, and nothing to animate for.
    window.scrollTo(0, 0);
    setLeaving(false);
  }, [leaving, location]);

  useEffect(() => {
    if (!(openingHold || gated || leaving)) return undefined;
    setFloorHeld(true);
    const id = setTimeout(() => setFloorHeld(false), MIN_COVER_MS);
    return () => clearTimeout(id);
  }, [openingHold, gated, leaving]);

  // The spinner earns its way in only once the wait has run long enough.
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
      <Veil visible={covering} held={held} reduced={reduced} onCovered={handleCovered} />
      {children(displayLocation)}
    </GateContext.Provider>
  );
}
