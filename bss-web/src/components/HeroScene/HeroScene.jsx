import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
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
            // Wait a couple frames so the terrain has actually painted before telling
            // the splash screen to dismiss, instead of revealing a half-built scene.
            requestAnimationFrame(() =>
              requestAnimationFrame(() => onReady?.()),
            );
          }}
        >
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
