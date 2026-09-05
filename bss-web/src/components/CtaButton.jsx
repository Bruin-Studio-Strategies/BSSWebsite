import { Link } from "react-router-dom";

// The site's one button. Everything that looks like a button on any page renders
// through here, so there is a single place the treatment lives.
//
// The gesture is a wipe, because that is this site's own gesture: the nav
// underline draws in from the left, the service cells rule in from the left, the
// recruitment spine fills from the top. The button this replaced lifted two
// pixels and grew a magenta-tinted glow on hover — a different language from
// every other interactive thing here, and the generic one.
//
// So: nothing moves, nothing glows. On hover a veil sweeps across the face from
// the left on the project easing curve. Deepening rather than fading matters —
// a primary action that gets lighter when you reach for it reads as going away.
//
// Two variants, and the difference is hierarchy rather than taste:
//
//   solid   — the page's actual call to action. Filled magenta, and by the One
//             Action Rule there is at most one per screen. Its veil is navy, so
//             the fill darkens toward the page's own ground.
//   outline — the navbar's standing link, on every page. It has to stay available
//             without competing with whatever solid button the page below it is
//             showing, so it carries the magenta as an edge and the veil that
//             sweeps in *is* the fill.
//
// Labels sit on the system's Label token — Inter 600, uppercase, letter-spaced —
// rather than a default `tracking-wide`, so a button reads as part of the same
// small-caps family as the section eyebrows.
const BASE =
  "group relative isolate inline-flex shrink-0 items-center overflow-hidden rounded-sm font-sans font-semibold uppercase text-white outline-none focus-visible:ring-1 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent";

const VARIANTS = {
  solid: {
    frame: "bg-magenta px-7 py-3 text-sm tracking-[0.18em]",
    veil: "bg-navy/35",
  },
  outline: {
    frame: "border border-magenta px-4 py-2 text-xs tracking-[0.16em]",
    veil: "bg-magenta",
  },
};

export default function CtaButton({
  to,
  href,
  variant = "solid",
  className = "",
  onClick,
  children,
}) {
  const { frame, veil } = VARIANTS[variant];
  const classes = `${BASE} ${frame} ${className}`;

  const body = (
    <>
      {/* Behind the label by DOM order rather than by z-index. Keyboard users get
          the same sweep as the mouse; reduced motion still gets the state, it
          just arrives at once instead of travelling. */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 origin-left scale-x-0 transition-transform duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none ${veil}`}
      />
      <span className="relative">{children}</span>
    </>
  );

  // An in-app destination is a router Link so it does not reload the app; an
  // external form is a plain anchor opening in its own tab.
  if (to) {
    return (
      <Link to={to} onClick={onClick} className={classes}>
        {body}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={classes}
    >
      {body}
    </a>
  );
}
