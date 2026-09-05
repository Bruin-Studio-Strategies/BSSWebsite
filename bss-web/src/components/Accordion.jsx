import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];

// Was a filled bg-blue-950 block with a sort-arrow icon and an EB Garamond
// title. Rebuilt as a ruled row: the divider between questions is the only
// structure it needs, which lets a stack of them read as a printed index rather
// than as a column of buttons.
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
        className="group flex w-full items-start justify-between gap-8 py-6 text-left"
      >
        <span className="font-display text-xl leading-snug text-white transition-colors duration-200 group-hover:text-white sm:text-2xl">
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
            className="overflow-hidden"
          >
            <p className="max-w-[46rem] pb-7 font-sans text-base leading-relaxed text-white/70">
              {children}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
