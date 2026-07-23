# DermaGlow AI 2.0

A calm, premium skincare analysis app. Users share their skin profile (and optionally a selfie), and Gemini returns hydration and oiliness scores, morning and evening routines, region-aware product recommendations, and lifestyle tips. No account required.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (CSS-first tokens) with a custom "porcelain and botanicals" theme
- Framer Motion for score reveals and staggered cards
- MongoDB via Mongoose (persists analyses so results have shareable links)
- Google Gemini (`@google/generative-ai`), server-side only
- next-themes for considered light and dark modes
- Hand-rolled PWA (manifest + service worker), installable and offline-aware

## Getting started

1. Copy the env template and fill it in:

   ```bash
   cp .env.example .env
   ```

   | Variable | Required | Notes |
   | --- | --- | --- |
   | `GEMINI_API_KEY` | yes | Server-side only, never exposed to the client. |
   | `GEMINI_MODEL` | no | Defaults to `gemini-3.5-flash-lite`. Change here, no code edit. |
   | `MONGODB_URI` | yes | Local Mongo or Atlas. |
   | `MONGODB_DB` | no | Defaults to `dermaglow`. |
   | `NEXT_PUBLIC_APP_URL` | no | Base URL for shareable links. |

2. Install and run:

   ```bash
   npm install
   npm run dev
   ```

3. Build for production:

   ```bash
   npm run build && npm start
   ```

## Architecture

Feature-first layout under `src/`:

```
src/
  app/                      routes only (thin)
    page.tsx                landing
    analyze/page.tsx        intake form (client)
    results/[id]/page.tsx   shareable result (server, reads DB)
    api/analyze/route.ts    the "gate" layer
  features/analysis/
    domain/                 options (config-driven) + zod schemas/types
    services/               gemini, prompt, analysis-service, typed errors
    data/                   mongoose model + repository
    components/             result view, score ring, share button
  components/               design-system UI, header/footer, theme, motion
  lib/                      env, db, image compression, ids, utils
```

Data flow: **form -> `POST /api/analyze` -> `analysis-service` (validate -> Gemini -> persist) -> `{ shareId }` -> `/results/[shareId]`**.

Key decisions:

- The uploaded photo is compressed and resized **in the browser** before upload, and is **never stored**. Only the analysis and profile text are persisted.
- The Gemini key is guarded by `server-only`; importing config/db/services on the client is a build error.
- On a malformed model response the service retries once, then returns a typed error. It never fabricates results, so the UI shows a real retry state.
- All options (skin types, concerns, genders, countries, limits) live in `domain/options.ts`. Change them in one place.

## Designed for the future SaaS path (not built yet)

Credits, payments (Razorpay), and accounts are intentionally **not** implemented, but the code is shaped so adding them later is an addition, not a rewrite:

- `analysis-service.ts` is a pure application service (validate -> analyze -> persist) with no knowledge of auth. It already accepts an optional `userId`.
- `app/api/analyze/route.ts` is the single **gate** layer. Session checks and credit decrements slot in here, before calling `createAnalysis(input, { userId })`. Nothing in the service or Gemini code changes.
- The Mongoose model already carries a nullable `userId` field, so analyses can be tied to accounts without a migration.

## Notes

- DermaGlow is informational only and not a substitute for a qualified dermatologist. Product notes are AI estimates, not verified reviews.
- Text is written with plain hyphens only, in both UI copy and the Gemini prompt output.
