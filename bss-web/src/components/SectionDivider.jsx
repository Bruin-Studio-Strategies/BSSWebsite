import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];

/**
 * The site's one section divider: a hairline that fades out at both ends and
 * draws itself in from the centre when it first scrolls into view.
 *
 * Every page used to roll its own — two `<hr>`s on `bg-gray-100` (a stock
 * Tailwind gray, which the palette does not contain), a half-width one on the
 * team page, and this gradient version on the landing page. They are all this
 * component now, so the rhythm between sections is the same everywhere.
 *
 * `amount: 1` means the reveal waits until the whole rule is on screen, which
 * matters for a 1px element: at a lower threshold it fires while still clipped
 * and the draw-in is never seen.
 */
export default function SectionDivider({ className = "" }) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      // Scales from the centre out, so the fade at each end stays symmetrical
      // through the animation rather than sweeping in from one side.
      initial={reducedMotion ? false : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 1 }}
      transition={{ duration: 0.9, ease: EASE }}
      className={`mx-auto h-px w-11/12 max-w-3xl bg-gradient-to-r from-transparent via-white/20 to-transparent ${className}`}
    />
  );
}
