/**
 * Resolves a person's headshot slug to the derivatives the browser should load.
 *
 * people.js stores a slug (`"Kian_Kazranian"`) rather than an imported image, so
 * the roster data stays free of 38 import statements and adding a member is a
 * one-line change. The full-resolution originals in Headshots/ are never
 * imported by the app — see scripts/optimize-headshots.mjs, which derives
 * everything below from them.
 */

import manifest from "./HeadshotsOptimized/placeholders.json";

// `eager` resolves each match to its hashed asset URL at build time. The images
// themselves are still fetched by the browser on demand; only the short URL
// strings are in the bundle.
const byWidth = {
  320: import.meta.glob("./HeadshotsOptimized/*-320.webp", { eager: true, import: "default" }),
  640: import.meta.glob("./HeadshotsOptimized/*-640.webp", { eager: true, import: "default" }),
};
const jpegFallbacks = import.meta.glob("./HeadshotsOptimized/*-640.jpg", {
  eager: true,
  import: "default",
});

/** "./HeadshotsOptimized/Kian_Kazranian-320.webp" -> "Kian_Kazranian" */
function slugFromPath(filePath) {
  return filePath.slice(filePath.lastIndexOf("/") + 1).replace(/-\d+\.(webp|jpg)$/, "");
}

function index(modules) {
  return Object.fromEntries(
    Object.entries(modules).map(([filePath, url]) => [slugFromPath(filePath), url]),
  );
}

const urls = {
  320: index(byWidth[320]),
  640: index(byWidth[640]),
  jpeg: index(jpegFallbacks),
};

const FALLBACK_SLUG = "Placeholder";

/**
 * Intrinsic size of the rendered derivative. Set as width/height on the <img>
 * so the grid reserves each cell before any image arrives — without it, 37
 * lazy-loaded images each shift the page as they land.
 */
export const HEADSHOT_WIDTH = 320;
export const HEADSHOT_HEIGHT = 400;

export function getHeadshot(slug) {
  const key = urls[320][slug] ? slug : FALLBACK_SLUG;

  return {
    // Two candidates and a sizes hint let the browser pick 320 on a standard
    // display and 640 on a 2x one, instead of every visitor paying for 2x.
    srcSet: `${urls[320][key]} 320w, ${urls[640][key]} 640w`,
    src: urls.jpeg[key],
    placeholder: manifest.placeholders[key],
    // Members whose headshot has not been collected yet point at the shared
    // Placeholder file — a light grey stock silhouette that reads as a broken
    // image against this palette. The card draws its own fallback instead.
    isFallback: key === FALLBACK_SLUG,
  };
}
