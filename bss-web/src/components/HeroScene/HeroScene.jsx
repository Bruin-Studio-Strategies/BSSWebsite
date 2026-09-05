import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
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

export default function HeroScene({
  scrollYProgress,
  exitProgress,
  reducedMotion,
  onReady,
}) {
  const wrapperRef = useRef(null);
  const inView = useInView(wrapperRef);
  const segments = useQualityTier();
  const live = inView;

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
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          // far reaches past the star field, which sits 45-90 units out so that the
        // landscape occludes it. At 40 the entire sky was behind the far plane.
        camera={{ fov: 45, near: 0.1, far: 130 }}
          frameloop={live ? "always" : "never"}
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
          />
          <Logo3D
            scrollYProgress={scrollYProgress}
            reducedMotion={reducedMotion}
          />
        </Canvas>
    </motion.div>
  );
}
