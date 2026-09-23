# The team roster

The roster is edited **in the CMS**, under **Team roster**. Click a person,
change a field, save. Use the buttons to add or remove someone. That is the
normal way to change it, and nothing here is involved.

This folder exists for one job: **replacing the whole roster at the start of a
year**, when it is faster to paste a spreadsheet than to click through forty
forms.

## Replacing the whole roster

1. Build the new roster as a spreadsheet. The easiest start is to copy the
   current one out of the CMS, or ask whoever runs the site for an export.
2. **File → Download → Comma-separated values (.csv)**
3. In the CMS, **Upload the roster sheet**, and drop it in.

A robot reads it, replaces every person, files the photographs, and then
**deletes the spreadsheet**. It is an instruction, not a file that lives here,
which is why this folder is normally empty.

Give it two or three minutes, then open **Team roster** in the CMS — everybody
from your sheet is there, ready to edit.

### The columns

| Column | Required | Notes |
| --- | --- | --- |
| `band` | yes | `executives`, `advisoryBoard` or `consultants`. |
| `first`, `last` | yes | |
| `role` | yes | e.g. "Co-President", "Consultant". |
| `photoName` | no | Leave blank for new people. **Never change it for someone already on the site.** |
| `major` | no | |
| `grad` | no | Graduation year. |
| `linkedIn` | no | Profile URL. Tidied up automatically. |
| `email` | no | |
| `newPhoto` | no | The filename of a photograph you are uploading. |

### A big cut is stopped

Replacing the roster removes everyone who is not in your sheet. If the sheet
would cut the roster by more than half, the import stops and says so, in case
the wrong file was uploaded or the sheet was not finished:

```
oops.csv would cut the roster from 37 people to 2, removing 35.
```

If that is genuinely what you meant, add one row to the sheet with
`--replace-all` in the **band** column and nothing else filled in, then upload
again.

## Photographs

Upload them under **Upload new headshots**, then name the file in that person's
**New photo** field — either in the CMS form or in the `newPhoto` column of a
sheet.

Order does not matter. A photograph nobody refers to yet simply waits until
somebody does.

**Upload the originals**, straight off the camera or phone. Do not crop or
shrink them: the site makes its own small versions, and anything under about
640x800 will look soft. A 7 MB file is fine.

Accepted: `.jpg`, `.jpeg`, `.png`. **Not `.heic`**, which is what iPhones shoot
by default — set the camera to "Most Compatible", or convert first.

## When somebody leaves

Remove them in the CMS. Their photograph is moved out of the way so the site
stops loading it, but it is never deleted.

## When somebody comes back

Add them again with the same **Photo name** they had before. Their photograph
comes back with them.

## If something goes wrong

Nothing is changed until every person has been checked, so a bad import leaves
the live roster exactly as it was. The failure names what is wrong:

```
2 problems in the roster — nothing was changed:

  • Row 14: Jane Smith's newPhoto "IMG_5501.JPG" is not in the uploaded headshots.
  • Row 22: Alex Lee has band "consultant" — must be one of executives, advisoryBoard, consultants.
```

To see these: the **Actions** tab at the top of the repository, then the most
recent "Import roster" run.
