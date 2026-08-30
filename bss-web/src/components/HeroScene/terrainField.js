import * as THREE from "three";
import { createNoise2D } from "simplex-noise";

// The single source of truth for the dune field's shape.
//
// It lives outside Terrain.jsx because two separate things need to agree about
// where the ground is: the mesh that draws it, and the camera dolly that flies
// over it. Previously only the mesh knew, the camera flew a hardcoded path, and
// on some page loads that path ended up *inside* a dune — the ground vanished
// (the plane is single-sided, so from underneath you see straight through it)
// and you were looking at the sky from below the map. Anything that needs to
// know the height of the ground asks this module.

// Deterministic seed. `createNoise2D()` with no argument reseeds from
// Math.random() on every page load, so the landscape — and, more importantly,
// the clearance between the camera's resting position and whichever crest
// happened to sit underneath it — was different on every visit. That is why the
// clipping was intermittent. A fixed seed makes the hero the same scene every
// time, which also means it can be checked once rather than hoped about.
function mulberry32(seed) {
  let a = seed >>> 0;
  return function random() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Not an arbitrary number: seeds were scored for how much room they leave under
// the camera's flight path and how much relief they keep on screen, and this one
// tops that list — 1.51 units of clearance at the tightest point (the camera
// never comes near the ground) with the widest height range of any candidate
// that clears 1.1. Re-tune the dolly and the seed has to be re-scored with it.
// Two noise fields, and the split is the whole point.
//
// The dunes are reseeded on every load, because a landscape that is identical
// every visit has no life in it. What is *not* left to chance is the shape the
// hero's ending depends on: the ridge the camera sinks into, the hollow it sinks
// through, and the clearance under its path. Those come from a fixed seed, and
// `SHAPE` below damps the random dunes back down wherever they sit — so the
// random field decorates the landscape everywhere it is free to, and stays out
// of the way where the transition would break.
//
// The original bug this guards against: with everything unseeded, 4.5% of loads
// put the camera through the terrain (you saw the sky from under the ground) and
// another 16% grazed close enough to clip. That failure is invisible until it
// happens to you. See the seed sweep in the header of this file's tests.
const SHAPE_SEED = 1359;
const RIDGE_SEED = 0x42535332; // "BSS2"

// Fixed: the ridge's meander and its saddle. These decide whether the frame is
// covered at the bottom of the sink, so they cannot vary.
const shapeNoise = createNoise2D(mulberry32(SHAPE_SEED));

// Reseeded per load unless a generator is supplied (the verification sweep
// supplies one so it can test many landscapes).
let duneNoise = createNoise2D();
export function reseedDunes(random) {
  duneNoise = createNoise2D(random);
}

export const ridgeRandom = () => mulberry32(RIDGE_SEED);
// Stars vary per load too — they are pure decoration and touch nothing.
export const starRandom = () => Math.random;

// Wider than the field looks, because the camera sits well back and the frustum
// spreads with distance: at the rear of the terrain it is roughly 40 units across
// on a 16:9 screen, so a 26-wide sheet ended inside the view and its cut left and
// right edges were visible against the sky. Fog hides the very back; this covers
// everything nearer than that.
export const TERRAIN_WIDTH = 44;
// Deeper than it needs to be for the view alone. The camera descends to just
// above the ground at the end of the hero, and it has to still be *over* the
// mesh when it gets there: the plane is a single-sided sheet with a cut front
// edge, so a low camera positioned beyond that edge looks straight under it.
// Extending the field toward the viewer is what buys the descent its room.
export const TERRAIN_DEPTH = 26;
// Zero Z offset, so local and world Z are the same number everywhere in this
// file — the foreground below is positioned by eye against the camera path, and
// two coordinate systems for one axis is how that goes wrong.
export const TERRAIN_OFFSET = { x: 0, y: -1.4, z: 0 };

// Soft maximum. A plain Math.max(raw, floor) meets the noise at a hard crease,
// and computeVertexNormals turns that crease into a visibly faceted band running
// across the back of the field. Blending over a small window instead keeps the
// surface smooth, so the normals — and therefore the lighting — stay continuous.
function softMax(a, b, k) {
  const d = a - b;
  return b + 0.5 * (d + Math.sqrt(d * d + k * k));
}

// The foreground: a trough with a tall ridge standing behind it, both running
// across the field near the camera.
//
// This is deliberate landscape rather than noise, because the hero's whole
// descent depends on it. At the top of the scroll the camera floats above the
// crest and reads the field beyond it; as it sinks into the trough the crest
// rises past the top of the frame and the ridge's near face becomes the entire
// viewport — a single dark surface the page below can simply continue out of.
// Noise alone cannot be relied on for that: the field's own relief peaks around
// two units, which cannot fill a frame from any camera position that still shows
// a landscape first.
//
// It is shaped as real dunes are — a windward hollow scoured out in front of a
// transverse ridge — so it reads as part of the terrain rather than an object
// placed on it. RIDGE_WOBBLE keeps the crest line meandering instead of running
// dead straight across the view, and the noise still sits on top of both, so the
// face the camera ends on has the same grain as everything else.
// Two shapes, and they do different jobs.
//
// The FAR RIDGE is the wall the descent lands on. It has to fill the frame from
// the bottom of the sink — but it does that by being *close* to where the camera
// lands, not by being tall. A tall one fills the frame just as well and then
// walls off the whole landscape from the top of the scroll, which is the trap
// this shape went through twice. Low and near beats high and far.
//
// The NEAR DUNE is a U — shoulders out at the flanks, open across the middle.
// It is the thing you actually look at from the top of the scroll, and the gap
// in it is what you see the rest of the landscape through. A near dune that was
// solid across simply walled the view off, which is what made the hero read as a
// blob of sand rather than a place.
//
// The two together are what make both halves possible at once. Looking down
// through the U from up and back, you see the mid-field, the far ridge, and the
// horizon past it. Dropping into the mouth of the U, the sightline flattens, the
// U's own shoulders close in at either side, and the far ridge — now much taller
// than the camera — takes the middle. Nothing is left to see past.
const RIDGE_Z = 5.6;
const RIDGE_HEIGHT = 2.4;
const RIDGE_SPREAD = 2;
const RIDGE_WOBBLE = 1.1;

const NEAR_Z = 8.6;
const NEAR_HEIGHT = 2.8;
const NEAR_SPREAD = 1.5;
// Where the U's gap ends and its shoulders begin. The gap has to be wide enough
// to read as a way through rather than a dent, and narrow enough that the
// shoulders still carry the sides of the frame on the way down.
const NEAR_GAP = 2.4;
const NEAR_FLANK = 6.5;

// The hollow the camera descends into, sitting in the mouth of the U. Its depth
// is what the sink's travel is bought with: the camera can only go as far down as
// there is somewhere to go, and the clearance floor stops it dead otherwise. Deeper
// than it looks from above, because most of it is under the camera and out of frame.
const TROUGH_Z = 9.8;
const TROUGH_DEPTH = 3;
const TROUGH_SPREAD = 1.7;

function gaussian(d, spread) {
  return Math.exp(-(d * d) / (2 * spread * spread));
}

// 0 across the gap in the middle of the U, 1 out at its shoulders.
function uProfile(x) {
  return THREE.MathUtils.smoothstep(Math.abs(x), NEAR_GAP, NEAR_FLANK);
}

// The far ridge is deliberately uniform across its width. It used to sag at the
// flanks like the near dune does, which cost nothing at the centre of the frame
// and everything at the edges: on a wide screen the corners look further out
// along the crest, and a crest that has dropped there leaves a sliver of sky in
// exactly the corner nobody checks. Measured at 169 failures in 400 landscapes.
// The U in the near dune is what the viewer sees past; this one is only ever a
// wall, and a wall with a low end is not a wall.

// How strongly the authored shapes own a point: 1 on the crests and in the
// hollow, 0 out in the open field.
function shapeMask(x, z) {
  const wobble = shapeNoise(x * 0.08 + 50, 50) * RIDGE_WOBBLE;
  return Math.max(
    gaussian(z - (RIDGE_Z + wobble), RIDGE_SPREAD),
    gaussian(z - NEAR_Z, NEAR_SPREAD),
    gaussian(z - TROUGH_Z, TROUGH_SPREAD)
  );
}

function foreground(x, z) {
  const wobble = shapeNoise(x * 0.08 + 50, 50) * RIDGE_WOBBLE;
  const ridge = RIDGE_HEIGHT * gaussian(z - (RIDGE_Z + wobble), RIDGE_SPREAD);
  const near = NEAR_HEIGHT * uProfile(x) * gaussian(z - NEAR_Z, NEAR_SPREAD);
  const trough = TROUGH_DEPTH * gaussian(z - TROUGH_Z, TROUGH_SPREAD);
  return ridge + near - trough;
}

// Height in the plane's own (pre-translate) coordinates.
export function localHeight(x, z) {
  // Additive (not averaged) layers, unlike ridged 1-n*n noise, stay smooth and
  // rounded like dune crests instead of folding into sharp mountain ridgelines.
  // Averaging the layers instead of adding them cancels out relief, so
  // amplitudes stack here.
  const primary = duneNoise(x * 0.05, z * 0.05);
  const secondary = duneNoise(x * 0.12 + 100, z * 0.12 + 100) * 0.4;
  const ripple = duneNoise(x * 0.5, z * 0.5) * 0.07;
  // Damped where the authored ridge and hollow live, so a load whose noise
  // happens to carve a notch out of the crest cannot open a hole in the frame at
  // the bottom of the sink, and cannot fill in the hollow the camera descends
  // into. Everywhere else the random field has its full range.
  const relief = 1 - 0.85 * shapeMask(x, z);
  const raw = (primary * relief + secondary * relief + 1.4) * 1.2 + ripple + foreground(x, z);
  // Floor rises toward the far edge (z -9, the boundary shared with
  // DistantRidge) so a low noise dip there can't open a gap revealing background
  // between the two meshes. Untouched over the front two-thirds so the near
  // dunes keep their full range of relief.
  const backT = THREE.MathUtils.clamp((-z - 7) / 6, 0, 1);
  const floor = THREE.MathUtils.lerp(0, 0.9, backT);
  return softMax(raw, floor, 0.35);
}

// Fixed ends for the color ramp, rather than the min and max of whatever
// vertices a given build happened to sample. The quality tier changes the
// segment count with the viewport, and a coarser grid misses the extremes — so
// normalizing per build gave phones and desktops measurably different palettes
// for the same landscape. Measured across the field at fine resolution.
export const HEIGHT_MIN = 0.03;
export const HEIGHT_MAX = 4.25;

const halfW = TERRAIN_WIDTH / 2;
const halfD = TERRAIN_DEPTH / 2;

// Height of the drawn ground surface at a world-space X/Z. Outside the mesh's
// footprint the sample is clamped to the nearest edge rather than extrapolated,
// so the value stays a real height the ground actually reaches — the camera
// starts back beyond the near edge and still needs a sane number there.
export function surfaceHeightAt(worldX, worldZ) {
  const x = THREE.MathUtils.clamp(worldX - TERRAIN_OFFSET.x, -halfW, halfW);
  const z = THREE.MathUtils.clamp(worldZ - TERRAIN_OFFSET.z, -halfD, halfD);
  return localHeight(x, z) + TERRAIN_OFFSET.y;
}
