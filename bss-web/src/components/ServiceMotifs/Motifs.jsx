import { motion } from "framer-motion";

import {
  BOX,
  GRID_STEP,
  markTriangles,
  meshWithHole,
  pointAlong,
  ridgePath,
  risingRidgePath,
  scatterPoints,
  toSmoothPath,
} from "./geometry.js";

const EASE = [0.16, 1, 0.3, 1];

// Six drawings, one system. Every motif is the service's verb rather than a
// picture of its noun — reading the landscape, climbing it, finding the line
// through the noise, propagating, positioning, getting through — so none of
// them can be mistaken for stock iconography.
//
// The system is what makes them a family: the same 160x120 box, the same
// hairline grid behind, 1px non-scaling strokes at white/25, and exactly one
// sky-blue "actor" per motif that carries the hover. Break any of those and the
// set stops reading as one set.

const stroke = {
  vectorEffect: "non-scaling-stroke",
  fill: "none",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

// Strokes draw themselves in when the card first scrolls into view; the actor
// then answers hover. Two beats, no idle animation — six perpetually moving
// diagrams on one screen would be noise, and the page already has a 3D hero.
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
    transition: { pathLength: { duration: 0.9, ease: EASE, delay }, opacity: { duration: 0.3, delay } },
  },
});

const fade = (delay = 0) => ({
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, ease: EASE, delay } },
});

function Grid() {
  const cols = Math.floor(BOX.w / GRID_STEP);
  const rows = Math.floor(BOX.h / GRID_STEP);
  return (
    <g className="stroke-white/[0.06]" style={stroke} strokeWidth="1">
      {Array.from({ length: cols - 1 }, (_, i) => (
        <line key={`v${i}`} x1={(i + 1) * GRID_STEP} y1="0" x2={(i + 1) * GRID_STEP} y2={BOX.h} />
      ))}
      {Array.from({ length: rows - 1 }, (_, i) => (
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

/** 01 — Reading the landscape: contours, and a probe taking a sounding. */
function MarketResearch({ reduced }) {
  const contours = [
    ridgePath(0.0, { amplitude: 13, baseline: 46 }),
    ridgePath(1.7, { amplitude: 11, baseline: 68 }),
    ridgePath(3.4, { amplitude: 9, baseline: 88 }),
  ];
  return (
    <Frame>
      <g className="stroke-white/25" style={stroke} strokeWidth="1.25">
        {contours.map((d, i) => (
          <motion.path key={i} d={d} variants={draw(i * 0.12)} />
        ))}
      </g>
      <motion.g
        className="stroke-sky"
        style={stroke}
        strokeWidth="1.25"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.4 } },
          hover: reduced ? {} : { y: 26, transition: { duration: 0.6, ease: EASE } },
        }}
      >
        <line x1="104" y1="8" x2="104" y2="42" />
        <rect x="100" y="41" width="8" height="8" transform="rotate(45 104 45)" className="fill-sky stroke-none" />
      </motion.g>
    </Frame>
  );
}

/** 02 — Climbing it: one rising ridge, with a marker that ascends on hover. */
function GrowthStrategy({ reduced }) {
  const pts = risingRidgePath();
  const d = toSmoothPath(pts);
  const start = pointAlong(pts, 0.3);
  const end = pointAlong(pts, 0.86);
  return (
    <Frame>
      <g className="stroke-white/25" style={stroke} strokeWidth="1.25">
        <motion.path d={d} variants={draw()} />
      </g>
      <motion.polygon
        className="fill-sky"
        points="-5,4 5,4 0,-6"
        // x/y appear in `hidden` as well as `show`. A variant that introduces a
        // transform value the initial variant never declared leaves framer with
        // nothing to animate from, and the actor renders parked at the SVG
        // origin — top-left of the box — instead of standing on its ridge.
        variants={{
          hidden: { opacity: 0, x: start.x, y: start.y - 4 },
          show: {
            opacity: 1,
            x: start.x,
            y: start.y - 4,
            transition: { duration: 0.5, delay: 0.5 },
          },
          hover: reduced
            ? {}
            : { x: end.x, y: end.y - 4, transition: { duration: 0.75, ease: EASE } },
        }}
      />
    </Frame>
  );
}

/** 03 — Signal from noise: scatter, and the line fitted through it. */
function DataAnalytics({ reduced }) {
  const pts = scatterPoints(17);
  return (
    <Frame>
      <g className="fill-white/30">
        {pts.map(([x, y], i) => (
          <motion.circle key={i} cx={x} cy={y} r="2.1" variants={fade(i * 0.035)} />
        ))}
      </g>
      <g className="stroke-sky" style={stroke} strokeWidth="1.5">
        <motion.line
          x1="10"
          y1="88"
          x2="150"
          y2="40"
          variants={{
            ...draw(0.55),
            hover: reduced ? {} : { strokeWidth: 2.4, transition: { duration: 0.3, ease: EASE } },
          }}
        />
      </g>
    </Frame>
  );
}

/** 04 — Propagating: the brand mark, echoing outward. */
function BrandStrategy({ reduced }) {
  const rings = [46, 58];
  return (
    <Frame>
      <g style={stroke} strokeWidth="1.25">
        {rings.map((r, i) => (
          <motion.polygon
            key={r}
            className="stroke-white/20"
            points={markTriangles({ r, count: 1 })[0]}
            variants={{
              ...fade(0.15 + i * 0.12),
              hover: reduced
                ? {}
                : {
                    scale: 1 + (i + 1) * 0.07,
                    opacity: 0.15,
                    transition: { duration: 0.7, ease: EASE, delay: i * 0.05 },
                  },
            }}
            style={{ ...stroke, transformOrigin: "80px 60px" }}
          />
        ))}
        <g className="stroke-sky" style={stroke}>
          {markTriangles({ r: 30, spread: 13 }).map((points, i) => (
            <motion.polygon key={`mark${i}`} points={points} variants={draw(0.3 + i * 0.08)} />
          ))}
        </g>
      </g>
    </Frame>
  );
}

/** 05 — Positioning: marks on a field, one of them ours. */
function CompetitiveAnalysis({ reduced }) {
  const others = [
    { x: 44, y: 78 },
    { x: 68, y: 44 },
    { x: 112, y: 82 },
  ];
  return (
    <Frame>
      <g className="stroke-white/20" style={stroke} strokeWidth="1.25">
        <motion.line x1="80" y1="10" x2="80" y2="110" variants={draw()} />
        <motion.line x1="10" y1="60" x2="150" y2="60" variants={draw(0.1)} />
      </g>
      <g className="fill-white/30">
        {others.map((p, i) => (
          <motion.polygon
            key={i}
            points={`${p.x - 4},${p.y + 3} ${p.x + 4},${p.y + 3} ${p.x},${p.y - 5}`}
            variants={fade(0.3 + i * 0.1)}
          />
        ))}
      </g>
      <motion.polygon
        className="fill-sky"
        points="-6,5 6,5 0,-7"
        variants={{
          hidden: { opacity: 0, x: 58, y: 88 },
          show: { opacity: 1, x: 58, y: 88, transition: { duration: 0.5, delay: 0.55 } },
          hover: reduced ? {} : { x: 120, y: 32, transition: { duration: 0.8, ease: EASE } },
        }}
      />
    </Frame>
  );
}

/**
 * 06 — Getting through: a void torn in the mesh, and the way through it.
 *
 * The previous version was a picket of vertical bars with a gap, which read as a
 * barcode with a video play button beside it. A hole is the stronger idea: the
 * mesh is one continuous surface that has been opened, so the drawing says
 * "there is a way in" rather than "here are some bars".
 */
function MarketEntry({ reduced }) {
  const { paths, center, holeR } = meshWithHole();
  return (
    <Frame grid={false}>
      <g className="stroke-white/20" style={stroke} strokeWidth="1">
        {paths.map((d, i) => (
          <motion.path key={i} d={d} variants={fade(i * 0.012)} />
        ))}
      </g>
      <motion.circle
        className="stroke-sky/40"
        style={stroke}
        strokeWidth="1"
        cx={center.x}
        cy={center.y}
        r={holeR}
        variants={{
          ...fade(0.35),
          hover: reduced ? {} : { scale: 1.12, transition: { duration: 0.6, ease: EASE } },
        }}
      />
      <motion.polygon
        className="fill-sky"
        points="-6,5 6,5 0,-7"
        style={{ rotate: 90 }}
        variants={{
          hidden: { opacity: 0, x: 18, y: center.y },
          show: { opacity: 1, x: 18, y: center.y, transition: { duration: 0.5, delay: 0.45 } },
          hover: reduced
            ? {}
            : { x: center.x + 4, y: center.y, transition: { duration: 0.8, ease: EASE } },
        }}
      />
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

export default function ServiceMotif({ name, reduced = false }) {
  const Motif = MOTIFS[name];
  if (!Motif) return null;
  return <Motif reduced={reduced} />;
}
