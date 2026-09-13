import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { getSunPosition, sunFrameFit } from "./sunPath.js";
import { follow } from "./smoothing.js";

// The canvas is alpha:true with no scene.background, so the empty space above the
// terrain was just showing the page's static body gradient through it — the sky
// never actually changed. This gives the scene its own background color that
// darkens toward the page's own night tone instead — no hue shift, stays on
// theme with the rest of the site's purple/navy palette.
//
// Both ends are the body gradient's own stops (see index.css). Landing the night
// sky exactly on the gradient's end color is what makes the handoff into the
// sections below the hero clean: by the time the pinned hero releases, the
// canvas and the page behind it are the same color, so the mask's fade edge has
// no step to reveal.
const SKY_DAY = new THREE.Color("#3D3C95");
const SKY_NIGHT = new THREE.Color("#0A0D3D");

// Fog was a fixed color while everything around it dimmed, so at the end of the
// scroll the haze band along the horizon was markedly lighter than the sky above
// it and than the page below it — the distant dunes read as a glowing wall, and
// that band was the visible seam where the hero met the next section. It now
// rides the same curve and settles a hair above the page color, which keeps a
// whisper of atmosphere at the horizon without the step.
const FOG_DAY = new THREE.Color("#1B2550");
const FOG_NIGHT = new THREE.Color("#0F1338");

// The fog range is deliberately slack. At 9/30 the far edge of the field sat at
// 87% fog and the distant landscape was barely readable; at 11/38 it is nearer
// 60%, so the depth still reads but there is something to see in it.
//
// It does not animate. An earlier version collapsed near and far toward the lens
// across the scroll so the scene dissolved into haze on its way out — too
// heavy-handed at any setting worth having, and it made the landscape the subject
// of its own exit. The scene leaves by fading now, and fog is just atmosphere.

export default function SunsetLighting({ scrollYProgress, exitProgress, reducedMotion }) {
  const ambientRef = useRef();
  const keyRef = useRef();
  const fillRef = useRef();
  const fogRef = useRef();
  const smooth = useRef(null);
  const sink = useRef(null);
  const sky = useRef(new THREE.Color(SKY_DAY));
  const sunPos = useRef(new THREE.Vector3());
  const { camera, scene, size } = useThree();

  useEffect(() => {
    scene.background = sky.current;
  }, [scene]);

  useFrame((_, delta) => {
    const smoothed = follow(smooth, reducedMotion ? 0 : scrollYProgress.get(), delta);
    // Ease-out so most of the dimming happens in the first part of the scroll
    // instead of a straight linear ramp that reads as "starting late."
    const eased = 1 - (1 - smoothed) ** 2;

    // The descent drops the camera into the hollow on the near side of the ridge,
    // which is the side the sun has already gone behind. Its face should be in
    // shadow, and it needs to be: that face becomes the whole frame, and the page
    // continues out of it, so the closer it lands to the page's own dark the less
    // work the final crossfade has to do — too much and the crossfade has to
    // brighten back up to the page, which is what made it read as a colour swap. Not gated on reducedMotion — it is a
    // brightness change, and without it the hand-off is a bright wall.
    const shade = 1 - 0.4 * follow(sink, exitProgress.get(), delta);

    if (ambientRef.current) ambientRef.current.intensity = THREE.MathUtils.lerp(1.75, 0.6, eased) * shade;
    if (keyRef.current) keyRef.current.intensity = THREE.MathUtils.lerp(0.65, 0.15, eased) * shade;
    if (fillRef.current) fillRef.current.intensity = THREE.MathUtils.lerp(0.78, 0.2, eased) * shade;

    // Uses the smoothed value directly (not the eased one above) — Logo3D's own
    // position uses the same raw smoothed t, so this tracks the sun exactly
    // instead of the light sitting at a fixed studio position the whole time.
    if (keyRef.current) {
      // Same frame fit as Logo3D, or the light would come from the arc the sun
      // used to ride rather than the one it is on — on a phone that is a
      // noticeably lower angle than the mark you can see in the sky.
      getSunPosition(smoothed, sunPos.current, sunFrameFit(camera, size.width / size.height).y);
      keyRef.current.position.copy(sunPos.current);
    }

    sky.current.copy(SKY_DAY).lerp(SKY_NIGHT, eased);
    if (fogRef.current) fogRef.current.color.copy(FOG_DAY).lerp(FOG_NIGHT, eased);
  });

  return (
    <>
      <fog ref={fogRef} attach="fog" args={["#1B2550", 11, 38]} />
      <ambientLight ref={ambientRef} intensity={1.75} color="#C9BEFF" />
      <directionalLight ref={keyRef} position={[4, 6, 3]} intensity={0.65} color="#B98CE0" />
      <directionalLight ref={fillRef} position={[-5, 3, -2]} intensity={0.78} color="#5288C7" />
    </>
  );
}
