import * as THREE from "three";

// Right-hand tip sits at the local origin so three rotated copies (see
// LogoBuildScene) can share that exact pivot point, matching the brand mark's
// "three congruent equilateral triangles rotated around the right tip" spec.
// Densified into many small segments (rather than just the 3 corners) so the
// "drawing itself in" reveal via geometry.setDrawRange can grow smoothly along
// the perimeter instead of jumping corner to corner.
export function buildTrianglePerimeter(sideLength, segmentsPerEdge = 16) {
  const h = (sideLength * Math.sqrt(3)) / 2;
  const tip = new THREE.Vector3(0, 0, 0);
  const topLeft = new THREE.Vector3(-h, sideLength / 2, 0);
  const bottomLeft = new THREE.Vector3(-h, -sideLength / 2, 0);
  const corners = [tip, topLeft, bottomLeft, tip];

  const points = [];
  for (let edge = 0; edge < 3; edge++) {
    const a = corners[edge];
    const b = corners[edge + 1];
    for (let s = 0; s < segmentsPerEdge; s++) {
      points.push(new THREE.Vector3().lerpVectors(a, b, s / segmentsPerEdge));
    }
  }
  points.push(corners[3].clone());
  return points;
}
