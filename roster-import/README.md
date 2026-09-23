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

1. **Upload the roster sheet** — your new `roster.csv`. It replaces the old one.
2. **Upload new headshots** — drag the photographs in.

Both of those folders will look empty, and that is correct. They are drop
boxes: once the import has run, it clears them out so that next year's upload
cannot get mixed up with this year's. The headshots themselves are kept
elsewhere and are never deleted.

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
| `photoName` | no | Filled in for you. **Never change it for someone already on the site.** |
| `major` | no | |
| `grad` | no | Graduation year. |
| `linkedIn` | no | Paste the profile URL. It gets tidied up automatically. |
| `email` | no | |
| `newPhoto` | no | Only when their photo is new. The filename as it came out of Drive. |

### `photoName`

The name their photograph is **saved** under on the website. Kian's photo is
stored as `Kian_Kazranian.jpg`, so his `photoName` is `Kian_Kazranian`.

**Never change this for someone already on the site.** It is the only thing
linking them to their picture, so editing it makes their photo disappear.

For somebody new, leave it blank. One is made from their name and filled in for
you, and from then on it stays put.

### `newPhoto`

The name the photograph you are **uploading** arrived with, like
`IMG_4821.JPG`. Only fill it in when somebody's photo is new or has changed.

Leave it blank and that person keeps the headshot they already have. That is why
almost every row is blank.

The difference between this and `photoName`: `newPhoto` is what the file is
called *now*, on your computer. `photoName` is what the website will call it
*forever*. The import does the renaming.

You do not have to clear it afterwards: the import empties it for you, so the
sheet you download next time is already clean.

### When somebody leaves

Delete their row. Their photograph is moved out of the way so the site stops
loading it, but it is never deleted.

### When somebody comes back

Add their row again, with the same `photoName` they had before. Their photograph
comes back with them — you do not need to upload it a second time.

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

- **Order does not matter.** The sheet and the photographs are two separate
  uploads, and each one starts a run. A photograph nobody's row refers to yet
  simply waits until you upload the sheet that names it.
- **Delete the old `roster.csv` before uploading a new one.** Uploading does
  not replace it — you end up with `roster.csv` and `roster-1.csv`, and the
  import refuses to run until only one is left. Use the `⋮` menu on the old
  file to delete it.
- The `photos` folder is emptied of the photographs that were used. That is deliberate:
  otherwise the next import would run against a mix of this year's photographs
  and last year's.
- Photographs are resized when the site is built, not when they are uploaded, so
  there is no separate step to remember and nothing resized is stored here.
- Originals are kept forever in `bss-web/src/pages/TeamPage/Headshots/`. Nothing
  is ever deleted from there, even when somebody leaves the club.
- Everything else about the team page — the heading over each group, the closing
  "Become a consultant" block — is edited in the CMS, not here.
