import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const STAR_COUNT = 1000;

// Scattered across the upper sky to fill the otherwise-empty space above the
// dunes — one draw call (a single Points object), effectively free. Faintly
// visible at rest, brightening toward night as the same scroll progress that
// drives the sunset advances, instead of being a fixed, always-the-same decoration.
export default function Starfield({ scrollYProgress, reducedMotion }) {
  const pointsRef = useRef();
  const smooth = useRef(0);
  const { camera } = useThree();

  const geometry = useMemo(() => {
    const positions = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      positions[i * 3] = THREE.MathUtils.randFloatSpread(70); // x: -35..35
      positions[i * 3 + 1] = THREE.MathUtils.randFloat(2, 26); // y: upper sky only
      positions[i * 3 + 2] = THREE.MathUtils.randFloat(-38, -12); // z: behind/around the sun
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame(() => {
    const target = reducedMotion ? 0 : scrollYProgress.get();
    smooth.current += (target - smooth.current) * 0.06;
    const eased = 1 - (1 - smooth.current) ** 2;
    if (pointsRef.current) {
      pointsRef.current.material.opacity = 0.25 + eased * 0.6;
      // Recentered on the camera every frame (but not rotated with it) so real
      // stars' actual behavior comes for free: translating the camera (the dolly)
      // produces zero parallax since the offset to every star stays constant,
      // while the camera's own rotation (from its changing lookAt as it dollies)
      // still naturally sweeps different stars across the view, same as reality.
      pointsRef.current.position.copy(camera.position);
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color="#E8E6FF"
        size={0.12}
        sizeAttenuation
        transparent
        opacity={0.25}
        depthWrite={false}
        fog={false}
      />
    </points>
  );
}
