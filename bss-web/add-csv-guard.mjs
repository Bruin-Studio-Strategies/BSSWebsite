import { readFileSync, writeFileSync } from "node:fs";

const target = "scripts/import-roster.mjs";
let s = readFileSync(target, "utf8");

function sub(a, b, label) {
  if (!s.includes(a)) throw new Error("MISS: " + label);
  s = s.replace(a, b);
}

sub(
  `  const csvText = await readFile(CSV_PATH, "utf8").catch(() => {
    throw new Error(
      \`No roster at roster-import/sheet/roster.csv.\\n\` +
        \`Export the roster sheet as CSV (File > Download > Comma-separated values) \` +
        \`and upload it there.\`,
    );
  });`,
  `  // Uploading a file that already exists does not replace it: the CMS keeps
  // both and names the new one roster-1.csv. The importer reads roster.csv, so
  // an edit uploaded that way is silently ignored and the *old* roster is what
  // gets published — the worst kind of failure, because everything reports
  // success. Refuse to guess.
  const sheets = (await readdir(path.dirname(CSV_PATH)).catch(() => [])).filter((file) =>
    file.toLowerCase().endsWith(".csv"),
  );

  if (sheets.length > 1) {
    throw new Error(
      \`There is more than one spreadsheet in roster-import/sheet/:\\n\\n\` +
        sheets.map((file) => \`  • \${file}\`).join("\\n") +
        \`\\n\\nUploading a sheet does not replace the one already there, it adds a\\n\` +
        \`second copy. Delete the ones you do not want, keep a single file named\\n\` +
        \`roster.csv, and upload again.\`,
    );
  }

  const csvText = await readFile(CSV_PATH, "utf8").catch(() => {
    throw new Error(
      \`No roster at roster-import/sheet/roster.csv.\\n\` +
        (sheets.length
          ? \`Found \${sheets[0]} instead — it has to be named roster.csv.\\n\`
          : \`\`) +
        \`Export the roster sheet as CSV (File > Download > Comma-separated values) \` +
        \`and upload it there.\`,
    );
  });`,
  "csv guard",
);

writeFileSync(target, s);
console.log("guard added");
