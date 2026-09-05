import { createContext, useContext, useLayoutEffect } from "react";

// The channel between the page transition's curtain and whatever is still
// getting ready behind it. Its own module rather than a second export from
// `PageTransition.jsx` so that file stays components-only and keeps fast refresh.
export const GateContext = createContext(null);

/**
 * Hold the curtain down while something behind it is still getting ready.
 *
 * The landing page's 3D scene is the only caller: it holds from first render
 * until the terrain has actually painted, which is what turns the curtain into
 * that page's loading screen without there being a second component for it.
 */
export default function useSceneGate(active) {
  const gate = useContext(GateContext);

  // Layout effect, not effect: the gate has to be registered in the same commit
  // the landing page first renders in, or the curtain will already have decided
  // there is nothing to wait for and started its reveal.
  useLayoutEffect(() => {
    if (!gate || !active) return undefined;
    return gate();
  }, [gate, active]);
}
