import { motion, useReducedMotion } from "framer-motion";

// Slow enough to read as a sweep across the grid, quick enough that the last of
// nineteen consultants is not still arriving a second after the first.
const grid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035, delayChildren: 0.05 } },
};

/**
 * One team of the roster: a ruled heading with its headcount, then a uniform
 * grid of TeamCards.
 *
 * The rule runs from the heading to the count so the group reads as a section
 * of one document rather than a floating centred title, matching the ruled
 * bands on the Clients page.
 */
export default function TeamContainer({ children, title, count }) {
  const reducedMotion = useReducedMotion();

  return (
    // Top margin carries the whole separation between teams — there is no rule
    // between them, since each heading already draws its own.
    <section className="mx-auto mt-20 w-4/5 max-w-6xl sm:mt-28">
      <div className="flex items-baseline gap-5">
        <h3 className="font-display text-2xl leading-none text-white sm:text-3xl md:text-4xl">
          {title}
        </h3>
        <div aria-hidden="true" className="h-px flex-1 bg-white/15" />
        {count != null && (
          <span className="font-sans text-xs tabular-nums tracking-[0.2em] text-white/40">
            {String(count).padStart(2, "0")}
          </span>
        )}
      </div>

      <motion.ul
        // The cards inherit their initial state from this list, so skipping it
        // here lands every one of them at "show" with no entrance at all.
        initial={reducedMotion ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, amount: 0.05 }}
        variants={grid}
        className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 sm:gap-x-8 md:grid-cols-4 lg:grid-cols-5"
      >
        {children}
      </motion.ul>
    </section>
  );
}
