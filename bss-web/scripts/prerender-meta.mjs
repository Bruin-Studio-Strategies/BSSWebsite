// Writes one real HTML file per route, with that route's own head tags.
//
// The app is a client-rendered SPA behind a catch-all rewrite, so every path used
// to be served the same index.html: the landing page's title, the landing page's
// description, and — worst of all — a canonical link pointing at "/". A crawler
// that does not run JavaScript therefore saw five identical pages claiming to be
// the homepage, which is how subpages get dropped as duplicates. RouteMeta.jsx
// fixes the head at runtime, but only after JavaScript has run, and unfurlers
// (Instagram, iMessage, Discord, LinkedIn) never run it at all.
//
// Vercel checks the filesystem before applying the rewrite, so dist/team/index.html
// is served for /team and the rewrite only catches paths that are not real files.
//
// This is head tags, not content: the body is still built by React. Prerendering
// the markup itself would need the app rendered at build time, which is a much
// larger change (see CLAUDE.md).
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { OG_IMAGE, ROUTE_META, SITE_NAME, SITE_URL } from "../src/seo/siteMeta.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

const escapeAttribute = (value) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Each tag is matched as a whole and rewritten on one line. The source tags span
// several lines (prettier wraps the long descriptions), so anything that tried to
// match just the content attribute would have to cross newlines and would be far
// easier to get subtly wrong.
function replaceTag(html, pattern, replacement, label, route) {
  if (!pattern.test(html)) {
    throw new Error(`prerender-meta: no ${label} tag found in dist/index.html (route ${route})`);
  }
  return html.replace(pattern, replacement);
}

function headFor(html, route, meta) {
  const canonical = `${SITE_URL}${route === "/" ? "" : route}`;
  const title = escapeAttribute(meta.title);
  const description = escapeAttribute(meta.description);

  let out = replaceTag(html, /<title>[\s\S]*?<\/title>/, `<title>${title}</title>`, "title", route);
  out = replaceTag(
    out,
    /<meta\s+name="description"[\s\S]*?\/>/,
    `<meta name="description" content="${description}" />`,
    "description",
    route
  );
  out = replaceTag(
    out,
    /<link\s+rel="canonical"[\s\S]*?\/>/,
    `<link rel="canonical" href="${canonical}" />`,
    "canonical",
    route
  );
  out = replaceTag(
    out,
    /<meta\s+property="og:title"[\s\S]*?\/>/,
    `<meta property="og:title" content="${title}" />`,
    "og:title",
    route
  );
  out = replaceTag(
    out,
    /<meta\s+property="og:description"[\s\S]*?\/>/,
    `<meta property="og:description" content="${description}" />`,
    "og:description",
    route
  );
  out = replaceTag(
    out,
    /<meta\s+property="og:url"[\s\S]*?\/>/,
    `<meta property="og:url" content="${canonical}" />`,
    "og:url",
    route
  );
  out = replaceTag(
    out,
    /<meta\s+name="twitter:title"[\s\S]*?\/>/,
    `<meta name="twitter:title" content="${title}" />`,
    "twitter:title",
    route
  );
  out = replaceTag(
    out,
    /<meta\s+name="twitter:description"[\s\S]*?\/>/,
    `<meta name="twitter:description" content="${description}" />`,
    "twitter:description",
    route
  );
  return out;
}

const base = await readFile(join(dist, "index.html"), "utf8");

// The landing page is index.html itself, which already carries its own values as
// the static defaults, so it is rewritten in place rather than nested in a folder.
await writeFile(join(dist, "index.html"), headFor(base, "/", ROUTE_META["/"]), "utf8");
const written = ["/"];

for (const [route, meta] of Object.entries(ROUTE_META)) {
  if (route === "/") continue;
  const dir = join(dist, route.replace(/^\//, ""));
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "index.html"), headFor(base, route, meta), "utf8");
  written.push(route);
}

console.log(
  `prerender-meta: wrote head tags for ${written.length} routes (${written.join(", ")}) against ${SITE_URL} — ${SITE_NAME}, og:image ${OG_IMAGE}`
);
