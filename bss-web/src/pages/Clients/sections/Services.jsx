import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion } from "framer-motion";

import useHoverCapable from "../../../hooks/useHoverCapable.js";

import ServiceMotif from "../../../components/ServiceMotifs/Motifs.jsx";

const EASE = [0.16, 1, 0.3, 1];

// Was a keen-slider carousel of white cards with saturated header blocks, stock
// blue circular arrows and dot pagination. A carousel earns its place when the
// slides carry imagery; these are six text descriptions, so it was hiding
// five-sixths of what BSS offers behind an interaction that bought nothing —
// exactly the thing a client evaluating the club needs to see all of at once.
//
// The motifs supply the visual material the services never had, drawn from the
// hero's own noise field rather than an icon set.
const SERVICES = [
  {
    motif: "market-research",
    title: "Market Research",
    description:
      "Our team conducts thorough research to understand market trends, audience behaviors, and potential opportunities, enabling clients to make informed, data-driven decisions.",
  },
  {
    motif: "growth-strategy",
    title: "Growth Strategy",
    description:
      "We collaborate with clients to develop and implement tailored strategies for scaling their businesses effectively and sustainably within the entertainment industry.",
  },
  {
    motif: "data-analytics",
    title: "Data Analytics",
    description:
      "Leveraging advanced data tools, we analyze key business metrics and trends to offer insights that drive smarter, evidence-based decisions.",
  },
  {
    motif: "brand-strategy",
    title: "Brand Strategy",
    description:
      "We develop compelling brand strategies that establish and reinforce a company's unique identity, ensuring long-term brand recognition and loyalty.",
  },
  {
    motif: "competitive-analysis",
    title: "Competitive Analysis",
    description:
      "We provide in-depth analysis of competitors' strategies, identifying opportunities and gaps to give our clients an advantage in a crowded market.",
  },
  {
    motif: "market-entry",
    title: "Market Entry",
    description:
      "We help companies navigate new markets by providing detailed assessments and strategies for successful entry into new segments, maximizing growth opportunities.",
  },
];

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
      className="group relative border-t border-white/15 pb-8 pt-7"
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

      <div className="flex items-baseline gap-3">
        <span
          className={`font-sans text-[0.6875rem] tabular-nums tracking-[0.2em] transition-colors duration-300 ${
            hovered ? "text-sky" : "text-white/40"
          }`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <h4 className="font-display text-xl leading-snug text-white sm:text-2xl">
          {service.title}
        </h4>
      </div>

      <div className="mt-5">
        <ServiceMotif name={service.motif} progress={progress} />
      </div>

      <p className="mt-5 font-sans text-sm leading-relaxed text-white/70">
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
      <span className="inline-block font-sans text-xs font-semibold uppercase tracking-[0.2em] text-sky">
        What We Do
      </span>
      <h3 className="mt-4 font-display text-4xl leading-[1.1] text-white sm:text-5xl">
        Our Services
      </h3>

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
