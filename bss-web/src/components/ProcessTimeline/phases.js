// The engagement as a production schedule: every phase placed on one week ruler
// running 0 -> LAST_WEEK, so a client sees the whole shape at once.
//
// Two kinds of row, because the engagement genuinely has two kinds of phase:
// `span` phases occupy a range of weeks, `milestone` phases are a single dated
// handoff. `period` is the client-facing copy and stays exactly as written.
//
// Copy and geometry are separate on purpose. The titles, periods and
// descriptions are content and live in `src/content/clients.json` where the club
// can edit them; the numbers below are layout and stay here. Editing "Weeks 1 to
// 4" should not be able to move a bar, and moving a bar is not a content edit.

import { process } from "../../pages/Clients/content.js";

export const LAST_WEEK = 9;

// `headFrom`/`headTo` are the slice of the week ruler the playhead travels
// across while this phase is the focused one. They tile the ruler end to end, so
// the playhead stays continuous, but they are NOT the phase's duration.
//
// Focus is shared equally between phases (see phaseIndexAtProgress): sizing each
// window by the weeks it covers made the single-dated milestones roughly one
// mouse-wheel tick wide, so "Midterm Deliverable" was skipped over entirely and
// every phase felt like it flicked past. An equal share means a milestone's
// window is scroll distance during which the playhead barely moves — it dwells
// on the diamond, which is exactly the beat a client handoff deserves.
//
// This list is the authority on order: the ruler reads left to right and the
// copy is matched to it by `id`, not by its own position in the JSON.
const GEOMETRY = [
  { id: "kickoff", type: "milestone", week: 0, headFrom: 0, headTo: 0.5 },
  { id: "research", type: "span", from: 1, to: 4, headFrom: 0.5, headTo: 4 },
  { id: "midterm", type: "milestone", week: 4, headFrom: 4, headTo: 5, deliverable: true },
  { id: "refinement", type: "span", from: 5, to: 9, headFrom: 5, headTo: 9 },
  { id: "final", type: "milestone", week: 9, headFrom: 9, headTo: 9, deliverable: true },
];

const copyById = new Map(process.phases.map((phase) => [phase.id, phase]));

export const PHASES = GEOMETRY.map((geometry) => {
  const copy = copyById.get(geometry.id);

  // Loud rather than blank: a phase whose copy has been removed would otherwise
  // draw an unlabelled bar on the schedule, which looks like a rendering fault
  // rather than a missing paragraph. This fails the build instead.
  if (!copy) {
    throw new Error(
      `Process phase "${geometry.id}" has no copy in src/content/clients.json. ` +
        `Every phase in the schedule needs a matching entry with that id.`,
    );
  }

  return { ...geometry, ...copy };
});

// Weeks that carry a client-facing handoff — drawn as brighter gridlines so the
// two moments a client actually receives something read at a glance.
export const DELIVERABLE_WEEKS = PHASES.filter((p) => p.deliverable).map((p) => p.week);
