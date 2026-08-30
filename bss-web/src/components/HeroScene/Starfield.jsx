import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { starRandom } from "./terrainField.js";
import { follow } from "./smoothing.js";

// Three magnitudes rather than one. A real sky is mostly faint with a scattering
// of bright ones, and a uniform spray of identical dots is the single thing that
// most makes a starfield read as a texture instead of a sky. Three Points objects
// is three draw calls of nothing; per-point sizing would need a custom shader for
// no visible gain.
// Sizes look large because the field sits 45-90 units out rather than 10-40, and
// sizeAttenuation shrinks with distance — roughly 2.7x the old values to land at
// the same apparent size on screen.
const MAGNITUDES = [
  { count: 72, size: 0.7, opacity: 1, twinkle: 0.8 },
  { count: 384, size: 0.42, opacity: 0.8, twinkle: 0.65 },
  { count: 1152, size: 0.24, opacity: 0.55, twinkle: 0.45 },
];

// Each magnitude is split into this many groups, each scintillating on its own
// phases and rates. Brightness is a material property, so one Points object can
// only pulse as a single sheet — 70 bright stars dimming together reads as the sky
// changing, not as twinkling. Splitting them is what makes neighbouring stars
// disagree, which is the entire effect.
//
// Six rather than three: at three, a third of each magnitude moved in lockstep and
// the sky still read as coherent. Per-star phase would want a custom shader; this
// gets there in eighteen draw calls of nothing.
const PHASE_GROUPS = 6;

// Frequent enough to be part of the sky rather than a rare event, and slow enough
// to actually follow: 2.2 seconds to cross, against 0.85 before. Speed comes out
// about a third of what it was, because the streak is now much further away as
// well as longer-lived.
const METEOR_GAP = [1.6, 4.5];
const METEOR_LIFE = 2.2;
const METEOR_TRAVEL = 52;
const METEOR_TAIL = 22;

function makeStars(random, count) {
  const between = (min, max) => min + random() * (max - min);
  // Placed by angle and distance, not in a box.
  //
  // These are offsets from the camera, not world positions (see the recentring in
  // the frame loop). The old box put them at local z -40..-10, which against a
  // camera at z 14.2 is world z -26..+4 — squarely inside the terrain's own
  // footprint. They were not showing through the dunes, they were in front of
  // them. Everything here now starts beyond the far edge of the landscape and the
  // distant ridge behind it, so the terrain occludes them properly.
  //
  // Spherical placement also fixes what the box did to coverage: a box of stars
  // seen from inside is dense straight ahead and sparse toward the corners, and
  // pushing it far enough away to clear the terrain would have made that worse.
  // Even angular spread means even sky.
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const distance = between(45, 90);
    // Azimuth reaches +/-74 degrees so an ultrawide frustum still finds sky in
    // its corners; elevation covers the visible band with margin at both ends.
    const azimuth = between(-1.3, 1.3);
    const elevation = between(-0.28, 0.5);
    const ground = distance * Math.cos(elevation);
    positions[i * 3] = ground * Math.sin(azimuth);
    positions[i * 3 + 1] = distance * Math.sin(elevation);
    positions[i * 3 + 2] = -ground * Math.cos(azimuth);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return geo;
}

// A tapered streak lying along -X, brightest at the head. The taper is baked into
// vertex colours rather than opacity because the material draws additively, where
// black is simply invisible — so one material gives a head that burns and a tail
// that vanishes.
function makeMeteorGeometry() {
  const positions = new Float32Array(METEOR_TAIL * 3);
  const colors = new Float32Array(METEOR_TAIL * 3);
  for (let i = 0; i < METEOR_TAIL; i++) {
    const t = i / (METEOR_TAIL - 1);
    positions[i * 3] = -t;
    const fade = (1 - t) ** 2.2;
    colors[i * 3] = fade;
    colors[i * 3 + 1] = fade * 0.9;
    colors[i * 3 + 2] = fade;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geo;
}

export default function Starfield({ scrollYProgress, reducedMotion }) {
  const groupRef = useRef();
  const layerRefs = useRef([]);
  const meteorRef = useRef();
  const meteorMat = useRef();
  const smooth = useRef(null);
  const clock = useRef(0);
  const shot = useRef({ until: -1, next: 3, dir: new THREE.Vector3(), from: new THREE.Vector3() });
  const { camera } = useThree();

  const random = useMemo(() => starRandom(), []);
  const layers = useMemo(
    () =>
      MAGNITUDES.flatMap((m, mi) =>
        Array.from({ length: PHASE_GROUPS }, (_, gi) => ({
          ...m,
          key: `${mi}-${gi}`,
          geometry: makeStars(random, Math.round(m.count / PHASE_GROUPS)),
          // Two rates per group, deliberately incommensurate, so the pair beats
          // against itself and never repeats on a countable cycle. A single sine
          // is a metronome and the eye picks that out as machinery immediately.
          //
          // Both are far faster than the first attempt's 0.9-1.8 rad/s — those were
          // periods of 3.5 to 7 seconds, which is breathing, not scintillation.
          phase: mi * 2.4 + gi * 1.87,
          phaseB: mi * 1.31 + gi * 2.61,
          rate: 2.1 + gi * 0.52 + mi * 0.23,
          rateB: 3.4 + gi * 0.79 + mi * 0.41,
        }))
      ),
    [random]
  );
  const meteorGeometry = useMemo(() => makeMeteorGeometry(), []);

  useEffect(
    () => () => {
      layers.forEach((l) => l.geometry.dispose());
      meteorGeometry.dispose();
    },
    [layers, meteorGeometry]
  );

  useFrame((_, delta) => {
    const smoothed = follow(smooth, reducedMotion ? 0 : scrollYProgress.get(), delta);
    const eased = 1 - (1 - smoothed) ** 2;
    const night = 0.25 + eased * 0.6;

    // Recentred on the camera every frame, but never rotated with it, so real
    // stars' behaviour comes for free: translating the camera produces no parallax
    // because the offset to every star is constant, while the camera's own
    // rotation still sweeps different stars across the view.
    if (groupRef.current) groupRef.current.position.copy(camera.position);

    clock.current += delta;
    layerRefs.current.forEach((points, i) => {
      if (!points) return;
      const layer = layers[i];
      let twinkle = 1;
      if (!reducedMotion) {
        const t = clock.current;
        const wave =
          0.6 * Math.sin(t * layer.rate + layer.phase) +
          0.4 * Math.sin(t * layer.rateB + layer.phaseB);
        twinkle = 1 - layer.twinkle * 0.5 * (1 + wave);
      }
      points.material.opacity = night * layer.opacity * twinkle;
    });

    if (reducedMotion) return;

    // No gate on how dark the sky is. There used to be one, and it meant the very
    // top of the page — the state most people look at longest — had no meteors in
    // it at all. Brightness still rides the sunset (see the opacity below), so an
    // early one is faint against the day sky rather than absent.
    const t = clock.current;
    const s = shot.current;
    if (t > s.next) {
      s.until = t + METEOR_LIFE;
      s.next = s.until + METEOR_GAP[0] + random() * (METEOR_GAP[1] - METEOR_GAP[0]);
      // Spawned so the arc actually crosses the frame. The camera is pitched down
      // and the top of the frame is only ~8 degrees above horizontal, so the old
      // start band of y 18-42 at this depth was 14-43 degrees up — every meteor was
      // born above the viewport and most never entered it. That, not the interval,
      // was why they seemed rare.
      //
      // Starting just above the top edge on the right and falling left carries the
      // streak down through the visible band and out the far side.
      s.from.set(5 + random() * 40, 6 + random() * 9, -62 + random() * 18);
      s.dir.set(-0.62 - random() * 0.2, -0.45 - random() * 0.16, 0).normalize();
    }

    if (meteorRef.current && meteorMat.current) {
      const live = t < s.until;
      meteorRef.current.visible = live;
      if (live) {
        const age = 1 - (s.until - t) / METEOR_LIFE;
        const travel = METEOR_TRAVEL * age;
        meteorRef.current.position.copy(s.from).addScaledVector(s.dir, travel);
        meteorRef.current.rotation.z = Math.atan2(s.dir.y, s.dir.x);
        // Stretches as it accelerates, then goes out — a streak that simply
        // translated at constant length would read as an object, not a burn.
        meteorRef.current.scale.setScalar(4.5 + age * 11);
        // Floored rather than scaled straight off the sunset. At the very top of
        // the page `eased` is 0, so multiplying by it alone made the landing state
        // — the thing most people look at longest — fire meteors at zero opacity.
        // They are dimmer against the day sky than against night, but present.
        meteorMat.current.opacity = Math.sin(Math.PI * age) * 0.9 * (0.45 + eased * 0.55);
      }
    }
  });

  return (
    <group ref={groupRef}>
      {layers.map((layer, i) => (
        <points
          key={layer.key}
          ref={(el) => {
            layerRefs.current[i] = el;
          }}
          geometry={layer.geometry}
        >
          <pointsMaterial
            color="#E8E6FF"
            size={layer.size}
            sizeAttenuation
            transparent
            opacity={0.25}
            depthWrite={false}
            fog={false}
          />
        </points>
      ))}

      <line ref={meteorRef} geometry={meteorGeometry} visible={false}>
        <lineBasicMaterial
          ref={meteorMat}
          vertexColors
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          fog={false}
        />
      </line>
    </group>
  );
}
