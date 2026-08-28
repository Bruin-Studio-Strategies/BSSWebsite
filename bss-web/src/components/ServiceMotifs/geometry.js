import { createNoise2D } from "simplex-noise";

// Geometry for the service motifs, generated from the same simplex noise that
// raises the hero's terrain — so the ridges in these little diagrams are
// literally the same mathematics as the landscape behind the headline, not a
// hand-drawn lookalike.
//
// Terrain.jsx calls createNoise2D() with the default source, which reseeds on
// every load; that is fine for a 3D scene nobody compares between visits, but
// these are six small drawings that sit next to each other and must stay
// recognisably themselves. A tiny seeded PRNG makes the shapes deterministic.

export const BOX = { w: 160, h: 120 };
export const GRID_STEP = 20;

function mulberry32(seed) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const noise2D = createNoise2D(mulberry32(20260827));

/** A single noise ridge across the box, sampled at `row` in the noise field. */
export function ridgePath(row, { amplitude = 14, baseline = 60, samples = 24 } = {}) {
  const points = [];
  for (let i = 0; i <= samples; i += 1) {
    const t = i / samples;
    const x = t * BOX.w;
    const y = baseline - noise2D(t * 3.2, row) * amplitude;
    points.push([x, y]);
  }
  return toSmoothPath(points);
}

/** A ridge that also trends upward left to right — the growth curve. */
export function risingRidgePath({ samples = 24 } = {}) {
  const points = [];
  for (let i = 0; i <= samples; i += 1) {
    const t = i / samples;
    const x = t * BOX.w;
    const wobble = noise2D(t * 2.6, 9.5) * 9;
    const climb = 88 - t * 58;
    points.push([x, climb + wobble]);
  }
  return points;
}

/** Deterministic scatter that still reads as measured data, not a pattern. */
export function scatterPoints(count = 16) {
  const random = mulberry32(4711);
  const points = [];
  for (let i = 0; i < count; i += 1) {
    const t = (i + 0.5) / count;
    const x = 12 + t * (BOX.w - 24);
    // A real trend plus noise, so the fitted line through it means something.
    const trend = 86 - t * 46;
    const spread = (random() - 0.5) * 34;
    points.push([x, Math.max(14, Math.min(106, trend + spread))]);
  }
  return points;
}

/**
 * Midpoint-quadratic smoothing so ridges read as terrain, not a polyline: each
 * sample becomes a control point and the curve passes through the midpoints
 * between them. The earlier version mixed `Q` with a trailing `T`, whose control
 * point is a reflection of the previous one — which threw the final segment off
 * on its own tangent and left a detached hook at the right-hand edge.
 */
export function toSmoothPath(points) {
  if (points.length < 2) return "";
  const f = (n) => n.toFixed(2);
  let d = `M ${f(points[0][0])} ${f(points[0][1])}`;
  for (let i = 1; i < points.length - 1; i += 1) {
    const [x, y] = points[i];
    const [nx, ny] = points[i + 1];
    d += ` Q ${f(x)} ${f(y)} ${f((x + nx) / 2)} ${f((y + ny) / 2)}`;
  }
  const last = points[points.length - 1];
  d += ` L ${f(last[0])} ${f(last[1])}`;
  return d;
}

/** Point on the rising ridge at 0..1 along its width, for placing a marker. */
export function pointAlong(points, t) {
  const i = Math.min(points.length - 1, Math.max(0, Math.round(t * (points.length - 1))));
  return { x: points[i][0], y: points[i][1] };
}

/**
 * The brand mark: three congruent equilateral triangles rotated a few degrees
 * about their shared right-hand tip. Returned as polygon point strings so a
 * motif can draw one, or all three, without redefining the geometry.
 */
export function markTriangles({ cx = 80, cy = 60, r = 26, spread = 7, count = 3 } = {}) {
  const tip = { x: cx + r, y: cy };
  return Array.from({ length: count }, (_, i) => {
    const rot = ((i - (count - 1) / 2) * spread * Math.PI) / 180;
    const pts = [0, 120, 240].map((deg) => {
      const a = (deg * Math.PI) / 180;
      const px = cx + Math.cos(a) * r;
      const py = cy + Math.sin(a) * r;
      // Rotate about the tip vertex, which is what keeps the point tight while
      // the two left corners fan apart.
      const dx = px - tip.x;
      const dy = py - tip.y;
      return [
        tip.x + dx * Math.cos(rot) - dy * Math.sin(rot),
        tip.y + dx * Math.sin(rot) + dy * Math.cos(rot),
      ];
    });
    return pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
  });
}

/**
 * A dense wireframe mesh with a hole torn through it.
 *
 * Every sample point inside `influence` of the centre is pushed radially
 * outward, remapping the disc [0, influence] onto the annulus [holeR,
 * influence] — so the lines bend around a clean void rather than being clipped
 * at it. Clipping would leave cut ends pointing at nothing; displacing keeps
 * every line continuous and makes the hole read as something the mesh is
 * stretched around, which is the whole idea.
 */
export function meshWithHole({
  center = { x: 96, y: 60 },
  holeR = 20,
  influence = 46,
  step = 10,
  samples = 44,
} = {}) {
  const displace = (x, y) => {
    const dx = x - center.x;
    const dy = y - center.y;
    const d = Math.hypot(dx, dy);
    if (d >= influence) return [x, y];
    if (d < 0.0001) return [center.x + holeR, center.y];
    // Ease the remap so lines crowd near the rim and relax toward the edge of
    // the influence disc, instead of shifting by a constant amount.
    const t = d / influence;
    const eased = t * t * (3 - 2 * t);
    const nd = holeR + (influence - holeR) * eased;
    return [center.x + (dx / d) * nd, center.y + (dy / d) * nd];
  };

  const paths = [];
  for (let x = step; x < BOX.w; x += step) {
    const pts = [];
    for (let i = 0; i <= samples; i += 1) {
      const y = (i / samples) * BOX.h;
      pts.push(displace(x, y));
    }
    paths.push(toSmoothPath(pts));
  }
  for (let y = step; y < BOX.h; y += step) {
    const pts = [];
    for (let i = 0; i <= samples; i += 1) {
      const x = (i / samples) * BOX.w;
      pts.push(displace(x, y));
    }
    paths.push(toSmoothPath(pts));
  }
  return { paths, center, holeR };
}
