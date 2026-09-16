// What each route tells a search engine and a link unfurler it is.
//
// The app is a client-rendered SPA behind a catch-all rewrite (vercel.json), so
// index.html is served verbatim for every path. Without this, Google, Instagram
// and LinkedIn all saw one title — "Bruin Studio Strategies" — for the landing
// page, the client page, the recruitment timeline and the contact form alike.
//
// index.html still carries the landing page's values as its static defaults, for
// the crawlers that never run JavaScript. Keep the two in step.

// The club's own domain, live since 2026-09-16. Canonical URLs, og:url and the
// sitemap all advertise this. The `www` host is the canonical one: the apex
// 308-redirects to it, so dropping the prefix here would point every canonical tag
// at a redirect. Duplicated in index.html, public/robots.txt and public/sitemap.xml
// — change all four together.
export const SITE_URL = "https://www.bruinstudiostrategies.com";

// Absolute, because og:image is one of the few tags that a relative URL simply
// does not work in — several unfurlers drop the card entirely.
export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export const SITE_NAME = "Bruin Studio Strategies";

// Titles lead with the page, not the club: a result that reads "Join BSS — UCLA
// Recruitment Timeline" is worth more in a list of ten blue links than ten
// identical club names. Descriptions carry the concrete facts the page owns —
// dates, stage count, engagement shape — since those are what a student or a
// studio is actually searching for.
export const ROUTE_META = {
  "/": {
    title: "Bruin Studio Strategies | UCLA Entertainment Consulting Club",
    description:
      "UCLA's first and premier entertainment consulting group. Student consultants deliver market research, growth strategy and data analytics for studios, production companies and creative ventures.",
  },
  "/clients": {
    title: "Work With BSS — Entertainment Consulting for Studios | Bruin Studio Strategies",
    description:
      "Market research, growth strategy, data analytics, brand strategy, competitive analysis and market entry, delivered over an eight-week engagement by two project managers and four to five UCLA consultants.",
  },
  "/recruitment": {
    title: "Join BSS — UCLA Recruitment Timeline & Application | Bruin Studio Strategies",
    description:
      "Five stages from applications opening to final interviews, open to any UCLA student from any major with no prior consulting experience required. Dates, dress code and the application link.",
  },
  "/team": {
    title: "Our Team — UCLA Consultants & Executives | Bruin Studio Strategies",
    description:
      "The students behind Bruin Studio Strategies: executives, advisory board and consultants studying everything from film and music industry to statistics, engineering and public affairs.",
  },
  "/contact": {
    title: "Contact Bruin Studio Strategies | UCLA Entertainment Consulting",
    description:
      "Get in touch with Bruin Studio Strategies about a client project, a partnership or joining the club. Email the team directly or send a message from the contact form.",
  },
};

// Not in the map above on purpose: an unknown path is not a page, and telling a
// crawler to index it is how a site ends up with a thousand indexed 404s.
export const NOT_FOUND_META = {
  title: `Page not found | ${SITE_NAME}`,
  description: "That page has moved or never existed.",
  noindex: true,
};

export function metaForPath(pathname) {
  return ROUTE_META[pathname] ?? NOT_FOUND_META;
}
