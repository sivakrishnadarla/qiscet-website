# QIS College of Engineering & Technology — website

A rebuilt public website for [QISCET, Ongole](https://qiscet.edu.in/qiscet/): new layout and a navy + saffron design, with the college’s real pages, photographs, NAP and documents. Built as a monorepo so it can go straight into Git and onto Vercel.
 
```
qiscet-website/
├── apps/web    Next.js 14 (React) — the website
└── apps/api    NestJS — enquiry, application, contact, grievance, feedback, newsletter
```

## What you get

- Every public page from the existing site, under clean URLs (`/departments/cse`, `/facilities/hostel`, `/academics/newsletters`, …) — about 380 pages, including department sub-pages (faculty, labs, syllabus, BoS, placements).
- Same NAP everywhere: Pondur Road, Vengamukkapalem, Ongole, Prakasam District, Andhra Pradesh – 523272 · +91 92464 19542 · principal@qiscet.edu.in. Admissions helpline +91 92464 19530. Counselling code **QISE**.
- Working forms (Apply Now, B-Category application, enquiry drawer, contact, grievance, five feedback forms, newsletter) posting to the NestJS API.
- Mobile navigation, sticky header, mega menu, WhatsApp / call bar, and a side “Enquire Now” tab.
- SEO / AEO / GEO: unique titles and descriptions, canonical URLs, Open Graph, JSON-LD (College, Course, FAQ, Breadcrumb, SearchAction), `sitemap.xml`, `robots.txt`, and [`/llms.txt`](apps/web/src/app/llms.txt/route.ts) for answer engines.
- 301 redirects from the old `/qiscet/*.php` paths, so existing links keep their equity.
- Official PDFs (syllabus, newsletters, NIRF, mandatory disclosure, …) still open from `qiscet.edu.in`, so nothing is lost and the repo stays deployable. Photographs used on the pages are stored in `apps/web/public/images`.

Login portals (student, staff, results) stay on the college’s existing systems and open in a new tab. Pages that had been defaced are not included.

## Run it locally

Requires Node.js 18.18+.

```bash
npm install
# terminal 1 — API on :4000
npm run dev:api
# terminal 2 — website on :3000
npm run dev
```

Open http://localhost:3000. Forms are proxied to the API (`/api/*` → `http://localhost:4000/api/*`). With no SMTP / Mongo / Sheets credentials, submissions are printed to the API log and appended to `apps/api/data/submissions.jsonl`.

## Environment

`apps/web/.env.example`

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL used in metadata, sitemap and JSON-LD |
| `API_URL` | NestJS origin. On Vercel set this to the deployed API, e.g. `https://qiscet-api.vercel.app` |
| `NEXT_PUBLIC_GTM_ID` | Optional. Defaults to the college’s existing container `GTM-W4F7HD49` |

`apps/api/.env.example` — turn on any combination of sinks:

- **Email** — `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `MAIL_TO_ADMISSIONS`, …
- **MongoDB Atlas** — `MONGODB_URI` (free tier). Documents go into `submissions`.
- **Google Sheets** — `SHEETS_WEBHOOK_URL` (an Apps Script web app that appends the JSON).
- **Admin list** — `ADMIN_TOKEN`, then `GET /api/admin/submissions` with header `x-admin-token`.

## Deploy on Vercel (two projects, one repo)

**Website**

1. Import the Git repo. Set **Root Directory** to `apps/web`. Framework preset: Next.js.
2. Add `NEXT_PUBLIC_SITE_URL` and `API_URL` (the API project’s URL, no trailing slash).
3. For the staff CMS, also add `CMS_ADMIN_PASSWORD`, `CMS_STAFF_PASSWORD`, `CMS_SECRET` and `MONGODB_URI` (see `apps/web/.env.example`). Without the database URI, staff can sign in but cannot save.
4. Deploy. `npm run build` runs automatically.

**API**

1. Second Vercel project, same repo. **Root Directory** `apps/api`. Framework: Other.
2. Build command: `npm run build` (compiles Nest to `dist/`). The serverless entry is `api/index.js`.
3. Add the SMTP / Mongo / Sheets variables from `.env.example`.
4. Copy the deployment URL into the website project’s `API_URL` and redeploy the website.

The browser only ever calls same-origin `/api/...`; Next.js proxies that to the Nest app, so there is no CORS step for normal visitors.

## Git

```bash
git init
git add .
git commit -m "Rebuild QISCET website (Next.js + NestJS)"
git remote add origin git@github.com:YOUR_ORG/qiscet-website.git
git push -u origin main
```

`node_modules`, `.next` and `.env` are gitignored. Do commit `apps/web/public/images` and `apps/web/content` — they are the site.

## Staff CMS

Staff and admins edit the site at `/admin` (also linked as “Staff login” in the footer).

| | |
| --- | --- |
| Local admin | `admin` / `qiscet-admin` |
| Local staff | `staff` / `qiscet-staff` |

Those defaults work only on localhost (and this preview). On Vercel, set `CMS_ADMIN_PASSWORD` and `CMS_STAFF_PASSWORD` or login is refused. Change them before the site is public.

What the desk can do:

- Create pages and blog posts, and edit any official page (the original JSON is kept; deleting the override restores it).
- Upload gallery albums. Every photo requires alt text. New albums appear on `/gallery`.
- Publish in an **AEO / GEO** format. The editor scores each page out of 10:
  1. One primary question, ending in a question mark.
  2. A direct answer of 40–90 words that names QISCET and Ongole — this is the paragraph AI tools should quote.
  3. Meta title 45–65 characters and meta description 140–165 characters.
  4. At least one H2.
  5. Two key facts (label / value) — emitted as `PropertyValue` structured data.
  6. Two FAQs whose answers stand alone — emitted as `FAQPage` + `QAPage` JSON-LD.
  7. An image with a real alt text.
  8. Author and dates.
  9. Named entities (QISCET, Ongole, the programme or office).
  10. Speakable markup on the direct answer, plus the right schema (`WebPage`, `BlogPosting`, `NewsArticle`, `Course`, `Event`, `FAQPage`).

Published answers are added to `/llms.txt`, `sitemap.xml` and site search. Blog posts also appear on `/blog` and `/news`. A draft example lives at **Blog → What is the EAPCET counselling code of QISCET?** so staff can see the format before publishing.

**Where edits are stored**

- Locally (`CMS_STORE=auto`): `apps/web/content/cms` and `apps/web/public/uploads`. Commit those folders so the next Git deploy includes them.
- On Vercel: set `MONGODB_URI` (and `MONGODB_DB`) on the **website** project. Live edits then persist in MongoDB and show immediately, without a rebuild. The first boot copies any CMS files committed from Git into an empty database.
- Without `MONGODB_URI` on Vercel, the CMS can display committed content but cannot save new edits.

`/cms-api/*` is the CMS API (not the Nest forms API). `/api/*` is still proxied to Nest.

## Content

Page copy lives in `apps/web/content` as JSON (one file per page, plus `departments.json`). The CMS writes overrides into `apps/web/content/cms` when running in file mode. Photographs are in `apps/web/public/images`; staff uploads go to `apps/web/public/uploads` (file mode) or MongoDB (live mode) and are served from `/uploads` or `/media`. Official PDFs stay on `qiscet.edu.in` and open in a new tab, so document links keep working without storing 1,200 files in Git.
