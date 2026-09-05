// The recruitment cycle as data, so a new cycle is a content edit rather than a
// layout edit. The page is deliberately not cycle-aware: it describes how
// recruitment works, and the dates are attributes of a stage rather than the
// thing the page is organised around. Every field except `title` is optional and
// a missing one simply drops its row, so a stage with no venue booked yet still
// renders correctly.
//
// TODO(content): `date`/`time` below are the Fall 2025 cycle's and are stale.
// Replace them when the next cycle's dates are set; the layout does not care
// what they say, or whether they are there at all.

// The application link itself lives in `src/applyLink.js`, because the navbar and
// the landing page link to it too and neither should be importing from a page
// folder to get it.

export const STAGES = [
  {
    title: "Applications Open",
    date: "9/30",
    description:
      "Submit your application and take the first step toward joining BSS, where you'll gain hands-on consulting experience in the entertainment industry.",
  },
  {
    title: "Information Session",
    date: "10/6",
    time: "7:00 PM",
    location: "Pauley Pavilion Club M10A",
    attire: "Casual",
    description:
      "Learn more about BSS, meet current members, and get an inside look at what we do and how you can be part of the team.",
  },
  {
    title: "Applications Due",
    date: "10/10",
    time: "11:59 PM",
    description:
      "Be sure to complete and submit your application by this date to be considered for the next round of recruitment.",
  },
  {
    title: "Coffee Chats",
    date: "10/15",
    location: "Kerckhoff Patio",
    attire: "Business Casual",
    inviteOnly: true,
    description:
      "An informal opportunity to chat with BSS members, learn about their experiences, and see if BSS is the right fit for you.",
  },
  {
    title: "Final Interviews",
    date: "10/17 + 10/18",
    attire: "Business Formal",
    inviteOnly: true,
    description:
      "Selected candidates will participate in final interviews, showcasing their simple casing skills and passion for entertainment consulting.",
  },
];
