import { Suspense, lazy, useState } from "react";
import { useReducedMotion } from "framer-motion";
import Wave from "../../assets/waves.png";
import RotatingLogo from "../RotatingLogo.jsx";
import LoadingSplash from "../LoadingSplash.jsx";
import { isWebGLAvailable } from "../../utils/webgl.js";
import useHeroScrollProgress, { useSceneExitProgress } from "../../hooks/useHeroScrollProgress.js";

const HeroScene = lazy(() => import("./HeroScene.jsx"));

// Softens the canvas's bottom edge instead of hard-clipping it at the section
// boundary. Deliberately shallow: it used to run black 62% -> transparent 97%,
// dissolving the bottom 38% of the canvas, which is a third of a screen of dune
// turning into flat page before the next section's copy arrives at 71% down. That
// band was the "empty space" between the hero and the section — not a layout gap
// but the mask eating the surface the copy was supposed to be printed on.
//
// At 88% the dune stays solid nearly to its edge and the fade is a vignette rather
// than a dissolve.
const FADE_MASK = "linear-gradient(to bottom, black 0%, black 88%, transparent 100%)";
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
  const exitProgress = useSceneExitProgress();


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
            exitProgress={exitProgress}
            reducedMotion={!!prefersReducedMotion}
            onReady={() => setSceneReady(true)}
          />
        </Suspense>
      </div>
    </>
  );
}
