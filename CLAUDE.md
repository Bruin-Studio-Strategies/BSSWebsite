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

The dune field's shape lives in `terrainField.js`, not in `Terrain.jsx`, because the
mesh and the camera dolly both have to agree on where the ground is — the camera
clamps itself to a minimum clearance above `surfaceHeightAt()` every frame. Its noise
is seeded from a fixed constant, and that constant was chosen by scoring seeds for
clearance under the flight path; re-tune `CAMERA_START` / `CAMERA_TARGET` and the seed
has to be re-scored with them. `DistantRidge` and `Starfield` are seeded from the same
module. Everything unlit in the scene (the ridge, the fog) has to be lerped toward
night explicitly — only the lights respond to the sunset on their own.

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

## For Students (`/recruitment`)

Rebuilt on the same measure and section-opener language as `/clients`, but with a
deliberately different character: **the landing owns the 3D landscape and the
clients page owns the engagement diagram, so this page borrows neither.** Its only
ornament is Agatho at scale — the stage numerals — and everything else is a
hairline rule. Trying the landscape here (a terrain-profile rail, elevation as the
timeline's axis) was explored and rejected: it made the reader decode a metaphor
before finding a date, and dates plus dress code are the whole reason a student
opens the page.

The cycle lives in `pages/Recruitment/stages.js`. **The page is deliberately not
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
the link lives in `src/applyLink.js`.** Before that there were four call sites
(navbar desktop, navbar mobile, the landing team block, the recruitment header)
carrying three different treatments and, worse, three different Google Form URLs.
The component's two variants are hierarchy rather than taste: `solid` is the
page's one call to action, `outline` is the navbar's standing link, which has to
stay available on every page without competing with whatever solid button is
below it. `applyLink.js` sits at the src root, not in `pages/Recruitment/`,
because the navbar and the landing page both need it. Its URL is still last
cycle's and needs confirming.

Not yet touched in this pass: navbar styling, the "What is BSS?"/testimonial section,
Team/Contact pages, most copy.
