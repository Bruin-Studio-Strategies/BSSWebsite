---
name: Bruin Studio Strategies
description: A computed sunset landscape, read through a quiet institutional instrument.
colors:
  navy: "#0F172E"
  purple: "#523794"
  sky: "#5288C7"
  magenta: "#B73593"
  horizon-indigo: "#3D3C95"
  deep-night: "#0A0D3D"
  night-sky: "#141338"
  ridge-shadow: "#211D4E"
  starlight: "#E8E6FF"
  lilac-ambient: "#C9BEFF"
  orchid-key: "#B98CE0"
  text-primary: "#FFFFFF"
  text-secondary: "rgba(255,255,255,0.70)"
  text-tertiary: "rgba(255,255,255,0.50)"
  text-quiet: "rgba(255,255,255,0.30)"
  hairline: "rgba(255,255,255,0.10)"
  hairline-strong: "rgba(255,255,255,0.20)"
  glass-fill: "rgba(255,255,255,0.03)"
typography:
  display:
    fontFamily: "Agatho, serif"
    fontSize: "clamp(2.25rem, 6vw, 6rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "normal"
  headline:
    fontFamily: "Agatho, serif"
    fontSize: "clamp(2.25rem, 4.5vw, 3.75rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "normal"
  title:
    fontFamily: "Agatho, serif"
    fontSize: "clamp(1.25rem, 2vw, 1.5rem)"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(1rem, 1.2vw, 1.125rem)"
    fontWeight: 300
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.2em"
  label-micro:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.2em"
rounded:
  none: "0px"
  sm: "2px"
  md: "6px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  2xl: "64px"
  section: "112px"
components:
  button-primary:
    backgroundColor: "{colors.magenta}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "rgba(183,53,147,0.80)"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  button-outline-hover:
    backgroundColor: "{colors.magenta}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  nav-item:
    backgroundColor: "transparent"
    textColor: "rgba(255,255,255,0.80)"
    typography: "{typography.body}"
    padding: "0px"
  nav-item-hover:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    typography: "{typography.body}"
    padding: "0px"
  eyebrow:
    backgroundColor: "transparent"
    textColor: "{colors.sky}"
    typography: "{typography.label}"
    padding: "0px"
  panel-flat:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.lg}"
    padding: "24px"
  panel-glass:
    backgroundColor: "{colors.glass-fill}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.lg}"
    padding: "24px"
  figure-framed:
    backgroundColor: "transparent"
    rounded: "{rounded.xl}"
    padding: "0px"
---

# Design System: Bruin Studio Strategies

## Overview

**Creative North Star: "The Overlook"**

You are standing above a computed landscape at sunset. Below you, a wireframe
terrain runs to a horizon where a triangular sun is setting; the sky bleeds from
indigo down into a near-black night. That world is generated, not photographed —
it is a rendering, and it is honest about being one. The interface you read it
through is the opposite: quiet, exact, and institutional. Hairline rules. A serif
that carries weight. Small-caps labels. Enormous margins. Nothing decorative that
isn't load-bearing.

The tension between those two halves is the whole identity. A student consulting
club has to look like it belongs in a room with a studio executive, which argues
for old-money restraint — ruled structure, generous air, a display serif with
gravity, no gimmicks. But it also has to look like it was built this decade by
people who understand the medium, which is what the landscape supplies. Neither
half is allowed to win outright. The atmosphere lives in the background layer and
in the hero; the foreground stays disciplined. When a surface feels loud, the fix
is always to quiet the interface, never to dim the world.

Confirmed rejections, all of them from the site's own prior state: white cards
with saturated color headers; Tailwind's stock `blue-*` and `gray-*` families
standing in for brand colors; EB Garamond as a display face; decorative icon
circles doing the work that structure should do; and any surface that requires
statistics, client logo walls, or case studies the club does not have. The 2024
site is evidence of what to avoid, not a base to polish.

**Key Characteristics:**

- Dark-field always. The page is a navy-to-indigo gradient; there is no light mode.
- Agatho for anything that carries authority; Inter for anything that carries information.
- Sky blue labels the structure. Magenta marks the one action. Everything else is white at a chosen opacity.
- Motion is one easing curve, always, and it always defers to `prefers-reduced-motion`.
- Depth comes from hairlines and tonal shifts, not shadows — except directly over the 3D scene, where blur is the only thing keeping text legible.

## Colors

A single dark chord — indigo through navy to near-black — lit by three brand
accents that each have exactly one job.

### Primary

- **Signal Magenta** (`#B73593`): the action color, and nothing else. Primary CTAs, the "Apply Now" outline that fills on hover, the rule beside a pulled quote. It is the only saturated warm note in the system, which is precisely why it reads as clickable.
- **Instrument Sky** (`#5288C7`): the structure color. Small-caps eyebrows above section headings, the underline that draws in under a nav item, footer link hover, the cool fill light in the 3D scene. Sky does all the quiet accent work so magenta never has to.

### Secondary

- **Deep Iris** (`#523794`): the brand purple. Rarely a flat UI color; it lives in gradients, in the terrain's mid-elevation ramp, in the ambient glows behind framed imagery, and in the substrate grids and section blooms behind the service motifs. Treat it as atmosphere, not paint — it is the layer things sit *on*, never the layer things are *made of*.

### Neutral

- **Studio Navy** (`#0F172E`): the anchoring dark. Footer ground, terrain valley floor, the base every panel tints toward. The nearest thing this system has to black.
- **Horizon Indigo** (`#3D3C95`): the top of the page gradient and the scene's daytime sky. Where the light is coming from.
- **Deep Night** (`#0A0D3D`): the bottom of the page gradient. The page literally gets darker as you scroll.
- **Night Sky** (`#141338`) and **Ridge Shadow** (`#211D4E`): the scene's dusk sky and its distant ridge silhouette. Available for large background masses on any page that wants the landscape's depth without rendering it.
- **Starlight** (`#E8E6FF`), **Lilac Ambient** (`#C9BEFF`), **Orchid Key** (`#B98CE0`): the light in the scene — stars, ambient bounce, key light. Not UI colors. Documented so future scene work stays in the same light.
- **White at opacity** — 100% for headings, 70% for body, 50% for supporting detail, 30% for the quietest metadata, 20% for strong hairlines, 10% for ordinary hairlines, 3% for glass fill. This ladder replaces a gray scale entirely.

### Named Rules

**The Two-Accent Rule.** Sky and magenta are the only accents that touch content:
sky labels structure, magenta marks the one action. Purple never joins them — it
works exclusively behind, as ground and glow. A surface that feels flat is
missing atmosphere, not another accent color.

**The One Action Rule.** Magenta marks the single most important action on a
screen and nothing else — under about 5% of any viewport. If two things on a page
are magenta, one of them is wrong. Sky blue takes every accent job that isn't a
call to action.

**The No Stock Blue Rule.** Tailwind's default `blue-*`, `gray-*`, and `slate-*`
families are banned. `bg-blue-950` is not Studio Navy, `bg-blue-900` is not Deep
Iris, and `text-gray-400` is not white-at-50%. Every color on screen comes from a
brand token or a white/black alpha value. Existing violations in the legacy
components are drift, not precedent.

**The Gray-Is-White Rule.** There is no gray in this system. Secondary text is
white at reduced opacity, so it sits correctly on every one of the dark fields —
gradient, navy, glass, or live 3D — without a second palette.

## Typography

**Display Font:** Agatho (self-hosted OTF, weights 300/400/500/700, fallback `serif`)
**Body Font:** Inter (Google Fonts, variable, fallback `system-ui, sans-serif`)
**Legacy Font:** EB Garamond — present in the codebase, being retired. Do not use in new work.

**Character:** Agatho is a high-contrast display serif with real editorial
weight — it does the job a wordmark does, which is why it can carry a heading at
`8xl` without any other ornament. Inter beneath it is neutral to the point of
being invisible, set light (300) so it never competes. The pairing is the
old-money half of the identity: the serif asserts, the sans informs, and the
distance between them is the hierarchy.

### Hierarchy

- **Display** (Agatho 400–500, `clamp(2.25rem, 6vw, 6rem)`, line-height 1.1): page-opening headlines. Landing hero only, at present. The scale is the point — do not use it at half size for decoration.
- **Headline** (Agatho 400, `text-4xl` → `text-6xl`, line-height 1.1): section headings — "What is BSS?", "Our Team". Always paired with a sky-blue eyebrow above it.
- **Title** (Agatho 500, `text-xl` → `text-2xl`, line-height 1.3): card and panel headings, timeline entries, accordion questions.
- **Body** (Inter 300, `text-base` → `text-lg`, line-height 1.625, max width ~`max-w-xl` / 65–75ch): all running text, at white/70. Never justified, never full-bleed.
- **Label** (Inter 600, `text-xs` → `text-sm`, uppercase, letter-spacing `0.2em`, Instrument Sky): the eyebrow above headings, phase markers on process cards, category tags. This is the system's most recognizable small detail.
- **Label Micro** (Inter 600, `0.6875rem`, uppercase, letter-spacing `0.2em`): one step below Label, for annotation that sits *inside* a diagram rather than labelling a block of content — week numerals on the project schedule, its legend, row numbering, and the "each project includes" spec. Never use it for a section eyebrow; if a label introduces content, it is a Label.

### Named Rules

**The Eyebrow Rule.** Every major section opens with a sky-blue uppercase
`0.2em`-tracked label, then the Agatho headline, then body at white/70. That
three-beat opening is how a section announces itself; it is consistent across
every page and should not be improvised per-surface.

**The Serif-Asserts Rule.** Agatho is for statements — headings, the wordmark,
numerals used as structure. It never sets running text, never sets UI labels, and
never sets anything the user has to read quickly.

## Layout

A centered measure on a dark field, with air as the primary luxury signal.

- **Container:** `max-w-6xl` centered, with responsive gutters `px-6 sm:px-10 md:px-14 lg:px-20`. Reading-width sections narrow to `max-w-5xl`; body copy inside them caps at `max-w-xl`.
- **Section rhythm:** `py-20 sm:py-28` between major sections. Content blocks inside a section step down to `gap-10 sm:gap-14 lg:gap-20`.
- **The two-column figure/text block** is the system's workhorse: a framed image on one side, eyebrow + headline + body + CTA on the other, `grid-cols-1 md:grid-cols-2`, order swapped between adjacent sections so the page alternates. On mobile it stacks with text first (`order-1`).
- **Breakpoints are non-standard and deliberate:** `sm: 576px`, `md: 960px`, `lg: 1440px`. This is not Tailwind's default scale — `sm` behaves like a phone-to-tablet break and `md` is where two-column layouts actually engage. Design mobile-first against these numbers, not against the defaults.
- **Section dividers:** one component, `SectionDivider`, used on every page. A hairline (`h-px`, `w-11/12`, `max-w-3xl`) that fades to transparent at both ends and scales in from its centre when first scrolled into view (0.9s, project easing, `once`, `amount: 1`). Spacing is the only thing a caller varies, passed as `className` — `my-12` between major sections, `my-4` where two sections are deliberately tight. It replaces the legacy `<hr>` elements entirely.
- **Scroll-pinned sections:** the hero uses a track taller than the viewport (`160vh`) with a `sticky` child, so the scene stays pinned while its animation plays. The track height and the hook's constant must be changed together.

### Named Rules

**The Absolute Footer Rule.** The footer is `position: absolute` at a fixed height
(`h-60` mobile / `h-24` from `sm`), not in normal flow. Every page must reserve its
own bottom clearance (`pb-96 sm:pb-60` on the landing, hand-tuned elsewhere) or
content will sit under it. This is a known structural debt: when a page is
rebuilt, prefer moving it into flow over adding another magic padding value.

**The Air Rule.** When a section feels cramped, remove an element before reducing
spacing. Generous vertical rhythm is doing identity work here, not just
readability work.

## Elevation & Depth

Depth is tonal and linear, not cast. Surfaces are separated by hairline borders
and by shifts in the underlying dark, the way an engraved document separates its
parts. There is no ambient shadow vocabulary and no resting elevation: a panel at
rest is flat, bounded by a 1px white/10 rule.

The single exception is content sitting directly over the live 3D scene, where the
background is moving pixels rather than a flat gradient. There, translucency plus
`backdrop-blur` is the only thing that keeps text legible, and it is permitted.

Where the system does want luminous depth — behind a framed photograph — it uses
a soft brand-gradient bloom (`from-sky/30 via-purple/20 to-magenta/30`, `blur-2xl`,
inset `-inset-3`) breathing slowly behind the image, not a drop shadow beneath it.
Light comes from behind the object, never from above it.

### Shadow Vocabulary

- **Hover lift** (`shadow-lg shadow-magenta/30` paired with `-translate-y-0.5`): primary CTA on hover only. A colored glow, not a black shadow.
- **Figure frame** (`shadow-2xl ring-1 ring-white/10`): photographs only, to separate a bright rectangle from the dark field.

### Named Rules

**The Two-Ground Rule.** Blur is a function of what is behind the element, not of
taste. Over the live 3D scene: translucent fill plus `backdrop-blur` is correct.
Over the flat page gradient: flat fill and a hairline border, no blur, no resting
shadow. Never apply frosted glass to a panel sitting on a static background — it
costs GPU, buys no legibility, and is the first thing that will look dated.

**The Flat-At-Rest Rule.** Shadows are a response to state, never a property of a
surface. If an element has a shadow while nobody is touching it, remove it.

## Shapes

The form language is rectangular and lightly softened — corners are cut, not
rounded, at the scale where it matters.

- **Buttons and small interactive surfaces:** `rounded-sm` (2px). Nearly square. This is what keeps CTAs reading as institutional rather than consumer-app.
- **Panels and cards:** there aren't any. Groups of peer items are ruled cells with square corners (see Ruled Cells); the only radius above `rounded-sm` in content belongs to photographs.
- **Photographs and figures:** `rounded-2xl` (16px), always with a `ring-1 ring-white/10` frame.
- **Circles** (`rounded-full`) are reserved for social icon buttons and scene elements. A circle around a decorative icon inside content is a legacy pattern being removed.
- **Borders** are 1px at white/10 by default, white/20 where a division needs to assert, and shift to a brand color only on hover (`hover:border-magenta/40`).
- **The recurring silhouette** is the logo mark itself: three congruent equilateral triangles rotated a few degrees about their shared right-hand tip vertex, so the tip stays tight while the left corners fan apart. It appears as flat mark, as 3D tube geometry, and as the setting sun in the hero. Any new use must preserve that construction exactly — three shapes, equal size, common pivot.

### Named Rules

**The Square-Button Rule.** Interactive controls stay at 2px radius. Pill buttons
and heavily rounded cards read as a startup landing page and break the
institutional half of the identity.

## Components

### Buttons

- **Shape:** near-square (`rounded-sm`, 2px), uppercase Inter 600, letter-spaced into the same small-caps family as the eyebrows (`0.18em` primary, `0.16em` outline) rather than a default `tracking-wide`.
- **Primary:** solid Signal Magenta, white text, `px-7 py-3` at `text-sm`. One per screen, by The One Action Rule.
- **Outline (nav "Apply Now"):** transparent with a 1px magenta border, white text, `px-4 py-2` at `text-xs`. The standing recruitment CTA in the navbar and mobile menu — it has to stay available on every page without competing with whatever primary the page below it is showing.
- **Hover is a wipe, not a lift.** A veil sweeps across the face of the button from the left over 450ms on the project easing curve: navy/35 on the primary, so the magenta *deepens*; solid magenta on the outline, so the border fills. Nothing translates, nothing glows. Focus-visible fires the same sweep, so a keyboard gets the mouse's feedback.
- **Why:** the wipe is this site's gesture — the nav underline draws in from the left, the service cells rule in from the left, the recruitment spine fills from the top. A button that lifted 2px and grew a magenta-tinted glow was speaking a different language from every other interactive thing on the site, and it was the generic one. Deepening rather than fading matters too: a primary action that gets lighter when you reach for it reads as going away.
- **Every apply control on the site is one component** (`components/ApplyButton.jsx`), linking to one URL (`src/applyLink.js`). There is no second implementation.
- **There is no secondary or ghost button variant.** When an action is not primary, it is a text link with an animated underline, not a weaker button.

### Ruled Cells

The system has no filled card. A group of peer items — the six services on
`/clients` — is set as ruled cells, which is the same hairline language the
recruitment timeline and the process schedule use.

- **Rule:** each cell carries a `white/15` hairline on its top edge only, and no
  border on the other three. Nothing is rounded, because nothing is a box.
- **Grid:** column gap only (`gap-x-8`), never a row gap. A row gap detaches each
  cell's rule from the cell above and the grid falls apart into stacked cards.
  Vertical air is the cells' own padding (`pt-7 pb-8`) instead.
- **Anatomy:** sky-blue tabular numeral → Agatho title → the item's motif → Inter
  body at white/70.
- **Hover:** a sky rule scales in from the left over the hairline, overhanging the
  cell by 16px on each side from `sm` up so it reads as part of the grid's ruling
  rather than as the edge of a panel. Nothing fills, nothing lifts. The numeral
  turns sky at the same time.
- **Ground, not fill:** the section sits on a wide `purple/32` radial bloom rather
  than giving each cell a surface. Six line drawings on flat navy read as a
  spreadsheet; the answer is to light the ground under them, not to put each one
  in a box.

A filled panel was tried first — `rounded-xl` with a `bg-white/[0.055]` veil,
lifting to `bg-white/[0.09]` on hover — on the reasoning that a transparent panel
on a dark gradient sits on the same plane as the page. It separated correctly and
still read as generic: a veil is the most anonymous way to make a panel, and it
was a third vocabulary on a site that already had two. If a filled surface is ever
genuinely needed, the veil must be white-alpha and not navy — navy separates near
the top of the page gradient but drops to 1.02:1 against it lower down, where most
content lives. Over the live 3D scene the fill would be `bg-white/[0.03]` with
`backdrop-blur-sm` (see The Two-Ground Rule).

### Navigation

- **Bar:** transparent, `h-24`, sitting above the hero scene rather than over an opaque strip, so the moving scene shows through. Fades and drops in 16px on mount.
- **Items:** Inter at `text-sm` / `lg:text-base`, white/80, brightening to white on hover. A 1px sky-blue underline scales in from the left on hover and stays drawn on the active route — the active state and the hover state are the same treatment, which is intentional.
- **CTA:** the magenta outline button, pushed right with `ml-auto`.
- **Mobile:** below `sm`, a hamburger opens a full-screen overlay; items fade up in a 60ms stagger. The overlay's background is currently a stock blue and is a known violation of The No Stock Blue Rule.

### Inputs / Fields

Currently unstyled browser defaults with a white label above and a blue focus
ring — the least-developed part of the system and explicitly **not** a pattern to
copy. When the contact form is rebuilt: transparent fill, 1px white/20 underside
or full border, `rounded-sm`, white text, white/40 placeholder, and a focus state
that shifts the border to Instrument Sky. No white input boxes on the dark field.

### Framed Figure

The signature content component. A photograph at `rounded-2xl` with
`ring-1 ring-white/10`, behind it a brand-gradient bloom (`-inset-3`, `blur-2xl`)
that breathes between 55% and 80% opacity on a 6-second loop, and a 1.02 scale on
hover. Under `prefers-reduced-motion` the bloom holds at a fixed 70% and the hover
scale is dropped. This is how every *feature* photograph in the system is
presented — one image carrying a section. Roster headshots are the one
documented exception; see Roster Grid.

### Roster Grid

How the team page presents thirty-seven people without ranking them. Every member
gets an identical cell — same frame, same three lines of type — because this is a
student club, not a masthead, and cell size is the crudest available way to say
who matters.

- **Frame:** `aspect-[4/5]`, `rounded-sm`, `ring-1 ring-white/10` over `bg-navy`. On hover the ring warms to `sky/50` and the photograph scales 1.04 *inside* the fixed frame; focus anywhere in the cell draws a 2px sky ring.
- **Anatomy:** Agatho name (`text-lg` → `sm:text-xl`) → uppercase Inter 600 role at `0.7rem`/`0.14em` in white/70 → major and abbreviated year in white/50. A LinkedIn glyph sits inline after the name and the whole cell is that link, via a `::before` overlay so the accessibility tree still sees one link per person. An optional Email link sits below at `z-10`.
- **Grid:** `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5`, `gap-x-6 gap-y-10`. Past `lg` the container's `max-w-6xl` fixes every cell at exactly 205px.
- **Band heading:** Agatho `text-3xl` → `sm:text-4xl`, a `flex-1` white/15 hairline, then a zero-padded count in white/40 — heading, rule, and count on one baseline.

**The Equal Cell Rule.** Within a roster, every person is the same size. Roles and
teams are information and stay on the card; they never become a size, a column
span, or a position of honour. A ranked variant of this grid is not a variant, it
is a different component and it does not belong to this club.

**Why the band heading breaks the Eyebrow Rule.** The page opener still follows it
(`37 MEMBERS` → *Meet Our Team* → body). The per-team bands underneath are
subordinate groupings, not major sections, and three stacked eyebrows announcing
"Executives / Advisory Board / Consultants" would label a label. The hairline and
the count carry that job instead.

**Why there is no divider between teams.** Each band already opens with a rule.
`SectionDivider` above one would stack two hairlines with nothing between them.
Separation between teams is carried entirely by the section's top margin
(`mt-20 sm:mt-28`). This is the only place in the system where consecutive
sections are not divided by the component.

**Why headshots get no bloom.** The Framed Figure's gradient bloom is for a
photograph that *is* the section. Thirty-seven blooms on one page is a light show,
for the same reason six perpetually animating motifs would be noise. A hairline
ring is the whole treatment.

**Missing headshots draw initials, never a silhouette.** A member with no photo on
file renders their initials in Agatho at white/30 over a `from-purple/25 to-navy`
wash. The shared grey stock silhouette reads as a broken image against this
palette; a deliberate blank does not.

**Stagger is 0.035s here, not the system's 0.08–0.12s.** That range is tuned for
three or four children. Applied to nineteen consultants it runs for two seconds
and the last row arrives long after the reader does. Scale the interval to the
count; keep the total sweep under a second.

#### Headshot Pipeline

Source headshots are camera originals — 37 files, ~55 MB, up to 7 MB each, for a
cell 205px wide. They live in `Headshots/` as the source of truth and **nothing in
the app imports them.**

`scripts/optimize-headshots.mjs` (sharp, a devDependency) derives 320px and 640px
WebP plus a 640px JPEG fallback into `HeadshotsOptimized/`, committed so a clean
checkout builds without sharp and Vercel never pays the conversion cost. It also
emits a 20px inline WebP per person, used as a blur-up placeholder so a cell shows
something rather than a hole.

`people.js` therefore stores a `slug`, not an import; `headshots.js` resolves it
through `import.meta.glob`. Adding a member is one line plus a re-run of the
script — skip the re-run and that member falls back to initials.

`sizes` is measured against the real grid, never estimated. An over-generous hint
silently pulls the 2x file onto 1x displays, which is how 469 KB becomes 1.1 MB.

### Service Motifs

Six small diagrams, one system — the visual material the services never had.
Each is the service's *verb* drawn rather than a picture of its noun: reading the
landscape, climbing it, finding the line through the noise, propagating,
positioning, getting through. That is what keeps them from reading as an icon
set, and it is the rule to follow if a seventh is ever added.

The family holds because every motif shares: a `160x120` box; the same hairline
grid behind it at `white/[0.06]`, the same value the schedule's gridlines use;
1px non-scaling strokes at `white/25`; and **exactly one** sky-blue actor that
carries the interaction. Geometry comes from the same `simplex-noise` field that
raises the hero terrain, seeded deterministically so the drawings stay themselves
between loads — the ridges are literally the landscape's mathematics, not a
hand-drawn imitation of it.

Two beats of motion and no more: strokes draw themselves in on first scroll into
view, then the actor answers hover on the parent card — the probe descends, the
marker climbs, the fitted line thickens, the mark radiates, the position shifts,
the triangle passes through the aperture. There is no idle animation; six
perpetually moving diagrams on one screen would be noise, and the page already
carries a 3D hero.

**The Verb Rule.** A motif animates the thing the service *does*. If a new one
would only sit there looking like its subject, it is an icon, and icons are not
this system.

### Section Divider

The only rule allowed between sections. A 1px line, `w-11/12` capped at
`max-w-3xl`, centred, its gradient running transparent → white/20 → transparent
so it has no hard ends. On first entering the viewport it scales in from the
centre (0.9s on the project curve, once only); under `prefers-reduced-motion` it
is simply present. Callers pass spacing and nothing else. Never introduce a
second divider treatment — a solid rule, a full-bleed rule, or a shorter
centred rule are all previous versions of this component, not alternatives to it.

### Section Opener

Eyebrow (sky, uppercase, `0.2em`) → Agatho headline → Inter body at white/70,
revealed as a 12%-staggered fade-up group triggered once at 30% visibility. The
most-reused pattern in the codebase and the fastest way to make a new page look
like it belongs.

### Motion

One easing curve governs the entire system: `cubic-bezier(0.16, 1, 0.3, 1)` — a
fast start settling into a long tail. Durations run 0.2s for state changes, 0.5s
for small reveals, 0.7s for section reveals. Groups stagger children 0.08–0.12s.
Scroll reveals fire once, never repeating. Every animation defers to
`prefers-reduced-motion`, and heavy 3D work is additionally feature-detected, lazy
loaded behind `Suspense`, DPR-capped, and quality-tiered by viewport.

**The system's gesture is a wipe.** Things arrive by being drawn or swept from an
edge, not by fading, lifting, or growing: the nav underline scales in from the
left, the service cell rules in from the left, the recruitment spine fills from
the top, the buttons sweep a veil across their own face. A cross-fade is what this
system does when it has nothing to say about direction.

**Page transitions are a short fade and nothing else**
(`transition/PageTransition.jsx`): 0.16s out, an instant scroll reset and route
swap while nothing is on screen, 0.28s back in. A sliding curtain was built and
rejected — a route change is not an event that deserves choreography, and the
gesture language above belongs to elements, not to whole pages.

The thing that fades is a full-bleed veil in the body's own gradient, not the
content — identical on screen, and it means a page that needs time before it can
be shown just holds the veil up (`useSceneGate`, in `transition/sceneGate.js`)
rather than running its own splash afterwards. The landing page's 3D scene is the
only caller.
The spinner inside it only appears after 450ms, so a fast machine never sees one.

## Do's and Don'ts

### Do:

- **Do** open every section with the eyebrow → Agatho headline → white/70 body sequence.
- **Do** express secondary text as white at reduced opacity (70/50/30), never as a gray.
- **Do** keep primary buttons at 2px radius, uppercase, and let hover sweep a veil across the face rather than lift the button.
- **Do** use `cubic-bezier(0.16, 1, 0.3, 1)` for every transition and reveal, and guard every one of them with `prefers-reduced-motion`.
- **Do** present photographs in the framed-figure pattern — 16px radius, white/10 ring, gradient bloom behind.
- **Do** design against the project's real breakpoints (576 / 960 / 1440), mobile-first.
- **Do** reserve bottom clearance for the absolutely-positioned footer on any new page.
- **Do** separate sections with the `SectionDivider` component, varying only its margin — unless the sections already open with their own rule, as the roster bands do.
- **Do** give every person in a roster the same cell, and let role and team live as text on the card rather than as size or position.
- **Do** re-run `scripts/optimize-headshots.mjs` after adding or replacing a headshot, and commit what it writes.

### Don't:

- **Don't** use Tailwind's stock `blue-*`, `gray-*`, or `slate-*` classes. Every color comes from a brand token or a white alpha.
- **Don't** put more than one magenta element on a screen, or use magenta for anything that isn't the primary action.
- **Don't** apply `backdrop-blur` to a panel that sits on the flat page gradient — glass is only for surfaces over the live 3D scene.
- **Don't** answer a hover with a lift and a colored glow. That is the one move this system never makes; hover is a wipe, a rule, or a tonal shift.
- **Don't** build white cards with saturated color header blocks (the legacy `ServiceCard` pattern). Panels are dark, bounded by hairlines.
- **Don't** set headings in EB Garamond, or set running text in Agatho.
- **Don't** hand-roll a divider with `<hr>`, a solid fill, or a stock `gray-*` background; there is one divider component.
- **Don't** wrap decorative icons in colored circles to create hierarchy — structure and type do that job.
- **Don't** design a layout that structurally needs statistics, a client logo wall, or case studies; the club has one testimonial and no metrics (see PRODUCT.md).
- **Don't** redraw the logo mark with a different number of triangles, unequal sizes, or a pivot other than the shared right-hand tip.
- **Don't** import a file from `Headshots/` anywhere in the app; the originals are archive, and importing one ships several megabytes for a 205px cell.
- **Don't** hide a person's name or role behind a hover overlay. Hover does not exist on touch, and the previous team page was thirty-seven unlabelled faces on a phone because of it.
