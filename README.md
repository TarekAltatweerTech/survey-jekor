# Jekor product survey (React)

The public page opened from the survey QR code: vote for one favourite product, rate every
product (1–5 stars + optional opinion), then — if they want — a name and phone number (both
optional; an anonymous answer shows as "مشارك #<number>" in the admin). Arabic only, RTL,
mobile first.

It is a **standalone site** (React 19 + Vite) deployed on **Vercel**. Laravel only provides the
API; nothing here is served by Laravel and nothing in Laravel depends on these files.

```
Vercel  ──  https://<your-project>.vercel.app        ← this folder, built into dist/
                 │  fetch (CORS, config/cors.php allows api/*)
Laravel ──  GET  https://<API domain>/api/v4/survey              the survey + its products
            POST https://<API domain>/api/v4/survey/responses    one complete answer
```

## Deploy on Vercel

1. **New Project → import the Git repository.**
2. **Root Directory:** leave it empty — this project is the root of its repository (the
   framework, build command and output directory come from `vercel.json`).
3. **Environment Variables** (Production, and Preview if used):

   | Name | Value |
   |---|---|
   | `VITE_SURVEY_API_URL` | `https://<API domain>/api/v4/survey` |

   The build stops with an explicit error when it is missing, so a broken page is never deployed.
   Vite bakes the value in at build time: after changing it, redeploy.
4. **Deploy**, open the URL and check the 5 products load.
5. **Point the QR code at it** — in the Laravel server `.env`:

   ```
   SURVEY_URL=https://<your-project>.vercel.app
   ```

   then `php artisan config:cache`. The admin screen *Product Survey → Products & QR Code* shows
   the QR code only once `SURVEY_URL` is set.

> Decide the final address **before printing**: a printed QR code can never be changed. A custom
> domain on Vercel (e.g. `survey.jekor.iq`) survives renaming or moving the Vercel project; a
> `*.vercel.app` address is tied to the project name.

## Local development

```bash
npm install
npm run dev          # http://localhost:5173
```

Create `.env.local` (git-ignored) to forward `/api` to the local Laravel:

```
VITE_PROXY_TARGET=https://fustekaicecream.test
```

The target must be the host of `APP_URL_API`, since the API routes are bound to that domain.
`https://` works: the dev proxy accepts Laragon's self-signed certificate. Never point it at
production. The page shows "الاستبيان مغلق" until the local survey has 5 products and accepts
answers (admin → *Product Survey → Products & QR Code*). To test a production build locally:

```bash
VITE_SURVEY_API_URL=https://fustekaicecream.test/api/v4/survey npm run build && npx vite preview
```

(`vite preview` calls that URL directly from the browser, so the browser must trust Laragon's
certificate — or use `http://` there.)

## Behaviour worth knowing

- **One answer per device.** The browser keeps a random `device_id` in `localStorage`; the
  `(survey_id, device_id)` unique index refuses a second answer. Clearing site data allows a new
  one — that is the accepted trade-off. Storage belongs to the Vercel domain: changing the domain
  resets it.
- **Drafts.** Answers are kept in `localStorage` while the visitor fills the form, so a reload
  resumes where they stopped. A draft is dropped if an admin changes the product selection.
- **Phone.** Arabic-Indic digits, spaces and `+964` / `00964` prefixes are accepted and turned
  into `07XXXXXXXXX` (same rules as `SurveyService::normalizePhone`).
- **Closed survey.** When an admin switches answers off (or fewer than 5 products are chosen),
  the page shows a "closed" screen — no redeploy needed to open or close it.

Admin side: *Product Survey → Products & QR Code* (choose the products, open/close, download
the QR) and *Product Survey → Ratings & Opinions* (results).
