import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createNoise2D } from "simplex-noise";
import { ridgeRandom } from "./terrainField.js";
import { follow } from "./smoothing.js";

// A flatter, more-faded ridge sitting well behind the main terrain — gives the
// horizon a sense of depth instead of dunes cutting straight to empty sky.
// Low segment count and a single noise octave since it only needs to read as a
// soft silhouette, not real detail. Dark, but distinct enough from the fog
// color that fog blending still visibly fades it — matching fog exactly reads
// as a hard-edged solid wall, but too close to the (lighter) sky tone reads as
// glowing rather than a dim, receding silhouette.
const COLOR_DAY = new THREE.Color("#211D4E");
// It is drawn with an unlit material, so it was the one element in the scene
// that ignored the sunset entirely: every light dimmed around it and the ridge
// held its daytime value, leaving a pale band across the horizon at the end of
// the scroll. It now settles just above the night fog, the same way it sits just
// above the day fog.
const COLOR_NIGHT = new THREE.Color("#151340");

export default function DistantRidge({ scrollYProgress, reducedMotion }) {
  const materialRef = useRef();
  const smooth = useRef(null);

  const geometry = useMemo(() => {
    // Seeded like the main terrain: the silhouette on the horizon should be the
    // same one on every visit, not a fresh draw each load.
    const noise2D = createNoise2D(ridgeRandom());
    const width = 55;
    const depth = 8;
    const wSeg = 48;
    const hSeg = 4;
    const geo = new THREE.PlaneGeometry(width, depth, wSeg, hSeg);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const h = noise2D(x * 0.06, z * 0.06) * 0.8;
      pos.setY(i, h);
    }
    geo.computeVertexNormals();
    // Just behind the main terrain's own far edge (-13) — far enough back for
    // clear separation, but well inside the fog's far distance (30) so it
    // actually reads as a faded silhouette instead of being fogged out entirely.
    // Sunk down so only its crest peeks over the main terrain's horizon.
    geo.translate(0, -1, -17);
    return geo;
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, delta) => {
    const smoothed = follow(smooth, reducedMotion ? 0 : scrollYProgress.get(), delta);
    const eased = 1 - (1 - smoothed) ** 2;
    if (materialRef.current) materialRef.current.color.copy(COLOR_DAY).lerp(COLOR_NIGHT, eased);
  });

  return (
    <mesh geometry={geometry}>
      {/* getHex() rather than the Color instance: the frame loop mutates this
          material's color, and handing it the shared constant risks mutating
          the constant along with it. */}
      <meshBasicMaterial ref={materialRef} color={COLOR_DAY.getHex()} />
    </mesh>
  );
}
