# Bruin Studio Strategies (BSS) Website

## What this is
Marketing/recruiting site for **Bruin Studio Strategies**, UCLA's entertainment-industry
consulting club. Students apply through it, clients read about the club through it, and
it's the club's public face. Founded-by-students, run-by-students — the org unites
consulting fundamentals with entertainment-industry and Gen-Z insight.

## Stack
- React 18 + Vite, plain Tailwind CSS (no component library / no shadcn)
- `react-router-dom` for routing, `framer-motion` for animation, `react-icons`
- `three` + `@react-three/fiber` + `@react-three/drei` for the 3D hero scene (added
  during the hero redesign — pinned to the React-18-compatible major versions,
  `@react-three/fiber@^8` / `@react-three/drei@^9`, since the latest majors require
  React 19)
- App code lives in `bss-web/` (the repo root itself is just a wrapper around it)

## Deployment
Hosted on **Vercel**, auto-deploying `main` straight to production on every push.
Always work on a branch and let Vercel's preview-deploy give you a review URL before
merging — there's no staging environment otherwise.

## Pages / routes (`src/App.jsx`)
- `/` — Landing (hero, "What is BSS?" + client testimonial, team preview, footer)
- `/clients` — For Clients (services, process)
- `/recruitment` — For Students (FAQ, timeline, apply CTA)
- `/team` — full team grid (headshots in `src/pages/TeamPage/Headshots/`)
- `/contact` — contact form (EmailJS)
- `*` — 404

## Brand identity
Source of truth is the brand kit the club provided (Illustrator files, PDF-compatible —
readable directly by copying `.ai` → `.pdf`). Was never fully wired into the live site
before the 2026 redesign; the site used generic EB Garamond + only the purple swatch.

- **Colors**: navy `#0F172E`, purple `#523794`, blue `#5288C7`, magenta `#B73593` — all
  four are now Tailwind tokens (`tailwind.config.js`: `navy`, `purple`, `sky`, `magenta`)
- **Display font**: **Agatho** (a purchased/custom serif, several weights). Self-hosted
  as `.otf` in `bss-web/public/fonts/`, declared via `@font-face` in `src/index.css`,
  exposed as the Tailwind `font-display` key. Use for headlines; body copy stays on
  `font-sans` (Inter, Google Fonts) or the pre-existing `font-serif` (EB Garamond, still
  used elsewhere on the site — `font-display` was added as a new key specifically so it
  wouldn't change any of that existing usage).
- **Logo mark**: a "play button" triangle made of **three congruent equilateral
  triangles, rotated a few degrees relative to each other around the right-hand tip
  vertex** — that pivot is why the tip stays tight while the two left corners fan apart.
  Not four shapes, not different sizes, not freely offset — get this wrong and it stops
  reading as the brand mark. Reference: `Branding/Logos-Branding/BSS_instagramlogo.ai`
  in the brand kit zip (or the rendered PNG next to it).
- **Original design brief** (`Stack & Features.pdf` from the club, if you still have a
  copy): McKinsey-inspired serif-modern look, wireframe/network graphics, rotating logo,
  parallax "digital mountains," animated stat counters. Treat this as loose inspiration,
  not a spec to follow literally — confirmed directly by the person running this project.

## Current work: hero redesign (branch `redesign-hero`)
The original hero (flat wave PNG + a flat rotating logo PNG) was replaced with a
scroll-driven 3D scene (`src/components/HeroScene/`): a wireframe/lit terrain
(`Terrain.jsx`, simplex-noise ridges) plus the logo rebuilt as real 3D tube geometry
(`Logo3D.jsx`, matching the three-equilateral-triangles description above), with a
scroll-linked camera dolly. Guardrails: lazy-loaded behind `Suspense`, WebGL
feature-detected with a fallback to the original flat assets, `prefers-reduced-motion`
respected, capped device pixel ratio, viewport-scaled terrain resolution.

**Cost adapts to the measured frame rate, not just the viewport.** Width cannot see a
phone in Low Power Mode, which caps rAF at 30fps and throttles the GPU with it.
`useQualityTier` gives each tier a DPR ladder (`dprSteps`, best first); drei's
`PerformanceMonitor` in `HeroScene` steps down it when frames drop and back up when
they recover, settling after four applied changes. **Readings measured while the
page was scrolling are ignored.** A fast fling costs main-thread time, not GPU time,
yet it dragged the fps average down; the resulting DPR step reallocates the
multisampled drawing buffer and froze a frame for 100-250ms mid-fling, then stepped
back up when the page settled — four resizes in one fast pass, measured. Adapting
only on idle windows is what keeps fast scrolling smooth; do not remove it. At the bottom step the terrain's wireframe
pass stops drawing, and a further decline switches the canvas to an even 30fps
(`ThrottledLoop`, driving `advance` with `frameloop="never"`) for the rest of the
mount. Fixed per tier, never switched live because each would compile a shader
mid-scroll: the phone tier renders the terrain with `meshLambertMaterial` instead of
`meshStandardMaterial`. Also: the canvas is opaque (`alpha: false`, since
`scene.background` paints every pixel); stars twinkle per star in the vertex shader,
three draw calls instead of eighteen; the wireframe pass is skipped once it has
cleared; the landing's two blurred glow loops (Info, Team) only run on screen; and
`isWebGLAvailable()` releases its probe context, which used to leak one per visit to
the home page.

Antialiasing (MSAA) stays on at every tier, phones included — a must per the person
running the project. Recover cost elsewhere, never by turning it off.

Also on the phone tier: the terrain's and far ridge's *fragment* shaders run at
`mediump` (`precision.js`, via `onBeforeCompile`); vertex stages stay highp, because
distant stars swim and the twinkle clock steps at mediump. Watch for banding in dark
gradients. Every tier: `ReportWhenDrawn` compiles all shaders (`compileAsync`) and
uploads textures before it counts ready frames, so nothing compiles on first
appearance mid-scroll. Scroll progress is set synchronously in the scroll event
rather than in its own rAF — a callback queued there ran after the scene's
already-queued frame, so the scene drew a frame behind the page. And progress
divides by a measured `100vh`, not `innerHeight`, because the phone address bar
changes `innerHeight` mid-scroll while every vh-sized element in `Landing.jsx` stays
put — the mismatch jumped the camera.

Not done, on purpose: replacing the hero's CSS `mask-image` with a gradient overlay.
Rejected by the person running the project.

The dune field's shape lives in `terrainField.js`, not in `Terrain.jsx`, because the
mesh and the camera dolly both have to agree on where the ground is — the camera
clamps itself to a minimum clearance above `surfaceHeightAt()` every frame. Its noise
is seeded from a fixed constant, and that constant was chosen by scoring seeds for
clearance under the flight path; re-tune `CAMERA_START` / `CAMERA_TARGET` and the seed
has to be re-scored with them. `DistantRidge` and `Starfield` are seeded from the same
module. Everything unlit in the scene (the ridge, the fog) has to be lerped toward
night explicitly — only the lights respond to the sunset on their own.

**The sun's arc is authored against the desktop frame and fitted to every other
one.** `sunPath.js` places it in world units measured for a 45-degree lens at
aspect 1.6 — a half-height of 16.6 and a half-width of 26.6 at the sun's depth.
A portrait phone runs Terrain's widened lens and pulled-back camera, so at that
same depth the frame is ~26 units tall and ~12 wide: the authored sweep covered a
third of it and the mark filled 59% of its width, which is why the sun tracked
low across the ridge and came in enormous. `sunFrameFit()` returns the factor to
raise the arc by and the factor to scale the mark by — both 1 on desktop, so that
composition is untouched — and `Logo3D` and `SunsetLighting` read it every frame
rather than memoising on resize, because `Terrain` sets `camera.fov` from its own
effect and the ordering between two components' effects is not something to rely
on. The X span is deliberately left alone: at 14.3 the sun already starts just
outside a phone's frame and sweeps in, which is the entrance the hero wants.

**The hero ends by sinking into a dune, not by fading out.** `terrainField.js`
authors two shapes on top of the noise, and they do different jobs:

- a **near dune shaped like a U** — shoulders at the flanks, open across the middle.
  It is what the viewer looks at from the top of the scroll, and the gap is what
  they see the rest of the landscape through. Solid across, it walls the view off
  and the hero reads as a blob of sand rather than a place.
- a **far ridge**, low and close to where the camera lands, which fills the frame at
  the bottom of the sink. It fills it by being *near*, not tall: a tall one fills the
  frame just as well and then blocks the whole landscape from the top of the scroll.
  That trap was walked into twice. It is also uniform across its width — sagging its
  flanks cost nothing at frame centre and left a sliver of sky in the corner of wide
  screens (169 failures in 400 landscapes when it saddled).

Three numbers are measured, not chosen, and any change to the shapes or the camera
means re-measuring them: the camera starts at **4.6** because that is the lowest start
that can still see past the ridge; the crossfade starts at **0.7** because that is where
the linear descent first covers the frame; and the descent end holds **100% ground
coverage across 400 random landscapes at aspect ratios 1.2 through 2.8**, with the
camera clamp applied as it ships. A gap there is invisible until it is on someone's
monitor.

**The dunes are random per load; the shapes are not.** `SHAPE_SEED` fixes the ridge
meander and the U; `reseedDunes()` reseeds the dune field on every visit, and stars
vary too. Where the authored shapes live the random field is damped to 15% strength,
so a load whose noise notches the crest cannot open a hole in the frame and cannot
fill in the hollow the camera drops through. Unseeded *everything* — the original
state — put the camera through the terrain on 4.5% of loads.

**The descent is linear and tracks scroll tightly, and must stay that way.** The
section below scrolls 1:1 with the wheel; easing the camera or letting it lag makes
the two layers move at visibly different speeds through the hand-off. That is why the
sink uses `TRACKING_TAU` rather than the scene's default follower constant.

**Readiness is reported from inside the frame loop, not from `onCreated`.**
`onCreated` fires when the WebGL context exists, which is well before the terrain
and the logo have built their geometry — the two `requestAnimationFrame`s that
used to follow it were two frames into an empty scene, so the loading screen lifted
on a canvas that merely existed. `ReportWhenDrawn` counts three real rendered
frames instead. It also fires immediately when the frame loop is parked, since the
loop only runs while the hero is in view and a parked loop never draws a frame to
count.

**The scene is the background for the hero *and* for `Info`, not just the hero.** In
`Landing.jsx` both live inside one `relative` stage whose first child is the pinned
canvas; the content is pulled back over it with `-mt-[100vh]`. That stage must never
get `overflow-hidden` — a clipped ancestor becomes the scroll container and silently
breaks `position: sticky` for everything inside it. The hero no longer hands off to
the next section at a boundary; "What is BSS?" scrolls up over the live scene and the
canvas fades out underneath it, driven by `useSceneExitProgress` (a second scroll
phase, in viewport heights from the top of the document, separate from the hero's own
`useHeroScrollProgress`). The night sky the scene ends on is the body gradient's own
end colour, so fading the canvas reads as the landscape leaving rather than the
picture going transparent. Once the fade completes the frameloop is parked entirely.

Every scroll-driven value in the scene goes through `follow()` in `smoothing.js`
rather than reading the motion value directly, because scroll arrives in ~100px jumps.
It is time-based, and it snaps instead of easing across a gap longer than a frame —
without that, landing on an already-scrolled page replays the whole sunset from
daylight, and scrolling back up from below the hero runs it backwards.

## Mobile

**One type scale, in `openerAlignment.js`.** `TITLE_SCALE` and `LEDE_SCALE`
live beside the alignment constants and are read by `SectionOpener` *and* by the
landing's copy blocks, which animate their children and so write their own
markup. The landing used to run its own larger scale — deliberately — and it
stepped up one at `lg`: its section headings were 60px, exactly the size of an
interior page's h1, so "What is BSS?" was set at the scale of the *title* of the
clients page. The site also carried three body sizes (18/16/14px). Measured in
the browser, not guessed. Changing the site's type scale now means editing those
two constants.

**Openers centre below `md`; content stays left** (The Opener Rule in
DESIGN.md). `md` is 960px in this project, not Tailwind's 768. Every page header
and section heading on the interior pages renders through
`components/SectionOpener.jsx`, and the landing's hero and copy blocks import the
same classes from `components/openerAlignment.js` — change alignment there,
never per page. Timelines, forms and roster grids stay left at every width; the
clients page's service cells and process phases and the recruitment FAQ rows
centre with their openers below `md`. Left-aligned everywhere was tried and reverted by the person
running the project.

**Hover does not exist there, and most of this site is read there.** Anything
gated on hover needs a touch path or it simply never happens: the clients page's
six motifs were hover-only and never moved on a phone. `hooks/useHoverCapable.js`
reports whether the device has a fine, hovering pointer; without one the service
cells drive their motif from their own scroll position instead, playing on entry
and rewinding on exit. The same reasoning is why a team card's name carries a
resting underline rather than only a hover state.

## Page transitions (`src/transition/`)

**A 0.34s cross-fade, and a separate loading screen for the hero.** Two things
that do not know about each other.

**And before either of them, a loading screen that is plain HTML.** The veil below
is a React component, so it cannot paint until the bundle has downloaded, parsed
and mounted — ~800ms on a throttled phone profile, seconds on real mobile data, and
until then the page was bare body gradient with nothing on it. `#boot` in
`index.html` (inline `<style>`, `/logo.svg` rather than a bundled asset, so it needs
neither stylesheet nor script) paints on the first byte; `ClearBootScreen` in
`main.jsx` removes it in a layout effect on React's first commit, by which point the
veil is already drawn underneath. Its logo size, bar width and animation timings
mirror `LoadingScreen` so the hand-off is invisible — change one, change both. If
the bundle never loads at all, this screen stays up: that is the same failure as
before, minus the blank page.

**Both pages are on screen at once, and that is the whole trick.** `mode="wait"`
is the obvious way to write this and it cannot produce a clean fade: it unmounts
the old page *before* mounting the new one, so there is necessarily a stretch in
the middle with nothing on screen — it reads as a fade to blank gradient, a pause,
and a separate fade back, however short the durations are. The pages are stacked
in one CSS grid cell (`grid-cols-1 grid-rows-1` + `gridArea: "1 / 1"`) so the
outgoing one is still fading down while the incoming one fades up. The cell also
sizes to the taller of the two, so nothing collapses mid-transition.

Four versions were built before this one, all worse, all variations on hiding the
gap instead of removing it: a sliding gradient curtain; one veil doing both the
route change and the hero load; deferring the route swap until the cover finished;
and `startTransition` to render the incoming page underneath. If this needs
changing again, change the duration — do not reintroduce `mode="wait"`.

**The scroll reset is instant, and fires at navigation.** It used to run with
`behavior: "smooth"`, so it animated *during* the fade and the outgoing page
visibly slid upward as it dissolved — that was the original fault, not the fade.
It cannot wait for exit-complete now that the pages overlap, or the incoming page
would spend the whole dissolve sitting at the outgoing page's scroll offset.

`useSceneGate` (in `sceneGate.js`, its own module so `PageTransition.jsx` stays
components-only and keeps fast refresh) holds the loading screen up while a page
gets ready. `HeroBackdrop` is the only caller, and only on the WebGL path — the
flat fallback has nothing to compile, so gating it would stall on work that never
starts. It registers in a *layout* effect, because a passive one runs a frame too
late. A 700ms floor stops the screen blinking (what shows through a blink is the
flat 2024 hero underneath), a 9s timeout releases it regardless, and the spinner
only fades up after 450ms so a fast machine never sees one.

**That spinner is CSS, and has to stay CSS** (`.veil-loader` in `index.css`). It was
framer-motion revealed by a `setTimeout`, and both live on the main thread — the
same thread the hero's shader compile blocks for seconds. Measured on a throttled
phone profile, navigating back to the landing page held the veil up for 2.0s and the
spinner hit full opacity at 2.0s, i.e. exactly as the veil began to fade: a bare
gradient for the entire wait, which is what "it doesn't show any loading" was. The
delay is now `animation-delay` and the motion is compositor-driven, so neither can
be starved by the work the screen exists to cover.

The floor and its expiry are deliberately two effects. In one effect keyed on the
gate, the moment the gate opened its cleanup cancelled the pending timer and the
branch that would have restarted it was skipped — the flag stuck on and no page
ever appeared.

Every route used to carry its own copy of the same `motion.div` wrapper — six of
them, so a new route could ship with no transition at all. `App.jsx` is now plain
`<Route>` elements.

## For Students (`/recruitment`)

Rebuilt on the same measure and section-opener language as `/clients`, but with a
deliberately different character: **the landing owns the 3D landscape and the
clients page owns the engagement diagram, so this page borrows neither.** Its only
ornament is Agatho at scale — the stage numerals — and everything else is a
hairline rule. Trying the landscape here (a terrain-profile rail, elevation as the
timeline's axis) was explored and rejected: it made the reader decode a metaphor
before finding a date, and dates plus dress code are the whole reason a student
opens the page.

The cycle lives in `src/content/recruitment.json`, read through
`pages/Recruitment/content.js`. **The page is deliberately not
cycle-aware** — it describes how recruitment works, and a date is an attribute of
a stage rather than the thing the page is organised around. Every field except
`title` is optional and a missing one drops its row, so a stage with no venue
booked yet still renders. The dates in there are the Fall 2025 cycle's and are
stale.

**The timeline is a vertical spine.** One hairline runs down the left edge with a
dot per stage sitting on it and every entry on the right — same side for all of
them, because alternating sides makes the reader's eye cross the line five times
to read five stages. The spine fills sky from the top as you scroll: segments
behind you are full, the one you are reading fills proportionally, the ones ahead
are empty, which is what makes the line read as progress through the cycle rather
than as a border. Rows carry bottom padding only, never vertical margin, so each
segment runs from its own dot into the top of the next one and the spine is
continuous instead of five ticks. `DOT_TOP` / `SEGMENT_TOP` in `Timeline.jsx` are
what keep the dot level with the eyebrow line — they are tuned to that type size
and have to move with it.

`useStageFocus` measures each row against a focus line at 45% viewport height to
decide which stage is being read; section-wide scroll progress fails here, because
a section only a little taller than the viewport gives each of five stages less
than a mouse-wheel tick of travel. It returns `within` — the fraction of the way
through the current row — as well as the index, so the fill moves continuously
rather than jumping a fifth of the spine at a time.

Shapes tried and rejected before this one, in order: plain ruled rows, then ruled
rows with a hairline connector down the numeral column (both read as a schedule,
not a timeline), then a horizontal rail pinned to the top of the viewport that
doubled as jump nav. The pinned rail showed the whole five-stage shape at a glance
but was rejected on sight — the spine is what the page ships.

The header carries the page's one magenta (the apply button, in the first
viewport — the old page had no apply control at all, only a commented-out one),
which is why the closing block asks with a text link instead of a second button.
`TimelineItem` is gone and `Accordion` was rebuilt off its filled `bg-blue-950`
block into a ruled row; both were used only by this page.

**Every "Apply Now" on the site renders through `components/ApplyButton.jsx`, and
the link lives in `src/content/site.json`.** Before that there were four call sites
(navbar desktop, navbar mobile, the landing team block, the recruitment header,
and the team page's closing band) carrying four different treatments and, worse,
three different Google Form URLs.
The component's two variants are hierarchy rather than taste: `solid` is the
page's one call to action, `outline` is the navbar's standing link, which has to
stay available on every page without competing with whatever solid button is
below it. The URL sits in `content/site.json`, not in `pages/Recruitment/`,
because the navbar and the landing page both need it; `content/site.js` is what
components import, so nothing has to know the value comes from JSON. It is still
last cycle's and needs confirming.

## Content files (`src/content/`)

**Every string the club should be able to change without opening a component
lives here, and components own layout only.** This is the groundwork for a CMS —
the club edits these files through a form rather than through code. The JSON is
the source of truth; the sibling `.js` modules exist to give the reasoning
somewhere to live, since JSON carries no comments. `src/content/README.md` holds
the editing rules (plain strings, no HTML; keep the typographic punctuation;
headlines set in measured columns).

Done so far: `/recruitment` (`recruitment.json`), `/clients` (`clients.json`),
`/contact` (`contact.json`), `/` (`landing.json`), `/team` (`team.json`) and the
cross-page values in `site.json` (application URL, club address, the nav links,
the footer's social links, and each route's SEO title and description in
`seo.json`). Every page's copy is now out of its components.

**`seo.json` has two readers, on purpose.** `src/seo/siteMeta.js` imports it the
way Vite imports any JSON, for the app; `scripts/prerender-meta.mjs` reads the
same file with `readFile` instead of importing `siteMeta.js`, because a JSON
import inside a module Node runs directly needs an import attribute and a Node
version that honours it. One source of truth, two readers — and the script's
guard still fails the build with a named error if a tag it rewrites is missing
from `index.html`.

**One fact lives in one place, and tokens carry it.** `{cycle}` in any content
string is filled from `site.json` by `content/tokens.js`, which every page's
content module runs its file through at import. The recruitment introduction and
the landing page's apply note both name the cycle; as independent strings the
live site shipped "Fall 2026" against "Fall 2025". An unknown token is left
verbatim rather than blanked — a typo should print itself, not open a hole in a
sentence.

The 404 is the same shape: `seo.json`'s `notFound.body` is both the meta
description and the sentence `ErrorPage.jsx` renders, where before the head tag
and the page held separate copies of the same opening clause.

`index.html`'s landing-page head tags look like a third instance and are not
one — `prerender-meta.mjs` rewrites `dist/index.html` from `seo.json` like every
other route, so the built output cannot drift. Only the source file's values are
redundant.

**The five nav links are written once.** The navbar's desktop row, the navbar's
mobile menu and the footer all render `NAVIGATION` from `site.json`; they used
to write the same list out by hand three times, which is three places to forget
when a route changes. `path` stays a fixed choice of the routes `App.jsx`
defines — only `label` is copy.

## Roster imports (`roster-import/`)

**The roster is replaced in bulk, not edited a person at a time.** It turns over
all at once every year, and retyping 37 people through a CMS form is the job
nobody does. The club uploads `roster.csv` and the photographs into
`roster-import/` — through the CMS's own **Roster spreadsheet** and **Roster
photos** media folders, or github.com's upload button, which are the same commit
— and the *Import roster* Action runs `scripts/import-roster.mjs`, builds, and
commits the result. Locally that is `npm run roster`.

**`rename: false` on both media folders is load-bearing.** The sheet's
`photoFile` column names each photograph by the filename it arrived with, so
letting the CMS slugify an upload breaks the match between a person and their
picture. The importer does the renaming, to the slug, on the way into the
archive.

**The sheet is the single master for the roster.** `people.json` is generated
and must not also become CMS-editable: an import rewrites it wholesale, so a
person added through a form would be silently wiped by the next upload.

**The sheet's two photo columns are named for the club, not for us.**
`photoName` is what a photograph is stored as and must never change; `newPhoto`
is what it arrived as and is filled in only when replacing one. They were `slug`
and `photoFile`, which were developer words and easy to mistake for each other.
`COLUMN_ALIASES` in `import-roster.mjs` still accepts the old spellings, so a
sheet downloaded before the rename imports, and the write-back migrates its
header.

**`photoName` is a column, not something derived.** The existing slugs follow no rule
anyone could rederive — "Allison McCabe" is filed as `Alli_Mccabe`,
"Jesse Acosta-Huerta" as `Jesse_Acosta_Huerta` — so deriving them from names
silently detached three people from their photographs on the first test run. The
sheet's value wins; a derived one is only the fallback for somebody new. The
CSV also carries `photoFile`, the filename exactly as it came out of the
photoshoot Drive, which is what saves anyone renaming 37 files by hand. A
returning member leaves it blank and keeps the headshot they have.

**The importer maintains the sheet and the archive, not just `people.json`.**
Three things it does on a successful run, each fixing a trap that only appears a
year later:

- **Writes each person's slug back.** A new member's slug is derived from their
  name and was previously recorded nowhere, so correcting a spelling in the
  sheet the following year would derive a different slug and quietly detach them
  from their photograph.
- **Clears `photoFile`.** It names a file that has just been consumed — `photos/`
  is emptied on success — so leaving the value in place makes the *next* import
  fail on a photograph that no longer exists. Reproduced: it errors with
  `Row 34: … photo "STALE.JPG" is not in roster-import/photos/`. Clearing it is
  what makes "returning members leave it blank" true without anyone tidying up.
- **Restores anyone who comes back.** Retirement is reversible: add the row
  again and their photograph moves out of `former/` before the retirement sweep
  runs. A member who takes a quarter off should not need re-photographing, and
  nobody should have to know that folder exists.
- **Retires anyone no longer on the roster**, moving their original into
  `Headshots/former/`. `headshots.js` globs `Headshots/*`, which does not
  descend, so this is what stops the build deriving them. It is a move and not a
  delete: the photographs are the club's. Without it a departed member was still
  being shipped as three files in `dist/` — found by asking what happens when
  someone leaves.

Rows are edited in place rather than the file regenerated, so a column the club
added for its own use survives. The round trip is byte-identical when nothing
needs changing.

**A replacement photograph clears the slug's old file first.** Camera exports
are frequently `.JPG` where the archive holds `.jpg`, and Windows treats those
as one filename while Linux does not: locally the copy overwrites and everything
looks right, but the Action's runner would leave *both* in `Headshots/`, where
`headshots.js` keys on the basename and the slug would resolve to two different
images depending on directory order. Found by testing a photo swap, which is
exactly the case that produces it.

**Uploading a sheet does not replace the old one.** The CMS keeps both and
names the second `roster-1.csv`, and the importer reads `roster.csv` — so an
edit uploaded that way is ignored and the previous roster is republished, with
every step reporting success. The importer now refuses to run when it finds more
than one CSV rather than guessing which was meant.

**Only the photographs that were used are cleared from the inbox.** The two
uploads are two commits and the first one starts a run on its own, so uploading
the photograph before the sheet used to destroy it: the run fired, found no row
naming the file, and `photos/` was emptied wholesale. Observed in the club's
first real upload — the photograph was committed by the CMS and deleted by the
Action ninety seconds later, with nothing saying why. An unmatched photograph
now waits for its row.

**Nothing is written until every row is checked.** The failure this replaces was
silent: a slug that did not match its photograph rendered that person as their
initials and nobody noticed. It now refuses the whole import and names each
problem by spreadsheet row. LinkedIn URLs are normalised on the way through —
that caught a live deep link into someone's education subpage.

**`optimize-headshots.mjs` takes the roster as its authority, not the folder.**
`Headshots/` is an archive and keeps everyone the club has ever photographed;
deriving from all of it kept departed members in the bundle, because
`headshots.js` globs eagerly. Derivatives with no matching person are removed —
the first real run dropped one. The originals are never deleted.

The team page's *copy* is in `team.json` and moves through the CMS like any
other page; only the roster goes through this path.

**`Hero.jsx` takes its copy as a prop.** It lives in `components/` and the copy
lives in `pages/Landing/`, so importing it directly would have pointed a shared
component at a page folder — the same inversion `site.json` exists to avoid.
`Title.jsx` passes it down.

The contact form's labels are copy and moved; its `name` attributes did not —
those are the keys the EmailJS template reads. The club's general address had
been declared a third and fourth time as a local `const EMAIL` in `Contact.jsx`
and `Form.jsx`; both now read `site.js`.

**Copy and geometry stay apart.** A process phase's title, period and
description are content; where its bar sits on the week ruler is layout and
stays in `components/ProcessTimeline/phases.js`, which merges the two by `id`.
Editing "Weeks 1 to 4" must not be able to move a bar. Same reasoning makes
`motif` a fixed dropdown of the six drawings rather than a text field.

**No em dashes in anything a visitor reads.** Content files, page titles and
rendered separators all avoid them; `·` is the site's separator (a stage's
eyebrow reads `01 · 10/6 · 7:00 PM`). The en dash in "4–5 consultants" is a
numeric range and is a different character. This is the club's call and it
reversed an earlier rule, so `src/content/README.md` says so explicitly — code
comments and these notes are unaffected.

**`EDITING.md` at the repo root is the club's guide**, written for an officer
rather than for a developer: how to get into the CMS, the yearly cycle setup, the
punctuation rules, and a checklist. `roster-import/README.md` is its counterpart
for the roster. Both are the handover — if a change makes one of them wrong, that
is a shipped bug for the people who use this site, not a stale comment.

**No `actions:` block in `.pages.yml`, deliberately.** A "Rebuild roster"
button lived there and was removed: the CMS polls the dispatch endpoint to show
a button's run status, and the poll loops for as long as the tab is open. Each
poll is a GitHub API call, so a single open tab exhausted the authenticated
5,000/hour limit and locked the club out of uploading for twenty minutes —
`GitHub rate limit reached. Please wait 1283 seconds`. The button bought
nothing: uploading a file already fires the workflow. `roster.yml` keeps its
`workflow_dispatch` trigger, so a manual run is still possible from the Actions
tab.

**`.pages.yml` at the repo root is the CMS.** Officers sign in at pagescms.org
with GitHub, pick this repo, and that file renders as a labelled form; saving
writes the JSON back and Vercel deploys it. Two rules when editing it: declare
only what the club should change, because **a field left undeclared can be
dropped when the CMS rewrites the file**; and anything with a fixed set of valid
values is a `select`, never a string. That is why a service's `motif`, a process
phase's `id` and a nav link's `path` are dropdowns — a free-text motif draws an
empty cell and a free-text path 404s.

The recruitment closing ask is split into `lead` / `applyLinkText` /
`betweenLinks` / `tail` because that sentence wraps two links and the links are
structure rather than content — the fragments change the words around them, not
the shape.

Not yet touched in this pass: navbar styling (only its mobile breakpoint moved, to
`md`), most copy. The Paramount testimonial is set in Agatho Light at body scale — the one sanctioned
exception to the Serif-Asserts Rule (see DESIGN.md); Inter Light read generic.

## Contact (`/contact`)

Brought onto the redesign without changing what the page does. It was the last
page still on the old site's terms: a `w-10/12` grid nothing else uses, centred
above `sm` and left-aligned below it, an EB Garamond headline, and a form of
default-bordered boxes with a `bg-blue-500` button and `blue-500` focus rings —
four No Stock Blue violations in one component.

Now the standard header (eyebrow, Agatho, body at white/70 on `w-4/5 max-w-6xl`)
over a two-column body: addresses on the left, form on the right. **The general
address is in the first viewport and set larger than everything else**, because
most people opening this page already know they want to email, and making them
fill in a form first is the page working against them. Officer contacts are listed
by role rather than by name — the roster turns over yearly and a name list goes
stale one line at a time.

Fields are ruled rather than boxed (see Form Fields in DESIGN.md), and the submit
is the shared `CtaButton`, which grew a `<button>` branch for it.

**The form leads and the addresses are the aside beside it.** Both were the same
weight at first — a sky micro-label over each column, and two of them on the left
against one on the right — so neither led and the page made the reader choose
before it had told them anything. They are different *kinds* of thing now: the
form is the page's function and carries an Agatho subhead; the address column
opens with a line of body copy instead of a competing heading, and keeps one sky
label ("By role") for the list underneath.

The addresses stay on the left, where they read first; the form leads on weight
rather than on order. Both columns hang off one rule and both are bounded — 23rem
and 34rem, pushed apart with `md:justify-between`. Unbounded, they smeared small text across the full
72rem. 23rem on the aside is measured: the general address is 31 characters and
sets about 350px at `text-xl`, so a narrower column breaks it mid-address.

**Addresses are always `font-sans`.** The general one was briefly Agatho at
`text-3xl` — a high-contrast display serif rendering something full of `@` and
dots reads as a mistake. Agatho carries authority; an address is information.

**What made it read as grey was sky having nothing to do.** The column headings
were white/50, but the system's Label token *is* Instrument Sky — with the
headline in Agatho and everything else white-on-gradient, no accent named the
structure. They are sky now; the general address is Agatho at `text-2xl`/`3xl`,
second-loudest thing on the page after the headline; and a purple radial bloom
sits under the form column, which is the one thing Deep Iris is allowed to do
(ground, never paint). Magenta stays only on the submit.

**The old form reported success it had not had.** It called `setSubmitted(true)`
synchronously after `emailjs.send` and logged failures to the console, so a send
that never arrived still thanked you. It now awaits the promise and has real
`idle`/`sending`/`sent`/`error` states, with the failure naming the club's address
as the way through.

Splitting the page by audience (client vs. student) was considered and rejected as
doing too much for what this page is.

## Team page (`/team`)
`/team` rebuilt into the redesign's visual world: one uniform cell per member (no
ranking by size — see The Equal Cell Rule in DESIGN.md), name/role/major always
visible instead of hidden behind the old black hover overlay, ruled band headings
with counts, responsive 2→3→4→5 columns, and a closing Apply Now CTA (which is
the shared `ApplyButton`, like every other one on the site).

**Headshots are derived at build time by `vite-imagetools`.** The originals in
`src/pages/TeamPage/Headshots/` total ~55 MB; `headshots.js` globs them with
query directives (320/640px WebP, a 640px JPEG fallback, and a 20px blur-up) and
the build emits the rest. `people.js` stores a `slug` and that is the join key.
Nothing resized is committed, so the old failure — add a headshot, forget to
re-run the script, ship a member rendered as initials — cannot happen.

Four things learned wiring it up, all of which bite again if changed:

- **`import.meta.glob` takes literals only.** Building the query from constants
  fails the build with "Could only use literals", so the four globs repeat
  themselves on purpose.
- **imagetools' default file filter is case-sensitive**, and six of the archive's
  originals are `.JPG`/`.JPEG` as camera exports usually are. `vite.config.js`
  passes a case-insensitive `include` or the build fails outright.
- **`assetsInclude: ['**/*.JPG', '**/*.JPEG']` used to sit in `vite.config.js`**
  from when the landing page imported camera exports directly. With imagetools
  added it claimed those extensions first and six headshots shipped as untouched
  originals — one of them 6.9 MB, 19 MB of images in total. It is gone; nothing
  imports a raw `.JPG` any more.
- **The blur-up needs `&inline`.** imagetools emits its own assets, so Vite's
  `assetsInlineLimit` never sees them and 38 ~350-byte placeholders became 38
  extra requests on the page most often opened on a phone.

Known limit: imagetools will not upscale and `withoutEnlargement=false` is
ignored, so three members whose source photographs are 400x400 get that size in
the 640 slot rather than an enlargement. The `srcSet` descriptor overstates
them; `object-cover` still fills the cell. Better source photographs are the fix.

Pinned to `vite-imagetools@9` because v10 requires Vite >= 7 and v11+ Vite >= 8,
and this project is on Vite 5. Upgrading Vite frees that.

**The rest of the site's photographs follow the same rule.** `src/assets/IMG_9814.JPG`,
`group.JPG`, `board.jpg`, `paramount.png` and `waves.png` are originals and are never
imported; `scripts/optimize-site-images.mjs` derives one WebP each into
`src/assets/optimized/` (1280px for the photos, which is right for a 3x phone column
and a 2x laptop column alike; 320px for the Paramount mark, which draws 36px tall) and
writes the 1200x630 `public/og-image.jpg` social card. That took the landing page's
images from ~4.3 MB to ~0.7 MB. Re-run it after replacing a source image, and commit
the output.

## SEO (`src/seo/`)

**The site is a client-rendered SPA behind a catch-all rewrite, so `index.html` is
served for every path.** `RouteMeta.jsx` rewrites the title, description, canonical,
robots, Open Graph and Twitter tags on every route change from the table in
`siteMeta.js`; the 404 is `noindex`. `index.html` keeps the landing page's values
plus Organization JSON-LD as static defaults, because link unfurlers (Instagram,
iMessage, Discord) never run JavaScript and only ever see that file — keep the two in
step. `SITE_URL` in `siteMeta.js` is the club's own domain,
`https://www.bruinstudiostrategies.com`, live since 2026-09-16 and canonical on the
`www` host (the apex 308-redirects to it). It is duplicated in `index.html`,
`public/robots.txt` and `public/sitemap.xml`; all four change together.

**Production is `main`, and the domain rides the latest production deployment.** The
domain was attached to a different Vercel account, which served a stale build no
matter what this account deployed; it was claimed with a `_vercel` TXT record at
Cloudflare (the club's DNS), and Vercel then bound it to the *next* production
deploy rather than the existing one. If the live site is ever stale while
`bss-website.vercel.app` is current, that binding — not the build — is what to check.

**Each route ships its own HTML file, written after the build.**
`scripts/prerender-meta.mjs` (run by `npm run build`, so Vercel runs it too) copies
`dist/index.html` to `dist/clients/index.html`, `dist/team/index.html` and so on, with
that route's title, description, canonical and OG/Twitter tags baked in. Vercel checks
the filesystem before the catch-all rewrite, so those files are what `/team` and
`/clients` actually serve. Without them every path served the landing page's head —
five URLs all claiming `canonical: /`, which is how subpages get dropped as
duplicates, and what unfurlers (which never run JS) saw. The script fails the build if
a tag it rewrites is missing from `index.html`, so renaming one there cannot silently
stop working. It rewrites the head only: the body is still React's, so full
prerendering of content remains a separate, larger change.

**The favicon is a raster set on a navy tile, not the raw SVG.** Google's result
for the site showed its generic globe placeholder, for two reasons. Nothing
answered `/favicon.ico` — the favicon crawler requests that path whatever the page
declares, and with no such file `vercel.json`'s catch-all rewrite returned
`index.html` for it under a `200`, which claims success for something that is not
an image. And the single `rel="icon"` the page did carry pointed at `/logo.svg`:
hairline ribbons on transparency over a 1440px viewBox, which at 16px on a white
results card fade to a grey smudge. Anything dropped in `public/` beats the
rewrite, so shipping real files is the whole fix for the first half.

`scripts/generate-favicons.mjs` (sharp, run by hand like the other two image
scripts, output committed) renders `public/logo.svg`, trims it out of its
oversized viewBox so the padding means the same on every edge, and writes
`favicon.ico` (16/32/48 as PNG-in-ICO, packed by hand since sharp cannot write
the format), `favicon-96.png`, `icon-192/512`, a maskable 512 and
`apple-touch-icon.png`, plus `public/site.webmanifest`.

**The browser icons are transparent; only the home-screen ones carry a tile.**
They were all composited onto an opaque `#0F172E` square, on the reasoning that
Google's white card and Chrome's near-black strip would each wash out one end of
the blue-to-magenta gradient. In the tab strip that square reads as a black box,
which is a shape the brand does not have — and the gradient's two ends
(`#5288C7`, `#B73593`) are mid-tone and hold against white and near-black alike.
Thin ink was the real problem, and the stroke ladder below is what answers it.
`apple-touch-icon.png` and the maskable 512 keep the navy tile, because neither
platform honours transparency: iOS composites an alpha icon onto black, and a
maskable icon is cropped to the launcher's shape and needs ink to the crop's
edge. Left transparent, those two trade a tile you chose for one you didn't.

**Stroke weight rides the output size, and that trade is the interesting part.**
The mark is an outline drawing, so downscaling puts each ribbon on a fraction of
a pixel and alpha-blends it to near-invisibility. Fattening fixes that and costs
the mark if overdone: measured at 96px, by weight 36 the three rotated triangles
have merged into one thick outline and it is no longer the brand mark. 20 is the
most that still resolves as three. So 16/32/48 take heavier weights — the fan is
not resolvable at those sizes at *any* weight, so they trade it for legibility —
and 96 and up keep it. 512 is the untouched artwork. The raw SVG is deliberately
no longer in the icon list: browsers prefer it when offered and it is the one icon
with no tile behind it. `logo.svg` remains the source artwork and what `#boot`
paints.

`prerender-meta.mjs` does not touch these tags, so every route file carries them.

**Every page has exactly one `h1`.** `SectionOpener` renders page openers as `h1` and
section openers as `h2`; everything under them steps down from there. The hero's "Work
with the Best" label is a paragraph, not a heading.

**A card's hover names its destination rather than moving.** The portrait scaled
4% at first, which says something is happening and nothing about what. Now a scrim
lifts off the bottom of the frame with a bordered "LinkedIn" plate rising into it,
the ring warms to sky, and the name's underline warms from white/25 to sky. All of
it is gated on the person actually having a profile, so a card that goes nowhere
does not look clickable.

**The name's underline is drawn at rest.** A LinkedIn glyph used to sit beside the
name as the at-rest signal and was cut for being noise on a 37-cell grid, which
left the card with nothing but hover states — and most of this page's traffic is
on phones, where hover does not exist. The resting underline replaces it: quiet at
white/25, sky when you are on it.

Executives load eagerly at high fetch priority; everyone below the fold stays
lazy. Full detail, including why the roster deviates from the Eyebrow, Framed
Figure, and SectionDivider rules, is in DESIGN.md under Roster Grid.
