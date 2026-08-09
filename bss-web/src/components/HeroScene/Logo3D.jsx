import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Billboard, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { SUN_X_START, SUN_Y_TOP, SUN_Z, getSunPosition } from "./sunPath.js";
import logoSrc from "../../assets/logo-plain.png";

const GLOW_COLOR = "#E24FB0";
const SUN_SCALE = 1.7;
// logo-plain.png is a 1:1 square (the mark itself doesn't fill the frame edge to
// edge), so a plain square plane matches it without distortion.
const LOGO_SIZE = 3.2;

// Soft radial halo behind the mark. Spread gradually across many stops instead of
// a bright center falling off fast — a hot little dot in the middle reads as a
// point light, not an atmospheric sun glow.
function makeGlowTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255,240,250,0.22)");
  gradient.addColorStop(0.25, "rgba(238,150,210,0.16)");
  gradient.addColorStop(0.55, "rgba(226,79,176,0.09)");
  gradient.addColorStop(1, "rgba(226,79,176,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

export default function Logo3D({ scrollYProgress, reducedMotion }) {
  const groupRef = useRef();
  const logoRef = useRef();
  const descend = useRef(0);
  const glowTexture = useMemo(() => makeGlowTexture(), []);
  const logoMap = useTexture(logoSrc);
  const { gl } = useThree();

  useEffect(() => {
    // Sharpens the thin strokes at oblique/minified viewing angles instead of
    // letting them shimmer — plain trilinear filtering alone still aliases on
    // lines this thin.
    logoMap.anisotropy = gl.capabilities.getMaxAnisotropy();
    logoMap.minFilter = THREE.LinearMipmapLinearFilter;
    logoMap.needsUpdate = true;
  }, [logoMap, gl]);

  useFrame(() => {
    if (!groupRef.current) return;
    const target = reducedMotion ? 0 : scrollYProgress.get();
    descend.current += (target - descend.current) * 0.06;
    getSunPosition(descend.current, groupRef.current.position);
    // Spins in-plane (Z axis) tied directly to scroll progress — a slow scroll
    // turns it slowly, not a spin of its own. Applied to the logo mesh itself
    // (inside the Billboard) rather than the group, so it keeps facing the
    // camera dead-on as the sun's own position/depth changes — an oblique plane
    // is the other big source of texture aliasing on strokes this thin.
    if (logoRef.current) logoRef.current.rotation.z = descend.current * Math.PI * 0.6;
  });

  return (
    <group ref={groupRef} position={[SUN_X_START, SUN_Y_TOP, SUN_Z]} scale={SUN_SCALE}>
      <pointLight color={GLOW_COLOR} intensity={0.8} distance={7} />
      <Billboard>
        <mesh scale={5}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={glowTexture}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            fog={false}
          />
        </mesh>
      </Billboard>
      <Billboard>
        <mesh ref={logoRef}>
          <planeGeometry args={[LOGO_SIZE, LOGO_SIZE]} />
          <meshBasicMaterial map={logoMap} transparent toneMapped={false} fog={false} />
        </mesh>
      </Billboard>
    </group>
  );
}
