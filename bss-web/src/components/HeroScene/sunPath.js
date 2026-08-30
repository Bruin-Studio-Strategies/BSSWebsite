// Shared between Logo3D (the visible sun) and SunsetLighting (the key light
// that tracks it) so the light always comes from wherever the sun actually is
// instead of a fixed studio-light position that never moves.

// Sits beyond the distant ridge, not among it.
//
// DistantRidge spans z -21 to -13, so the old SUN_Z of -14 put the sun inside
// that range and in front of its centre — it set *over* the silhouette instead of
// behind it, which is the one thing a setting sun cannot do. Everything here is
// past the ridge's far edge, so the ridge occludes it on the way down: the meshes
// are depth-tested, and the glow is additive, so the silhouette cuts into the
// bloom exactly the way a real horizon does.
//
// The arc is scaled with the distance. Moving from 28 units out to 40 shrinks
// everything by the same factor, so X, Y and the scale in Logo3D are all ~1.43x
// their old values to land at the same apparent size and sweep.
export const SUN_Y_TOP = 6;
export const SUN_Y_BOTTOM = -5.7;
export const SUN_X_START = 14.3;
export const SUN_X_END = -14.3;
export const SUN_Z = -26;
// Bulges the path above a straight line between start and end — the sun arcs
// across the sky like it actually would, instead of sliding down a straight
// line. Kept small: a real sunset's arc is wide and shallow, not a tight parabola.
export const SUN_ARC_HEIGHT = 1;

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
