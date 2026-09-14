// Drops a material's fragment shader to medium precision, leaving its vertex
// shader alone.
//
// three's own `precision` renderer option sets both stages at once, and the
// vertex stage must stay high: at mediump a star 90 units out lands on a ~0.1-unit
// grid and visibly swims, and the star shader's running clock loses the precision
// its twinkle needs within minutes. The fragment stage is where a phone spends its
// time — the terrain fills the frame — and phone GPUs run mediump there on
// half-width arithmetic at roughly twice the speed.
//
// A precision statement applies to everything declared after it. three's prefix
// (shared uniforms such as cameraPosition, which must match the vertex stage)
// comes before the material's own source, so putting the statement at the top of
// that source changes only the material's own work.
//
// The cost to watch for is banding in slow dark gradients — dune shadows, fog.
// Only the phone tier uses it (see useQualityTier.js): Apple-silicon Macs honour
// mediump too, and have no need to trade anything.
export function mediumpFragment(shader) {
  shader.fragmentShader = `precision mediump float;\n${shader.fragmentShader}`;
}
