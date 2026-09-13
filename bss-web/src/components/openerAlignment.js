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

// Uneven centred lines are what make centred type look careless. Below md only:
// from md up the text is left-aligned, and several measures there were tuned to
// break on a particular word.
export const OPENER_BALANCE = "max-md:text-balance";
