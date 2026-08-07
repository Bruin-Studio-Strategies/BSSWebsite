import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Terrain from "./Terrain.jsx";
import Logo3D from "./Logo3D.jsx";
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

export default function HeroScene({ scrollYProgress, reducedMotion }) {
  const wrapperRef = useRef(null);
  const inView = useInView(wrapperRef);
  const segments = useQualityTier();

  return (
    <div ref={wrapperRef} className="absolute inset-0">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ fov: 45, near: 0.1, far: 40 }}
        frameloop={inView ? "always" : "never"}
        onCreated={({ gl }) => {
          const el = gl.domElement;
          el.addEventListener("webglcontextlost", (e) => e.preventDefault(), false);
        }}
      >
        <fog attach="fog" args={["#0F172E", 6, 20]} />
        <Terrain scrollYProgress={scrollYProgress} reducedMotion={reducedMotion} segments={segments} />
        <Logo3D scrollYProgress={scrollYProgress} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
