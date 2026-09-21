/**
 * Resolves a person's headshot slug to the derivatives the browser should load.
 *
 * The originals in Headshots/ are straight camera and phone exports — 38 files,
 * ~55 MB, up to 7 MB each — shown in a box a few hundred CSS pixels wide.
 * `vite-imagetools` derives everything the browser sees from them at build time,
 * so nothing resized is committed and adding a headshot cannot be half-done.
 *
 * The directives below are the operations a committed sharp script used to
 * perform ahead of time: a 4:5 cover crop at 320 and 640, a JPEG of the 2x size
 * for browsers without WebP, and a 20px version for the blur-up. EXIF
 * orientation is applied by imagetools, which matters because the club uploads
 * photographs straight off a phone.
 *
 * people.js stores a slug rather than an imported image, so the roster data
 * stays free of 38 import statements and adding a member is a one-line change.
 */

// 4:5 portrait. The card renders at 320 CSS px at its widest, so 640 covers 2x
// displays and 320 covers 1x — no third size earns its bytes here.
//
// Every argument here is written out in full rather than built from constants:
// Vite analyses `import.meta.glob` statically and rejects anything that is not
// a literal ("Could only use literals"), so the repetition is required, not
// carelessness.
const w320 = import.meta.glob("./Headshots/*.{jpg,JPG,jpeg,JPEG,png,PNG}", {
  eager: true,
  import: "default",
  query: "?w=320&h=400&fit=cover&position=center&format=webp",
});

const w640 = import.meta.glob("./Headshots/*.{jpg,JPG,jpeg,JPEG,png,PNG}", {
  eager: true,
  import: "default",
  query: "?w=640&h=800&fit=cover&position=center&format=webp",
});

// Fallback for browsers without WebP. Only the 2x size — a browser old enough
// to need this is not going to be on a retina display.
const jpegFallbacks = import.meta.glob("./Headshots/*.{jpg,JPG,jpeg,JPEG,png,PNG}", {
  eager: true,
  import: "default",
  query: "?w=640&h=800&fit=cover&position=center&format=jpeg",
});

// Blur-up placeholder: a 20px-wide WebP so a card has something to show before
// its real image arrives, instead of a hole.
//
// `&inline` is what makes it a `data:` URI rather than a file. Without it these
// are emitted as 38 separate ~350-byte requests, because imagetools writes its
// own assets and Vite's `assetsInlineLimit` never sees them — the limit is
// 4096 bytes and would have inlined every one. That is 38 extra round trips on
// the page most likely to be opened on a phone, to avoid the hole that the
// placeholder exists to fill.
const placeholders = import.meta.glob("./Headshots/*.{jpg,JPG,jpeg,JPEG,png,PNG}", {
  eager: true,
  import: "default",
  query: "?w=20&h=25&fit=cover&position=center&format=webp&inline",
});

/** "./Headshots/Kian_Kazranian.JPG" -> "Kian_Kazranian" */
function slugFromPath(filePath) {
  return filePath.slice(filePath.lastIndexOf("/") + 1).replace(/\.[^.]+$/, "");
}

function index(modules) {
  return Object.fromEntries(
    Object.entries(modules).map(([filePath, url]) => [slugFromPath(filePath), url]),
  );
}

const urls = {
  320: index(w320),
  640: index(w640),
  jpeg: index(jpegFallbacks),
  placeholder: index(placeholders),
};

const FALLBACK_SLUG = "Placeholder";

/**
 * Intrinsic size of the rendered derivative. Set as width/height on the <img>
 * so the grid reserves each cell before any image arrives — without it, 38
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
    placeholder: urls.placeholder[key],
    // Members whose headshot has not been collected yet point at the shared
    // Placeholder file — a light grey stock silhouette that reads as a broken
    // image against this palette. The card draws its own fallback instead.
    isFallback: key === FALLBACK_SLUG,
  };
}
