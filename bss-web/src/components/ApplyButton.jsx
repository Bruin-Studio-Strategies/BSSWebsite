import { APPLICATION_URL } from "../applyLink.js";

// Every "Apply Now" on the site renders through here, so the button has one
// shape, one hover, and one destination. Before this there were four call sites
// carrying three different treatments and three different form links.
//
// Two variants, and the difference between them is hierarchy rather than taste:
//
//   solid   — the page's actual call to action. Filled magenta, and by the
//             One Action Rule there is at most one of these per screen.
//   outline — the navbar's standing link, present on every page. It has to stay
//             available without competing with whatever solid button the page
//             below it is showing, so it borrows the magenta as an edge and only
//             fills on hover. It also stays in sentence case, because the rest
//             of the navbar's labels are.
//
// Lift-on-hover is CSS rather than framer-motion so the button carries no
// animation library of its own; `motion-reduce` drops the movement.
const BASE =
  "group inline-flex shrink-0 items-center rounded-sm font-sans text-sm text-white transition-all duration-200 ease-out motion-reduce:transition-none";

const VARIANTS = {
  solid:
    "gap-3 bg-magenta px-6 py-3 font-semibold uppercase tracking-wide hover:-translate-y-0.5 hover:bg-magenta/80 hover:shadow-lg hover:shadow-magenta/30 active:translate-y-0 active:shadow-none motion-reduce:hover:translate-y-0",
  outline:
    "gap-2 border border-magenta px-4 py-2 hover:-translate-y-0.5 hover:bg-magenta active:translate-y-0 motion-reduce:hover:translate-y-0",
};

export default function ApplyButton({
  variant = "solid",
  className = "",
  onClick,
  children = "Apply Now",
}) {
  return (
    <a
      href={APPLICATION_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={`${BASE} ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </a>
  );
}
