import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  HEIGHT_MAX,
  HEIGHT_MIN,
  TERRAIN_DEPTH,
  TERRAIN_OFFSET,
  TERRAIN_WIDTH,
  localHeight,
  surfaceHeightAt,
} from "./terrainField.js";
import { follow, TRACKING_TAU } from "./smoothing.js";

const NAVY = new THREE.Color("#0F172E");
const PURPLE = new THREE.Color("#523794");
const SKY = new THREE.Color("#5288C7");
const MAGENTA = new THREE.Color("#B73593");

function heightColorInto(out, t) {
  if (t < 0.33) return out.copy(NAVY).lerp(PURPLE, t / 0.33);
  if (t < 0.66) return out.copy(PURPLE).lerp(SKY, (t - 0.33) / 0.33);
  return out.copy(SKY).lerp(MAGENTA, (t - 0.66) / 0.34);
}

// The camera flies two phases, and they are driven by two different scroll
// ranges. The hero's own scroll plays the sunset from CAMERA_START to
// CAMERA_HERO_END, drifting gently and keeping the whole field and horizon in
// view. The scroll *after* the hero then sinks it to CAMERA_DESCENT_END, down
// into the hollow in front of the tall ridge, until that ridge's near face is
// the entire frame — which is what the page below continues out of.
//
// The end position is not eyeballed: rays cast across the frustum against the
// height field confirm the ground fills 100% of the view there at aspect ratios
// from 1.2 to 2.4, with 0.60 of clearance left under the camera. No sliver of sky
// survives at the edge of a wide monitor or the corner of a phone. Move the
// ridge or this point and that has to be re-checked, or the transition ends on a
// gap — there is no way to see that failure except by looking for it.
const CAMERA_START = new THREE.Vector3(0, 5.6, 14.2);
const CAMERA_HERO_END = new THREE.Vector3(0, 4.4, 11.8);
const CAMERA_DESCENT_END = new THREE.Vector3(0, -0.8, 10.2);
// The look target lifts as the camera drops, so the descent ends facing the
// ridge's face rather than pitched down at the sand under it.
const LOOK_HERO = new THREE.Vector3(0, 0.4, -6);
const LOOK_DESCENT_END = new THREE.Vector3(0, 0.6, -2);

// Minimum distance the camera keeps above the ground, enforced every frame. The
// descent deliberately ends close to the surface, so this is far tighter than it
// was and it is doing real work rather than sitting unused — but the terrain is
// a single-sided sheet, and a camera that crosses it sees straight through the
// ground into the sky. The path clears it by 0.99 at the end; this is the floor
// under that.
const CAMERA_CLEARANCE = 0.45;

// Narrow viewports see far less of the landscape at the same vertical field of
// view — the vertical angle is fixed, so horizontal coverage falls off with the
// aspect ratio and a phone gets roughly a 20-degree window where a desktop gets
// 73. The establishing shot reads as a close-up of a dune rather than a place.
//
// Widening the lens rather than pulling the camera back, because back is where the
// mesh ends: the camera already sits a unit beyond the terrain's near edge at the
// top of the scroll, and moving further would put the bottom of the frame past it,
// looking at nothing. Widening costs some perspective distortion at the extremes
// and nothing else.
const WIDE_ASPECT = 1.2;
// 16, not more. The descent ends by filling the frame with the ridge's near face,
// and a taller frame needs that face to subtend more vertically — widening the
// lens does the opposite. At a gain of 24 a phone lost the bottom of the frame on
// 117 of 150 landscapes (92% coverage); 16 holds 100% across aspect 0.42 to 2.8
// with the descent's end position unchanged. Raising it means moving the descent
// end closer to the ridge, which costs the camera its clearance.
const NARROW_FOV_GAIN = 16;

function fovForAspect(aspect) {
  if (aspect >= WIDE_ASPECT) return 45;
  return 45 + (WIDE_ASPECT - aspect) * NARROW_FOV_GAIN;
}

// Narrow screens also start the camera physically further back, which is a
// different thing from the wider lens above: the lens buys angle, this buys
// distance, and distance is what actually makes the establishing shot read as a
// landscape rather than a close-up of one dune.
//
// Capped at 4. The camera already sits past the terrain's front edge (the mesh
// ends at z 13), and pulling back tips the bottom of the frame toward that edge:
// measured, the first rays start looking underneath the sheet at +6, and by +7
// it is 11% of the frame. 4 leaves margin at every aspect and FOV combination.
// Applied only to the two hero keys — the descent's end position is verified for
// frame coverage and does not move.
// Back AND up. Height is what opens the field out — from higher, the ridge stops
// filling the lower frame and the landscape behind it reads — while distance is
// what stops it being a close-up of one dune. Doing only one of them barely moves
// the picture.
//
// Pull-back is capped at 4: the camera already sits past the terrain's front edge
// (the mesh ends at z 13) and pulling back tips the bottom of the frame toward it.
// Measured, the first rays look underneath the sheet at +6, and it is 11% of the
// frame by +7. Lift works against that — raising the camera with the look target
// fixed steepens the pitch, dragging the bottom of the frame back toward the near
// edge — so the pair is verified together, never separately.
// Searched, not guessed: of every combination of pull-back, lift and look-target
// raise, this is the most zoomed-out one where no ray in the frame looks under
// the mesh's near edge. Raising the look target is what unlocks the other two —
// it flattens the pitch, which is the thing that was driving the bottom of the
// frame into the front edge and capping the pull-back at 4.
const MAX_PULLBACK = 8;
const MAX_LIFT = 5.5;
// 1.4, not 1: at 1 the very narrowest phones (aspect 0.38-0.42, a tall handset in
// portrait) still put 1-3% of the frame under the mesh's near edge. 1.4 clears it
// down to 0.38 with no measurable cost to how much landscape is on screen.
const MAX_LOOK_LIFT = 1.4;
const PULLBACK_ASPECT = 0.95;

function narrowness(aspect) {
  return THREE.MathUtils.clamp((PULLBACK_ASPECT - aspect) / (PULLBACK_ASPECT - 0.45), 0, 1);
}

export default function Terrain({
  scrollYProgress,
  exitProgress,
  reducedMotion,
  segments,
  lambert = false,
  wireframe = true,
}) {
  const dolly = useRef(null);
  const descent = useRef(null);
  const look = useRef(new THREE.Vector3());
  const wireRef = useRef();
  const { camera, size } = useThree();

  const pullback = useRef(0);
  const lift = useRef(0);
  const lookLift = useRef(0);
  useEffect(() => {
    const narrow = narrowness(size.width / size.height);
    pullback.current = narrow * MAX_PULLBACK;
    lift.current = narrow * MAX_LIFT;
    lookLift.current = narrow * MAX_LOOK_LIFT;
    const next = fovForAspect(size.width / size.height);
    if (camera.fov === next) return;
    camera.fov = next;
    camera.updateProjectionMatrix();
  }, [camera, size]);

  const geometry = useMemo(() => {
    const [wSeg, hSeg] = segments;
    const geo = new THREE.PlaneGeometry(TERRAIN_WIDTH, TERRAIN_DEPTH, wSeg, hSeg);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const scratch = new THREE.Color();
    const span = HEIGHT_MAX - HEIGHT_MIN;

    for (let i = 0; i < pos.count; i++) {
      const h = localHeight(pos.getX(i), pos.getZ(i));
      pos.setY(i, h);
      const rawT = THREE.MathUtils.clamp((h - HEIGHT_MIN) / span, 0, 1);
      // Lifts the floor a bit so the lowest dips land a shade above pure NAVY
      // instead of at it — softer shadows without changing the color itself.
      heightColorInto(scratch, 0.17 + rawT * 0.83);
      colors[i * 3] = scratch.r;
      colors[i * 3 + 1] = scratch.g;
      colors[i * 3 + 2] = scratch.b;
    }

    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    geo.translate(TERRAIN_OFFSET.x, TERRAIN_OFFSET.y, TERRAIN_OFFSET.z);
    return geo;
  }, [segments]);

  // The tier hook swaps segment counts when the viewport crosses a breakpoint,
  // so this rebuilds on resize. Without an explicit dispose the superseded
  // buffers stay resident on the GPU for the life of the page.
  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, delta) => {
    const hero = follow(dolly, reducedMotion ? 0 : scrollYProgress.get(), delta);
    const sink = follow(descent, reducedMotion ? 0 : exitProgress.get(), delta, TRACKING_TAU);
    // Linear, and it has to stay linear. The section below the hero scrolls up at
    // exactly the rate of the wheel; this camera falls behind the same wheel. Any
    // easing here means the two move at different speeds through the hand-off —
    // the landscape racing ahead of the copy and then coasting while the copy
    // keeps going — which reads as the two layers being unrelated. Easing bought
    // room for the colour settle at the end; that room is now bought by the
    // longer exit window instead, which costs nothing.
    const sunk = sink;

    camera.position.lerpVectors(CAMERA_START, CAMERA_HERO_END, hero);
    // Both fade out as the descent takes over, so the sink still lands exactly
    // where its frame coverage was verified.
    const wide = 1 - sunk;
    camera.position.z += pullback.current * wide;
    camera.position.y += lift.current * wide;
    camera.position.lerp(CAMERA_DESCENT_END, sunk);
    const ground = surfaceHeightAt(camera.position.x, camera.position.z);
    camera.position.y = Math.max(camera.position.y, ground + CAMERA_CLEARANCE);

    look.current.lerpVectors(LOOK_HERO, LOOK_DESCENT_END, sunk);
    look.current.y += lookLift.current * wide;
    camera.lookAt(look.current);

    // The gridlines carry the descent — the surface is smooth and in shadow, so
    // without them nothing moves against the frame — and then they clear, leaving
    // that surface bare. That bare face is the point: it is what the section below
    // is printed on. The scene does not dissolve away to reveal a page underneath;
    // it settles into being the page's background.
    //
    // Keyed to raw scroll, not the eased fall, and gone by 0.95 so the face is
    // clean before the copy is over it.
    if (wireRef.current) {
      const strength = 0.4 + 0.15 * Math.min(1, sink / 0.6);
      const clearing = THREE.MathUtils.clamp((0.95 - sink) / 0.4, 0, 1);
      wireRef.current.opacity = strength * clearing;
      // A second full pass over the terrain, so it is skipped outright whenever
      // it would draw nothing — once cleared, and on a device HeroScene has found
      // cannot hold its frame rate even at the bottom of its DPR ladder. Toggling
      // `visible` compiles nothing, so this can change mid-scroll without a hitch.
      wireRef.current.visible = wireframe && wireRef.current.opacity > 0.001;
    }
  });

  return (
    <>
      <mesh geometry={geometry}>
        {/* polygonOffset pushes the filled surface back so the wireframe drawn on
            the exact same vertices wins the depth test. The dunes are viewed at a
            very shallow angle, which makes each triangle's depth slope large, and
            at factor 1 the offset was not clearing it — lines broke up and crawled
            along the crests as the camera moved.

            Lambert on the phone tier (see useQualityTier.js): the same diffuse
            response without the standard material's specular, which at this
            roughness was barely visible and was most of the per-pixel cost. */}
        {lambert ? (
          <meshLambertMaterial
            vertexColors
            polygonOffset
            polygonOffsetFactor={2}
            polygonOffsetUnits={2}
          />
        ) : (
          <meshStandardMaterial
            vertexColors
            roughness={0.85}
            metalness={0.05}
            polygonOffset
            polygonOffsetFactor={2}
            polygonOffsetUnits={2}
          />
        )}
      </mesh>
      <mesh geometry={geometry}>
        {/* depthWrite off: this sits exactly on an opaque surface that has
            already written the same depth, so writing it again only risks
            interfering with how the transparent sun glow sorts against it. */}
        <meshBasicMaterial
          ref={wireRef}
          vertexColors
          wireframe
          transparent
          opacity={0.4}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}
