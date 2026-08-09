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

Not yet touched in this pass: navbar styling, the "What is BSS?"/testimonial section,
Team/Clients/Recruitment/Contact pages, any copy.
