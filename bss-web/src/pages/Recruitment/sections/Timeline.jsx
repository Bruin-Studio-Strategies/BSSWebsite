import { motion, useReducedMotion } from "framer-motion";

import { STAGES } from "../stages.js";
import useStageFocus from "../useStageFocus.js";

const EASE = [0.16, 1, 0.3, 1];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const viewport = { once: true, amount: 0.2 };

// Where the dot sits inside its row: level with the eyebrow line, which is the
// first thing in the entry. Rows carry bottom padding only, so each segment runs
// from its own dot straight into the top of the next one and the spine reads as
// one continuous line rather than five ticks.
const DOT_TOP = "top-[0.3rem]";
const SEGMENT_TOP = "top-[1rem]";

function Meta({ stage }) {
  const parts = [stage.location, stage.attire].filter(Boolean);
  if (!parts.length && !stage.inviteOnly) return null;

  return (
    <p className="mt-4 font-sans text-sm text-white/50">
      {parts.join(" · ")}
      {stage.inviteOnly && (
        <>
          {parts.length > 0 && " · "}
          <span className="font-semibold uppercase tracking-[0.16em] text-sky">
            Invite only
          </span>
        </>
      )}
    </p>
  );
}

function Stage({ stage, index, isLast, state, fill, reduced, rowRef }) {
  const smooth = reduced ? "" : "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]";

  const dotTone =
    state === "current"
      ? "bg-sky scale-125"
      : state === "passed"
        ? "bg-white"
        : "bg-white/25";

  return (
    <motion.li
      ref={rowRef}
      variants={reduced ? undefined : fadeUp}
      className={`relative grid grid-cols-[1.75rem_1fr] gap-x-4 sm:grid-cols-[2.25rem_1fr] sm:gap-x-6 ${
        isLast ? "" : "pb-14 sm:pb-16"
      }`}
    >
      {/* The spine segment down to the next stage. Unlit by default; the passed
          length of it is drawn over in sky, which is what makes the line read as
          progress through the cycle rather than as a border. */}
      {!isLast && (
        <span
          aria-hidden="true"
          className={`absolute left-[0.5rem] ${SEGMENT_TOP} bottom-0 w-px -translate-x-1/2 bg-white/15 sm:left-[0.75rem]`}
        >
          <span
            className={`absolute inset-x-0 top-0 block bg-sky ${smooth}`}
            style={{ height: `${fill * 100}%` }}
          />
        </span>
      )}

      {/* The dot. */}
      <span aria-hidden="true" className="relative">
        <span
          className={`absolute left-[0.5rem] ${DOT_TOP} h-[11px] w-[11px] -translate-x-1/2 rounded-full sm:left-[0.75rem] ${dotTone} ${smooth}`}
        />
      </span>

      <div>
        <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.2em] tabular-nums text-white/40">
          <span className={`${smooth} ${state === "upcoming" ? "" : "text-white/70"}`}>
            {String(index + 1).padStart(2, "0")}
          </span>
          {stage.date && <span className="text-white/40"> — {stage.date}</span>}
          {stage.time && <span className="text-white/40"> · {stage.time}</span>}
        </p>

        <h3 className="mt-3 font-display text-2xl leading-tight text-white sm:text-3xl">
          {stage.title}
        </h3>

        <p className="mt-3 max-w-[42rem] font-sans text-base leading-relaxed text-white/70">
          {stage.description}
        </p>

        <Meta stage={stage} />
      </div>
    </motion.li>
  );
}

export default function Timeline() {
  const reduced = useReducedMotion();
  const { setRowRef, activeIndex, within } = useStageFocus(STAGES.length);

  return (
    <motion.ol
      initial={reduced ? undefined : "hidden"}
      whileInView={reduced ? undefined : "show"}
      viewport={viewport}
      variants={stagger}
    >
      {STAGES.map((stage, index) => (
        <Stage
          key={stage.title}
          stage={stage}
          index={index}
          isLast={index === STAGES.length - 1}
          state={
            index < activeIndex
              ? "passed"
              : index === activeIndex
                ? "current"
                : "upcoming"
          }
          // Segments behind you are full, the one you are in fills as you read
          // it, and the ones ahead are empty.
          fill={index < activeIndex ? 1 : index === activeIndex ? within : 0}
          reduced={reduced}
          rowRef={setRowRef(index)}
        />
      ))}
    </motion.ol>
  );
}
