import { useCallback, useEffect, useRef, useState } from "react";
import { useMotionValue } from "framer-motion";

import { LAST_WEEK, PHASES } from "./phases.js";

// Which row is being read, and where the playhead sits on the week ruler.
//
// An earlier version derived both from one section-wide 0->1 progress value.
// That fails whenever the section is about as tall as the viewport, which this
// one is: the scroll distance during which the section is both visible and still
// moving came to ~430px total, so each of the five phases held focus for ~85px —
// less than a single mouse-wheel tick. Phases flicked past, and the milestone
// rows could be skipped entirely.
//
// Measuring each row against a focus line instead makes a phase's window equal
// to its own height, so it holds for as long as it is the thing you are looking
// at, and stays correct no matter how tall the section or the viewport is.
const FOCUS_VH = 0.42;

export default function useScheduleFocus() {
  const rowRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const week = useMotionValue(0);

  const setRowRef = useCallback(
    (i) => (el) => {
      rowRefs.current[i] = el;
    },
    []
  );

  useEffect(() => {
    let raf = null;

    const measure = () => {
      const rows = rowRefs.current.filter(Boolean);
      if (!rows.length) return;
      const focusY = window.innerHeight * FOCUS_VH;

      let best = 0;
      let bestDistance = Infinity;
      rows.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        // Distance from the focus line to the row's span, zero while the line is
        // inside the row — so the row the line is actually within always wins,
        // and rows above/below only compete when the line is between two of them.
        const distance =
          rect.top > focusY
            ? rect.top - focusY
            : rect.bottom < focusY
              ? focusY - rect.bottom
              : 0;
        if (distance < bestDistance) {
          bestDistance = distance;
          best = i;
        }
      });

      setActiveIndex((prev) => (prev === best ? prev : best));

      // Within the focused row, how far the focus line has travelled through it;
      // the playhead crosses that phase's own weeks over exactly that span. The
      // phases' head ranges tile the ruler end to end, so this stays continuous
      // across row boundaries instead of jumping.
      const rect = rows[best].getBoundingClientRect();
      const local = Math.min(
        1,
        Math.max(0, (focusY - rect.top) / Math.max(1, rect.height))
      );
      const phase = PHASES[best];
      week.set(phase.headFrom + (phase.headTo - phase.headFrom) * local);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        measure();
        raf = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [week]);

  return { setRowRef, activeIndex, week, lastWeek: LAST_WEEK };
}
