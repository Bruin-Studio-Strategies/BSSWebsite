// What each route tells a search engine and a link unfurler it is.
//
// The app is a client-rendered SPA behind a catch-all rewrite (vercel.json), so
// index.html is served verbatim for every path. Without this, Google, Instagram
// and LinkedIn all saw one title — "Bruin Studio Strategies" — for the landing
// page, the client page, the recruitment timeline and the contact form alike.
//
// index.html still carries the landing page's values as its static defaults, for
// the crawlers that never run JavaScript. Keep the two in step.
//
// The values live in `src/content/seo.json` so the club can edit a title or a
// description through the CMS. This module is what the app imports; the build
// script (scripts/prerender-meta.mjs) reads that same JSON with `readFile`
// rather than importing this file, because a JSON import in a module Node runs
// directly would need an import attribute and a Node version to match it. One
// source of truth, two readers.

import seo from "../content/seo.json";

// The club's own domain, live since 2026-09-16. Canonical URLs, og:url and the
// sitemap all advertise this. The `www` host is the canonical one: the apex
// 308-redirects to it, so dropping the prefix here would point every canonical tag
// at a redirect. Duplicated in index.html, public/robots.txt and public/sitemap.xml
// — change all four together.
export const SITE_URL = seo.siteUrl;

// Absolute, because og:image is one of the few tags that a relative URL simply
// does not work in — several unfurlers drop the card entirely.
export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export const SITE_NAME = seo.siteName;

// Titles lead with the page, not the club: a result that reads "Join BSS — UCLA
// Recruitment Timeline" is worth more in a list of ten blue links than ten
// identical club names. Descriptions carry the concrete facts the page owns —
// dates, stage count, engagement shape — since those are what a student or a
// studio is actually searching for.
// Authored as a list so the CMS can render it as rows with the path as a fixed
// dropdown; keyed by path here because that is how the app looks one up.
export const ROUTE_META = Object.fromEntries(
  seo.routes.map(({ path, title, description }) => [path, { title, description }]),
);

// Not in the map above on purpose: an unknown path is not a page, and telling a
// crawler to index it is how a site ends up with a thousand indexed 404s. The
// club edits the wording; `noindex` is not theirs to turn off.
//
// `body` serves as both the meta description and the sentence on the page. The
// two used to be separate strings opening with the same clause, so editing the
// 404 in the CMS changed the browser tab and left the page saying something
// else. ErrorPage.jsx reads NOT_FOUND from the same object.
export const NOT_FOUND = seo.notFound;

export const NOT_FOUND_META = {
  title: `${seo.notFound.title} | ${SITE_NAME}`,
  description: seo.notFound.body,
  noindex: true,
};

export function metaForPath(pathname) {
  return ROUTE_META[pathname] ?? NOT_FOUND_META;
}
