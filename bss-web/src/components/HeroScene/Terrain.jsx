import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { createNoise2D } from "simplex-noise";

const NAVY = new THREE.Color("#0F172E");
const PURPLE = new THREE.Color("#523794");
const SKY = new THREE.Color("#5288C7");
const MAGENTA = new THREE.Color("#B73593");

function heightColor(t) {
  if (t < 0.33) return NAVY.clone().lerp(PURPLE, t / 0.33);
  if (t < 0.66) return PURPLE.clone().lerp(SKY, (t - 0.33) / 0.33);
  return SKY.clone().lerp(MAGENTA, (t - 0.66) / 0.34);
}

// Camera rests here, dollies forward/down toward CAMERA_TARGET as scroll progresses.
const CAMERA_START = new THREE.Vector3(0, 3.4, 9);
const CAMERA_TARGET = new THREE.Vector3(0, 0.9, 2.5);

export default function Terrain({ scrollYProgress, reducedMotion, segments }) {
  const noise2D = useMemo(() => createNoise2D(), []);
  const dolly = useRef(0);
  const { camera } = useThree();

  const geometry = useMemo(() => {
    const [wSeg, hSeg] = segments;
    const width = 26;
    const depth = 18;
    const geo = new THREE.PlaneGeometry(width, depth, wSeg, hSeg);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    const heights = new Float32Array(pos.count);
    let minH = Infinity;
    let maxH = -Infinity;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      // Additive (not averaged) layers, unlike ridged 1-n*n noise, stay smooth and rounded
      // like dune crests instead of folding into sharp mountain ridgelines. Averaging the
      // layers instead of adding them cancels out relief, so amplitudes stack here.
      const primary = noise2D(x * 0.05, z * 0.05);
      const secondary = noise2D(x * 0.12 + 100, z * 0.12 + 100) * 0.4;
      const ripple = noise2D(x * 0.5, z * 0.5) * 0.07;
      const raw = (primary + secondary + 1.4) * 1.2 + ripple;
      // Floor rises toward the far edge (z -9, the boundary shared with
      // DistantRidge) so a low noise dip there can't open a gap revealing
      // background between the two meshes. Untouched over the front
      // two-thirds so the near dunes keep their full range of relief.
      const backT = THREE.MathUtils.clamp((-z - 3) / 6, 0, 1);
      const floor = THREE.MathUtils.lerp(0, 0.9, backT);
      const h = Math.max(raw, floor);
      heights[i] = h;
      if (h < minH) minH = h;
      if (h > maxH) maxH = h;
    }

    const colors = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const h = heights[i];
      pos.setY(i, h);
      const rawT = THREE.MathUtils.clamp((h - minH) / (maxH - minH || 1), 0, 1);
      // Lifts the floor a bit so the lowest dips land a shade above pure NAVY
      // instead of at it — softer shadows without changing the color itself.
      const t = 0.17 + rawT * 0.83;
      const c = heightColor(t);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    geo.translate(0, -1.4, -4);
    return geo;
  }, [noise2D, segments]);

  useFrame(() => {
    const raw = reducedMotion ? 0 : scrollYProgress.get();
    // Scaled down instead of clamped — CAMERA_TARGET sits close enough to the
    // ground that a tall dune under the random noise seed can occasionally clip
    // through the near clip plane at the very end, so the dolly still needs to
    // stop just short of 1. A hard Math.min(raw, 0.9) meant the camera reached
    // that cap quickly then sat frozen for the rest of the scroll — scaling the
    // whole range keeps it easing continuously the entire way instead.
    const target = raw * 0.9;
    dolly.current += (target - dolly.current) * 0.06;
    camera.position.lerpVectors(CAMERA_START, CAMERA_TARGET, dolly.current);
    camera.lookAt(0, 0.4, -6);
  });

  return (
    <>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          vertexColors
          roughness={0.85}
          metalness={0.05}
          polygonOffset
          polygonOffsetFactor={1}
          polygonOffsetUnits={1}
        />
      </mesh>
      <mesh geometry={geometry}>
        <meshBasicMaterial vertexColors wireframe transparent opacity={0.4} />
      </mesh>
    </>
  );
}
