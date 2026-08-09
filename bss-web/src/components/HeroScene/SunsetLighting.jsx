import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { getSunPosition } from "./sunPath.js";

// The canvas is alpha:true with no scene.background, so the empty space above the
// terrain was just showing the page's static body gradient through it — the sky
// never actually changed. This gives the scene its own background color that
// darkens toward the page's own night tone instead — no hue shift, stays on
// theme with the rest of the site's purple/navy palette.
const SKY_DAY = new THREE.Color("#3D3C95");
const SKY_NIGHT = new THREE.Color("#141338");

export default function SunsetLighting({ scrollYProgress, reducedMotion }) {
  const ambientRef = useRef();
  const keyRef = useRef();
  const fillRef = useRef();
  const smooth = useRef(0);
  const sky = useRef(new THREE.Color(SKY_DAY));
  const sunPos = useRef(new THREE.Vector3());
  const { scene } = useThree();

  useEffect(() => {
    scene.background = sky.current;
  }, [scene]);

  useFrame(() => {
    const target = reducedMotion ? 0 : scrollYProgress.get();
    smooth.current += (target - smooth.current) * 0.06;
    // Ease-out so most of the dimming happens in the first part of the scroll
    // instead of a straight linear ramp that reads as "starting late."
    const eased = 1 - (1 - smooth.current) ** 2;

    if (ambientRef.current) ambientRef.current.intensity = THREE.MathUtils.lerp(1.75, 0.6, eased);
    if (keyRef.current) keyRef.current.intensity = THREE.MathUtils.lerp(0.65, 0.15, eased);
    if (fillRef.current) fillRef.current.intensity = THREE.MathUtils.lerp(0.78, 0.2, eased);

    // Uses smooth.current directly (not the eased value above) — Logo3D's own
    // position uses the same raw smoothed t, so this tracks the sun exactly
    // instead of the light sitting at a fixed studio position the whole time.
    if (keyRef.current) {
      getSunPosition(smooth.current, sunPos.current);
      keyRef.current.position.copy(sunPos.current);
    }

    sky.current.copy(SKY_DAY).lerp(SKY_NIGHT, eased);
  });

  return (
    <>
      <fog attach="fog" args={["#1B2550", 9, 30]} />
      <ambientLight ref={ambientRef} intensity={1.75} color="#C9BEFF" />
      <directionalLight ref={keyRef} position={[4, 6, 3]} intensity={0.65} color="#B98CE0" />
      <directionalLight ref={fillRef} position={[-5, 3, -2]} intensity={0.78} color="#5288C7" />
    </>
  );
}
