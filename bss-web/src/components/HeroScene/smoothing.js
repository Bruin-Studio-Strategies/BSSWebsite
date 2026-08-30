// Exponential follower for the scene's scroll-driven values.
//
// Scroll arrives in ~100px jumps, so nothing in the scene reads the scroll
// position directly — each value eases toward it instead, which is what keeps
// the sunset and the dolly continuous between wheel ticks.
//
// TAU is the time constant: the value covers about 63% of the remaining
// distance every TAU seconds, whatever the frame rate. The old form applied a
// flat 6% per frame, which quietly meant the scene eased twice as fast on a
// 120Hz display as on a 60Hz one.
const TAU = 0.25;

// A tighter one for anything the viewer can compare against page scroll. The
// section below the hero moves 1:1 with the wheel; the landscape behind it runs
// through a follower, and a quarter-second of lag between the two is plainly
// visible as the two layers sliding at different speeds. Short enough to track,
// long enough to still absorb a ~100px wheel step.
export const TRACKING_TAU = 0.07;

// Beyond this, a gap is not a slow frame — it is the frameloop having been
// parked (the scene scrolled out of view, the tab in the background) or the
// page having just started. Easing across it would replay whatever the value
// did in the meantime: scroll from the bottom of the page back to the hero and
// you would watch the sunset run backwards for two seconds before settling, and
// landing on an already-scrolled page played the whole thing forwards from
// daylight. Past this threshold the follower simply arrives.
const RESUME_GAP = 0.25;

export function follow(ref, target, delta, tau = TAU) {
  if (ref.current === null || delta > RESUME_GAP) ref.current = target;
  else ref.current += (target - ref.current) * (1 - Math.exp(-delta / tau));
  return ref.current;
}
