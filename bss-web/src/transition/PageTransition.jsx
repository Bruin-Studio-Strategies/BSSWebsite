import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import { useLocation } from "react-router-dom";

import logo from "../assets/logo-plain.png";
import { GateContext } from "./sceneGate.js";

// One curtain does both jobs on this site: it covers the route change, and it is
// the hero's loading screen.
//
// They used to be two separate things fighting each other. The route change was a
// cross-fade in `mode="wait"` — half a second of the old page dissolving to
// nothing, then half a second of the new one arriving, so for most of a second you
// were looking at an empty gradient. Then, if you had landed on `/`, the 3D
// scene's own splash slammed in on top at z-999 *after* that and faded out
// separately. Two full transitions back to back, the second interrupting the first.
//
// Now there is one object. It slides down over the outgoing page, the route swaps
// underneath it while nothing is visible, and it keeps going down and off the
// bottom. Continuous travel in one direction reads as moving through to the next
// thing; a panel that arrives and then retreats the way it came reads as a door
// that changed its mind. When the destination is the landing page and the terrain
// has not finished compiling, the curtain simply stays down until it has — the
// wait happens inside the transition instead of after it.
//
// The curtain is painted in the body's own gradient, so it is not a foreign
// surface sliding over the page. It is the page's ground, briefly with nothing
// printed on it.

const GRADIENT_BG = "linear-gradient(#3D3C95, 20%, #0a0d3d)";
const EASE = [0.16, 1, 0.3, 1];

// Cover is quick and reveal is slower: the cover answers a click and wants to feel
// immediate, the reveal is an arrival and can afford to be watched.
const COVER = 0.34;
const REVEAL = 0.52;

// How long the curtain has to be held before it admits it is loading. Under this,
// a spinner is a flash of anxiety on a machine that was fine.
const PATIENCE_MS = 450;

// A gate that never opens must not trap the page behind the curtain — a WebGL
// context that dies mid-compile would otherwise leave a blank gradient forever.
const GATE_TIMEOUT_MS = 9000;

const SLIDE = {
  idle: { y: "-100%" },
  covering: { y: "0%" },
  covered: { y: "0%" },
  revealing: { y: "100%" },
};

const FADE = {
  idle: { opacity: 0 },
  covering: { opacity: 1 },
  covered: { opacity: 1 },
  revealing: { opacity: 0 },
};

function Curtain({ phase, held, reduced, onCoverComplete, onRevealComplete }) {
  // Reduced motion keeps the state change and drops the travel: the curtain still
  // covers and still gates the scene, it just appears rather than sweeps.
  const positions = reduced ? FADE : SLIDE;

  // `idle` parks the curtain back above the viewport, and it has to get there
  // instantly: animating from y:100% to y:-100% would sweep the whole panel back
  // up across the screen, so every navigation would end with a second, upward
  // wipe nobody asked for.
  const duration =
    phase === "idle" ? 0 : reduced ? 0.2 : phase === "revealing" ? REVEAL : COVER;

  return createPortal(
    <motion.div
      // Portaled to <body> because the hero's container carries a CSS mask-image,
      // and Chromium mis-composites a position:fixed sibling beneath a masked
      // element in the same subtree whatever the z-index says.
      className="pointer-events-none fixed inset-0 z-[999] flex flex-col items-center justify-center gap-6"
      style={{ background: GRADIENT_BG, willChange: "transform" }}
      initial={false}
      animate={positions[phase]}
      transition={{ duration, ease: EASE }}
      onAnimationComplete={() => {
        if (phase === "covering") onCoverComplete();
        if (phase === "revealing") onRevealComplete();
      }}
      aria-hidden={phase === "idle"}
    >
      {/* Only after the wait has gone on long enough to need explaining. The
          curtain is silent on a fast machine. */}
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
 * happens while the curtain is down rather than in front of the visitor.
 */
export default function PageTransition({ children }) {
  const location = useLocation();
  const reduced = !!useReducedMotion();

  const [displayLocation, setDisplayLocation] = useState(location);
  // First load starts covered, so every visit opens the same way a navigation
  // does and the landing page has somewhere to do its waiting.
  const [phase, setPhase] = useState("covered");
  const [held, setHeld] = useState(false);

  const [gateCount, setGateCount] = useState(0);
  const gatesTimedOut = useRef(false);

  const registerGate = useCallback(() => {
    setGateCount((n) => n + 1);
    return () => setGateCount((n) => Math.max(0, n - 1));
  }, []);

  // A new pathname sends the curtain down. Comparing pathnames rather than
  // location objects keeps a query-string or hash change from triggering one.
  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) setPhase("covering");
  }, [location, displayLocation]);

  const handleCoverComplete = useCallback(() => {
    setDisplayLocation(location);
    // Instant, not smooth. Smooth scrolling used to run *while* the pages were
    // cross-fading, so the outgoing page visibly slid upward as it dissolved.
    // Behind the curtain there is nothing to animate for.
    window.scrollTo(0, 0);
    setPhase("covered");
  }, [location]);

  // Reveal once nothing is holding it. `covered` is also where a first load sits,
  // so this is one code path for both "arrived" and "started".
  useEffect(() => {
    if (phase !== "covered") return undefined;
    if (gateCount > 0 && !gatesTimedOut.current) return undefined;
    const id = requestAnimationFrame(() => setPhase("revealing"));
    return () => cancelAnimationFrame(id);
  }, [phase, gateCount]);

  // The spinner earns its way in only after the curtain has been down a while.
  useEffect(() => {
    if (phase !== "covered") {
      setHeld(false);
      return undefined;
    }
    const id = setTimeout(() => setHeld(true), PATIENCE_MS);
    return () => clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "covered" || gateCount === 0) return undefined;
    const id = setTimeout(() => {
      gatesTimedOut.current = true;
      setGateCount(0);
    }, GATE_TIMEOUT_MS);
    return () => clearTimeout(id);
  }, [phase, gateCount]);

  return (
    <GateContext.Provider value={registerGate}>
      <Curtain
        phase={phase}
        held={held}
        reduced={reduced}
        onCoverComplete={handleCoverComplete}
        onRevealComplete={() => setPhase("idle")}
      />
      {children(displayLocation)}
    </GateContext.Provider>
  );
}
