import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

import { OG_IMAGE, SITE_NAME, SITE_URL, metaForPath } from "./siteMeta.js";

// Hand-rolled rather than react-helmet-async: this needs to set eight tags on
// route change and nothing else — no nesting, no server rendering, no priority
// resolution. A dependency for that is weight without a job.
//
// Tags are updated in place, and every one of them is written on every route, so
// there is no state to clean up: a value from the previous page can never
// survive into the next one. That matters most for robots, where a stale
// `noindex` left over from the 404 page would quietly delist a real page.
function upsertMeta(attribute, key, content) {
  const selector = `meta[${attribute}="${key}"]`;
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function upsertCanonical(href) {
  let tag = document.head.querySelector('link[rel="canonical"]');
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", "canonical");
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
}

/**
 * Keeps the document head in step with the route.
 *
 * Rendered once inside the router. A layout effect rather than a passive one so
 * the title changes in the same frame the page does — a passive effect lets the
 * previous page's title sit in the tab through the cross-fade.
 */
export default function RouteMeta() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const meta = metaForPath(pathname);
    const canonical = `${SITE_URL}${pathname === "/" ? "" : pathname}`;

    document.title = meta.title;
    upsertMeta("name", "description", meta.description);
    upsertMeta("name", "robots", meta.noindex ? "noindex, follow" : "index, follow");
    upsertCanonical(canonical);

    upsertMeta("property", "og:title", meta.title);
    upsertMeta("property", "og:description", meta.description);
    upsertMeta("property", "og:url", canonical);
    upsertMeta("property", "og:image", OG_IMAGE);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:site_name", SITE_NAME);

    // Twitter reads its own namespace and falls back to OG inconsistently across
    // clients; summary_large_image is what turns a link into a card rather than
    // a thumbnail strip.
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", meta.title);
    upsertMeta("name", "twitter:description", meta.description);
    upsertMeta("name", "twitter:image", OG_IMAGE);
  }, [pathname]);

  return null;
}
