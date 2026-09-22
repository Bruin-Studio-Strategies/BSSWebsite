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
 */

import team from "../../content/team.json";
import fill from "../../content/tokens.js";

export const { header, bands, closing } = fill(team);
