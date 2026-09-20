/**
 * The recruitment page's copy, read from `src/content/recruitment.json`.
 *
 * This module exists so the page's sections import one named thing each rather
 * than reaching into a JSON blob, and so the notes below have somewhere to live
 * — JSON cannot carry comments. `src/content/README.md` holds the rest.
 *
 * The cycle is data so that a new one is a content edit rather than a layout
 * edit. Every field on a stage except `title` is optional and a missing one
 * simply drops its row, so a stage with no venue booked yet still renders
 * correctly.
 *
 * TODO(content): the dates in `recruitment.json` are the Fall 2025 cycle's and
 * are stale. Replace them when the next cycle's dates are set; the layout does
 * not care what they say, or whether they are there at all.
 */

import recruitment from "../../content/recruitment.json";
import fill from "../../content/tokens.js";

export const { header, timeline, faq, closing } = fill(recruitment);

/** The five cycle stages, in the order they are read. */
export const STAGES = timeline.stages;
