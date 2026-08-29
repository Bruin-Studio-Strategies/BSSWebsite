import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaEnvelope } from "react-icons/fa";

import {
  getHeadshot,
  HEADSHOT_WIDTH,
  HEADSHOT_HEIGHT,
} from "../pages/TeamPage/headshots.js";

const EASE = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

// The roster carries "N/A" where a field was never collected, which must not
// reach the page as literal text.
const value = (field) => (field && field !== "N/A" ? field : null);

/**
 * One member of the roster. Every card is the same size and carries the same
 * fields regardless of role — the page groups people by team, but does not rank
 * them by cell size.
 *
 * Name, role, and major sit under the portrait rather than inside a hover
 * overlay. The overlay this replaces was unreachable on touch, so on a phone
 * the old page was 37 unlabelled faces.
 */
export default function TeamCard({
  first,
  last,
  major,
  grad,
  role,
  slug,
  linkedIn,
  email,
  priority = false,
}) {
  const { src, srcSet, placeholder, isFallback } = getHeadshot(slug);
  const imgRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  // A cached image can finish decoding before React attaches onLoad, which
  // would leave the blur-up placeholder on screen permanently.
  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  const name = `${first} ${last}`;
  const profile = value(linkedIn);
  const initials = `${first?.[0] ?? ""}${last?.[0] ?? ""}`;

  // With a major, the year is an abbreviated suffix ("Economics ’27"). Without
  // one, that suffix would stand alone as a bare "’27", so it becomes a phrase.
  const study = value(major)
    ? `${major}${grad ? ` ’${String(grad).slice(-2)}` : ""}`
    : grad
      ? `Class of ${grad}`
      : null;

  return (
    <motion.li variants={fadeUp} className="group relative">
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-navy ring-1 ring-white/10 transition-shadow duration-500 group-hover:ring-sky/50 group-focus-within:ring-2 group-focus-within:ring-sky">
        {isFallback ? (
          // No headshot on file. Initials in the display face read as a
          // deliberate blank rather than as an image that failed to load.
          <span
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple/25 to-navy font-display text-4xl tracking-wide text-white/30"
          >
            {initials}
          </span>
        ) : (
          <>
            {/* 20px-wide inline WebP, blurred up. Gives the cell something to
                show while its real image is still queued behind 36 others. */}
            <img
              src={placeholder}
              alt=""
              aria-hidden="true"
              className={`absolute inset-0 h-full w-full scale-110 object-cover blur-lg transition-opacity duration-700 ${
                loaded ? "opacity-0" : "opacity-100"
              }`}
            />
            <img
              ref={imgRef}
              src={src}
              srcSet={srcSet}
              // Measured, not guessed: the container is w-4/5 capped at
              // max-w-6xl, so past 1440px each of the five cards is a fixed
              // 205px. An over-generous hint here pulls the 640 file onto
              // displays that only need the 320.
              sizes="(min-width: 1440px) 205px, (min-width: 960px) 19vw, (min-width: 576px) 26vw, 40vw"
              width={HEADSHOT_WIDTH}
              height={HEADSHOT_HEIGHT}
          // Lazy loading defers the fetch until after layout, which is the
          // right trade for the ~27 cards below the fold but a needless delay
          // for the first team. Those are requested immediately instead, and
          // marked high so they outrank the rest of the page's assets.
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "auto"}
              decoding="async"
              // Decorative: the name is adjacent visible text, so announcing it
              // here would read every person's name twice.
              alt=""
              onLoad={() => setLoaded(true)}
              className={`relative h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out group-hover:scale-[1.04] ${
                loaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </>
        )}
      </div>

      <h4 className="mt-4 font-display text-lg leading-tight text-white sm:text-xl">
        {profile ? (
          // The ::before overlay makes the whole card the LinkedIn target while
          // keeping exactly one link per person in the accessibility tree.
          <a
            href={profile}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm outline-none before:absolute before:inset-0 before:content-['']"
          >
            {name}
            <FaLinkedin
              aria-hidden="true"
              className="ml-2 inline-block -translate-y-px text-[0.7em] text-white/35 transition-colors duration-200 group-hover:text-sky"
            />
          </a>
        ) : (
          name
        )}
      </h4>

      <p className="mt-1.5 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white/70">
        {role}
      </p>
      {study && (
        <p className="mt-1 font-sans text-sm leading-snug text-white/50">
          {study}
        </p>
      )}

      {email && (
        <a
          href={`mailto:${email}`}
          // Above the card-wide overlay so the secondary action stays clickable.
          className="relative z-10 mt-2 inline-flex items-center gap-1.5 font-sans text-xs text-white/45 outline-none transition-colors duration-200 hover:text-magenta focus-visible:text-magenta focus-visible:underline focus-visible:underline-offset-4"
        >
          <FaEnvelope aria-hidden="true" className="text-[0.85em]" />
          Email
        </a>
      )}
    </motion.li>
  );
}
