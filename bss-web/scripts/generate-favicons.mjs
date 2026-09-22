/**
 * Renders the site's favicon set from public/logo.svg.
 *
 *   node scripts/generate-favicons.mjs [--force]
 *
 * The site declared exactly one icon — the raw SVG — and Google's search result
 * showed its generic globe placeholder instead of the mark. Two reasons, and this
 * script is the fix for both:
 *
 *   1. Nothing answered /favicon.ico. There is no such file in public/, so
 *      vercel.json's catch-all rewrite served index.html for it: a 200 OK with
 *      Content-Type: text/html, which is worse than a 404 because it tells the
 *      favicon crawler it succeeded. Dropping a real file in public/ is the whole
 *      fix — static files are matched before the rewrite.
 *   2. logo.svg is a poor 16px icon even where SVG favicons are read. Its mark is
 *      a stroked outline at stroke-width 8 over a 1440px viewBox, sitting on
 *      transparency and off-centre within that box, so it renders as a pale
 *      gradient smear on a white results card.
 *
 * So the mark is composited onto a navy #0F172E tile at brand contrast, trimmed
 * out of its oversized viewBox and re-centred, and written at the raster sizes
 * search engines, browsers and iOS actually ask for. Output lands in public/ and
 * is committed, so Vercel never runs sharp — the same arrangement as
 * optimize-site-images.mjs. Re-run after replacing
 * logo.svg; --force re-encodes what is already there.
 */

import { readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(HERE, "..", "public");
const SOURCE = path.join(PUBLIC_DIR, "logo.svg");

// Brand navy, the same token Tailwind exposes as `navy` and index.html carries as
// theme-color.
//
// Only the home-screen icons sit on it now. Every browser icon is transparent:
// the navy square read as a black box in the tab strip, which is a shape the brand
// does not have. The worry it was there to answer — that the blue-to-magenta
// gradient washes out on Chrome's near-black strip or Google's white card — does
// not survive contact with the mark: both ends of that gradient are mid-tone
// (#5288C7, #B73593) and carry contrast against white and near-black alike. What
// genuinely needed the tile was thin ink, and the stroke weights below are what
// fixed that.
//
// iOS and Android keep it, because neither platform honours transparency in a
// home-screen icon: iOS composites an alpha icon onto black, and a maskable icon
// is cropped to the launcher's shape, which needs ink to the edge of the crop.
// Leaving those transparent trades a tile you chose for one you didn't.
const TILE = { r: 0x0f, g: 0x17, b: 0x2e, alpha: 1 };
const NO_TILE = { r: 0, g: 0, b: 0, alpha: 0 };

// Fraction of the tile left empty around the mark. Favicons are read at 16px, so
// the mark takes nearly the whole tile; iOS crops a rounded rectangle out of the
// home-screen icon and needs more room at the corners.
const PAD = 0.12;
const PAD_APPLE = 0.18;
// A maskable icon is cropped to whatever shape the launcher uses, and only the
// inner 80% circle is guaranteed to survive. The mark is widest across its
// horizontal axis, which is exactly where a circular crop bites hardest.
const PAD_MASKABLE = 0.24;

// Every variant is rasterised at this size and downscaled to its target. The
// weights below are in the SVG's own 1440-unit space, so they scale with it and a
// given weight means the same thing at every output size.
const MASTER = 1024;

/**
 * How much to fatten the mark's ribbons, per output size.
 *
 * The logo is an outline drawing: hairline ribbons at the scale of a 1440px
 * viewBox. Downscaled to 16px they land on a fraction of a pixel each, get
 * alpha-blended to roughly a third opacity, and the icon reads as a grey smudge —
 * which is very nearly what a missing favicon looks like anyway.
 *
 * Fattening fixes that and costs the brand mark if overdone. Measured at 96px:
 * by weight 36 the three rotated triangles have merged into one thick outline and
 * the mark is no longer the mark (see CLAUDE.md on why three congruent triangles
 * is not a detail). 20 is the most that still resolves as three.
 *
 * So the weight rides the size. Below 48px the fan is not resolvable at any
 * weight — there are not enough pixels between the ribbons — so those sizes trade
 * it for legibility and the sizes that can show it keep it. 512 is the untouched
 * artwork.
 */
const WEIGHTS = [
  { maxSize: 16, stroke: 36 },
  { maxSize: 32, stroke: 28 },
  { maxSize: 48, stroke: 24 },
  { maxSize: 96, stroke: 20 },
  { maxSize: 256, stroke: 12 },
  { maxSize: Infinity, stroke: 0 },
];

const strokeFor = (size) => WEIGHTS.find((w) => size <= w.maxSize).stroke;

// 16/32/48 go inside favicon.ico. 48 is the size Google documents as its baseline
// and the one it picks out of a multi-size .ico; 16 and 32 are what browser tab
// strips use, and letting the .ico carry them beats making the browser downscale
// the 48 itself.
const ICO_SIZES = [16, 32, 48];

const PNG_OUTPUTS = [
  // Google recommends a multiple of 48. This is the one its crawler is pointed at
  // by the rel="icon" tag.
  { file: "favicon-96.png", size: 96, pad: PAD, tile: NO_TILE },
  // The manifest's two required entries. Chrome draws these in the install prompt
  // and the app list, both of which supply their own surface.
  { file: "icon-192.png", size: 192, pad: PAD, tile: NO_TILE },
  { file: "icon-512.png", size: 512, pad: PAD, tile: NO_TILE },
  // Cropped to the launcher's shape, so this one keeps its tile.
  { file: "icon-maskable-512.png", size: 512, pad: PAD_MASKABLE, tile: TILE },
  // iOS home screen. No manifest involved — iOS reads the link tag only, and
  // composites anything transparent onto black.
  { file: "apple-touch-icon.png", size: 180, pad: PAD_APPLE, tile: TILE },
];

const force = process.argv.includes("--force");

async function exists(file) {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
}

// The fill rule that draws the mark's ribbons. Stroking the same paths with the
// same gradient is what fattens them; the artwork carries no other fill.
const FILL_RULE = ".s0 { fill: url(#g1) }";

/**
 * Rasterises logo.svg at one stroke weight and trims it down to its own ink.
 *
 * The mark occupies roughly the middle two thirds of its 1440px viewBox and is
 * not centred inside it, so compositing the SVG as-is would sit the mark low and
 * left on the tile with a band of dead navy down one side. Trimming to the alpha
 * bounding box is what makes the padding below mean the same thing on every edge.
 */
const markCache = new Map();
async function renderMark(stroke) {
  if (markCache.has(stroke)) return markCache.get(stroke);

  let svg = await readFile(SOURCE, "utf8");
  if (!svg.includes(FILL_RULE)) {
    throw new Error(`logo.svg no longer contains "${FILL_RULE}" — the stroke weights below cannot be applied`);
  }
  if (stroke > 0) {
    svg = svg.replace(FILL_RULE, `.s0 { fill: url(#g1); stroke: url(#g1); stroke-width: ${stroke} }`);
  }

  const flat = await sharp(Buffer.from(svg), { density: 600 })
    .resize(MASTER, MASTER, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const trimmed = await sharp(flat).trim({ threshold: 1 }).png().toBuffer();
  const { width, height } = await sharp(trimmed).metadata();
  if (!width || !height) throw new Error("logo.svg rasterised to nothing — is librsvg reading its <style> block?");

  markCache.set(stroke, trimmed);
  return trimmed;
}

/** Composites the trimmed mark, centred, onto a `size` square of `background`. */
async function tile(mark, size, pad, background = TILE) {
  const inner = Math.round(size * (1 - pad * 2));
  const fitted = await sharp(mark)
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  return sharp({
    create: { width: size, height: size, channels: 4, background },
  })
    .composite([{ input: fitted, gravity: "centre" }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/**
 * Packs PNGs into an .ico container.
 *
 * sharp cannot write .ico and the format does not need a dependency to produce:
 * an icon directory entry may point at a whole PNG file rather than the legacy
 * BMP bitmap, which every browser released since IE Vista reads. So this is a
 * 6-byte header, a 16-byte entry per image, then the PNG bytes.
 */
function packIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = icon
  header.writeUInt16LE(pngs.length, 4);

  let offset = 6 + pngs.length * 16;
  const entries = [];
  for (const { size, data } of pngs) {
    const entry = Buffer.alloc(16);
    // 0 means 256 in this field; none of our sizes hit that, but the encoding is
    // why the range stops at 256 rather than 255.
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2); // palette size: 0 for truecolour
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += data.length;
  }

  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

async function main() {
  if (!(await exists(SOURCE))) throw new Error(`missing ${SOURCE}`);

  const ico = path.join(PUBLIC_DIR, "favicon.ico");
  if (force || !(await exists(ico))) {
    const pngs = [];
    for (const size of ICO_SIZES) {
      const mark = await renderMark(strokeFor(size));
      pngs.push({ size, data: await tile(mark, size, PAD, NO_TILE) });
    }
    await writeFile(ico, packIco(pngs));
    console.log(`favicon.ico  ${ICO_SIZES.join("/")}px`);
  } else {
    console.log("favicon.ico  (exists, --force to rebuild)");
  }

  for (const { file, size, pad, tile: background } of PNG_OUTPUTS) {
    const out = path.join(PUBLIC_DIR, file);
    if (!force && (await exists(out))) {
      console.log(`${file}  (exists, --force to rebuild)`);
      continue;
    }
    const mark = await renderMark(strokeFor(size));
    await writeFile(out, await tile(mark, size, pad, background));
    console.log(`${file}  ${size}px`);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
