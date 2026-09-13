/**
 * Generates the web-sized derivatives for the photographs and logos outside the
 * team roster, and the social card the site advertises as og:image.
 *
 *   node scripts/optimize-site-images.mjs [--force]
 *
 * The originals in src/assets/ are phone exports and press downloads: the
 * Paramount logo alone is 1.8 MB for a mark that draws 36 CSS px tall, and the
 * landing page shipped roughly 9 MB of images in total, which put its LCP on the
 * edge of Google's 2.5s threshold on a phone. They stay in the repo as the source
 * of truth and are never imported by the app.
 *
 * Output lands in src/assets/optimized/ and is committed, so a clean checkout
 * builds without sharp and Vercel never pays the conversion cost — the same
 * arrangement as scripts/optimize-headshots.mjs. Re-run after replacing any
 * source image; --force re-encodes what is already there.
 */

import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.join(HERE, "..", "src", "assets");
const OUT_DIR = path.join(SRC_DIR, "optimized");
const PUBLIC_DIR = path.join(HERE, "..", "public");

// One WebP per image, at the width it actually needs — and only that, because
// every size here is imported by the app and anything else is dead weight in
// the repo.
//
// The photographs take 1280 and nothing else, and that is the right size at both
// ends rather than a compromise: on a phone they fill a ~393 CSS px column at a
// device pixel ratio of 3 (about 1180 device pixels), and on a laptop a 640 CSS px
// column at 2x. A 640 variant would only ever serve a 1x desktop, which is not who
// reads this site.
//
// WebP only, no JPEG fallback: every browser this site supports has decoded it
// since Safari 14 in 2020. It also keeps transparency, which the Paramount mark and
// the wave graphic both need — they sit on the page gradient.
const IMAGES = [
  { file: "IMG_9814.JPG", width: 1280 },
  { file: "group.JPG", width: 1280 },
  { file: "board.jpg", width: 1280 },
  { file: "paramount.png", width: 320 },
  { file: "waves.png", width: 1280 },
];

// The social card. 1200x630 is what every unfurler crops to, and the group shot
// in front of the Paramount marquee is the one image the club has that says what
// it is at a glance.
const OG_SOURCE = "IMG_9814.JPG";
const OG_SIZE = { width: 1200, height: 630 };

const force = process.argv.includes("--force");

async function exists(file) {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  let bytesIn = 0;
  let bytesOut = 0;
  let written = 0;
  let skipped = 0;

  for (const image of IMAGES) {
    const slug = path.basename(image.file, path.extname(image.file));
    const input = await readFile(path.join(SRC_DIR, image.file));
    bytesIn += input.length;

    const outPath = path.join(OUT_DIR, `${slug}-${image.width}.webp`);
    if (!force && (await exists(outPath))) {
      skipped += 1;
      bytesOut += (await stat(outPath)).size;
      continue;
    }

    // rotate() with no argument applies EXIF orientation, which the phone exports
    // rely on and which is dropped when metadata is stripped on encode.
    const buffer = await sharp(input)
      .rotate()
      .resize({ width: image.width, withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 })
      .toBuffer();

    await writeFile(outPath, buffer);
    written += 1;
    bytesOut += buffer.length;
  }

  // Written to public/ rather than src/assets/: og:image is fetched by crawlers at
  // a stable URL, so it must not carry a build hash in its filename. JPEG, because
  // a few unfurlers still do not render WebP cards.
  const ogPath = path.join(PUBLIC_DIR, "og-image.jpg");
  if (force || !(await exists(ogPath))) {
    const og = await sharp(await readFile(path.join(SRC_DIR, OG_SOURCE)))
      .rotate()
      .resize({ ...OG_SIZE, fit: "cover", position: "attention" })
      .jpeg({ quality: 82, mozjpeg: true, progressive: true })
      .toBuffer();
    await writeFile(ogPath, og);
    console.log(`og-image.jpg — ${(og.length / 1024).toFixed(0)} KB`);
  }

  const mb = (n) => `${(n / 1024 / 1024).toFixed(2)} MB`;
  console.log(
    `${IMAGES.length} sources — ${written} written, ${skipped} already present\n` +
      `${mb(bytesIn)} of originals -> ${mb(bytesOut)} of derivatives`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
