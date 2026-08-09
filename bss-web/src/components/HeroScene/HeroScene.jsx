import { useEffect, useRef, useState } from "react";
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
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return inView;
}

export default function HeroScene({ scrollYProgress, reducedMotion, onReady }) {
  const wrapperRef = useRef(null);
  const inView = useInView(wrapperRef);
  const segments = useQualityTier();

  return (
    // Pausing the frameloop (below) only stops new frames from rendering — the
    // canvas's last painted frame stays on screen. Without also hiding it here,
    // that frozen frame can visibly stick in place instead of scrolling away
    // with the rest of the hero once it's out of view.
    <div ref={wrapperRef} className="absolute inset-0" style={{ visibility: inView ? "visible" : "hidden" }}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ fov: 45, near: 0.1, far: 40 }}
        frameloop={inView ? "always" : "never"}
        onCreated={({ gl }) => {
          const el = gl.domElement;
          el.addEventListener("webglcontextlost", (e) => e.preventDefault(), false);
          // Wait a couple frames so the terrain has actually painted before telling
          // the splash screen to dismiss, instead of revealing a half-built scene.
          requestAnimationFrame(() => requestAnimationFrame(() => onReady?.()));
        }}
      >
        <SunsetLighting scrollYProgress={scrollYProgress} reducedMotion={reducedMotion} />
        <Starfield scrollYProgress={scrollYProgress} reducedMotion={reducedMotion} />
        <DistantRidge />
        <Terrain scrollYProgress={scrollYProgress} reducedMotion={reducedMotion} segments={segments} />
        <Logo3D scrollYProgress={scrollYProgress} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
