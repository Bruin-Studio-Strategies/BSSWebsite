import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { useScroll, useReducedMotion } from "framer-motion";
import Wave from "../../assets/waves.png";
import RotatingLogo from "../RotatingLogo.jsx";
import { isWebGLAvailable } from "../../utils/webgl.js";

const HeroScene = lazy(() => import("./HeroScene.jsx"));

function FlatFallback() {
  return (
    <>
      <img
        src={Wave}
        alt=""
        className="absolute top-32 sm:top-60 w-full h-screen object-cover z-0"
      />
      <RotatingLogo />
    </>
  );
}

export default function HeroBackdrop() {
  const containerRef = useRef(null);
  const [webglOk, setWebglOk] = useState(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  useEffect(() => {
    setWebglOk(isWebGLAvailable());
  }, []);

  if (webglOk === false) {
    return (
      <div ref={containerRef} className="absolute inset-0 z-0">
        <FlatFallback />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="absolute inset-0 z-0">
      {webglOk && (
        <Suspense fallback={<FlatFallback />}>
          <HeroScene scrollYProgress={scrollYProgress} reducedMotion={!!prefersReducedMotion} />
        </Suspense>
      )}
    </div>
  );
}
