import { motion, useReducedMotion, useTransform } from "framer-motion";

import { DELIVERABLE_WEEKS, LAST_WEEK, PHASES } from "./phases.js";
import useScheduleFocus from "./useScheduleFocus.js";

const EASE = [0.16, 1, 0.3, 1];

const WEEKS = Array.from({ length: LAST_WEEK + 1 }, (_, i) => i);

const pct = (week) => `${(week / LAST_WEEK) * 100}%`;

// One shared grid for the header, every row, and the playhead overlay, so a
// phase's bar sits under the week number that labels it; changing the column
// template here moves all three together. The text column takes the free space
// and the ruler is capped, not the other way round: a Gantt track is mostly
// empty by nature, so giving it `1fr` made every description wrap early against
// a wall of blank grid. Nine weeks across ~26rem still leaves ~46px per week.
const ROW_GRID = "md:grid md:grid-cols-[1fr_minmax(0,26rem)] md:gap-x-12";

// The track is inset from its column's edges because week 0 and week 9 sit at 0%
// and 100% — without the inset their centered labels hang off both sides.
const TRACK_INSET = "mx-3";

const viewport = { once: true, amount: 0.25 };

function Gridlines() {
  return (
    <div aria-hidden="true" className="absolute inset-0">
      {WEEKS.map((week) => (
        <span
          key={week}
          className={`absolute top-0 bottom-0 w-px ${
            DELIVERABLE_WEEKS.includes(week) ? "bg-white/15" : "bg-white/[0.06]"
          }`}
          style={{ left: pct(week) }}
        />
      ))}
    </div>
  );
}

function Legend() {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 md:mt-0 md:justify-end">
      <span className="flex items-center gap-2">
        <span className="h-1.5 w-8 rounded-full bg-sky" />
        <span className="font-sans text-[0.6875rem] uppercase tracking-[0.15em] text-white/60">
          Work phase
        </span>
      </span>
      <span className="flex items-center gap-2">
        <span className="h-2 w-2 rotate-45 bg-white" />
        <span className="font-sans text-[0.6875rem] uppercase tracking-[0.15em] text-white/60">
          Client deliverable
        </span>
      </span>
    </div>
  );
}

function WeekHeader() {
  return (
    <div aria-hidden="true" className={`${ROW_GRID} md:items-end`}>
      <span className="hidden font-sans text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-white/60 md:block md:pb-2">
        Week
      </span>
      <div className={`relative hidden h-6 md:block ${TRACK_INSET}`}>
        {WEEKS.map((week) => {
          const isDeliverable = DELIVERABLE_WEEKS.includes(week);
          return (
            <span
              key={week}
              className={`absolute bottom-0 -translate-x-1/2 font-sans text-[0.6875rem] tabular-nums ${
                isDeliverable ? "font-semibold text-white" : "font-normal text-white/50"
              }`}
              style={{ left: pct(week) }}
            >
              {week}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// Focus is carried by the track and by one step of text weight — not by fading
// inactive rows out. Dimming a row to the point where it reads as "off" would
// drop its body copy to roughly 2:1 against this background; every state below
// stays at or above 5:1.
function PhaseRow({ phase, index, isActive, reducedMotion, rowRef }) {
  const isMilestone = phase.type === "milestone";

  return (
    <motion.li
      ref={rowRef}
      variants={{
        hidden: { opacity: 0, y: reducedMotion ? 0 : 16 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
      }}
      aria-current={isActive ? "step" : undefined}
      className={`relative border-t border-white/10 py-8 transition-colors sm:py-10 duration-500 first:border-t-0 ${ROW_GRID}`}
    >
      {/* Active row gets a faint wash rather than the inactive rows getting a
          fade — same focus read, no contrast cost. */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 -inset-x-4 rounded bg-white/[0.035] transition-opacity duration-300 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* `relative` so this positioned block paints above the wash behind it —
          a static child would end up underneath it. */}
      <div className="relative">
        <div className="flex items-baseline gap-3">
          <span
            className={`font-sans text-[0.6875rem] tabular-nums tracking-[0.2em] transition-colors duration-300 ${
              isActive ? "text-white/70" : "text-white/40"
            }`}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            className={`font-sans text-xs font-semibold uppercase tracking-[0.2em] transition-colors duration-300 ${
              isActive ? "text-sky" : "text-sky/70"
            }`}
          >
            {phase.period}
          </span>
        </div>
        <h3
          className={`mt-2 font-display text-xl leading-snug transition-colors duration-300 sm:text-2xl ${
            isActive ? "text-white" : "text-white/60"
          }`}
        >
          {phase.title}
        </h3>
        <p
          className={`mt-2 max-w-[42rem] font-sans text-sm leading-relaxed transition-colors duration-300 ${
            isActive ? "text-white/75" : "text-white/50"
          }`}
        >
          {phase.description}
        </p>
      </div>

      {/* Track column: where this phase actually sits in the nine weeks. The
          gridlines run the row's full height rather than a fixed strip, so five
          rows stack into one continuous schedule grid instead of five detached
          rulers. Hidden below md, where the column is too narrow to place
          anything honestly — the period copy already carries the same fact. */}
      <div className={`relative hidden min-h-[3rem] md:block ${TRACK_INSET}`}>
        <Gridlines />
        {isMilestone ? (
          // Rotation and centering live in the variants, not in Tailwind
          // classes: framer writes its own `transform`, so a `rotate-45
          // -translate-x-1/2` className is silently dropped the moment this
          // animates and the diamond renders as an off-centre square.
          <motion.span
            className={`absolute top-2 h-2.5 w-2.5 transition-colors duration-300 ${
              isActive ? "bg-white" : "bg-white/45"
            }`}
            style={{ left: pct(phase.week) }}
            variants={{
              hidden: { opacity: 0, scale: reducedMotion ? 1 : 0.4, rotate: 45, x: "-50%" },
              show: {
                opacity: 1,
                scale: 1,
                rotate: 45,
                x: "-50%",
                transition: { duration: 0.5, ease: EASE },
              },
            }}
          />
        ) : (
          <motion.span
            className={`absolute top-[0.65rem] h-1.5 origin-left rounded-full transition-colors duration-300 ${
              isActive ? "bg-sky" : "bg-sky/35"
            }`}
            style={{ left: pct(phase.from), width: pct(phase.to - phase.from) }}
            variants={{
              hidden: { scaleX: reducedMotion ? 1 : 0 },
              show: { scaleX: 1, transition: { duration: 0.7, ease: EASE } },
            }}
          />
        )}
      </div>
    </motion.li>
  );
}

export default function ProcessTimeline() {
  const reducedMotion = useReducedMotion();
  const { setRowRef, activeIndex, week } = useScheduleFocus();

  // The week rides a MotionValue straight to the compositor; only the focused
  // row's index goes through React, and that changes five times at most.
  const playheadLeft = useTransform(week, (w) => `${(w / LAST_WEEK) * 100}%`);

  return (
    <div className="relative">
      <Legend />

      <motion.div
        className="mt-8"
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
      >
        <WeekHeader />
        <ol className="relative mt-3">
          {PHASES.map((phase, i) => (
            <PhaseRow
              key={phase.title}
              rowRef={setRowRef(i)}
              phase={phase}
              index={i}
              isActive={i === activeIndex}
              reducedMotion={!!reducedMotion}
            />
          ))}

          {/* Playhead overlay: a separate grid with the same template as the rows,
              so the line lands in the track column at the same scale as the bars.
              Sits above the rows but below nothing that needs clicking, hence
              pointer-events-none. Suppressed under reduced motion, where a line
              that only means anything while it moves is just clutter. */}
          {!reducedMotion && (
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 hidden ${ROW_GRID}`}
            >
              <span />
              <div className={`relative ${TRACK_INSET}`}>
                <motion.span
                  className="absolute top-0 bottom-0 w-px bg-white/70"
                  style={{ left: playheadLeft }}
                >
                  <span className="absolute -top-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rotate-45 bg-white" />
                </motion.span>
              </div>
            </div>
          )}
        </ol>
      </motion.div>
    </div>
  );
}
