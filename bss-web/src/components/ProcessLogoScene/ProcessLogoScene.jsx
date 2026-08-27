import { Suspense, lazy, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import logoSrc from "../../assets/logo-plain.png";
import { isWebGLAvailable } from "../../utils/webgl.js";

const LogoBuildScene = lazy(() => import("./LogoBuildScene.jsx"));

// No-WebGL / still-loading fallback: the finished flat mark, not an attempt at the
// build animation — matches HeroBackdrop's fallback philosophy of degrading to a
// static brand asset rather than a broken or half-built scene.
function FlatFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <img src={logoSrc} alt="" className="h-28 w-28 opacity-80 sm:h-36 sm:w-36" />
    </div>
  );
}

export default function ProcessLogoScene({ progress }) {
  const [webglOk] = useState(isWebGLAvailable);
  const reducedMotion = useReducedMotion();

  if (!webglOk) return <FlatFallback />;

  return (
    <Suspense fallback={<FlatFallback />}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ fov: 40, position: [0, 0, 6] }}
      >
        <LogoBuildScene progress={progress} reducedMotion={!!reducedMotion} />
      </Canvas>
    </Suspense>
  );
}
