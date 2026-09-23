# Updating the team roster

This is how the whole roster gets replaced at the start of a year. You do not
need to install anything, and you do not need to know git.

## What you need

1. **The roster as a spreadsheet.** Start from `sheet/roster.csv` —
   it already has everyone currently on the site. Open it in Google Sheets,
   edit it there, then **File → Download → Comma-separated values (.csv)**.
2. **The headshots**, downloaded from the photoshoot's Drive folder. Leave the
   filenames exactly as they are — `IMG_4821.JPG` is fine. You never have to
   rename anything.

## What you do

In the CMS, in the sidebar:

1. **Roster spreadsheet** — upload your new `roster.csv`. It replaces the old one.
2. **Roster photos** — drag the headshots in.

That is it. (You can also do this on github.com, in this folder, with
**Add file → Upload files** — it is the same thing, and useful if the CMS is
having a bad day.)

**Upload the original photographs**, straight off the camera or the phone. Do
not crop or shrink them first: the site makes its own small versions, and a
photo under about 640x800 will look soft on a good screen. A 7 MB file is fine.

A robot takes it from there: it checks the spreadsheet, resizes every
photograph, and updates the site. Give it two or three minutes.

## The columns

| Column | Required | Notes |
| --- | --- | --- |
| `band` | yes | `executives`, `advisoryBoard` or `consultants`. Nothing else. |
| `first`, `last` | yes | |
| `role` | yes | e.g. "Co-President", "Consultant". |
| `slug` | no | **Don't change these for people already on the site.** See below. |
| `major` | no | |
| `grad` | no | Graduation year. |
| `linkedIn` | no | Paste the profile URL. It gets tidied up automatically. |
| `email` | no | |
| `photoFile` | no | The photo's filename, exactly as it came out of Drive. |

### `slug`

This is how a person is matched to their photograph. For anyone already on the
site, **leave it exactly as it is** — changing it disconnects them from their
headshot. For somebody new, leave it blank and one is made from their name.

### `photoFile`

Only needed when somebody's photograph is **new or changed**. People already on
the site keep the headshot they have if you leave it blank.

## If it goes wrong

The robot checks everything *before* it changes anything, so a mistake never
leaves the site half-updated. If something is off it stops and says exactly
what, by row number:

```
2 problems in the roster — nothing was changed:

  • Row 14: Jane Smith's photo "IMG_5501.JPG" is not in roster-import/photos/.
  • Row 22: Alex Lee has band "consultant" — must be one of executives, advisoryBoard, consultants.
```

Fix the sheet, upload it again. To see these messages: the **Actions** tab at
the top of the repository, then the most recent "Import roster" run.

It will also mention things that are not errors, and carry on regardless — for
example that somebody has no photograph yet, and so will show their initials
until one arrives. That is fine and is how a roster can go up before the
photoshoot.

## Notes

- The `photos` folder is emptied after a successful import. That is deliberate:
  otherwise the next import would run against a mix of this year's photographs
  and last year's.
- Photographs are resized when the site is built, not when they are uploaded, so
  there is no separate step to remember and nothing resized is stored here.
- Originals are kept forever in `bss-web/src/pages/TeamPage/Headshots/`. Nothing
  is ever deleted from there, even when somebody leaves the club.
- Everything else about the team page — the heading over each group, the closing
  "Become a consultant" block — is edited in the CMS, not here.
