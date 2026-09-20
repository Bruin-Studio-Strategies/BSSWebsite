/**
 * The team page's copy, read from `src/content/team.json`.
 *
 * The roster itself is not here. `people.js` is the 37-person list and is on its
 * own track — it is bulk-replaced once a year from a spreadsheet rather than
 * edited a field at a time, and each person carries a headshot that has to be
 * resized before the browser sees it.
 *
 * `bands` is the three headings over the roster, keyed rather than listed: which
 * groups exist and which array feeds each one is structure and stays in
 * `TeamPage.jsx`. Renaming "Advisory Board" is a content edit; adding a fourth
 * group is not.
 *
 * The header's body carries a non-breaking space before its em dash. It is
 * deliberate and invisible in an editor: balanced on a phone the line otherwise
 * breaks before the dash and the next line opens on "— and".
 */

import team from "../../content/team.json";

export const { header, bands, closing } = team;
