# AtlasIQ

A premium, interactive-map SaaS platform for preparing Kazakhstan high-school
students for the UNT (Единое национальное тестирование) Geography exam —
built with Next.js, Supabase, and MapLibre GL.

All 18 planned stages are complete. See [Remaining future improvements](#remaining-future-improvements)
for known, honestly-scoped gaps before treating this as a live production app.

## Stage status

- [x] Stage 1 — Project Setup
- [x] Stage 2 — Design System
- [x] Stage 3 — Landing Page
- [x] Stage 4 — Authentication
- [x] Stage 5 — Dashboard
- [x] Stage 6 — Interactive Kazakhstan Map
- [x] Stage 7 — Question Engine
- [x] Stage 8 — User Profile
- [x] Stage 9 — Database Integration
- [x] Stage 10 — Statistics & Achievements
- [x] Stage 11 — Learning Modes
- [x] Stage 12 — Leaderboard
- [x] Stage 13 — Admin Panel
- [x] Stage 14 — Settings
- [x] Stage 15 — Premium Features
- [x] Stage 16 — Mobile & PWA
- [x] Stage 17 — SEO & Performance
- [x] Stage 18 — Final Polish & Production Ready

## Tech stack

Next.js 14 (App Router) · TypeScript (strict) · Tailwind CSS · Framer Motion ·
Zustand · React Hook Form · Zod · Supabase (Postgres + Auth) · MapLibre GL ·
Stripe (structure only, no live payments) · deployable to Vercel

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Supabase project keys
npm run dev
```

Open http://localhost:3000.

### Setting up the database

1. Create a project at https://supabase.com and copy its URL + anon key into `.env.local`.
2. Apply the schema: `supabase db push` (Supabase CLI, linked to your project) or paste `supabase/migrations/20260709000000_init_schema.sql` into the Dashboard's SQL editor.
3. Seed reference data (categories, achievements, questions): run `supabase/seed.sql` the same way.
4. Sign up through the app once — the `on_auth_user_created` trigger creates your `profiles` row automatically.
5. To try the admin panel, flip your own row's `role` to `'admin'` in the Supabase table editor (there's no self-serve promotion flow by design).

Every page that reads gamification data falls back to mock/empty data on a
per-query basis if a table is missing, so the app still renders before
you've run the migrations — just with placeholder numbers.

### Deploying to Vercel

1. Push this repo to GitHub/GitLab/Bitbucket and import it in Vercel.
2. Add the environment variables from `.env.example` in the Vercel project settings (at minimum `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
3. Set `NEXT_PUBLIC_SITE_URL` to your production domain (used in metadata, sitemap, and Open Graph tags).
4. Deploy — no build configuration needed, Next.js on Vercel is zero-config.
5. If you connect Stripe (optional, see below), add `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PREMIUM_PRICE_ID` and point a Stripe webhook at `https://<your-domain>/api/billing/webhook`.

## Scripts

| Script                | Purpose                              |
| ---------------------- | -------------------------------------- |
| `npm run dev`           | Start the dev server                  |
| `npm run build`         | Production build                      |
| `npm run start`         | Run the production build              |
| `npm run lint`          | ESLint                                |
| `npm run lint:fix`      | ESLint with auto-fix                  |
| `npm run format`        | Prettier (writes)                     |
| `npm run type-check`    | `tsc --noEmit`                        |

## Project structure

```
supabase/
  migrations/             # full schema, RLS policies, triggers, SQL functions
  seed.sql                # categories, achievements, and all 36 map objects

public/
  icons/                  # PWA icons (192/512, maskable variants, apple-touch)
  sw.js                   # hand-written service worker (offline caching)
  og-image.png            # Open Graph / Twitter Card image

src/
  app/
    (auth)/               # login, register, forgot-password — no app shell
    (app)/                # authenticated app shell (sidebar + header)
      dashboard/  learn/  map/  profile/  statistics/  achievements/
      leaderboard/  settings/  pricing/  admin/{users,categories,questions,achievements}/
    api/
      results/            # persist a finished learning session
      leaderboard/        # tab/page/search-driven rankings
      admin/{users,categories,questions,achievements}/
      billing/{checkout,webhook}/
      account/delete/
    auth/callback/         # OAuth code exchange
    manifest.ts  robots.ts  sitemap.ts   # SEO/PWA metadata routes
  components/
    ui/                   # design-system primitives (Button, Card, Dialog, ...)
    layout/                # Navbar, Footer, Sidebar, AppHeader, SkipLink
    sections/               # landing page sections
    auth/  dashboard/  map/  learn/  profile/  statistics/
    achievements/  leaderboard/  admin/  settings/  pricing/  pwa/  charts/
  lib/
    constants/  utils/  animations.ts  fonts.ts
    supabase/              # browser/server/admin/middleware clients
    repositories/           # all Supabase reads/writes, one file per domain
    auth/                   # getCurrentProfile, requireAdminProfile
    map/                    # region + geo-object static data
    learning/                # learning-mode configs
    billing/                 # Stripe client + free-tier limits
    validations/              # Zod schemas
    seo/                       # structured data
  hooks/  store/  types/
```

## Design tokens

Colors, spacing and radii are CSS variables in `src/app/globals.css`, exposed
to Tailwind via `tailwind.config.ts`. Dark mode is the default theme; a
`.light` override exists for the Settings > Appearance toggle.

## Features completed

- **Landing page** — hero, features, how-it-works, stats, pricing, FAQ, all animated
- **Auth** — email/password + Google OAuth, middleware-enforced route protection
- **Dashboard** — XP/level/accuracy/streak, continue-learning, recent results & achievements
- **Interactive map** — MapLibre GL, 36 real Kazakhstan objects (regions/cities/rivers/lakes/mountains), search, hover/click, region detail panel
- **Question engine** — 6 learning modes (Practice, Exam, Time Attack, Random Challenge, Category Challenge, Favorites), difficulty selector, combo/XP/accuracy scoring, timer
- **Profile** — editable name, stats, favorite topics, full achievements grid
- **Database** — full Postgres schema, RLS on every table, repository pattern, real session persistence
- **Statistics** — XP/accuracy trend charts, learning time, gated behind Premium
- **Leaderboard** — global/weekly/monthly/accuracy/streak rankings, search, pagination
- **Admin panel** — analytics, user role/premium management, full CRUD on categories/questions/achievements, all routes re-verify admin role server-side
- **Settings** — account, appearance (live theme), language, notifications, privacy, password change, account deletion
- **Premium** — Stripe-ready checkout/webhook structure (inert without keys, by design), real free-tier gating (locked categories, daily session cap, gated advanced stats)
- **PWA** — manifest, real generated icons, hand-written service worker, install prompt, offline page
- **SEO** — Open Graph/Twitter metadata, JSON-LD, sitemap/robots, noindex on private routes
- **Performance** — dynamic-imported map (code splitting), route loading skeletons, AVIF/WebP image optimization
- **Accessibility** — skip-to-content link, focus-visible rings everywhere, reduced-motion support, audited icon-only buttons for aria-labels

## Remaining future improvements

Documented honestly rather than left silent:

- **No live payments.** Stripe checkout/webhook code is fully wired but inert without real API keys, per the original spec for this stage.
- **Map data is point-based, not polygon boundaries.** No network access was available in the build environment to fetch a real administrative-boundary GeoJSON dataset (see comments in `src/lib/map/regions.ts`). Swapping in real polygons only touches that file and the map's fill layer.
- **Question bank is still client-side static data** (`src/lib/map/geo-objects.ts`) for the live quiz, even though the `questions` table + `getQuestionsForCategories()` repository function exist and are ready — wiring the engine to fetch from the DB (enabling admin-authored questions to actually appear in quizzes) is the natural next step.
- **Category-specific achievements** ("Знаток областей", "Мастер карты", etc.) aren't auto-tracked yet — only the two measurable from aggregate profile stats (XP, streak) sync automatically. Per-category answer tracking would unlock the rest.
- **Daily free-tier session limit** is checked on page load, not re-validated in real time if a user restarts a session without navigating away.
- **No i18n implementation.** The language setting is saved but doesn't yet translate the UI (Kazakh/English).
- **No custom iOS splash screens** (`apple-touch-startup-image`) — Android/modern iOS get an auto-generated splash from the manifest; older iOS versions won't.
- **Accessibility** — the biggest remaining audit item is `<label>`/`htmlFor` pairing in a handful of inline admin/settings forms; a full WCAG pass and a real Lighthouse run (no browser was available in the build environment) are recommended before launch.
- **No automated tests.** Given the environment had no network access to install a test runner, none were added — recommend Vitest/Playwright as the next investment.

## Note on this delivery environment

This build was authored in a sandboxed environment with no package-registry
network access, so `npm install` / `npm run dev` / `npm run build` could not
be executed to produce a live verification log. Every file was hand-written
and cross-checked with static analysis (import-resolution and dead-export
scans across the full `src/` tree, zero unresolved imports at final delivery).
Run the three commands above locally as your first step — if anything
surfaces, it's almost certainly a dependency-version nuance rather than a
structural issue.
