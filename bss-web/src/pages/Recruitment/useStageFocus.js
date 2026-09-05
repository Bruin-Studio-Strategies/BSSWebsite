import { useCallback, useEffect, useRef, useState } from "react";

// Which stage you are currently reading, and how far through the sequence that
// puts you — measured from the rows themselves rather than from one section-wide
// scroll progress value.
//
// Section-wide progress breaks as soon as the section is about as tall as the
// viewport: the distance over which it is both visible and still moving can come
// to a few hundred pixels total, which divided between five stages is less than
// a mouse-wheel tick each. Measuring every row against a fixed focus line makes a
// stage's window equal to its own height, so it stays current for exactly as long
// as it is the thing on screen, at any section or viewport height.
const FOCUS_VH = 0.45;

export default function useStageFocus(count) {
  const rowRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  // How far through the current stage's own row the reader is, so the spine can
  // fill part of a segment rather than snapping a whole one at a time.
  const [within, setWithin] = useState(0);

  const setRowRef = useCallback(
    (i) => (el) => {
      rowRefs.current[i] = el;
    },
    []
  );

  const scrollToStage = useCallback((i, reduced) => {
    const el = rowRefs.current[i];
    if (!el) return;
    el.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
  }, []);

  useEffect(() => {
    let raf = null;

    const measure = () => {
      const rows = rowRefs.current.filter(Boolean);
      if (!rows.length) return;

      const focusY = window.innerHeight * FOCUS_VH;

      // The last row whose top has crossed the focus line is the one being read.
      let index = 0;
      for (let i = 0; i < rows.length; i += 1) {
        if (rows[i].getBoundingClientRect().top <= focusY) index = i;
      }

      // Carry the fraction of the way through the current row as well, so the
      // playhead travels continuously between dots instead of jumping a fifth of
      // the rail at a time.
      const rect = rows[index].getBoundingClientRect();
      const within = rect.height
        ? Math.min(Math.max((focusY - rect.top) / rect.height, 0), 1)
        : 0;

      const span = Math.max(rows.length - 1, 1);
      setActiveIndex(index);
      setWithin(within);
      setProgress(Math.min((index + within) / span, 1));
    };

    const onScroll = () => {
      if (raf !== null) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        measure();
      });
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [count]);

  return { setRowRef, activeIndex, progress, within, scrollToStage };
}
