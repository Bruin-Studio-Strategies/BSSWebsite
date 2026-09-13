import {
  OPENER_ACTIONS,
  OPENER_ALIGN,
  OPENER_BALANCE,
  OPENER_MEASURE,
} from "./openerAlignment.js";

// The site's section opener: sky eyebrow → Agatho headline → white/70 lede, with
// an optional action under it. Every page header and section heading on the
// interior pages renders through here, so what an opener looks like — and where
// it sits, centred below md and left from md up — is decided once. It used to be
// the same dozen lines of markup pasted into five pages, which is how one page
// could end up aligned differently from the next.
//
// `size` is the headline's rank: "page" opens a page (h2), "section" opens a
// section inside one (h3). Both step down one size per breakpoint below md —
// page 36/48/60px, section 30/36/48px across phone, tablet and desktop. At the
// desktop sizes on a 312px phone column a page headline filled the width edge to
// edge and a three-word question took three lines, which read as cramped rather
// than confident. The landing page is not a caller — its blocks animate and run
// their own scale — but it takes the same alignment from openerAlignment.js.
const TITLE = {
  page: { Tag: "h2", classes: "text-4xl leading-[1.05] sm:text-5xl md:text-6xl" },
  section: { Tag: "h3", classes: "text-3xl leading-[1.1] sm:text-4xl md:text-5xl" },
};

export default function SectionOpener({
  eyebrow,
  title,
  size = "section",
  titleClassName = "",
  // The lede's max-width, as its own prop rather than an extra class: two max-w
  // utilities on one element resolve by stylesheet order, not by which was passed.
  measure = "max-w-[42rem]",
  ledeClassName = "",
  action,
  className = "",
  children,
}) {
  const { Tag, classes } = TITLE[size];

  return (
    <div className={`${OPENER_ALIGN} ${className}`}>
      <span className="inline-block font-sans text-xs font-semibold uppercase tracking-[0.2em] text-sky">
        {eyebrow}
      </span>
      <Tag
        className={`mt-4 font-display text-white ${classes} ${OPENER_MEASURE} ${OPENER_BALANCE} ${titleClassName}`}
      >
        {title}
      </Tag>
      {children && (
        <p
          className={`mt-6 font-sans text-sm leading-relaxed text-white/70 sm:text-base ${measure} ${OPENER_MEASURE} ${OPENER_BALANCE} ${ledeClassName}`}
        >
          {children}
        </p>
      )}
      {action && <div className={`flex ${OPENER_ACTIONS}`}>{action}</div>}
    </div>
  );
}
