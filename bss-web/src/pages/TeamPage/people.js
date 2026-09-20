/**
 * The roster, grouped into the bands the team page renders.
 *
 * The people themselves are in `src/content/people.json`, which is generated —
 * do not hand-edit it. The roster turns over all at once every year, so it is
 * rebuilt in bulk from a spreadsheet and a folder of photographs rather than
 * edited a person at a time: see `roster-import/README.md` and
 * `scripts/import-roster.mjs`.
 *
 * `slug` is the join key between a person and their headshot. `headshots.js`
 * resolves it to the derivatives the browser loads, and anyone without a
 * matching image falls back to the shared placeholder, which the card draws
 * over with their initials.
 */

import people from "../../content/people.json";

const inBand = (band) => people.filter((person) => person.band === band);

export const EXECUTIVES = inBand("executives");
export const ADVISORYBOARD = inBand("advisoryBoard");
export const CONSULTANTS = inBand("consultants");

// Kept because the team page's band list has carried it since before the
// redesign and an empty array renders nothing. Give it a band in people.json
// and a heading in team.json if the club ever fills it.
export const PRODUCT_MANAGERS = [];
