import { useEffect, useRef } from "react";
import { motion, useTransform } from "framer-motion";

import {
  BOX,
  GRID_STEP,
  markTriangles,
  meshWithHole,
  ridgePath,
  scatterPoints,
  toSmoothPath,
} from "./geometry.js";

const EASE = [0.16, 1, 0.3, 1];

const COLS_GRID = Math.floor(BOX.w / GRID_STEP);
const ROWS_GRID = Math.floor(BOX.h / GRID_STEP);

// Six drawings, one system. Every motif is the service's verb rather than a
// picture of its noun — reading the landscape, climbing it, finding the line
// through the noise, propagating, positioning, getting through — so none of
// them can be mistaken for stock iconography.
//
// The family holds because they share: the same 160x120 box, the same hairline
// grid, 1px non-scaling strokes at white/25, and a locator as the single actor
// in every one of them, moved on hover.

const stroke = {
  vectorEffect: "non-scaling-stroke",
  fill: "none",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

// Strokes draw themselves in when the card first scrolls into view; the actor
// then answers hover. No idle animation — six perpetually moving diagrams on one
// screen would be noise, and the page already carries a 3D hero.
//
// IMPORTANT: an element animating `pathLength` must not carry `style={stroke}`
// itself. framer implements pathLength by writing stroke-dasharray/-dashoffset
// into that same style object, and a style prop supplied alongside it leaves the
// dash pattern half-applied — the stroke then renders as detached fragments with
// gaps. Put the shared stroke style on a wrapping <g> instead.
const draw = (delay = 0) => ({
  hidden: { pathLength: 0, opacity: 0 },
  show: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.5, ease: EASE, delay },
      opacity: { duration: 0.5, delay },
    },
  },
});

const fade = (delay = 0) => ({
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8, ease: EASE, delay } },
});

/**
 * The actor: a locator — a filled node inside a halo ring.
 *
 * Previous versions used the brand mark, first redrawn and then lifted verbatim
 * from the brand kit's vector. Neither worked, and the reason was not the
 * drawing: a logo is meant to be seen once, at size, as an identity. Repeated
 * six times at twenty pixels and crawling around inside diagrams it stops
 * reading as the mark and starts reading as a stray graphic, which cheapens it.
 *
 * A locator says exactly one thing — "the position under examination" — at any
 * size, in two shapes. It is drawn centred on the origin so a translate alone
 * places it, and it takes its colour from the wrapper.
 */
function Locator({ size = 20 }) {
  return (
    <>
      {/* Bloom, then ring, then node. The bloom is a real filled circle rather
          than only a blur filter, so the glow still reads on displays and
          browsers that render filters conservatively. */}
      <circle r={size * 0.5} fill="currentColor" opacity="0.1" />
      <circle
        r={size * 0.32}
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.45"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
      <circle r={size * 0.13} fill="currentColor" />
    </>
  );
}

// Two stops: a tight core and a wider falloff. A single large blur reads as a
// smudge, while a tight one alone barely registers against the dark field.
const GLOW = "drop-shadow(0 0 2px rgba(82,136,199,0.85)) drop-shadow(0 0 7px rgba(82,136,199,0.5))";

/** Positioned by a MotionValue rather than variants, so hover can scrub it. */
function Actor({ x, y, size, opacity, scale }) {
  return (
    <motion.g className="text-sky" style={{ x, y, opacity, scale, filter: GLOW }}>
      <Locator size={size} />
    </motion.g>
  );
}

/**
 * Spins its children about its own origin.
 *
 * Rotation is written straight to the SVG `transform` attribute from the motion
 * value, because every CSS route to this was ambiguous: framer reads
 * originX/originY as fractions on HTML but pixels on SVG, transform-box changes
 * what transform-origin resolves against, and framer's default origin for an SVG
 * element is its bounding-box centre — which for these triangles sits a quarter
 * of the radius off the centroid, so they orbited instead of turning in place.
 * `rotate(deg)` with no centre given is plain SVG and pivots on the local
 * origin, which the parent translate has already put on the dot. Set through a
 * ref so it updates per frame without re-rendering.
 */
function SpinGroup({ angle, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const apply = (value) => {
      if (ref.current) ref.current.setAttribute("transform", `rotate(${value})`);
    };
    apply(angle.get());
    return angle.on("change", apply);
  }, [angle]);

  return <g ref={ref}>{children}</g>;
}

function Grid() {
  return (
    <g className="stroke-white/[0.06]" style={stroke} strokeWidth="1">
      {Array.from({ length: COLS_GRID - 1 }, (_, i) => (
        <line key={`v${i}`} x1={(i + 1) * GRID_STEP} y1="0" x2={(i + 1) * GRID_STEP} y2={BOX.h} />
      ))}
      {Array.from({ length: ROWS_GRID - 1 }, (_, i) => (
        <line key={`h${i}`} x1="0" y1={(i + 1) * GRID_STEP} x2={BOX.w} y2={(i + 1) * GRID_STEP} />
      ))}
    </g>
  );
}

function Frame({ children, grid = true }) {
  return (
    <svg
      viewBox={`0 0 ${BOX.w} ${BOX.h}`}
      className="h-auto w-full overflow-visible"
      aria-hidden="true"
    >
      {grid && <Grid />}
      {children}
    </svg>
  );
}

// Hover progress runs the full 0..1, so the actors use the whole range.
const TRAVEL = [0, 1];

/**
 * 01 — Searching a market: a scan sweeping a field, and what it finds.
 *
 * Two earlier attempts built this out of the noise field — open ridges, then
 * closed contour rings — and both read as squiggles, because noise-derived
 * shapes are squiggles. Nothing here is random: exact concentric circles, a
 * bezel of evenly spaced ticks, and a sweep line at a computed angle. A scan is
 * also the only one of these drawings whose meaning nobody has to be told.
 */
function MarketResearch({ progress }) {
  const cx = 80;
  const cy = 60;
  const rings = [15, 29, 43];
  const ticks = Array.from({ length: 16 }, (_, i) => (i / 16) * 360);
  // The sweep is drawn to a computed endpoint rather than rotated. Rotating it
  // put the pivot at the line's bounding-box centre — framer's default origin
  // for an SVG element — so the sweep swung about its own middle instead of the
  // centre of the scan. With x1/y1 pinned to the centre and only the far end
  // moving, the line cannot come off the centre.
  const angle = useTransform(progress, TRAVEL, [-125, 145]);
  const sweepX = useTransform(angle, (deg) => cx + Math.cos((deg * Math.PI) / 180) * 43);
  const sweepY = useTransform(angle, (deg) => cy + Math.sin((deg * Math.PI) / 180) * 43);
  // The find brightens as the sweep reaches it rather than being lit the whole
  // time, so the scan reads as doing something.
  const findOpacity = useTransform(progress, [0.45, 0.62, 1], [0.25, 1, 1]);

  return (
    <Frame grid={false}>
      <g className="stroke-white/20" style={stroke} strokeWidth="1.25">
        {rings.map((r, i) => (
          <motion.circle key={r} cx={cx} cy={cy} r={r} variants={fade(0.1 + i * 0.14)} />
        ))}
        <motion.line x1={cx - 50} y1={cy} x2={cx + 50} y2={cy} variants={draw(0.3)} />
        <motion.line x1={cx} y1={cy - 50} x2={cx} y2={cy + 50} variants={draw(0.36)} />
      </g>

      <g className="stroke-white/25" style={stroke} strokeWidth="1.25">
        {ticks.map((deg) => {
          const a = (deg * Math.PI) / 180;
          const inner = deg % 90 === 0 ? 46 : 49;
          return (
            <motion.line
              key={deg}
              x1={cx + Math.cos(a) * inner}
              y1={cy + Math.sin(a) * inner}
              x2={cx + Math.cos(a) * 53}
              y2={cy + Math.sin(a) * 53}
              variants={fade(0.4 + (deg / 360) * 0.3)}
            />
          );
        })}
      </g>

      <g className="stroke-sky" style={stroke} strokeWidth="1.25">
        <motion.line x1={cx} y1={cy} x2={sweepX} y2={sweepY} variants={fade(0.5)} />
      </g>

      <motion.g style={{ opacity: findOpacity }}>
        <Actor x={cx + 26} y={cy - 19} size={18} />
      </motion.g>
    </Frame>
  );
}

/**
 * 02 — Compounding: a staircase whose risers double.
 *
 * Earlier versions were a noise ridge and then a projection fan. Neither said
 * the thing that matters: growth here is compounding, so each step gains more
 * than the one before it. The riser heights follow 2^i, and a faint continuous
 * curve behind them traces the same function — the steps are what a client
 * actually experiences, the curve is what it adds up to.
 */
function GrowthStrategy({ progress }) {
  const x0 = 14;
  const x1 = 148;
  const base = 104;
  const top = 18;
  const steps = 6;
  const span = base - top;
  const denom = 2 ** steps - 1;

  const level = (i) => base - ((2 ** i - 1) / denom) * span;
  const xAt = (i) => x0 + (i / steps) * (x1 - x0);

  // Stepped path: run out along the current level, then rise to the next.
  let stair = `M ${x0} ${base}`;
  for (let i = 1; i <= steps; i += 1) {
    stair += ` H ${xAt(i).toFixed(2)} V ${level(i).toFixed(2)}`;
  }

  // The same function sampled smoothly, drawn faintly behind the steps.
  const curve = [];
  for (let i = 0; i <= 48; i += 1) {
    const t = i / 48;
    curve.push([x0 + t * (x1 - x0), base - ((2 ** (t * steps) - 1) / denom) * span]);
  }

  const stops = Array.from({ length: steps + 1 }, (_, i) => i / steps);
  const x = useTransform(progress, stops, stops.map((_, i) => xAt(i)));
  const y = useTransform(progress, stops, stops.map((_, i) => level(i)));

  return (
    <Frame>
      <g className="stroke-white/15" style={stroke} strokeWidth="1">
        <motion.path d={toSmoothPath(curve)} variants={draw(0.5)} />
      </g>
      <g className="stroke-white/30" style={stroke} strokeWidth="1.25">
        <motion.path d={stair} variants={draw()} />
      </g>
      <Actor x={x} y={y} size={20} />
    </Frame>
  );
}

/** 03 — Signal from noise: scatter, and the line fitted through it. */
function DataAnalytics({ progress }) {
  const pts = scatterPoints(17);
  const x = useTransform(progress, TRAVEL, [12, 148]);
  const y = useTransform(progress, TRAVEL, [87, 41]);
  return (
    <Frame>
      <g className="fill-white/30">
        {pts.map(([px, py], i) => (
          <motion.circle key={i} cx={px} cy={py} r="2.1" variants={fade(i * 0.055)} />
        ))}
      </g>
      <g className="stroke-sky/70" style={stroke} strokeWidth="1.25">
        <motion.line x1="10" y1="88" x2="150" y2="40" variants={draw(0.55)} />
      </g>
      <Actor x={x} y={y} size={20} />
    </Frame>
  );
}

/**
 * 04 — Locking on: three rings of the mark's geometry, each turning at its own
 * rate until they align.
 *
 * The triangles start scattered at different angles and rotate at different
 * speeds toward zero, so they converge into register at the end of the travel —
 * the brand resolving into one aligned thing rather than a shape that merely
 * gets bigger.
 *
 * Each triangle is generated about the origin and then translated into place, so
 * rotation happens about its own centre. Rotating it where it sits and naming a
 * centre through transform-origin is what put the scan's sweep off-axis: for SVG
 * elements framer takes the bounding-box centre by default, and a triangle's
 * bounding box is not centred on its centroid.
 */
function BrandStrategy({ progress }) {
  const radii = [26, 40, 54];
  const rotA = useTransform(progress, TRAVEL, [-52, 0]);
  const rotB = useTransform(progress, TRAVEL, [78, 0]);
  const rotC = useTransform(progress, TRAVEL, [-124, 0]);
  // SVG's own rotate() with no centre given pivots on the element's local
  // origin, which after this translate is the middle of the composition. Driving
  // the transform attribute directly sidesteps CSS transform-origin altogether:
  // framer reads originX/originY as fractions on HTML but pixels on SVG, and
  // that mismatch had the triangles swinging around a bounding-box edge — they
  // orbited the centre instead of turning in place.
  // Rotation only — the shared translate lives on the wrapper below. Positioning
  // the rings and the locator separately and trusting two different transform
  // systems to agree is what pulled them off each other; inside one translated
  // group they cannot drift apart, because they are drawn in the same space.
  // SVG rotate() with no centre given pivots on the local origin, which the
  // wrapper's translate has already put at the middle.
  const angles = [rotA, rotB, rotC];
  const scale = useTransform(progress, TRAVEL, [0.82, 1]);

  return (
    <Frame>
      {/* One translate for the whole composition: the rings and the dot are
          drawn in the same space, so they cannot drift off each other, and the
          dot is exactly the axis every triangle turns about. */}
      <g transform="translate(80 60)">
        {radii.map((r, i) => (
          <SpinGroup key={r} angle={angles[i]}>
            <motion.polygon
              className="stroke-white/25"
              points={markTriangles({ cx: 0, cy: 0, r, count: 1 })[0]}
              style={stroke}
              strokeWidth="1.25"
              variants={fade(0.12 + i * 0.14)}
            />
          </SpinGroup>
        ))}
        <Actor x={0} y={0} size={24} scale={scale} />
      </g>
    </Frame>
  );
}

/**
 * 05 — Contested ground: overlapping territories, and where ours is clear.
 *
 * A 2x2 with markers scattered in it was legible but said nothing a hundred
 * other consulting pages do not. Overlap is the actual subject of competitive
 * analysis: who holds what, where those claims collide, and which ground is
 * yours alone. The locator starts in the contested middle and settles into the
 * part of our territory nobody else reaches.
 */
function CompetitiveAnalysis({ progress }) {
  const rivals = [
    { cx: 58, cy: 46, r: 30 },
    { cx: 102, cy: 44, r: 26 },
  ];
  const ours = { cx: 76, cy: 76, r: 33 };
  const x = useTransform(progress, TRAVEL, [82, 62]);
  const y = useTransform(progress, TRAVEL, [54, 95]);

  return (
    <Frame>
      <g className="stroke-white/25" style={stroke} strokeWidth="1.25">
        {rivals.map((c, i) => (
          <motion.circle key={i} cx={c.cx} cy={c.cy} r={c.r} variants={draw(i * 0.16)} />
        ))}
      </g>
      {/* Ours carries a wash as well as a stroke, so which territory is being
          talked about is settled before any motion happens. */}
      <motion.circle
        className="fill-sky/[0.07]"
        cx={ours.cx}
        cy={ours.cy}
        r={ours.r}
        variants={fade(0.4)}
      />
      <g className="stroke-sky/70" style={stroke} strokeWidth="1.25">
        <motion.circle cx={ours.cx} cy={ours.cy} r={ours.r} variants={draw(0.32)} />
      </g>
      <Actor x={x} y={y} size={20} />
    </Frame>
  );
}

/**
 * 06 — Getting through: a void torn in the mesh, and the way through it.
 *
 * The mesh is one continuous surface displaced around an opening rather than a
 * picket of bars with a gap, so it reads as a surface that has been opened. The
 * actor crosses to the opening and then shrinks through it; the travel finishes
 * before the vanish begins, or it dissolves mid-journey and never reads as
 * entering.
 */
function MarketEntry({ progress }) {
  const { paths, center, holeR } = meshWithHole();
  const stops = [0, 0.62, 1];
  const x = useTransform(progress, stops, [14, center.x, center.x]);
  const scale = useTransform(progress, stops, [1, 1, 0.12]);
  const opacity = useTransform(progress, stops, [1, 1, 0]);
  return (
    <Frame grid={false}>
      <g className="stroke-white/20" style={stroke} strokeWidth="1">
        {paths.map((d, i) => (
          <motion.path key={i} d={d} variants={fade(i * 0.02)} />
        ))}
      </g>
      <motion.circle
        className="stroke-sky/40"
        style={{ ...stroke, transformBox: "fill-box", transformOrigin: "center" }}
        strokeWidth="1"
        cx={center.x}
        cy={center.y}
        r={holeR}
        variants={fade(0.35)}
      />
      <Actor x={x} y={center.y} size={22} scale={scale} opacity={opacity} />
    </Frame>
  );
}

export const MOTIFS = {
  "market-research": MarketResearch,
  "growth-strategy": GrowthStrategy,
  "data-analytics": DataAnalytics,
  "brand-strategy": BrandStrategy,
  "competitive-analysis": CompetitiveAnalysis,
  "market-entry": MarketEntry,
};

export default function ServiceMotif({ name, progress }) {
  const Motif = MOTIFS[name];
  if (!Motif) return null;
  return <Motif progress={progress} />;
}
