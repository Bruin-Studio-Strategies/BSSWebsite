import { Suspense, lazy, useState } from "react";
import { useReducedMotion } from "framer-motion";
import Wave from "../../assets/waves.png";
import RotatingLogo from "../RotatingLogo.jsx";
import LoadingSplash from "../LoadingSplash.jsx";
import { isWebGLAvailable } from "../../utils/webgl.js";
import useHeroScrollProgress from "../../hooks/useHeroScrollProgress.js";

const HeroScene = lazy(() => import("./HeroScene.jsx"));

// Fades the scene into the page background near the bottom of the viewport instead
// of letting overflow-hidden hard-clip it right at the section boundary.
const FADE_MASK = "linear-gradient(to bottom, black 0%, black 62%, transparent 97%)";
const fadeStyle = {
  maskImage: FADE_MASK,
  WebkitMaskImage: FADE_MASK,
};

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
  // isWebGLAvailable() is a synchronous DOM check (no SSR here) — computing it
  // directly avoids an initial null state where neither the scene nor its
  // fallback would render, leaving the hero blank for a frame on first paint.
  const [webglOk] = useState(isWebGLAvailable);
  const [sceneReady, setSceneReady] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const scrollYProgress = useHeroScrollProgress();

  if (!webglOk) {
    return (
      <div className="absolute inset-0 z-0" style={fadeStyle}>
        <FlatFallback />
      </div>
    );
  }

  return (
    <>
      {/* Covers the whole page (not just this section) until the terrain has actually
          painted, so slow machines get a real loading screen instead of a brief flash. */}
      <LoadingSplash visible={!sceneReady} reducedMotion={!!prefersReducedMotion} />
      <div className="absolute inset-0 z-0" style={fadeStyle}>
        <Suspense fallback={<FlatFallback />}>
          <HeroScene
            scrollYProgress={scrollYProgress}
            reducedMotion={!!prefersReducedMotion}
            onReady={() => setSceneReady(true)}
          />
        </Suspense>
      </div>
    </>
  );
}
