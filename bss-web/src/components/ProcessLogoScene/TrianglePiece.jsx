import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { buildTrianglePerimeter } from "./triangleGeometry.js";

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const WHITE = new THREE.Color("#ffffff");

// One of the three triangles that make up the mark. Its own "drawn" fraction is
// derived from where the overall scene progress sits inside [rangeStart, rangeEnd] —
// three of these with staggered, overlapping ranges is what makes the pieces read as
// arriving one after another instead of all at once.
export default function TrianglePiece({
  rotationDeg,
  color,
  rangeStart,
  rangeEnd,
  progress,
  reducedMotion,
  sideLength = 2.4,
}) {
  const lineRef = useRef();
  const drawn = useRef(0);
  const baseColor = useMemo(() => new THREE.Color(color), [color]);
  const liveColor = useMemo(() => new THREE.Color(color), [color]);

  const { geometry, totalPoints } = useMemo(() => {
    const points = buildTrianglePerimeter(sideLength, 18);
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return { geometry: geo, totalPoints: points.length };
  }, [sideLength]);

  useFrame(() => {
    if (!lineRef.current) return;
    // Reduced motion skips the scroll-tied reveal entirely and settles on the
    // finished mark, rather than freezing mid-build (unlike the hero, where
    // freezing at the *start* of its animation is the safe default — here the
    // payoff state is the one that actually needs to be visible).
    const overall = reducedMotion ? 1 : progress.get();
    const local = clamp01((overall - rangeStart) / (rangeEnd - rangeStart));
    drawn.current += (local - drawn.current) * 0.15;

    const count = Math.max(2, Math.round(drawn.current * (totalPoints - 1)) + 1);
    geometry.setDrawRange(0, count);

    const settle = clamp01((overall - 0.92) / 0.08);
    liveColor.copy(baseColor).lerp(WHITE, settle * 0.85);
    lineRef.current.material.color.copy(liveColor);
    lineRef.current.material.opacity = 0.4 + drawn.current * 0.6;
  });

  return (
    <line ref={lineRef} geometry={geometry} rotation={[0, 0, THREE.MathUtils.degToRad(rotationDeg)]}>
      <lineBasicMaterial color={color} transparent opacity={0.4} toneMapped={false} />
    </line>
  );
}
