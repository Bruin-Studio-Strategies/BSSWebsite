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

export default function Hero({ scrollYProgress }) {
  const reduced = !!useReducedMotion();

  // Whole block moves and fades together. The drift itself is capped small
  // (-25px total) so the fade can stretch across most of the scroll range
  // without ever reading as climbing toward the navbar the way it used to.
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -25]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  const wv = reduced ? reducedWordVariant : wordVariant;

  return (
    <motion.div
      style={{ y, opacity }}
      // Centred below md, left from md up, like every section opener on the site
      // (see openerAlignment.js). The ml-2 nudges are md-only because an offset
      // on centred text pulls it off-axis.
      className={`relative flex flex-col ${OPENER_ITEMS} ${OPENER_ALIGN}`}
    >
      <motion.h4
        {...fadeUpProps(0.05, reduced)}
        className="font-sans text-sm sm:text-base text-white/60 font-medium md:ml-2 tracking-wide"
      >
        Work with the Best
      </motion.h4>

      <motion.h1
        variants={headlineContainer}
        initial="hidden"
        animate="show"
        // The tablet step is md, not sm: from 576px the desktop sizes (60/96px) broke
        // "Cut to" and "Success" onto separate lines and filled a tablet's width.
        className="font-display text-4xl md:text-6xl lg:text-8xl text-white [perspective:1000px]"
      >
        <motion.span variants={wv} className="inline-block">
          Cut to
        </motion.span>{" "}
        <motion.span variants={wv} className="inline-block text-6xl md:text-8xl lg:text-9xl font-medium">
          Success
        </motion.span>
      </motion.h1>

      <motion.p
        {...fadeUpProps(0.3, reduced)}
        className="w-5/6 sm:w-auto sm:whitespace-nowrap md:ml-2 mt-8 sm:mt-5 text-sm sm:text-base text-white/70"
      >
        Providing strategic consulting for the entertainment industry
      </motion.p>
    </motion.div>
  );
}
