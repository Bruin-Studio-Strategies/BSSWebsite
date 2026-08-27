import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import TrianglePiece from "./TrianglePiece.jsx";

const SKY = "#5288C7";
const PURPLE = "#523794";
const MAGENTA = "#B73593";

// Ranges overlap on purpose — the next piece is already sketching in before the
// previous one finishes, so the build reads as continuous momentum rather than
// three separate, sequentially-paused reveals.
const PIECES = [
  { rotationDeg: -8, color: SKY, rangeStart: 0, rangeEnd: 0.42 },
  { rotationDeg: 0, color: PURPLE, rangeStart: 0.32, rangeEnd: 0.68 },
  { rotationDeg: 8, color: MAGENTA, rangeStart: 0.58, rangeEnd: 0.92 },
];

export default function LogoBuildScene({ progress, reducedMotion }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const p = reducedMotion ? 1 : progress.get();
    // Once the mark is essentially complete, ease into a slow idle spin + gentle
    // breathing scale instead of sitting dead-static — a small "it's alive now"
    // beat that echoes the hero logo's own scroll-tied rotation.
    const settled = THREE.MathUtils.clamp((p - 0.92) / 0.08, 0, 1);
    groupRef.current.rotation.z = reducedMotion ? 0 : settled * state.clock.elapsedTime * 0.12;
    groupRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.6) * 0.02 * settled);
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <pointLight position={[3, 2, 4]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-2, -1.5, 3]} intensity={0.6} color={MAGENTA} />
      {PIECES.map((piece) => (
        <TrianglePiece key={piece.color} {...piece} progress={progress} reducedMotion={reducedMotion} />
      ))}
    </group>
  );
}
