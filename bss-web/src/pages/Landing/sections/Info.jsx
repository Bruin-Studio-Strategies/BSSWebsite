import { motion, useReducedMotion } from "framer-motion";
import { FaQuoteLeft } from "react-icons/fa";
import group from "../../../assets/IMG_9814.JPG";
import paramountLogo from "../../../assets/paramount.png"; // transparent Paramount logo
import { OPENER_ALIGN, OPENER_BALANCE, OPENER_MEASURE } from "../../../components/openerAlignment.js";

const EASE = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const viewport = { once: true, amount: 0.3 };

export default function Info() {
  const reducedMotion = useReducedMotion();

  // The first block has no entrance of its own — no fade, no reveal, no gate. It
  // is printed on the dune: by the time it is on screen the hero's descent has
  // landed and cleared the wireframe off the surface behind it, and that bare
  // surface is this section's background. Anything that animated this copy read as
  // it arriving from somewhere else, which is exactly wrong. The testimonial below
  // is past the scene and keeps the house scroll reveal.
  return (
    <>
      <section className="mx-auto max-w-6xl px-[10%] sm:px-10 md:px-14 lg:px-20 py-20 sm:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10 sm:gap-14 lg:gap-20">
          <motion.div className={OPENER_ALIGN}>
            <motion.span
              className="inline-block font-sans text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-sky"
            >
              Who We Are
            </motion.span>
            <motion.h3
              className={`font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mt-4 mb-6 leading-[1.1] ${OPENER_BALANCE}`}
            >
              What is BSS?
            </motion.h3>
            <motion.p
              className={`font-sans text-sm sm:text-base md:text-lg lg:text-xl text-white/70 leading-relaxed max-w-xl ${OPENER_MEASURE} ${OPENER_BALANCE}`}
            >
              Bruin Studio Strategies, UCLA's first and premier entertainment consulting group,
              unites technical consulting fundamentals, technology, and Gen-Z insights to deliver
              actionable insights amidst the fast-paced and malleable entertainment ecosystems.
            </motion.p>
          </motion.div>

          <motion.div className="relative">
            <motion.div
              className="absolute -inset-3 rounded-2xl bg-gradient-to-br from-purple/40 via-magenta/20 to-sky/30 blur-2xl"
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
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-[10%] sm:px-10 pb-20 sm:pb-28">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          variants={stagger}
          className="border-l-2 border-magenta/60 pl-6 sm:pl-10"
        >
          <motion.div variants={fadeUp}>
            <FaQuoteLeft className="text-magenta/60 text-2xl sm:text-3xl mb-6" />
          </motion.div>
          <motion.blockquote
            variants={fadeUp}
            // Inter Light, not a serif. It was EB Garamond italic (being retired),
            // then Agatho — but four lines of Agatho is running text in a face
            // built for headings, which the Serif-Asserts Rule rules out, and it
            // read as heavy. The magenta rule and the quote mark are what mark it
            // as a quote; the face does not have to. Body size on phones, where
            // at anything larger this quote filled the screen on its own.
            className="font-sans font-light text-sm leading-relaxed text-white/90 sm:text-base md:text-2xl md:leading-snug lg:text-3xl"
          >
            "Partnering with the Bruin Studios Strategies group was a fantastic experience.
            Their teams brought creativity, professionalism, and real passion to our case prompt,
            delivering thoughtful and compelling presentations that reflected both hard work and
            fresh ideas."
          </motion.blockquote>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
          >
            <img
              src={paramountLogo}
              alt="Paramount Pictures logo"
              className="h-8 sm:h-9 w-auto opacity-90"
            />
            <div className="hidden h-8 w-px bg-white/20 sm:block" />
            <div>
              <p className="text-white font-semibold text-sm sm:text-base">
                Jonathon Kane
              </p>
              <p className="text-white/50 text-xs sm:text-sm">
                Manager, Business Development, Paramount Pictures
              </p>
            </div>
          </motion.div>
          <motion.p variants={fadeUp} className="mt-4 text-white/30 text-xs sm:text-sm">
            Paramount x BSS Spring 2025 Case Competition
          </motion.p>
        </motion.div>
      </section>
    </>
  );
}
