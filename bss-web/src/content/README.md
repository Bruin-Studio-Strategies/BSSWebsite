# `src/content/`

Every string on the site that the club should be able to change without opening
a component. These files are what the CMS writes to; the components read from
them and own layout only.

JSON cannot carry comments, so the reasoning that used to sit above each of
these values lives here instead.

## Files

| File | Feeds |
| --- | --- |
| `site.json` | Values more than one page needs: the application URL, the club's general address, the current recruitment cycle, the five nav links, the footer's social links. Read through `site.js`. |
| `recruitment.json` | `/recruitment` — header, the five cycle stages, the FAQ, the closing ask. |
| `clients.json` | `/clients` — header, the six services, the process phases' copy, the closing ask. |
| `contact.json` | `/contact` — header, the officer list by role, the form's labels and its outcome messages. |
| `landing.json` | `/` — the hero's four lines, "What is BSS?", the Paramount testimonial, the team block. |
| `team.json` | `/team` — header, the three band headings, the closing ask. The roster itself is `people.js`, not here. |
| `seo.json` | The title and description each route gives Google and link unfurlers, the site's domain and name, and the 404 page. |

## Rules for editing

- **Plain strings, no HTML.** The design system controls the type. A `<b>` or a
  `<span class="...">` in here either renders literally or breaks the measure.
- **No em dashes.** The site does not use them anywhere a visitor can read.
  Use a comma, a semicolon, a colon, a full stop, or `·` where a separator is
  wanted. (`·` is the site's separator: a stage's eyebrow reads `01 · 10/6 ·
  7:00 PM`.) The en dash in a numeric range, as in "4–5 consultants", is a
  different character and stays.
- **Curly quotes.** `’` rather than `'`, throughout. A straight quote reads as a
  mistake next to Agatho.
- **Headlines are measured.** The columns they set in are bounded (34rem on the
  closing ask, 46rem on FAQ answers). A headline three times longer than the one
  it replaces will not break the page, but it will break the composition.
- **Only `title` is required on a stage.** Every other field is optional and a
  missing one drops its row, so a stage with no venue booked yet still renders
  correctly. This is deliberate: it means a cycle can be published before every
  detail is settled.

## One fact, one place

Anything said on two pages is stored once and written as a token. `{cycle}`
comes from `site.json` and is filled by `tokens.js` wherever it appears — in any
string in any of these files, not just the two that use it today.

This exists because it already went wrong: the recruitment page's introduction
and the landing page's apply note both named the cycle, they sit in two
different CMS forms, and the live site shipped "Fall 2026" on one against
"Fall 2025" on the other. An unrecognised token is left on the page as written
(`{cyle}` prints as itself) rather than blanked, so a typo says what to fix
instead of leaving a hole in a sentence.

The 404 works the same way: `notFound.body` is both the sentence on the page
and the search-result description, because they were two strings opening with
the same clause and only one of them changed when the wording did.

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
- **`seo.json`'s route `path` values are structure.** They have to match the
  routes in `App.jsx` — the title and description beside each are the copy. The
  build fails with a named error if a tag it rewrites has gone missing, which is
  deliberate: a silent failure here is how five pages end up all claiming to be
  the homepage. (`index.html` also carries the landing page's tags, for crawlers
  that never run JavaScript, but the build rewrites them from this file — they
  are not a second copy to keep in step.)
- **`path` on a nav link is structure.** It has to match a route in `App.jsx`,
  so the CMS offers the five that exist rather than a text field. Only `label`
  is copy. The navbar's desktop row, its mobile menu and the footer all read
  this one list.
- **`bands` on the team page is keyed, not a list.** Renaming "Advisory Board"
  is a content edit; adding a fourth group is not — which groups exist and which
  people feed them is structure in `TeamPage.jsx`.
- **The hero headline is two fields**, `headlineLead` and `headlineAccent`.
  They are set at different sizes and animate as separate words, so the split is
  typography rather than a sentence cut in half. A headline that needs three
  parts is a component edit.

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
