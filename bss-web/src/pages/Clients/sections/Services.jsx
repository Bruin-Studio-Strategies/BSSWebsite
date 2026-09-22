import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion } from "framer-motion";

import useHoverCapable from "../../../hooks/useHoverCapable.js";
import { SERVICES, services } from "../content.js";

import ServiceMotif from "../../../components/ServiceMotifs/Motifs.jsx";
import SectionOpener from "../../../components/SectionOpener.jsx";
import { OPENER_ACTIONS, OPENER_ALIGN, OPENER_BALANCE } from "../../../components/openerAlignment.js";

const EASE = [0.16, 1, 0.3, 1];

// Was a keen-slider carousel of white cards with saturated header blocks, stock
// blue circular arrows and dot pagination. A carousel earns its place when the
// slides carry imagery; these are six text descriptions, so it was hiding
// five-sixths of what BSS offers behind an interaction that bought nothing —
// exactly the thing a client evaluating the club needs to see all of at once.
//
// The motifs supply the visual material the services never had, drawn from the
// hero's own noise field rather than an icon set.

function ServiceCell({ service, index, reduced }) {
  const progress = useMotionValue(reduced ? 1 : 0);
  const [hovered, setHovered] = useState(false);

  // A phone cannot hover, so gating the motifs on it meant six drawings that
  // never moved on the device most of this site is read on. There, the cell's
  // own position drives them instead: the motif plays when the cell is properly
  // on screen and rewinds when it leaves, so scrolling the page is what performs
  // the animation. `amount: 0.6` rather than a sliver, so it fires when you are
  // actually looking at the cell and not when its top edge appears.
  const canHover = useHoverCapable();
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.6 });

  // Slow on the way in so the move is watchable rather than a flick, and a
  // little quicker on the way out so the cell settles without dragging.
  const run = (on) => {
    if (reduced) return;
    animate(progress, on ? 1 : 0, { duration: on ? 1.5 : 0.9, ease: EASE });
  };

  const onHover = (isOver) => {
    if (!canHover) return;
    setHovered(isOver);
    run(isOver);
  };

  useEffect(() => {
    if (canHover) return;
    setHovered(inView);
    run(inView);
    // `run` closes over stable values only; re-running on identity would restart
    // the animation on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canHover, inView, reduced]);

  return (
    <motion.li
      ref={ref}
      onHoverStart={() => onHover(true)}
      onHoverEnd={() => onHover(false)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
      variants={{
        hidden: { opacity: 0, y: reduced ? 0 : 18 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: EASE, delay: (index % 3) * 0.08 },
        },
      }}
      // No fill. The cells are defined by the rules between them the way a
      // printed table is, which is the hairline language the recruitment
      // timeline and the process schedule already speak — a filled panel was a
      // third vocabulary on a site that only needed two.
      //
      // Rows carry padding rather than margin and the grid has no row gap, so
      // each cell's top rule butts against the one above and the ruling reads as
      // a grid rather than as six detached underlines.
      //
      // Centred below md, with the section opener above it: stacked one to a
      // row (two at tablet width) under a centred drawing, a left-aligned title
      // and description read as a second layout. From md the cells sit in a
      // three-column table and go left with the grid.
      className={`group relative border-t border-white/15 pb-8 pt-7 ${OPENER_ALIGN}`}
    >
      {/* Hover draws a sky rule over the hairline instead of tinting the cell.
          It overhangs the cell on both sides so the mark reads as belonging to
          the grid's ruling rather than to a box. */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -top-px left-0 right-0 h-px origin-left bg-sky transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none sm:-left-4 sm:-right-4 ${
          hovered ? "scale-x-100" : "scale-x-0"
        }`}
      />

      {/* The numeral stacks above the title below md. Centred inline, the pair
          centred as one unit and pushed the title ~15px right of the drawing's
          axis under it; stacked, the title sits on the axis the way a process
          phase's title does under its "01 · WEEK 0" line. */}
      <div className={`flex flex-col items-center gap-1 md:flex-row md:items-baseline md:gap-3 ${OPENER_ACTIONS}`}>
        <span
          className={`font-sans text-[0.6875rem] tabular-nums tracking-[0.2em] transition-colors duration-300 ${
            hovered ? "text-sky" : "text-white/40"
          }`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="font-display text-lg leading-snug text-white sm:text-xl md:text-2xl">
          {service.title}
        </h3>
      </div>

      <div className="mt-5">
        <ServiceMotif name={service.motif} progress={progress} />
      </div>

      <p className={`mt-5 font-sans text-sm leading-relaxed text-white/70 ${OPENER_BALANCE}`}>
        {service.description}
      </p>
    </motion.li>
  );
}

export default function Services() {
  const reduced = !!useReducedMotion();

  return (
    <section className="relative mx-auto w-4/5 max-w-6xl">
      {/* Atmosphere, not paint: the same gradient bloom the landing page puts
          behind its framed photographs, scaled up to sit under the whole grid.
          It gives the section a ground to sit on so six line drawings on flat
          navy stop reading as a spreadsheet. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-16 -top-10 bottom-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_40%,rgba(82,55,148,0.32),transparent_70%)] blur-2xl"
      />
      <SectionOpener eyebrow={services.eyebrow} title={services.title} />

      {/* Column gap only. A row gap would break every cell's top rule away from
          the cell above it and the grid would come apart into stacked cards. */}
      <ul className="mt-12 grid grid-cols-1 gap-x-8 sm:grid-cols-2 md:grid-cols-3">
        {SERVICES.map((service, i) => (
          <ServiceCell key={service.title} service={service} index={i} reduced={reduced} />
        ))}
      </ul>
    </section>
  );
}
