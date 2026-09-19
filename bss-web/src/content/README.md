# `src/content/`

Every string on the site that the club should be able to change without opening
a component. These files are what the CMS writes to; the components read from
them and own layout only.

JSON cannot carry comments, so the reasoning that used to sit above each of
these values lives here instead.

## Files

| File | Feeds |
| --- | --- |
| `site.json` | Values more than one page needs: the application URL, the club's general address. Read through `site.js`. |
| `recruitment.json` | `/recruitment` — header, the five cycle stages, the FAQ, the closing ask. |
| `clients.json` | `/clients` — header, the six services, the process phases' copy, the closing ask. |
| `contact.json` | `/contact` — header, the officer list by role, the form's labels and its outcome messages. |

## Rules for editing

- **Plain strings, no HTML.** The design system controls the type. A `<b>` or a
  `<span class="...">` in here either renders literally or breaks the measure.
- **Typographic punctuation.** Curly quotes (`’`), em dashes (`—`) and `·`
  are used throughout and should stay — this is a type-driven site and straight
  quotes read as a mistake next to Agatho.
- **Headlines are measured.** The columns they set in are bounded (34rem on the
  closing ask, 46rem on FAQ answers). A headline three times longer than the one
  it replaces will not break the page, but it will break the composition.
- **Only `title` is required on a stage.** Every other field is optional and a
  missing one drops its row, so a stage with no venue booked yet still renders
  correctly. This is deliberate: it means a cycle can be published before every
  detail is settled.

## Fields that are not free text

Two values look like content and are not:

- **`motif`** on a service names one of six drawings in
  `components/ServiceMotifs/`: `market-research`, `growth-strategy`,
  `data-analytics`, `brand-strategy`, `competitive-analysis`, `market-entry`.
  Anything else renders nothing. The CMS exposes it as a dropdown.
- **`id`** on a process phase is what matches it to its place on the week ruler
  in `components/ProcessTimeline/phases.js`. The ruler is layout, not content —
  editing "Weeks 1 to 4" changes the label, not the bar. Removing a phase's
  entry fails the build with a named error rather than drawing a blank bar.

## Why the recruitment page is not cycle-aware

The page describes *how recruitment works*. A date is an attribute of a stage
rather than the thing the page is organised around, which is why there is no
"current cycle" object and no dated archive — a new cycle is an edit to the
`stages` list, not a new record.

## Known limit: the closing ask

`closing` is split into `lead` / `applyLinkText` / `betweenLinks` / `tail`
because the sentence wraps two links (the application form and the club's
address) and those links are structure, not content. Editing the four fragments
changes the sentence around the links; it cannot move or remove them. If that
sentence ever needs to change shape, it is a component edit.
