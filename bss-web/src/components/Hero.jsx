import { motion, useReducedMotion, useTransform } from "framer-motion";
import { OPENER_ALIGN, OPENER_ITEMS } from "./openerAlignment.js";

const EASE = [0.16, 1, 0.3, 1];

const headlineContainer = {
  hidden: {},
  // Tightened from 0.12/0.27. The old timing meant the headline was still
  // arriving most of a second in, and on a phone that lands right after the
  // loading screen lifts — so the first thing you saw was an empty hero.
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

// rotateX flip-in (needs the h1's [perspective] below) instead of a flat
// fade, so the headline reads with a bit more presence on load.
const wordVariant = {
  hidden: { opacity: 0, y: 28, rotateX: -50 },
  show: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.65, ease: EASE } },
};

const reducedWordVariant = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5 } },
};

function fadeUpProps(delay, reduced) {
  return {
    initial: { opacity: 0, y: reduced ? 0 : 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: EASE },
  };
}

export default function Hero({ scrollYProgress, copy }) {
  const reduced = !!useReducedMotion();

  // Whole block moves and fades together. The drift itself is capped small
  // (-25px total) so the fade can stretch across most of the scroll range
  // without ever reading as climbing toward the navbar the way it used to.
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -25]);
  // Holds at full opacity for most of the pin and only then fades, so the headline
  // is read solid rather than already dimming from the first tick. The fade ends at
  // 0.98, just before the copy unpins, so nothing is left to scroll away half-lit.
  const opacity = useTransform(scrollYProgress, [0.7, 0.98], [1, 0]);

  const wv = reduced ? reducedWordVariant : wordVariant;

  return (
    <motion.div
      style={{ y, opacity }}
      // Centred below md, left from md up, like every section opener on the site
      // (see openerAlignment.js). The ml-2 nudges are md-only because an offset
      // on centred text pulls it off-axis.
      className={`relative flex flex-col ${OPENER_ITEMS} ${OPENER_ALIGN}`}
    >
      {/* A paragraph, not a heading. It was an h4 sitting in front of the h1,
          which made the page's outline open on a fourth-level heading — this is
          a label over the headline, and it carries no section of its own. */}
      <motion.p
        {...fadeUpProps(0.05, reduced)}
        // Scales with the headline. It stopped at text-base while "Success" grew to
        // 128px, and at desktop the label read as a caption stranded above it.
        className="font-sans text-base sm:text-lg md:text-xl lg:text-2xl text-white/60 font-medium md:ml-2 tracking-wide"
      >
        {copy.label}
      </motion.p>

      <motion.h1
        variants={headlineContainer}
        initial="hidden"
        animate="show"
        // The tablet step is md, not sm: from 576px the desktop sizes (60/96px) broke
        // "Cut to" and "Success" onto separate lines and filled a tablet's width.
        className="font-display text-4xl md:text-6xl lg:text-8xl text-white [perspective:1000px]"
      >
        <motion.span variants={wv} className="inline-block">
          {copy.headlineLead}
        </motion.span>{" "}
        <motion.span variants={wv} className="inline-block text-6xl md:text-8xl lg:text-9xl font-medium">
          {copy.headlineAccent}
        </motion.span>
      </motion.h1>

      <motion.p
        {...fadeUpProps(0.3, reduced)}
        // Same scale as the label above, for the same reason. Held to one line only
        // from lg: at these sizes a tablet column is too narrow for it, and nowrap
        // there pushed it past the edge.
        className="w-5/6 sm:w-auto lg:whitespace-nowrap md:ml-2 mt-8 sm:mt-5 md:mt-6 text-base sm:text-lg md:text-xl lg:text-2xl text-white/70"
      >
        {copy.subline}
      </motion.p>
    </motion.div>
  );
}
