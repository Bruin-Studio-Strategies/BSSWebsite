# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two distinct audiences of roughly equal weight, each with its own funnel. Neither
outranks the other: pages are designed for whichever audience owns that route,
with no shared hierarchy forced across them.

- **UCLA students** deciding whether to apply to BSS. They arrive during or just
  before a recruitment cycle, usually from an Instagram post, a flyer, or a friend
  in the club. Most have no consulting experience and are trying to work out
  whether they are the kind of person this club takes. Their job: understand what
  membership actually involves, find the dates, and apply.
- **Entertainment-industry clients** — studios, production companies, agencies,
  and adjacent creative/business ventures — evaluating a student consulting group
  for a project. They are assessing credibility and fit before an email. Their
  job: understand what BSS can deliver, what the engagement looks like, and how to
  start one.

Routes by audience: `/recruitment` and `/team` serve students; `/clients` serves
clients; `/contact` and `/` serve both.

## Product Purpose

The public marketing and recruiting site for **Bruin Studio Strategies (BSS)**,
UCLA's student-run entertainment-industry consulting club. It is the club's whole
public face: the only place a student can learn how to join and the only place a
prospective client can evaluate the group. Success is two conversions — a
submitted student application during the recruitment window, and an inbound client
email — from an audience that in both cases has usually never heard of the club
before.

## Positioning

UCLA's first and premier entertainment consulting group. The mechanism a
neighboring club could not truthfully copy: consulting fundamentals applied
specifically to entertainment-industry problems, delivered by students who are
themselves the Gen-Z audience the industry is trying to reach and understand. The
insight is native, not researched.

## Operating Context

- **Client engagements** run on an ~8-week timeframe, staffed as 2 project
  managers + 4–5 consultants per project, ending in delivered recommendations and
  a presentation.
- **Services offered:** market research, growth strategy, data analytics, brand
  strategy, competitive analysis, market entry.
- **Recruitment** runs as a seasonal cycle, not rolling. The sequence is:
  applications open → information session → applications due → coffee chats
  (invite only) → final interviews (invite only). Events carry a location and an
  attire expectation (casual → business casual → business formal). New members'
  first quarter is training — resume workshops, case study training, professional
  development — before project work.
- **Membership structure:** Executives, Advisory Board, Consultants. (A Product
  Managers group exists in the data but is currently not rendered.)
- Inbound contact is email plus an EmailJS-backed form; there is no CRM, applicant
  tracking system, or login. Applications are collected via an external Google
  Form linked from the site.

## Capabilities and Constraints

- Static marketing site. No auth, no accounts, no backend beyond EmailJS for the
  contact form. All content is hardcoded in source — no CMS — so every copy or
  roster change is a code change and a deploy.
- Hosted on **Vercel**, auto-deploying `main` to production on every push. There is
  no staging environment; branch preview deploys are the only review surface.
- Team roster lives in `bss-web/src/pages/TeamPage/people.js` with headshots in
  `bss-web/src/pages/TeamPage/Headshots/`. Headshot quality and aspect ratio are
  inconsistent (member-supplied), and a `Placeholder.jpg` stands in for missing
  ones — any team layout must survive both.
- **Undecided:** Fall 2026 recruitment dates are not set. The current timeline
  copy ("Fall 2025", 9/30 through 10/18) is last cycle's and is stale. The
  recruitment timeline must be built data-driven with clearly swappable date
  values, and the page must read correctly while dates are still TBD.
- **Undecided:** whether a Committees/Projects page ever ships.

## Brand Commitments

- **Name:** Bruin Studio Strategies, abbreviated BSS.
- **Brand kit** (club-supplied, binding):
  - **Colors:** navy `#0F172E`, purple `#523794`, blue `#5288C7`, magenta
    `#B73593`. Wired as Tailwind tokens `navy`, `purple`, `sky`, `magenta`.
  - **Display typeface:** **Agatho** (purchased serif; Light / Regular / Medium /
    Bold). Self-hosted as `.otf` in `bss-web/public/fonts/`, exposed as the
    Tailwind `font-display` key. Body copy is Inter (`font-sans`); EB Garamond
    (`font-serif`) is pre-existing legacy usage.
  - **Logo mark:** a "play button" triangle made of **three congruent equilateral
    triangles rotated a few degrees relative to each other about the right-hand
    tip vertex** — the tip stays tight while the two left corners fan apart. Not
    four shapes, not different sizes, not freely offset. Approved treatments:
    mono outline, and a sky→magenta gradient stroke with an outer glow.
  - **Wordmark lockups:** stacked "BRUIN STUDIO / STRATEGIES" in Agatho, approved
    on black with glow, on white plain, and on a navy→purple gradient with glow.
- **Voice:** plain, competent, student-run without being casual about the work.
  Never overclaims scale or track record.
- **Redesign intent (binding):** the site is being modernized. The 2024 original —
  flat wave PNG, generic EB Garamond, single purple swatch — is evidence and
  anti-reference, not a base to polish. The landing page has already been
  redesigned on branch `redesign-hero` (3D scroll-driven sunset/terrain hero,
  brand fonts and full palette wired in); the remaining pages are being brought up
  to it.
- **`Stack & Features.pdf`** (the club's original 2024 design brief: McKinsey
  serif-modern, wireframe/network graphics, digital-mountain parallax, animated
  stat counters, shuffle.js client wall) is **reference only, explicitly not
  binding** — confirmed by the person running this project. It records what the
  old site was aiming at.

## Evidence on Hand

Real and cleared for use:

- **Paramount Pictures testimonial** — Jonathon Kane, Manager, Business
  Development, on the Paramount x BSS Spring 2025 Case Competition. Quote and
  transparent Paramount logo (`bss-web/src/assets/paramount.png`) are in use on
  the landing page and cleared for the Clients page as well.
- **Group photo** (`bss-web/src/assets/IMG_9814.JPG`), **board/working photo**
  (`bss-web/src/assets/board.jpg`), and member headshots.
- **Real roster** with names, roles, and headshots.
- **Real contact addresses:** `bruinstudiostrategies@gmail.com` plus named
  officer emails (Co-Presidents, VP of External Affairs, VPs of Internal
  Relations).
- **Real engagement structure:** the 8-week timeframe, the 2 PM + 4–5 consultant
  staffing, the six named service lines, the five-stage recruitment sequence.

**Absences that must not be fabricated.** Paramount is the *only* external proof
the club has. There is **no** client logo wall, **no** second testimonial, **no**
case studies, and **no** verified statistics of any kind — no member count, no
projects-completed figure, no years-active number, no placement or outcome data.
Do not design a surface that structurally requires them (animated stat counters, a
logos strip, a case-study grid), and do not invent placeholder numbers "to be
replaced later." The original brief's own note on its stat-counter idea — "not
sure how good it will be since we don't have a rep rn" — still holds.

## Product Principles

1. **Two funnels, one house.** A student and a studio executive want opposite
   things. Each page commits to its own audience rather than splitting the
   difference; only the shell — nav, footer, brand system — is shared.
2. **Earn credibility through specificity, not scale.** With one testimonial and
   no metrics, concrete process detail (8 weeks, this team shape, these five
   stages, this attire) is the proof. Vague superlatives read as a student club
   overreaching; precise mechanics read as competence.
3. **Never fabricate proof.** No invented clients, counts, outcomes, or quotes.
   When evidence is missing, change the design, not the truth.
4. **The application window is the clock.** Recruitment content is dated and
   perishable. It must be trivially updatable, obviously current, and correct both
   when dates are known and when they are still TBD.
5. **Modern, not trendy.** The redesign has to still look right in two years, run
   by whoever inherits it — brand system over one-off effects, and every effect
   degrades cleanly.

## Accessibility & Inclusion

No formal standard was established by the club. Product-specific needs that do
apply: the site is read on phones during club fairs and between classes, so mobile
is a primary reading context, not an afterthought; and the landing page's 3D scene
already sets the expectation that heavy motion is feature-detected, capped, and
honors `prefers-reduced-motion` — that guardrail extends to any new motion work.
