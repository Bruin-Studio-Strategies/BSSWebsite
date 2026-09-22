// Where a section opener sits on the page, decided in one place. Openers — the
// eyebrow, headline, lede and the action under them — centre below `md` (960px,
// the project's own breakpoint, not Tailwind's 768) and hang left from `md` up.
// What sits under an opener splits two ways. Content with a structural left edge
// — the recruitment spine, FAQ rows with their toggle, forms, roster bands —
// stays left at every width, because centring it would take that edge away.
// Self-contained stacked blocks with no edge to hang from — the clients page's
// service cells and process phases — centre with the opener below md, where
// left-aligned under a centred heading they read as a second layout.
//
// Class strings rather than only a wrapper component, because the landing's hero
// and copy blocks animate their children with framer-motion and run a larger type
// scale — they share the alignment, not the markup. Kept out of SectionOpener.jsx
// so that file exports components only and keeps fast refresh.

// The block's text alignment.
export const OPENER_ALIGN = "text-center md:text-left";

// Flex-column blocks align their children with items-*, not text-align.
export const OPENER_ITEMS = "items-center md:items-start";

// Anything with a max-width inside the block. text-align centres the lines; this
// centres the box they sit in.
export const OPENER_MEASURE = "mx-auto md:mx-0";

// A row of actions — a button, or a button beside a line of text.
export const OPENER_ACTIONS = "justify-center md:justify-start";

// The heading scale, and the lede under it. These live here rather than in
// SectionOpener.jsx for the same reason the alignment does: the landing's copy
// blocks animate their children with framer-motion, so they write their own
// markup and cannot call the component — but they must not therefore run their
// own type scale.
//
// They used to. The landing stepped up one at `lg`, which put its section
// headings at 60px: exactly the size of an interior page's h1, so "What is BSS?"
// was set at the scale of the *title* of the clients page. The site also carried
// three body sizes — 18px here, 16px on interior ledes, 14px in service cells.
// One scale, one place, and a section heading is smaller than a page heading
// everywhere.
export const TITLE_SCALE = {
  page: "text-4xl leading-[1.05] sm:text-5xl md:text-6xl",
  section: "text-3xl leading-[1.1] sm:text-4xl md:text-5xl",
};

// Body copy under an opener.
export const LEDE_SCALE = "text-sm leading-relaxed sm:text-base";

// Uneven centred lines are what make centred type look careless. Below md only:
// from md up the text is left-aligned, and several measures there were tuned to
// break on a particular word.
export const OPENER_BALANCE = "max-md:text-balance";
