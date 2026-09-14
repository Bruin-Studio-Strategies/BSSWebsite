// Runs every time the landing page mounts, so the probe context has to be given
// back. A detached canvas's context is otherwise only freed whenever the garbage
// collector gets to it, and mobile browsers cap live WebGL contexts at a handful —
// each trip back to the home page used to leave one more behind.
export function isWebGLAvailable() {
  try {
    if (!window.WebGLRenderingContext) return false;
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}
