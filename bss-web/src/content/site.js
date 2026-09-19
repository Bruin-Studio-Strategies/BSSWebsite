/**
 * The handful of values more than one page needs, read from `site.json`.
 *
 * This is the one place the application link lives, for every apply control on
 * the site — the navbar, the landing page's team block, the recruitment header
 * and the team page's closing band. Before it existed there were four call
 * sites carrying three different Google Form URLs.
 *
 * It sits in `content/` rather than in `pages/Recruitment/` because the navbar
 * and the landing page both need it, and neither should be reaching into a page
 * folder for a value. The constants are re-exported from JSON rather than
 * declared here so the CMS has a plain data file to write to; nothing importing
 * them has to know that.
 *
 * TODO(content): the URL below is the previous cycle's navbar link, kept because
 * it was the only one shown on every page. Confirm it is the live form for the
 * next cycle and replace it in `site.json`; nothing else needs editing.
 */

import site from "./site.json";

export const APPLICATION_URL = site.applyUrl;

/** The club's general address, shown on the contact page and the closing ask. */
export const CONTACT_EMAIL = site.contactEmail;
