import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { OPENER_ALIGN, OPENER_MEASURE } from "./openerAlignment.js";

const EASE = [0.16, 1, 0.3, 1];

// Was a filled bg-blue-950 block with a sort-arrow icon and an EB Garamond
// title. Rebuilt as a ruled row: the divider between questions is the only
// structure it needs, which lets a stack of them read as a printed index rather
// than as a column of buttons.
//
// Centred below md with the section opener above it, left from md up. The toggle
// stays on the right at every width, so a spacer of the same width sits opposite
// it while the row is centred — without it the question centres on the space left
// over beside the toggle, which lands it a few pixels off the page's axis.
export default function Accordion({ title, children }) {
  const [active, setActive] = useState(false);
  const panelId = useId();

  const reduced = useReducedMotion();

  return (
    <div className="border-t border-white/10 last:border-b">
      <button
        type="button"
        aria-expanded={active}
        aria-controls={panelId}
        onClick={() => setActive((a) => !a)}
        className={`group flex w-full items-start justify-between gap-3 py-6 sm:gap-4 md:gap-8 ${OPENER_ALIGN}`}
      >
        <span aria-hidden="true" className="mt-2 h-3 w-3 shrink-0 md:hidden" />

        {/* Balanced, because a question in Agatho on a 312px phone column breaks
            a word or two from its end — "…look for in an / applicant?" — and a
            stack of rows each ending on a stranded word reads as a layout fault. */}
        {/* One step below the Title role on phones. At 18px three of the four
            questions are 3-19px wider than the 258px the row leaves beside the
            toggle, so they each broke to two lines; at 16px the widest needs
            246px and every question sets on one line. */}
        <span className="text-balance font-display text-base leading-snug text-white transition-colors duration-200 group-hover:text-white sm:text-xl md:text-2xl">
          {title}
        </span>

        {/* A plus that loses its upright stroke to become a minus. Two hairlines
            and a transform — the same weight as the rules around it, so the
            control belongs to the typography rather than sitting on top of it
            as an icon would. */}
        <span aria-hidden="true" className="relative mt-2 h-3 w-3 shrink-0 sm:mt-3">
          <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-white/50 transition-colors duration-200 group-hover:bg-white" />
          <span
            className={`absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-white/50 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-white ${
              active ? "scale-y-0 opacity-0" : "scale-y-100 opacity-100"
            }`}
          />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {active && (
          <motion.div
            id={panelId}
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.4, ease: EASE }}
            className={`overflow-hidden ${OPENER_ALIGN}`}
          >
            <p
              className={`max-w-[46rem] pb-7 font-sans text-sm leading-relaxed text-white/70 sm:text-base ${OPENER_MEASURE}`}
            >
              {children}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
