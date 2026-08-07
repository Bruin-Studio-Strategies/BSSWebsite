import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

const PURPLE = new THREE.Color("#7C5CC9");
const MAGENTA = new THREE.Color("#E24FB0");

// Four slightly-offset closed triangle paths, echoing the brand mark's layered outline.
const LAYER_OFFSETS = [
  { scale: 1, rotate: 0 },
  { scale: 1.05, rotate: 0.05 },
  { scale: 1.1, rotate: -0.04 },
  { scale: 1.16, rotate: 0.08 },
];

function trianglePoints(scale, rotate) {
  const base = [
    new THREE.Vector3(-0.95, 0.85, 0),
    new THREE.Vector3(-0.95, -0.85, 0),
    new THREE.Vector3(1.25, 0, 0),
  ];
  const m = new THREE.Matrix4()
    .makeRotationZ(rotate)
    .multiply(new THREE.Matrix4().makeScale(scale, scale, scale));
  const pts = base.map((p) => p.clone().applyMatrix4(m));
  pts.push(pts[0].clone());
  return pts;
}

function colorsForPoints(points) {
  return points.map((p) => {
    const t = THREE.MathUtils.clamp((p.x + 1) / 2.4, 0, 1);
    return PURPLE.clone().lerp(MAGENTA, t);
  });
}

export default function Logo3D({ scrollYProgress, reducedMotion }) {
  const groupRef = useRef();
  const layers = useMemo(
    () =>
      LAYER_OFFSETS.map(({ scale, rotate }) => {
        const points = trianglePoints(scale, rotate);
        return { points, colors: colorsForPoints(points) };
      }),
    []
  );

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (reducedMotion) return;
    groupRef.current.rotation.y += delta * 0.18;
    groupRef.current.rotation.x = Math.sin(Date.now() * 0.00015) * 0.12;
    groupRef.current.rotation.z = scrollYProgress.get() * Math.PI * 2;
  });

  return (
    <group ref={groupRef} position={[2.4, 1.7, -1]} scale={1.15}>
      {layers.map((layer, i) => (
        <group key={i}>
          <Line points={layer.points} vertexColors={layer.colors} lineWidth={4} transparent opacity={0.25} />
          <Line points={layer.points} vertexColors={layer.colors} lineWidth={1.6} />
        </group>
      ))}
    </group>
  );
}
