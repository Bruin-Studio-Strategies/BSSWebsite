import { useMemo } from "react";
import * as THREE from "three";
import { createNoise2D } from "simplex-noise";

// A flatter, more-faded ridge sitting well behind the main terrain — gives the
// horizon a sense of depth instead of dunes cutting straight to empty sky.
// Low segment count and a single noise octave since it only needs to read as a
// soft silhouette, not real detail. Dark, but distinct enough from the fog
// color that fog blending still visibly fades it — matching fog exactly reads
// as a hard-edged solid wall, but too close to the (lighter) sky tone reads as
// glowing rather than a dim, receding silhouette.
const COLOR = new THREE.Color("#211D4E");

export default function DistantRidge() {
  const geometry = useMemo(() => {
    const noise2D = createNoise2D();
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

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial color={COLOR} />
    </mesh>
  );
}
