/**
 * The landing page's copy, read from `src/content/landing.json`.
 *
 * The hero headline is two fields rather than one sentence. `headlineLead` and
 * `headlineAccent` are set at different sizes and animate as separate words —
 * "Success" is a step larger than "Cut to" and carries the medium weight — so
 * the split is typography, not a sentence that happens to be cut in half. A
 * headline that needs three parts is a component edit.
 *
 * `applyNote` is the line beside the landing page's Apply button. It names a
 * cycle and goes stale; the button's URL is in `content/site.json`.
 *
 * TODO(content): `applyNote` still says Fall 2025 while the recruitment page's
 * header says Fall 2026. One of the two is wrong and the club should say which.
 */

import landing from "../../content/landing.json";

export const { hero, info, testimonial, team } = landing;
