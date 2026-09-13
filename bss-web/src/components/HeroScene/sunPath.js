// Shared between Logo3D (the visible sun) and SunsetLighting (the key light that
// tracks it) so the light always comes from wherever the sun actually is
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

// Everything above is authored against the desktop frame: a 45-degree lens at
// aspect 1.6, roughly 40 units in front of the sun plane, which works out to a
// half-height of 16.6 and a half-width of 26.6 world units at that depth.
//
// A portrait phone is a different frame entirely. Terrain widens the lens to ~57
// degrees for narrow aspects and pulls the camera back, so at the same depth the
// frame is about 26 units tall and only 12 wide. Two things follow, and both were
// visible on a phone: the authored +6/-5.7 sweep covers most of the desktop frame
// but barely a third of that taller one, so the sun tracked low and skimmed the
// ridge instead of arcing over the landscape; and a mark sized against a 26-unit
// half-width fills 59% of a 12-unit one, so it came in enormous.
//
// X is deliberately not touched. At 14.3 the sun already starts just outside a
// phone's frame (1.19 half-widths out) and sweeps in from there, which is the
// entrance the hero wants — it is where the arc *rides* that was wrong.
const REFERENCE_HALF_HEIGHT = 16.6;
const REFERENCE_HALF_WIDTH = 26.6;
// The mark is scaled by the square root of the width ratio, not the ratio
// itself. The raw ratio lands it at the same fraction of the frame as desktop
// shows — about 15% of the width — which is correct in proportion and wrong in
// effect: at phone size that reads as a distant speck rather than as the scene's
// subject. The square root keeps the direction (narrower frame, smaller mark)
// while letting a phone hold roughly 40% of its width, against 59% with no fit
// at all. The floor is the point past which the three rotated triangles stop
// reading as three and it is just a bright blob.
const MIN_SIZE = 0.6;

/**
 * How this frame differs from the one the arc was authored for.
 *
 * Returns the factor to raise the arc by (`y`) and the factor to scale the mark
 * by (`size`). Both are 1 on a desktop frame, so that composition is untouched.
 * Read per frame rather than memoised on resize: Terrain mutates `camera.fov`
 * from its own effect, and effect ordering between two components is not
 * something to rely on.
 */
export function sunFrameFit(camera, aspect) {
  const distance = Math.abs(camera.position.z - SUN_Z);
  const halfHeight = Math.tan((camera.fov * Math.PI) / 360) * distance;
  const halfWidth = halfHeight * aspect;
  return {
    y: Math.max(1, halfHeight / REFERENCE_HALF_HEIGHT),
    size: Math.min(1, Math.max(MIN_SIZE, Math.sqrt(halfWidth / REFERENCE_HALF_WIDTH))),
  };
}

// Quadratic bezier through (start, control, end) — t is raw scroll-derived
// progress (0..1), not eased; callers that want an eased feel should ease t
// themselves before calling this. `yScale` comes from sunFrameFit and is 1 on
// the frame the arc was authored for.
export function getSunPosition(t, out, yScale = 1) {
  const inv = 1 - t;
  out.x = inv * inv * SUN_X_START + 2 * inv * t * controlX + t * t * SUN_X_END;
  out.y =
    (inv * inv * SUN_Y_TOP + 2 * inv * t * controlY + t * t * SUN_Y_BOTTOM) * yScale;
  out.z = SUN_Z;
  return out;
}
