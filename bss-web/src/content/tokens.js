/**
 * Fills `{token}` placeholders in content strings from `site.json`.
 *
 * Some facts belong to the site rather than to a page, and the recruitment
 * cycle is the one that kept going wrong: the recruitment page's introduction
 * and the landing page's apply note both name it, they sit in two different CMS
 * forms, and nothing connected them. The live site said "Fall 2026" on one page
 * and "Fall 2025" on the other — somebody updated one and had no reason to know
 * about the second.
 *
 * So it is stored once and written as `{cycle}` wherever it is said. One box in
 * the CMS, impossible to get half-right.
 *
 * `fill()` runs over a whole content file at import, not over a nominated list
 * of fields, so `{cycle}` works in any string the club can edit rather than
 * only in the two that use it today. It is a few dozen replacements once at
 * module load.
 *
 * An unknown token is deliberately left as written. Blanking it would turn a
 * typo into a sentence with a hole in it, which reads as a bug in the site;
 * left alone, `{cyle}` shows up on the page as itself and says what to fix.
 */

import site from "./site.json";

const TOKENS = {
  cycle: site.cycle,
};

const PATTERN = /\{(\w+)\}/g;

function fillString(value) {
  return value.replace(PATTERN, (whole, name) =>
    Object.hasOwn(TOKENS, name) ? TOKENS[name] : whole,
  );
}

/** Deep-maps a content file, filling every string it contains. */
export default function fill(value) {
  if (typeof value === "string") return fillString(value);
  if (Array.isArray(value)) return value.map(fill);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, v]) => [key, fill(v)]));
  }
  return value;
}
