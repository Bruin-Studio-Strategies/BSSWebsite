import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import logo from "../assets/logo-plain.png";

// Fixed + high z-index so this sits above the nav bar and hero text regardless of
// where it's mounted in the tree — it's meant to block the whole page, not just
// the hero's own box, until the 3D scene has actually finished painting. Portaled
// to document.body because the hero container uses a CSS mask-image for its fade
// edge, and Chromium mis-composites a position:fixed sibling underneath a masked
// element in the same DOM subtree regardless of z-index — the portal sidesteps it.
const GRADIENT_BG = "linear-gradient(#3D3C95, 20%, #0a0d3d)";

export default function LoadingSplash({ visible, reducedMotion }) {
  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center gap-6"
          style={{ background: GRADIENT_BG }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <motion.img
            src={logo}
            alt=""
            className="h-16 w-16 sm:h-20 sm:w-20"
            animate={reducedMotion ? { rotate: 0 } : { rotate: 360 }}
            transition={
              reducedMotion ? undefined : { duration: 1.4, repeat: Infinity, ease: "linear" }
            }
          />
          <div className="h-1 w-40 sm:w-48 overflow-hidden rounded-full bg-white/15">
            <motion.div
              className="h-full w-1/3 rounded-full bg-white/80"
              animate={reducedMotion ? { x: "0%" } : { x: ["-100%", "300%"] }}
              transition={
                reducedMotion ? undefined : { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
              }
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
