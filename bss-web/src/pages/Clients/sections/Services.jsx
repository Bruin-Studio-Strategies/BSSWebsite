import { useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "framer-motion";

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
  // Hover alone drives the motif's actor. Reduced motion parks it at the far end
  // of its travel, so the drawing still reads as finished without moving.
  const progress = useMotionValue(reduced ? 1 : 0);
  const [hovered, setHovered] = useState(false);

  const onHover = (isOver) => {
    setHovered(isOver);
    if (reduced) return;
    // Slow on the way in so the move is watchable rather than a flick, and a
    // little quicker on the way out so the card settles without dragging.
    animate(progress, isOver ? 1 : 0, {
      duration: isOver ? 1.5 : 0.9,
      ease: EASE,
    });
  };

  return (
    <motion.li
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
      // Cards carry an actual surface tone, not just a hairline. Transparent
      // panels on a dark gradient read as the same plane as the page, which is
      // why the section felt blended together.
      //
      // The fill is white-alpha rather than navy: navy separates near the top of
      // the page gradient but is indistinguishable from it lower down, at 1.02:1
      // — which is exactly where this section sits. A white veil holds roughly
      // the same separation at every height instead.
      className={`group relative rounded-xl border p-5 transition-colors duration-300 sm:p-6 ${
        hovered
          ? "border-sky/50 bg-white/[0.09]"
          : "border-white/15 bg-white/[0.055]"
      }`}
    >
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

      <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
        {SERVICES.map((service, i) => (
          <ServiceCell key={service.title} service={service} index={i} reduced={reduced} />
        ))}
      </ul>
    </section>
  );
}
