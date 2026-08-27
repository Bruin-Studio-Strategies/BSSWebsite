// The engagement as a production schedule: every phase placed on one week ruler
// running 0 -> LAST_WEEK, so a client sees the whole shape at once.
//
// Two kinds of row, because the engagement genuinely has two kinds of phase:
// `span` phases occupy a range of weeks, `milestone` phases are a single dated
// handoff. `period` is the client-facing copy and stays exactly as written.

export const LAST_WEEK = 9;

// `activeFrom`/`activeTo` are the slice of the week ruler during which a row is
// the focused one as the playhead crosses. They are not the phase's duration —
// a single-dated milestone still needs a readable window around its week, or the
// playhead would skip past "Midterm Deliverable" in one frame and it would never
// be the focused row.
export const PHASES = [
  {
    type: "milestone",
    week: 0,
    activeFrom: 0,
    activeTo: 0.6,
    title: "Project Kickoff",
    period: "Week 0",
    description:
      "The project officially begins with the creation and approval of the Statement of Work. The contract is finalized with the client and an initial kickoff call is scheduled with the project team to align expectations and goals.",
  },
  {
    type: "span",
    from: 1,
    to: 4,
    activeFrom: 0.6,
    activeTo: 3.6,
    title: "Research and Analysis",
    period: "Weeks 1 to 4",
    description:
      "The team conducts extensive research and analysis to gather critical data and insights. A slide deck is also created to present these findings as well as the project process",
  },
  {
    type: "milestone",
    week: 4,
    activeFrom: 3.6,
    activeTo: 4.6,
    deliverable: true,
    title: "Midterm Deliverable",
    period: "Week 4",
    description:
      "At the mid-point of the project, a deliverable is shared with the client. This is an opportunity to adjust the course of the project and get feedback on the project if needed.",
  },
  {
    type: "span",
    from: 5,
    to: 9,
    activeFrom: 4.6,
    activeTo: 8.4,
    title: "Additional Research and Refinements",
    period: "Weeks 5 to 9",
    description:
      "Based on client feedback from the midterm deliverable, additional refinements and research are made to fine-tune the deliverables to implement the client's needs",
  },
  {
    type: "milestone",
    week: 9,
    activeFrom: 8.4,
    activeTo: 9.001,
    deliverable: true,
    title: "Final Deliverable",
    period: "Week 9",
    description:
      "The final deliverable is completed and submitted to the client, concluding the project. The team will answer any questions and provide support as needed.",
  },
];

// Weeks that carry a client-facing handoff — drawn as brighter gridlines so the
// two moments a client actually receives something read at a glance.
export const DELIVERABLE_WEEKS = PHASES.filter((p) => p.deliverable).map((p) => p.week);

export function phaseIndexAtWeek(week) {
  const i = PHASES.findIndex((p) => week >= p.activeFrom && week < p.activeTo);
  return i === -1 ? PHASES.length - 1 : i;
}
