/**
 * The landing page's copy, read from `src/content/landing.json`.
 *
 * The hero headline is two fields rather than one sentence. `headlineLead` and
 * `headlineAccent` are set at different sizes and animate as separate words —
 * "Success" is a step larger than "Cut to" and carries the medium weight — so
 * the split is typography, not a sentence that happens to be cut in half. A
 * headline that needs three parts is a component edit.
 *
 * `applyNote` is the line beside the landing page's Apply button. It names the
 * cycle with `{cycle}` rather than spelling out a year — the same fact appears
 * in the recruitment page's introduction, and when they were two independent
 * strings the site shipped "Fall 2025" here against "Fall 2026" there. See
 * `content/tokens.js`. The button's URL is in `content/site.json`.
 */

import landing from "../../content/landing.json";
import fill from "../../content/tokens.js";

export const { hero, info, testimonial, team } = fill(landing);
