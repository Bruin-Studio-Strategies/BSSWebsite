/**
 * Generates the web-sized headshot derivatives the team page actually ships.
 *
 * The originals in src/pages/TeamPage/Headshots/ are straight camera/phone
 * exports — 37 files, ~55 MB, up to 7 MB each — displayed in a box a few
 * hundred CSS pixels wide. They stay in the repo as the source of truth and are
 * never imported by the app; this script derives everything the browser sees.
 *
 *   node scripts/optimize-headshots.mjs [--force]
 *
 * Output lands in src/pages/TeamPage/HeadshotsOptimized/ and is committed, so a
 * clean checkout builds without sharp and Vercel never pays the conversion
 * cost. Re-run it after adding or replacing a headshot; --force re-encodes
 * files that already exist.
 */

import { createHash } from "node:crypto";
import { readdir, readFile, mkdir, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.join(HERE, "..", "src", "pages", "TeamPage", "Headshots");
const OUT_DIR = path.join(HERE, "..", "src", "pages", "TeamPage", "HeadshotsOptimized");

// 4:5 portrait. The card renders at 320 CSS px at its widest, so 640 covers 2x
// displays and 320 covers 1x — no third size earns its bytes here.
const ASPECT = 4 / 5;
const WIDTHS = [320, 640];

// Wide enough to survive the blur, small enough to inline as a data URI.
const LQIP_WIDTH = 20;

const force = process.argv.includes("--force");

/** Kian_Kazranian.JPG -> Kian_Kazranian */
const slugOf = (file) => path.basename(file, path.extname(file));

async function exists(file) {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const files = (await readdir(SRC_DIR)).filter((f) => /\.(jpe?g|png)$/i.test(f));
  if (files.length === 0) throw new Error(`No source headshots found in ${SRC_DIR}`);

  await mkdir(OUT_DIR, { recursive: true });

  const placeholders = {};
  let written = 0;
  let skipped = 0;
  let bytesIn = 0;
  let bytesOut = 0;

  for (const file of files.sort()) {
    const slug = slugOf(file);
    const input = await readFile(path.join(SRC_DIR, file));
    bytesIn += input.length;

    // One decode reused by every derivative below. rotate() with no argument
    // applies the EXIF orientation, which phone exports rely on and which is
    // otherwise dropped when the metadata is stripped on encode.
    const base = () => sharp(input).rotate();

    const targets = [
      ...WIDTHS.map((w) => ({ file: `${slug}-${w}.webp`, width: w, format: "webp" })),
      // Fallback for browsers without WebP. Only the 2x size — a browser old
      // enough to need this is not going to be on a retina display.
      { file: `${slug}-640.jpg`, width: 640, format: "jpeg" },
    ];

    for (const target of targets) {
      const outPath = path.join(OUT_DIR, target.file);
      if (!force && (await exists(outPath))) {
        skipped += 1;
        bytesOut += (await stat(outPath)).size;
        continue;
      }

      const pipeline = base().resize({
        width: target.width,
        height: Math.round(target.width / ASPECT),
        fit: "cover",
        position: "centre",
        withoutEnlargement: false,
      });

      const buffer = await (target.format === "webp"
        ? pipeline.webp({ quality: 78, effort: 6 })
        : pipeline.jpeg({ quality: 80, mozjpeg: true, progressive: true })
      ).toBuffer();

      await writeFile(outPath, buffer);
      written += 1;
      bytesOut += buffer.length;
    }

    // Blur-up placeholder: a 20px-wide WebP inlined as a data URI so a card has
    // something to show before its real image arrives, instead of a hole.
    const lqip = await base()
      .resize({
        width: LQIP_WIDTH,
        height: Math.round(LQIP_WIDTH / ASPECT),
        fit: "cover",
        position: "centre",
      })
      .webp({ quality: 40, effort: 6 })
      .toBuffer();

    placeholders[slug] = `data:image/webp;base64,${lqip.toString("base64")}`;
  }

  const manifest = {
    // Lets a future reader tell a stale manifest from a current one without
    // diffing 37 base64 strings.
    sources: createHash("sha1")
      .update(files.sort().join("\n"))
      .digest("hex")
      .slice(0, 12),
    placeholders,
  };

  await writeFile(
    path.join(OUT_DIR, "placeholders.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );

  const mb = (n) => `${(n / 1024 / 1024).toFixed(1)} MB`;
  console.log(
    `${files.length} headshots — ${written} written, ${skipped} already present\n` +
      `${mb(bytesIn)} of originals -> ${mb(bytesOut)} of derivatives`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
