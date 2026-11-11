# blocksy.

**Make online safety click.** Blocksy is a playful cybersecurity-education web app. Each security action, from spotting a phishing text to turning on MFA, earns colorful interlocking toy bricks. You then snap them together into your own 3D structure in **My Blocksy Build**.

> Portfolio project. Everything runs in the browser in **demo mode**: there's no backend, no real accounts, and passwords are never stored or sent anywhere.

## Features

| Area | What it does |
| --- | --- |
| **Landing page** | Two-column hero with a real-time **3D brick shield** (React Three Fiber): bricks float, snap into place and react to hover/click. Also: six feature cards, How It Works, a live dashboard preview, Why Blocksy, an example-build gallery, the CTA and the footer. |
| **Password Check** | Live strength analysis: length, character variety, common passwords, sequences, keyboard walks, years, predictable shapes, and a rough crack-time estimate. Includes a crypto-random passphrase generator. 100% client-side. |
| **Phishing Practice** | 8 fictional scenarios (email, SMS, social DM, login page). Decide safe or suspicious, then see the clues and the takeaway. |
| **MFA Builder** | Explains the factors, compares methods (passkeys → SMS) and walks through a 6-step self-reported checklist. |
| **Privacy Check** | 6-item self-paced privacy checklist with time estimates. |
| **Breach Awareness** | Explains breaches, offers a clearly labeled **demo** checker that uses fictional identities only, and a response plan. |
| **Habit Tracker** | Daily habits, streaks, a weekly brick chart, milestones, a personal security checklist and an activity log. |
| **My Blocksy Build** | 12×12 stud baseplate in 3D: pick from inventory, rotate, snap with gravity stacking, remove (top bricks only), reset, orbit/zoom, plus keyboard controls and a top-down 2D mode. Saves locally. |
| **Rewards & achievements** | Brick-drop celebration toasts, 9 brick-badge achievements and an achievements gallery. |
| **Dashboard** | Overview with stats, learning progress, build preview, inventory, quick actions and recent activity. |
| **Auth screens** | Log in / sign up with validation, a password visibility toggle, confirm-password and clear errors, all running in demo mode. |

### Brick color meanings

Blue = passwords · Green = MFA · Yellow = phishing · Purple = privacy · Red = alerts/breaches · Orange = habits & education · Teal = starter foundation.

## Tech

Next.js 16 (App Router, Turbopack, Cache Components) · React 19 · TypeScript · Tailwind CSS v4 · Motion · Three.js + React Three Fiber + drei · Lucide React · Fredoka + Nunito via `next/font` (self-hosted at build time).

## Getting started

Requires Node.js 20.9+.

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build && npm start   # production
npm run lint
```

Optional environment variables:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Absolute URL used for metadata (e.g. your Vercel URL). |
| `NEXT_PUBLIC_GITHUB_URL` | Shows a GitHub link in the footer. Without it, the footer says "link coming soon". |

Deploys to Vercel as-is (every route is static).

## What's real and what's demo-only

| | Status |
| --- | --- |
| Password analysis, passphrase generator | **Real**, runs locally. It's an educational estimate and does **not** check breach corpora. |
| Phishing practice | **Real** interactive lessons using **fictional** brands, numbers and reserved domains. None of the links go anywhere. |
| MFA / privacy / breach checklists | **Self-reported.** Blocksy can't see your accounts and never claims they're protected. |
| Breach checker | **Demonstration only.** It uses fictional identities and makes no lookups. Real checks (e.g. via Have I Been Pwned, following its API terms) are marked *coming soon*. |
| Log in / sign up | **Demo mode.** No account is created. The email and display name stay in `localStorage`, and the password is discarded right after validation. |
| Progress, bricks, build, achievements | Stored in this browser's `localStorage` (`blocksy-demo-v1`). You can export or delete them in Settings. |
| "Learning progress" | Measures lessons and checklist items completed in Blocksy. It is **not** a security score for your real accounts. |
| Contact form | Coming soon. |

## Project structure

```
src/
  app/                    routes: landing, login, signup, privacy, security, contact, /app/*
  components/
    brand/Logo.tsx        wordmark + brick mark
    bricks/IsoBuild.tsx   isometric SVG brick renderer (badges, cards, previews, fallback)
    three/                brick geometry, studio lighting, hero scene (BrickScene)
    builder/              BrickBuilder (UI, rules, 2D mode) + BuilderCanvas (3D)
    activities/           PasswordChecker, PhishingQuiz, Checklist (MFA/Privacy/Breach)
    dashboard/            AppShell, DashboardSidebar, OverviewView, ProgressTracker,
                          AchievementBadge, BrickInventory, PageHeader
    landing/              Navbar, HeroSection, FeatureCard, DashboardPreview, Sections
    rewards/              CelebrationLayer (brick + achievement toasts)
  lib/
    bricks.ts             colors, sizes, proportions
    state.ts / store.ts   demo state, placement rules, localStorage store, actions
    password.ts           local password analyzer
    phishing.ts, content.ts, achievements.ts, sample.ts
```

## 3D, performance and accessibility notes

- **Real 3D bricks.** Each footprint (1×1, 1×2, 2×2, 2×4) is a rounded body plus beveled lathe studs, merged into one cached `BufferGeometry`. Materials are glossy `MeshPhysicalMaterial` with clearcoat, cached per color. The baseplate's 144 studs are a single `InstancedMesh`.
- Lighting comes from in-scene light formers, so no HDR download is needed. Soft shadows and contact shadows are on, and neutral tone mapping keeps the pastels true.
- DPR is capped at 1.75. The hero canvas pauses when offscreen (`IntersectionObserver` → `frameloop="never"`) and goes static under reduced motion.
- **Fallbacks.** Without WebGL, the hero shows an isometric SVG of the same shield, and the builder switches to the top-down 2D grid with the same rules. The SVG also doubles as the loading placeholder.
- Reduced motion follows the OS setting and can be overridden in Settings. Navigation is semantic, with skip links and visible focus rings. Checklists and the quiz work by keyboard. The builder supports arrow keys, `R` to rotate, `Enter` to place and `Delete` to remove.

## Credits

All brick designs, the logo and illustrations are original. The project isn't affiliated with or endorsed by any toy company, and every brand in the phishing and breach examples is fictional.
