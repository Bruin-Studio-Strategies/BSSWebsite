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
      const ridge = Math.abs(noise2D(x * 0.09, z * 0.09));
      const detail = noise2D(x * 0.25, z * 0.25) * 0.35;
      const h = (1 - ridge) * 2.6 + detail;
      heights[i] = h;
      if (h < minH) minH = h;
      if (h > maxH) maxH = h;
    }

    const colors = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const h = heights[i];
      pos.setY(i, h);
      const t = THREE.MathUtils.clamp((h - minH) / (maxH - minH || 1), 0, 1);
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
    const target = reducedMotion ? 0 : scrollYProgress.get();
    dolly.current += (target - dolly.current) * 0.06;
    camera.position.lerpVectors(CAMERA_START, CAMERA_TARGET, dolly.current);
    camera.lookAt(0, 0.4, -6);
  });

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial vertexColors wireframe transparent opacity={0.85} />
    </mesh>
  );
}
