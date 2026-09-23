# Editing the BSS website

You do not need to know how to code to change anything in this guide. Nothing
here can break the site's design — the layout, fonts and colours are fixed, and
you are editing the words inside them.

There are two tools, for two different jobs:

| What you want to change | Where |
| --- | --- |
| Any words on any page — dates, headings, paragraphs, the apply link | **The CMS** |
| The whole team roster, once a year | **Upload a spreadsheet and photos** ([guide](roster-import/README.md)) |

Everything you change goes live on its own, about two minutes later.

---

## Getting in

1. Go to **[app.pagescms.org](https://app.pagescms.org)**.
2. Sign in with GitHub. If you do not have an account, make one — it is free and
   takes two minutes. Ask whoever runs the site to give your account access.
3. Pick this repository.

You will see a list of pages down the left. Click one, edit the boxes, press
**Save**.

---

## Setting up a new recruitment cycle

This is the main thing the site needs each year. About five minutes.

### 1. The cycle name

**Site-wide → Current recruitment cycle**

Type the new cycle, e.g. `Fall 2027`.

Write this **once**, here. Both the recruitment page and the home page say it,
and they take it from this one box. (They used to be typed separately, and the
site spent a year saying Fall 2026 on one page and Fall 2025 on the other.)

### 2. The application form

**Site-wide → Application form link**

Paste the new Google Form URL. Every "Apply Now" button on the site points here.
Check this every year — it is the single most important field on the site, and
the thing most likely to be left pointing at last year's form.

### 3. The dates

**For Students page → Recruitment timeline → Stages**

One row per stage. Fill in what you know:

- **Stage** — the name, e.g. "Information Session". Required.
- **Date** — written how it should read, e.g. `10/6` or `10/17 + 10/18`.
- **Time**, **Location**, **Attire** — leave blank if not decided yet. A blank
  field simply does not appear on the page, so you can publish the timeline
  before every room is booked.
- **Invitation only** — tick for coffee chats and final interviews.
- **Description** — a sentence or two about what happens.

You can add or remove stages. There is nothing magic about there being five.

### 4. Check it

Open the site two minutes later. The dates should be on `/recruitment`, and the
home page should mention the same cycle.

---

## Changing words on a page

Every page is in the list: **Home**, **For Clients**, **For Students**,
**Our Team**, **Contact**.

Some field names worth knowing:

- **Eyebrow** — the small blue capitals above a heading.
- **Headline** / **Section heading** — the large serif text.
- **Introduction** / **Body** — the paragraph underneath.

### The home page headline

It is two boxes — "Cut to" and "Success" — because the second word is set much
larger than the first. Keep the second one short; it prints very big.

---

## Things that are deliberately not editable

If you want one of these changed, it needs a developer:

- **The team roster.** Edited as a spreadsheet, not a form — see the
  [roster guide](roster-import/README.md). You upload it, and the photos, from
  **Roster spreadsheet** and **Roster photos** in the CMS sidebar.
- **Photographs** anywhere other than the roster.
- **Which drawing** appears on each service on the For Clients page. You can pick
  from the six that exist; there is no way to add a seventh.
- **Where the bars sit** on the project timeline. You can rename a phase and
  reword it; the shape of the chart is fixed.
- **Page layout**, colours, fonts, the 3D landscape on the home page.
- **Adding a new page.**

---

## Rules that keep the site looking right

**Do not paste formatted text.** Copying out of Google Docs or Word can bring
invisible formatting with it. If something looks wrong after a paste, retype it.

**No em dashes.** The site does not use them. Where you want a pause, use a
comma, a semicolon or a full stop; where you want a separator, use `·`.

**Keep the curly apostrophes.** `don’t`, not `don't`. If you retype a sentence
from scratch you will probably lose them, so it is easier to edit around what is
already there.

**Headlines have room, but not unlimited room.** A headline three times longer
than the one it replaces will still work, but it will look wrong. Keep roughly
the length of what is there.

**Never paste HTML.** Anything in angle brackets shows up on the page literally.

---

## If something goes wrong

Nothing you do here is permanent — every change is recorded and any of it can be
undone. If a page looks broken after an edit, say what you changed and it can be
put back exactly as it was.

If a change has not appeared after five minutes, it is probably still building
rather than lost.

---

## Yearly checklist

At the start of each academic year:

- [ ] **Site-wide → Current recruitment cycle** — new cycle name
- [ ] **Site-wide → Application form link** — this year's Google Form
- [ ] **For Students → Stages** — the new dates, times, rooms
- [ ] **Contact → Officers** — the new board, by role
- [ ] **The roster** — see the [roster guide](roster-import/README.md)
- [ ] Open the site and read it top to bottom
