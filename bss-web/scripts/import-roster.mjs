/**
 * Keeps the team roster, the photograph archive and the spreadsheet export in
 * agreement.
 *
 *   node scripts/import-roster.mjs
 *
 * The roster itself is `src/content/people.json`, and the club edits it as a
 * form in the CMS. This script runs after any change and does the work a form
 * cannot: filing photographs, retiring people who have left, and writing the
 * roster back out as a spreadsheet.
 *
 * It also accepts a spreadsheet as a one-shot replacement of the whole roster,
 * for the yearly turnover where pasting a column beats clicking forty forms.
 *
 *   roster-import/sheet/*.csv        drop one here to replace everything
 *   roster-import/photos/            headshots, named however they came
 *   roster-import/current/roster.csv written by this script, never read
 *
 * A spreadsheet is an instruction rather than a record: it is applied and then
 * deleted, so nothing lives in the upload folder between imports. That is what
 * stops an upload colliding with a resident file, and stops deleting one firing
 * a run with nothing to read.
 *
 * The `newPhoto` field holds a filename exactly as it came out of the
 * photoshoot ("IMG_4821.JPG"), which is what saves anyone renaming forty files:
 * the roster says which file belongs to whom and this does the renaming, to the
 * `slug`, on the way into the archive.
 *
 * Nothing resizes anything here. `headshots.js` asks vite-imagetools for the
 * sizes the browser needs and the build derives them, so a headshot cannot be
 * added without its derivatives following.
 *
 * Nothing is written until every person has been checked. A half-applied roster
 * is worse than none, and the failure this replaces was silent: a slug that did
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
// A spreadsheet is dropped in here to replace the whole roster, and is deleted
// once it has been applied. Nothing lives here between imports.
const SHEET_DIR = path.join(IMPORT_DIR, "sheet");
const PHOTO_DIR = path.join(IMPORT_DIR, "photos");

// The roster written back out as a spreadsheet, rewritten on every run so it is
// never stale. Replacing the roster starts by editing a copy of what is already
// there, and with the upload folder deliberately empty between imports there
// was nothing to start from — the club would have had to retype forty people to
// use the feature meant to save them from retyping forty people.
//
// A separate directory from the upload folder, because anything sitting in that
// one is treated as an instruction to replace the roster.
const EXPORT_DIR = path.join(IMPORT_DIR, "current");
const EXPORT_PATH = path.join(EXPORT_DIR, "roster.csv");

// The order the export writes, and the order the club sees in a spreadsheet.
const EXPORT_COLUMNS = [
  "band",
  "first",
  "last",
  "photoName",
  "major",
  "grad",
  "role",
  "linkedIn",
  "email",
  "newPhoto",
];

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

/** A path as the club sees it in the repository, for error messages. */
function rel(target) {
  return path.relative(REPO, target).split(path.sep).join("/");
}

/**
 * The roster as it stands, turned into the same shape a spreadsheet row
 * produces so one validation pass can serve both. `slug` is called `photoName`
 * everywhere the club sees it.
 */
async function recordsFromRoster() {
  const people = JSON.parse(await readFile(PEOPLE_JSON, "utf8").catch(() => "[]"));
  return people.map((person) => ({
    band: person.band ?? "",
    first: person.first ?? "",
    last: person.last ?? "",
    role: person.role ?? "",
    photoName: person.slug ?? "",
    major: person.major ?? "",
    grad: person.grad ?? "",
    linkedIn: person.linkedIn ?? "",
    email: person.email ?? "",
    newPhoto: person.newPhoto ?? "",
  }));
}

/** The same shape, read out of an uploaded spreadsheet. */
async function recordsFromSheet(file, problems, warnings) {
  const text = await readFile(file, "utf8");
  const rows = parseCsv(text).filter((row) => row.some((cell) => cell.trim() !== ""));
  if (rows.length < 2) return [];

  const header = rows[0].map((h) => h.trim());
  for (const column of REQUIRED_COLUMNS) {
    if (!header.includes(column)) {
      problems.push(`${path.basename(file)} has no "${column}" column.`);
    }
  }
  for (const column of header) {
    if (!KNOWN_COLUMNS.includes(column)) {
      warnings.push(`Column "${column}" is not one this script reads — it is ignored.`);
    }
  }

  return rows.slice(1).map((cells, i) => {
    const record = { line: i + 2 };
    for (const field of ["band", "first", "last", "role", "major", "grad", "linkedIn", "email"]) {
      record[field] = cells[header.indexOf(field)] ?? "";
    }
    record.photoName = cells[columnIndex(header, "photoName")] ?? "";
    record.newPhoto = cells[columnIndex(header, "newPhoto")] ?? "";
    return record;
  });
}

/** A CSV field, quoted only when it has to be. */
function csvField(value) {
  const text = String(value ?? "");
  const special = [",", String.fromCharCode(34), "\n", "\r"];
  const needsQuotes = special.some((character) => text.includes(character));
  if (!needsQuotes) return text;
  const quote = String.fromCharCode(34);
  return quote + text.split(quote).join(quote + quote) + quote;
}

/**
 * Writes the roster back out as a spreadsheet, so replacing it next year
 * starts from what is already there rather than from a blank page.
 */
async function writeExport(people) {
  const rows = [EXPORT_COLUMNS.join(',')];
  for (const person of people) {
    const value = (column) =>
      column === "photoName" ? person.slug : column === "newPhoto" ? "" : person[column];
    rows.push(EXPORT_COLUMNS.map((column) => csvField(value(column))).join(','));
  }
  await mkdir(EXPORT_DIR, { recursive: true });
  // CRLF, because this is opened in Excel and Sheets more often than not.
  await writeFile(EXPORT_PATH, rows.join("\r\n") + "\r\n", "utf8");
}

async function main() {
  const problems = [];
  const warnings = [];

  // The roster is `people.json`, and the club edits it as a form in the CMS.
  // A spreadsheet is not a second copy of it that has to be kept in step — it
  // is a one-shot instruction that replaces the whole roster and is then
  // deleted. Nothing named roster.csv lives in the repository, which is what
  // stops an upload colliding with a resident file, and what stops deleting one
  // firing a run with nothing to read.
  const sheets = (await readdir(SHEET_DIR).catch(() => [])).filter((file) =>
    file.toLowerCase().endsWith(".csv"),
  );

  if (sheets.length > 1) {
    throw new Error(
      `There is more than one spreadsheet in ${rel(SHEET_DIR)}:\n\n` +
        sheets.map((file) => `  • ${file}`).join("\n") +
        `\n\nA spreadsheet replaces the entire roster, so it is not obvious which\n` +
        `of these was meant. Delete the ones you do not want and try again.`,
    );
  }

  const replacing = sheets.length === 1;
  const all = replacing
    ? await recordsFromSheet(path.join(SHEET_DIR, sheets[0]), problems, warnings)
    : await recordsFromRoster();

  // A sheet can carry one row that is not a person: `--replace-all` in the band
  // column, which confirms a drastic cut. It is removed before anything looks
  // at the roster, so it never reaches validation as a person with no name.
  const CONFIRM = "--replace-all";
  const confirmed =
    process.argv.includes(CONFIRM) || all.some((r) => (r.band ?? "").trim() === CONFIRM);
  const records = all.filter((r) => (r.band ?? "").trim() !== CONFIRM);

  if (!records.length) {
    throw new Error(
      replacing
        ? `${sheets[0]} has a header but no people in it.`
        : `${rel(PEOPLE_JSON)} has no people in it. Upload a spreadsheet to ` +
          `rebuild the roster, or add people in the CMS.`,
    );
  }
  if (problems.length) throw new Error(problems.join("\n"));

  // A spreadsheet replaces everything, which is the one operation here that can
  // quietly destroy the roster: a half-finished sheet, or the wrong file, and
  // the site is left with three people and no warning that anything was lost.
  // A yearly turnover replaces most of the roster, so the threshold cannot be
  // strict — but going from 37 people to 2 is not a turnover, it is a mistake.
  //
  // Named `--replace-all` rather than a yes/no prompt because nothing here is
  // interactive: the Action runs it unattended, so the confirmation has to be
  // something the club can put in the file itself.
  if (replacing) {
    const existing = await recordsFromRoster();
    const keeping = new Set(records.map((r) => (r.photoName || "").trim()).filter(Boolean));
    const losing = existing.filter((person) => !keeping.has(person.photoName)).length;

    const drastic = existing.length >= 10 && records.length < existing.length / 2;
    if (drastic && !confirmed) {
      throw new Error(
        `${sheets[0]} would cut the roster from ${existing.length} people to ` +
          `${records.length}, removing ${losing}.\n\n` +
          `That is a bigger change than a normal year, so it has been stopped in\n` +
          `case the wrong file was uploaded or the sheet was not finished.\n\n` +
          `If it is correct, add a row to the sheet with "--replace-all" in the\n` +
          `band column, or run the import locally with that flag.`,
      );
    }
  }

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

  for (let i = 0; i < records.length; i += 1) {
    const record = records[i];
    // Named the way the person reading the complaint sees it: a spreadsheet row
    // number they can scroll to, or a position in the roster they can count to
    // in the CMS.
    const where = replacing ? `Row ${record.line}` : `Person ${i + 1}`;
    const get = (field) => (record[field] ?? "").trim();
    const fail = (message) => problems.push(`${where}: ${message}`);

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
      fail(`${who} collides with ${seenSlugs.get(slug)} — both resolve to "${slug}".`);
    }
    seenSlugs.set(slug, where.toLowerCase());

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
      band,
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

  // The spreadsheet has done its job and is removed. It is an instruction, not
  // a record: leaving it would make it a second copy of the roster that has to
  // be kept in step with the one the CMS edits, and the next upload would
  // collide with it rather than replacing it.
  if (replacing) {
    await rm(path.join(SHEET_DIR, sheets[0]), { force: true });
    warnings.push(
      `${sheets[0]} replaced the whole roster and has been removed. From here the ` +
        `roster is edited in the CMS.`,
    );
  }

  // `newPhoto` is not carried into the roster: it names a file that has just
  // been filed, so keeping it would make the next run look for a photograph
  // that is no longer in the inbox.
  const record = people.map(({ photo, ...fields }) => fields);
  await writeFile(PEOPLE_JSON, `${JSON.stringify(record, null, 2)}\n`, "utf8");
  await writeExport(record);

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
