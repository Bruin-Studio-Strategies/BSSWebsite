import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import Terrain from "./Terrain.jsx";
import DistantRidge from "./DistantRidge.jsx";
import Starfield from "./Starfield.jsx";
import Logo3D from "./Logo3D.jsx";
import SunsetLighting from "./SunsetLighting.jsx";
import useQualityTier from "./useQualityTier.js";

function useInView(ref) {
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      {
        threshold: 0,
      },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return inView;
}

// Readiness is reported from inside the frame loop, not from `onCreated`.
// `onCreated` fires when the WebGL context exists, which is well before the
// terrain and the logo have built their geometry — two rAFs after it is still two
// rAFs into an empty scene. Counting real rendered frames means the veil lifts on
// a drawn landscape rather than on a canvas that merely exists.
//
// Three frames rather than one: the first is often the frame the geometry is
// uploaded on, and the sunset lighting settles a frame behind that.
function ReportWhenDrawn({ onReady, running }) {
  const frames = useRef(0);
  const fired = useRef(false);

  useFrame(() => {
    if (fired.current) return;
    frames.current += 1;
    if (frames.current >= 3) {
      fired.current = true;
      onReady?.();
    }
  });

  // The frame loop is parked when the hero is off screen, and a parked loop
  // never draws a frame to count. Landing on an already-scrolled page would
  // otherwise hold the veil up until its timeout with nothing behind it loading.
  useEffect(() => {
    if (running || fired.current) return;
    fired.current = true;
    onReady?.();
  }, [running, onReady]);

  return null;
}

// A steady 30fps for a device that cannot hold its frame rate even at the bottom
// of its DPR ladder. Frames landing anywhere between 25 and 55 read as stutter; the
// same scene paced evenly at 30 reads as motion. Drives the canvas through
// `advance` while the Canvas's own loop is set to "never".
//
// The timestamp handed to `advance` continues the scene clock rather than using
// performance.now(), which is on a different origin — the first frame would
// otherwise carry a delta of the whole page lifetime.
const THROTTLED_FPS = 30;

function ThrottledLoop() {
  const advance = useThree((state) => state.advance);
  const clock = useThree((state) => state.clock);

  useEffect(() => {
    const interval = 1000 / THROTTLED_FPS;
    let raf;
    let last = null;
    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      // A few ms of slack so a 60Hz display lands on every other vsync instead of
      // drifting onto every third when a frame arrives a hair early.
      if (last !== null && now - last < interval - 4) return;
      const dt = last === null ? interval : now - last;
      last = now;
      advance(clock.elapsedTime + dt / 1000);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [advance, clock]);

  return null;
}

export default function HeroScene({
  scrollYProgress,
  exitProgress,
  reducedMotion,
  onReady,
}) {
  const wrapperRef = useRef(null);
  const inView = useInView(wrapperRef);
  // Pixels and MSAA come from the same tier as the geometry — on a phone those
  // two cost more than the mesh does. See useQualityTier.js.
  const { segments, dprSteps, antialias, lambert } = useQualityTier();
  const live = inView;

  // Where on the tier's DPR ladder the scene is sitting. Keyed to the ladder
  // itself, so crossing a tier breakpoint starts the new tier from its top step
  // instead of carrying an index that meant something else on the old one.
  const [adapted, setAdapted] = useState({ steps: dprSteps, index: 0 });
  const stepIndex = adapted.steps === dprSteps ? adapted.index : 0;
  const maxDpr = dprSteps[stepIndex];
  const shiftDpr = (by) =>
    setAdapted((prev) => {
      const from = prev.steps === dprSteps ? prev.index : 0;
      const index = Math.min(dprSteps.length - 1, Math.max(0, from + by));
      return prev.steps === dprSteps && index === from ? prev : { steps: dprSteps, index };
    });

  // The bottom of the ladder is where the device has shown it is struggling, so
  // that is also where the wireframe pass stops drawing. A decline arriving there
  // has nothing left to shed but frames, so the scene switches to an even 30fps
  // for the rest of this mount rather than keep dropping them unevenly.
  const atFloor = stepIndex === dprSteps.length - 1;
  const [throttled, setThrottled] = useState(false);

  // There is no exit fade. The scene is not a thing that plays and then gets out
  // of the way — once the descent has landed, the dune's bare face is the surface
  // the page's own copy sits on, so fading the canvas would be fading the section's
  // background out from under its text.


  return (
    // Pausing the frameloop (below) only stops new frames from rendering — the
    // canvas's last painted frame stays on screen. Without also hiding it here,
    // that frozen frame can visibly stick in place instead of scrolling away
    // with the rest of the hero once it's out of view.
    <motion.div
      ref={wrapperRef}
      className="absolute inset-0"
      style={{ visibility: live ? "visible" : "hidden" }}
    >
        <Canvas
          dpr={[Math.min(1, maxDpr), maxDpr]}
          gl={{
            antialias,
            // Opaque. SunsetLighting paints scene.background every frame, so the
            // canvas never had a transparent pixel in it — but an alpha canvas
            // still makes the compositor blend a full-screen layer with the page
            // under it (through the hero's mask) on every frame.
            alpha: false,
            powerPreference: "high-performance",
          }}
          // far reaches past the star field, which sits 45-90 units out so that the
        // landscape occludes it. At 40 the entire sky was behind the far plane.
        camera={{ fov: 45, near: 0.1, far: 130 }}
          frameloop={live && !throttled ? "always" : "never"}
          onCreated={({ gl }) => {
            const el = gl.domElement;
            el.addEventListener(
              "webglcontextlost",
              (e) => e.preventDefault(),
              false,
            );
          }}
        >
          <ReportWhenDrawn onReady={onReady} running={live} />
          {/* Steps the backing store down the tier's ladder when frames drop and
              back up when they recover. Short windows (6 x 250ms) so a phone in
              Low Power Mode, pinned at 30fps, sheds pixels within a couple of
              seconds rather than after the hero is over. Four flips and it stops
              adjusting, so a device on the edge settles instead of oscillating —
              every change reallocates the drawing buffer. */}
          <PerformanceMonitor
            iterations={6}
            flipflops={4}
            onDecline={() => (atFloor ? setThrottled(true) : shiftDpr(1))}
            onIncline={() => shiftDpr(-1)}
          />
          {live && throttled && <ThrottledLoop />}
          <SunsetLighting
            scrollYProgress={scrollYProgress}
            exitProgress={exitProgress}
            reducedMotion={reducedMotion}
          />
          <Starfield
            scrollYProgress={scrollYProgress}
            reducedMotion={reducedMotion}
          />
          <DistantRidge
            scrollYProgress={scrollYProgress}
            reducedMotion={reducedMotion}
          />
          <Terrain
            scrollYProgress={scrollYProgress}
            exitProgress={exitProgress}
            reducedMotion={reducedMotion}
            segments={segments}
            lambert={lambert}
            wireframe={!atFloor}
          />
          <Logo3D
            scrollYProgress={scrollYProgress}
            reducedMotion={reducedMotion}
          />
        </Canvas>
    </motion.div>
  );
}
