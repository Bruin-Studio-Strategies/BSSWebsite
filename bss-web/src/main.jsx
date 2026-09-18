import "./index.css";

import React, { useLayoutEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

/**
 * Clears the pre-JavaScript loading screen in index.html.
 *
 * A layout effect, and it wraps the app rather than living inside it: parent
 * layout effects run after their children's, so by the time this fires the first
 * commit is on screen — including PageTransition's own veil, which is what the
 * visitor keeps looking at while the hero's scene compiles. Removing it any
 * earlier would show a frame of empty page between the two.
 */
function ClearBootScreen({ children }) {
  useLayoutEffect(() => {
    document.getElementById("boot")?.remove();
  }, []);
  return children;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClearBootScreen>
      <App />
    </ClearBootScreen>
  </React.StrictMode>
);
