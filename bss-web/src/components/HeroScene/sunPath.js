// Shared between Logo3D (the visible sun) and SunsetLighting (the key light
// that tracks it) so the light always comes from wherever the sun actually is
// instead of a fixed studio-light position that never moves.

// Sits behind the terrain plane's own far edge (see Terrain's z range, roughly
// -13 to 5) — not just "further back" but fully outside its footprint — so
// there's no local ground under it to sink into; it can only ever be occluded
// by nearer dune ridges, the way an actual horizon works. Rises in the east
// (screen right, higher up) and sets toward the west (screen left) as it
// descends.
export const SUN_Y_TOP = 4.2;
export const SUN_Y_BOTTOM = -4;
export const SUN_X_START = 10;
export const SUN_X_END = -10;
export const SUN_Z = -14;
// Bulges the path above a straight line between start and end — the sun arcs
// across the sky like it actually would, instead of sliding down a straight
// line. Kept small: a real sunset's arc is wide and shallow, not a tight parabola.
export const SUN_ARC_HEIGHT = 0.7;

const controlX = (SUN_X_START + SUN_X_END) / 2;
const controlY = Math.max(SUN_Y_TOP, SUN_Y_BOTTOM) + SUN_ARC_HEIGHT;

// Quadratic bezier through (start, control, end) — t is raw scroll-derived
// progress (0..1), not eased; callers that want an eased feel should ease t
// themselves before calling this.
export function getSunPosition(t, out) {
  const inv = 1 - t;
  out.x = inv * inv * SUN_X_START + 2 * inv * t * controlX + t * t * SUN_X_END;
  out.y = inv * inv * SUN_Y_TOP + 2 * inv * t * controlY + t * t * SUN_Y_BOTTOM;
  out.z = SUN_Z;
  return out;
}
