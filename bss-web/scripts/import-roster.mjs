/**
 * Rebuilds the team roster from a spreadsheet and a folder of photographs.
 *
 *   node scripts/import-roster.mjs
 *
 * The roster turns over once a year, all at once. Retyping 37 people through a
 * CMS form is exactly the job nobody does, so this takes the two things the club
 * already produces — a Google Sheet and a Drive folder of headshots from the
 * photoshoot — and turns them into `src/content/people.json` and a filed set of
 * originals.
 *
 * Inputs, both at the repo root so they can be dropped in through github.com's
 * upload button without anyone touching git:
 *
 *   roster-import/sheet/roster.csv   one row per person
 *   roster-import/photos/            the headshots, named however they came
 *
 * Two directories, neither inside the other, because the CMS mounts each as its
 * own media browser: rooted at `roster-import/` the sheet's browser listed
 * `photos/` as a subfolder, so the same folder appeared twice in the sidebar and
 * it was not obvious which one a headshot belonged in.
 *
 * It files the photographs in the archive under each person's slug and writes
 * the roster. Nothing here resizes anything: headshots.js asks vite-imagetools
 * for the sizes the browser needs and the build derives them, so a headshot
 * cannot be added without its derivatives following.
 *
 * The CSV carries a `newPhoto` column holding the filename exactly as it came
 * out of the shoot ("IMG_4821.JPG"). That is what removes the real manual
 * labour: nobody renames 37 files to match a slug, the sheet says which file
 * belongs to whom and this script does the renaming.
 *
 * Nothing is written until every row has been checked. A half-applied roster is
 * worse than none, and the failure this replaces was silent — a slug that did
 * not match its photograph rendered that person as their initials, and nobody
 * noticed until somebody scrolled the page.
 */

import { createHash } from "node:crypto";
import { copyFile, mkdir, readdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, "..");
const REPO = path.join(ROOT, "..");

const IMPORT_DIR = path.join(REPO, "roster-import");
const CSV_PATH = path.join(IMPORT_DIR, "sheet", "roster.csv");
const PHOTO_DIR = path.join(IMPORT_DIR, "photos");

const ARCHIVE_DIR = path.join(ROOT, "src", "pages", "TeamPage", "Headshots");

// Where a departed member's original goes. It is a subdirectory of the archive
// rather than a deletion, because the club's photographs are theirs to keep —
// but `headshots.js` globs `Headshots/*` and that pattern does not descend, so
// moving a file in here is what stops the build deriving and shipping it.
//
// Without this the build kept serving people who had left: one of them was
// still in `dist/` as three files with nobody to attach them to.
const RETIRED_DIR = path.join(ARCHIVE_DIR, "former");
const PEOPLE_JSON = path.join(ROOT, "src", "content", "people.json");

// The three groups the team page renders, in the order it renders them. A band
// outside this set is a code change (TeamPage.jsx decides which arrays exist),
// so it is rejected here rather than silently dropping those people.
const BANDS = ["executives", "advisoryBoard", "consultants"];

const REQUIRED_COLUMNS = ["band", "first", "last", "role"];

// Two columns carry names that had to say what they do to somebody who does not
// write software. "slug" and "photoFile" were developer words, and the pair were
// easy to confuse with each other: one is the name a photograph is *stored*
// under and must never change, the other is the name a photograph *arrives*
// with and is only filled in when a new one is being uploaded.
//
// The old names still work. A sheet downloaded before the rename keeps
// importing, and the write-back migrates its header to the new name.
const COLUMN_ALIASES = {
  photoName: ["photoName", "slug"],
  newPhoto: ["newPhoto", "photoFile"],
};

const KNOWN_COLUMNS = [
  ...REQUIRED_COLUMNS,
  ...Object.values(COLUMN_ALIASES).flat(),
  "major",
  "grad",
  "linkedIn",
  "email",
];

/** The position of a column, accepting either its current or its former name. */
function columnIndex(header, name) {
  for (const alias of COLUMN_ALIASES[name] ?? [name]) {
    const at = header.indexOf(alias);
    if (at !== -1) return at;
  }
  return -1;
}

const IMAGE_PATTERN = /\.(jpe?g|png)$/i;

// Sheets writes a byte-order mark at the front of its CSV exports. Left in, it
// becomes part of the first column's name and "band" stops being found.
const BOM = /^﻿/;

// Combining accents, stripped after normalize("NFD") so a name with a diacritic
// still produces an ASCII filename.
const COMBINING_MARKS = /[̀-ͯ]/g;

/**
 * Minimal RFC 4180 parser. Sheets quotes any field containing a comma and
 * doubles quotes inside one — a split on "," corrupts "Economics, B.A." and a
 * regex that handles quoting correctly is harder to read than this loop.
 */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  // A trailing newline would otherwise produce a final empty row.
  const input = text.replace(BOM, "").replace(/\r\n?/g, "\n").replace(/\n$/, "");

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];

    if (quoted) {
      if (char === '"') {
        if (input[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          quoted = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') quoted = true;
    else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += char;
  }

  row.push(field);
  rows.push(row);
  return rows;
}

/**
 * Only a fallback for somebody new. The existing slugs follow no rule anyone
 * could rederive — "Allison McCabe" is filed as `Alli_Mccabe` and
 * "Jesse Acosta-Huerta" as `Jesse_Acosta_Huerta` — so the sheet carries a
 * `slug` column and this is used only when that column is blank. Deriving them
 * all instead silently detached three people from their photographs.
 */
function slugFor(first, last) {
  return `${first}_${last}`
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .replace(/[^A-Za-z0-9_-]+/g, "")
    .replace(/_+/g, "_");
}

/**
 * Thirty-seven people pasting their own profile produces `linkedin.com/in/x`
 * with no scheme, `m.linkedin.com`, a trailing slash and `?trk=` tracking junk.
 * Left alone, the card's link goes nowhere.
 */
function normalizeLinkedIn(value) {
  const raw = value.trim();
  if (!raw) return { url: null };

  let url = raw;
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return { error: `is not a URL: ${raw}` };
  }

  if (!/(^|\.)linkedin\.com$/i.test(parsed.hostname)) {
    return { error: `is not a LinkedIn address: ${raw}` };
  }

  parsed.hostname = "www.linkedin.com";
  parsed.protocol = "https:";
  parsed.search = "";
  parsed.hash = "";

  const segments = parsed.pathname.split("/").filter(Boolean);
  if (segments[0] !== "in" || !segments[1]) {
    return { error: `is not a personal profile (expected /in/…): ${raw}` };
  }

  // Copying the address out of a LinkedIn tab rather than off the profile gives
  // a deep link — /in/someone/details/education/ — which opens on a subpage
  // instead of the person. Keep the handle, drop the rest.
  parsed.pathname = `/in/${segments[1]}`;
  const note = segments.length > 2 ? `pointed at /${segments.slice(2).join("/")}` : null;

  return { url: parsed.toString(), note };
}

function normalizeEmail(value) {
  const raw = value.trim();
  if (!raw) return { email: null };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) return { error: `is not an address: ${raw}` };
  return { email: raw };
}

function normalizeGrad(value) {
  const raw = value.trim();
  if (!raw) return { grad: null };
  const match = raw.match(/\b(20\d{2})\b/);
  if (!match) return { error: `is not a graduation year: ${raw}` };
  return { grad: match[1] };
}

/** A CSV field needs quoting if it carries a comma, a quote or a newline. */
function csvField(value) {
  const text = value ?? "";
  const special = [",", '"', "\n", "\r"];
  const needsQuotes = special.some((character) => text.includes(character));
  return needsQuotes ? `"${text.replace(/"/g, '""')}"` : text;
}

/**
 * Writes the sheet back with each person's slug recorded and `photoFile`
 * cleared. Rows are edited in place rather than regenerated, so a column the
 * club added for its own use survives even though this script ignores it.
 */
async function writeRoster(csvText, header, people) {
  // Preserve whatever the sheet arrived with: Sheets exports CRLF, and
  // rewriting the file with LF would show every row as changed in the diff.
  const eol = csvText.includes("\r\n") ? "\r\n" : "\n";
  const rows = parseCsv(csvText);

  let slugColumn = columnIndex(header, "photoName");
  if (slugColumn === -1) {
    // A sheet that never had the column gets one, appended so existing
    // columns keep their positions.
    slugColumn = header.length;
    rows[0].push("photoName");
  }
  const photoColumn = columnIndex(header, "newPhoto");

  // Migrate a sheet still using the old headings.
  rows[0][slugColumn] = "photoName";
  if (photoColumn !== -1) rows[0][photoColumn] = "newPhoto";

  for (const person of people) {
    const row = rows[person.row];
    if (!row) continue;
    while (row.length <= Math.max(slugColumn, photoColumn)) row.push("");
    row[slugColumn] = person.slug;
    if (photoColumn !== -1) row[photoColumn] = "";
  }

  const out = rows.map((row) => row.map(csvField).join(",")).join(eol);
  await writeFile(CSV_PATH, out + eol, "utf8");
}

async function main() {
  const problems = [];
  const warnings = [];

  // Uploading a sheet that already exists does not replace it: the CMS keeps
  // both and names the new one roster-1.csv. This script reads roster.csv, so
  // an edit uploaded that way is ignored and the *old* roster is what gets
  // published — the worst kind of failure, because every step reports success.
  // Refuse to guess which one was meant.
  const sheets = (await readdir(path.dirname(CSV_PATH)).catch(() => [])).filter((file) =>
    file.toLowerCase().endsWith(".csv"),
  );

  if (sheets.length > 1) {
    throw new Error(
      `There is more than one spreadsheet in roster-import/sheet/:\n\n` +
        sheets.map((file) => `  • ${file}`).join("\n") +
        `\n\nUploading a sheet adds a second copy rather than replacing the one\n` +
        `already there. Delete the ones you do not want, keep a single file\n` +
        `named roster.csv, and upload again.`,
    );
  }

  const csvText = await readFile(CSV_PATH, "utf8").catch(() => {
    throw new Error(
      `No roster at roster-import/sheet/roster.csv.\n` +
        (sheets.length ? `Found ${sheets[0]} instead — it must be named roster.csv.\n` : ``) +
        `Export the roster sheet as CSV (File > Download > Comma-separated values) ` +
        `and upload it there.`,
    );
  });

  const rows = parseCsv(csvText).filter((r) => r.some((cell) => cell.trim() !== ""));
  if (rows.length < 2) throw new Error("roster.csv has a header but no people in it.");

  const header = rows[0].map((h) => h.trim());
  for (const column of REQUIRED_COLUMNS) {
    if (!header.includes(column)) problems.push(`roster.csv has no "${column}" column.`);
  }
  for (const column of header) {
    if (!KNOWN_COLUMNS.includes(column)) {
      warnings.push(`Column "${column}" is not one this script reads — it is ignored.`);
    }
  }
  if (problems.length) throw new Error(problems.join("\n"));

  // Who already has an original on file. A returning member leaves `photoFile`
  // blank and keeps the headshot they have; only somebody with neither is worth
  // mentioning.
  // Anyone previously retired. Read before anything is written, because a
  // member who comes back should be treated as already having a photograph —
  // the warning about missing headshots would otherwise fire for them, and the
  // file is sitting right there.
  const retiredFiles = new Map(
    (await readdir(RETIRED_DIR).catch(() => []))
      .filter((f) => IMAGE_PATTERN.test(f))
      .map((f) => [path.basename(f, path.extname(f)), f]),
  );

  const archivedSlugs = new Set(
    (await readdir(ARCHIVE_DIR).catch(() => []))
      .filter((f) => IMAGE_PATTERN.test(f))
      .map((f) => path.basename(f, path.extname(f))),
  );

  const photoFiles = await readdir(PHOTO_DIR).catch(() => []);
  const photosByName = new Map(photoFiles.map((f) => [f.toLowerCase(), f]));
  const photosUsed = new Set();

  const people = [];
  const seenSlugs = new Map();

  for (let i = 1; i < rows.length; i += 1) {
    // The row number a person would see in the spreadsheet, so a complaint about
    // "row 14" can be acted on without counting.
    const line = i + 1;
    const cells = rows[i];
    const get = (column) => (cells[columnIndex(header, column)] ?? "").trim();
    const fail = (message) => problems.push(`Row ${line}: ${message}`);

    const first = get("first");
    const last = get("last");
    if (!first || !last) {
      fail("needs both a first and a last name.");
      continue;
    }

    const who = `${first} ${last}`;
    const band = get("band");
    if (!BANDS.includes(band)) {
      fail(`${who} has band "${band}" — must be one of ${BANDS.join(", ")}.`);
    }

    const role = get("role");
    if (!role) fail(`${who} has no role.`);

    // The sheet's value wins. A slug is the join key to a file on disk, not a
    // formatting of the name, and renaming one orphans that person's headshot.
    const slug = get("photoName") || slugFor(first, last);
    if (!/^[A-Za-z0-9_-]+$/.test(slug)) {
      fail(`${who}'s photoName "${slug}" may only contain letters, numbers, _ and -.`);
    }
    if (seenSlugs.has(slug)) {
      fail(`${who} collides with row ${seenSlugs.get(slug)} — both resolve to "${slug}".`);
    }
    seenSlugs.set(slug, line);

    const linkedIn = normalizeLinkedIn(get("linkedIn"));
    if (linkedIn.error) fail(`${who}'s LinkedIn ${linkedIn.error}`);
    if (linkedIn.note) {
      warnings.push(`${who}'s LinkedIn ${linkedIn.note} — trimmed to their profile.`);
    }

    const email = normalizeEmail(get("email"));
    if (email.error) fail(`${who}'s email ${email.error}`);

    const grad = normalizeGrad(get("grad"));
    if (grad.error) fail(`${who}'s grad year ${grad.error}`);

    const photoFile = get("newPhoto");
    let photo = null;
    if (photoFile) {
      const found = photosByName.get(photoFile.toLowerCase());
      if (!found) {
        fail(`${who}'s newPhoto "${photoFile}" is not in the uploaded headshots.`);
      } else if (!IMAGE_PATTERN.test(found)) {
        fail(`${who}'s newPhoto "${photoFile}" is not a .jpg or .png.`);
      } else {
        photo = found;
        photosUsed.add(found);
      }
    } else if (!archivedSlugs.has(slug) && !retiredFiles.has(slug)) {
      // Not an error. A roster can be published before the photoshoot; the card
      // draws its own initials fallback for anyone without one. Someone already
      // in the archive needs no `photoFile` — leaving it blank keeps the
      // headshot they have, which is what a returning member wants.
      warnings.push(`${who} has no photo — their card will show initials.`);
    }

    people.push({
      row: i,
      band,
      id: slug,
      first,
      last,
      major: get("major") || null,
      grad: grad.grad ?? null,
      role,
      slug,
      linkedIn: linkedIn.url ?? null,
      email: email.email ?? null,
      photo,
    });
  }

  for (const file of photoFiles) {
    if (!IMAGE_PATTERN.test(file)) continue;
    if (!photosUsed.has(file)) {
      warnings.push(`Photo "${file}" matches no row in roster.csv — it is ignored.`);
    }
  }

  for (const band of BANDS) {
    if (!people.some((p) => p.band === band)) {
      warnings.push(`No one is in "${band}" — that heading will render with a count of 0.`);
    }
  }

  if (problems.length) {
    throw new Error(
      `${problems.length} problem${problems.length === 1 ? "" : "s"} in the roster — ` +
        `nothing was changed:\n\n${problems.map((p) => `  • ${p}`).join("\n")}`,
    );
  }

  // Everything below this line writes. Past this point the roster is known good.

  await mkdir(ARCHIVE_DIR, { recursive: true });

  // A replacement photograph rarely arrives with the same extension as the one
  // it replaces: the archive holds Kalani_Caetano.jpg and the new file is a
  // .JPG off a camera. Windows treats those as one filename and overwrites, so
  // this reads as working locally; Linux does not, and the Action would leave
  // *both* in the archive. `headshots.js` keys on the basename, so the slug
  // would then resolve to two different images and which one shipped would
  // depend on directory order. Clear every existing file for the slug first.
  const archived = await readdir(ARCHIVE_DIR).catch(() => []);
  for (const person of people) {
    if (!person.photo) continue;

    const extension = path.extname(person.photo);
    const replacing = `${person.slug}${extension}`;
    for (const file of archived) {
      if (path.basename(file, path.extname(file)) !== person.slug) continue;
      if (file === replacing) continue;
      await rm(path.join(ARCHIVE_DIR, file));
    }

    await copyFile(path.join(PHOTO_DIR, person.photo), path.join(ARCHIVE_DIR, replacing));
  }

  // Anyone who has come back gets their photograph moved out of `former/`
  // first. Retiring is reversible for exactly this reason: a member who takes a
  // quarter off should not have to be re-photographed, and nobody should have to
  // know that a `former` folder exists.
  const restored = [];
  for (const person of people) {
    if (person.photo) continue;
    if (archivedSlugs.has(person.slug)) continue;
    const file = retiredFiles.get(person.slug);
    if (!file) continue;
    await rename(path.join(RETIRED_DIR, file), path.join(ARCHIVE_DIR, file));
    restored.push(person.slug);
  }
  if (restored.length) {
    warnings.push(
      `${restored.join(", ")} ${restored.length === 1 ? "is" : "are"} back on the ` +
        `roster. Their photographs were restored from Headshots/former/.`,
    );
  }

  // Anyone in the archive who is no longer on the roster is retired, so the
  // build stops deriving them. `Placeholder` is not a person and always stays.
  const retired = [];
  const onRoster = new Set(people.map((person) => person.slug));
  for (const file of await readdir(ARCHIVE_DIR)) {
    if (!IMAGE_PATTERN.test(file)) continue;
    const slug = path.basename(file, path.extname(file));
    if (slug === "Placeholder" || onRoster.has(slug)) continue;
    await mkdir(RETIRED_DIR, { recursive: true });
    await rename(path.join(ARCHIVE_DIR, file), path.join(RETIRED_DIR, file));
    retired.push(slug);
  }
  if (retired.length) {
    warnings.push(
      `${retired.join(", ")} ${retired.length === 1 ? "is" : "are"} no longer on the ` +
        `roster. Their photographs moved to Headshots/former/ and the site stops ` +
        `loading them.`,
    );
  }

  // The sheet is written back, for two reasons that both bite a year later.
  //
  // A new person's slug is derived from their name, and nothing recorded it —
  // so correcting a spelling in the sheet next year would silently derive a
  // different slug and detach them from their photograph. Writing it down pins
  // it the first time.
  //
  // And `photoFile` names a file that has just been consumed: `photos/` is
  // emptied on success, so leaving the value in place means the next import
  // fails on a photograph that is no longer there. Clearing it is what makes
  // "returning members leave it blank" true without anyone having to tidy up.
  await writeRoster(csvText, header, people);

  const record = people.map(({ photo, row, ...fields }) => fields);
  await writeFile(PEOPLE_JSON, `${JSON.stringify(record, null, 2)}\n`, "utf8");

  // A fingerprint of the roster, so a stale manifest can be told from a current
  // one without diffing 37 base64 strings.
  const fingerprint = createHash("sha1")
    .update(
      people
        .map((p) => p.slug)
        .sort()
        .join("\n"),
    )
    .digest("hex")
    .slice(0, 12);

  // Only the photographs that were actually filed are cleared. Leaving those
  // would mean the next import ran against a mix of this year's and last
  // year's.
  //
  // Anything unmatched stays put, because the two uploads are two commits and
  // the first one starts a run on its own. Uploading the photograph before the
  // sheet used to destroy it: the run fired, found no row naming it, and the
  // inbox was emptied wholesale. The club then had to re-upload a file they had
  // already sent, with nothing saying why. Now it simply waits for its row.
  for (const file of photosUsed) {
    await rm(path.join(PHOTO_DIR, file), { force: true });
  }
  await mkdir(PHOTO_DIR, { recursive: true });
  await writeFile(path.join(PHOTO_DIR, ".gitkeep"), "", "utf8");

  const counts = BANDS.map((b) => `${b} ${people.filter((p) => p.band === b).length}`).join(", ");
  console.log(`import-roster: ${people.length} people (${counts}), roster ${fingerprint}`);
  if (warnings.length) {
    console.log(`\n${warnings.length} thing${warnings.length === 1 ? "" : "s"} to know:`);
    for (const warning of warnings) console.log(`  • ${warning}`);
  }
  console.log(`\nThe build derives the resized headshots from these originals.`);
}

main().catch((error) => {
  console.error(`\n${error.message}\n`);
  process.exitCode = 1;
});
