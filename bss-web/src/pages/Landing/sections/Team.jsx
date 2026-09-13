import { motion, useReducedMotion } from "framer-motion";
import ApplyButton from "../../../components/ApplyButton.jsx";
import group from "../../../assets/optimized/group-1280.webp";
import {
  OPENER_ACTIONS,
  OPENER_ALIGN,
  OPENER_BALANCE,
  OPENER_MEASURE,
} from "../../../components/openerAlignment.js";

const EASE = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: EASE } },
};

const viewport = { once: true, amount: 0.3 };

export default function Team() {
  const reducedMotion = useReducedMotion();

  return (
    // pb-* holds clearance for Footer, which is absolutely positioned (h-60 sm:h-24)
    // rather than sitting in normal flow — see Footer.jsx.
    <section className="mx-auto max-w-6xl px-[10%] sm:px-10 md:px-14 lg:px-20 pt-4 sm:pt-8 pb-96 sm:pb-60">
      <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-10 sm:gap-14 lg:gap-20">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          variants={scaleIn}
          className="relative order-2 md:order-1"
        >
          <motion.div
            className="absolute -inset-3 rounded-2xl bg-gradient-to-br from-sky/30 via-purple/20 to-magenta/30 blur-2xl"
            animate={
              reducedMotion
                ? { opacity: 0.7 }
                : { opacity: [0.55, 0.8, 0.55], scale: [1, 1.05, 1] }
            }
            transition={{ duration: 6, repeat: reducedMotion ? 0 : Infinity, ease: "easeInOut" }}
          />
          <motion.img
            src={group}
            alt="Bruin Studio Strategies group photo"
            whileHover={reducedMotion ? undefined : { scale: 1.02 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="relative w-full h-auto rounded-2xl object-cover aspect-[4/3] md:aspect-[16/10] lg:aspect-[5/3] shadow-2xl ring-1 ring-white/10"
          />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          variants={stagger}
          className={`order-1 md:order-2 ${OPENER_ALIGN}`}
        >
          <motion.span
            variants={fadeUp}
            className="inline-block font-sans text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-sky"
          >
            Meet the Team
          </motion.span>
          {/* h2, under the hero's h1 — see Info.jsx. */}
          <motion.h2
            variants={fadeUp}
            className={`font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mt-4 mb-6 leading-[1.1] ${OPENER_BALANCE}`}
          >
            Our Team
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className={`font-sans text-sm sm:text-base md:text-lg lg:text-xl text-white/70 leading-relaxed max-w-xl ${OPENER_MEASURE} ${OPENER_BALANCE}`}
          >
            At Bruin Studio Strategies, we are more than UCLA students—we are a community of
            innovators reshaping entertainment consulting. With diverse backgrounds in fields
            including data science, economics, policy, film, business, and computer science, our
            members bring diverse perspectives that blend analytical rigor with creative insight.
          </motion.p>
          <motion.p
            variants={fadeUp}
            className="mt-4 font-sans text-sm sm:text-base md:text-lg lg:text-xl text-white/70 leading-relaxed max-w-xl mx-auto md:mx-0"
          >
            We pride ourselves on fostering a free-flowing and creative environment where
            innovative ideas flourish, turning market research and unique ideas into actionable
            strategies. Driven through innovation, our team delivers bold solutions that push the
            boundaries of the entertainment industry.
          </motion.p>
          <motion.div
            variants={fadeUp}
            className={`mt-8 flex flex-col items-center gap-4 sm:flex-row ${OPENER_ACTIONS}`}
          >
            <ApplyButton />
            <span className="font-sans text-white/50 text-sm">
              Applications for Fall 2025 are live.
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
