# Bad Decisions Studio Website

Static marketing site for [Bad Decisions Studio](https://www.baddecisions.studio), built around three public paths:
- `Podcast`
- `Education`
- `Work With Us`

The project is intentionally simple: reusable HTML sections, page templates, one build step, and vanilla CSS/JS.

## Stack

- HTML, CSS, JavaScript
- Vercel for hosting and serverless functions
- Vercel Cron + deploy hook for daily podcast rebuilds
- Self-hosted fonts: `PP Editorial New`, `Inter`, `Azeret Mono`

## Repo layout

```text
Main/
├── build.js                  Build script: composes templates + sections into final pages
├── dev-server.js             Small local static server
├── data/
│   └── site-content.js       Shared content/config for platform links, podcast cards, guests, learn rows
├── templates/                Page templates (head/meta/layout)
│   ├── index.html
│   ├── education.html
│   ├── podcast.html
│   ├── work-with-us.html
│   └── work-with-us/
│       ├── media-partnerships.html
│       ├── open-roles.html
│       └── services.html
├── sections/                 Source-of-truth HTML partials
│   ├── nav.html
│   ├── hero.html
│   ├── pillars.html
│   ├── find-us.html
│   ├── podcast-landing.html
│   ├── newsletter.html
│   ├── about.html
│   ├── trusted-marquee.html
│   ├── footer.html
│   ├── education.html
│   ├── podcast.html
│   ├── work-with-us.html
│   └── work-with-us/
│       ├── media-partnerships.html
│       ├── media-partnerships-cta.html
│       ├── open-roles.html
│       └── services.html
├── css/
│   ├── globals.css           Tokens, fonts, base utilities, shared primitives
│   ├── style.css             Section/page styling and responsive rules
│   ├── components.css        Shared component normalization
│   └── nav.css               Shared navigation styling
├── js/
│   └── main.js               Nav, scroll reveal, lazy video, mobile sliders
├── api/
│   └── cron/
│       └── podcast-refresh.js Daily deploy-hook trigger for podcast rebuilds
├── assets/
│   ├── bd-logo/
│   ├── client-logos/
│   ├── fonts-web/
│   ├── learn/
│   ├── platform-logos/
│   ├── podcast/
│   ├── tech-logos/
│   └── video/
├── docs/
│   └── AUDIT.md              Historical audit notes
├── index.html                Generated output
├── education.html            Generated output
├── podcast.html              Generated output
├── work-with-us.html         Generated output
├── work-with-us/
│   ├── media-partnerships.html
│   ├── open-roles.html
│   └── services.html
├── llms.txt
├── sitemap.xml
├── robots.txt
├── vercel.json
├── CLAUDE.md
└── package.json
```

## Build flow

Edit source files only:
- `sections/`
- `templates/`
- `data/site-content.js`
- `css/`
- `js/`

Then rebuild:

```bash
npm run build
```

Do not hand-edit generated pages at the root like:
- `index.html`
- `education.html`
- `podcast.html`
- `work-with-us/*.html`

They are overwritten by the build.

## Current page notes

- `/work-with-us/open-roles` uses a compact header and role list only (bottom CTA removed).
- `/work-with-us/services` currently includes:
  - services cards
  - technology stack
  - final contact CTA
  - (the previous long About section was removed)
- Technology stack logos are served from `assets/tech-logos/` and rendered via shared `.services-stack-*` classes.

## Development

Install:

```bash
npm install
```

Build once:

```bash
npm run build
```

Run local server:

```bash
npm run serve
```

Build + serve together:

```bash
npm run dev
```

Default local URLs:
- [http://localhost:4173](http://localhost:4173)
- [http://localhost:8000](http://localhost:8000) when running the simple node server on that port

## Content model

`data/site-content.js` is the canonical source for repeated content:
- platform links/assets/order
- podcast recent episode cards
- podcast guest tiles
- learn free-content rows

If a section uses `{{token}}` placeholders in a partial, the build expands them from `site-content.js`.

## Podcast refresh

Recent podcast episodes are rendered as static HTML. The browser does not call a podcast API on page load.

How it works:

1. `npm run build` runs `build.js`.
2. If `YOUTUBE_API_KEY` is available, `build.js` calls the YouTube playlist API once and replaces `podcastRecentEpisodes` in memory for that build.
3. The generated `podcast.html` contains the latest episode cards as plain HTML.
4. If YouTube fails or `YOUTUBE_API_KEY` is missing, the build falls back to the checked-in episode list in `data/site-content.js`.

Production refresh:

- `vercel.json` registers a daily cron at `0 8 * * *`.
- The cron calls `/api/cron/podcast-refresh`.
- The cron endpoint checks `CRON_SECRET`.
- The endpoint triggers `VERCEL_DEPLOY_HOOK_URL`.
- The deploy hook starts a fresh production build, which fetches YouTube once and bakes the latest podcast cards into the page.

Setup required in Vercel:

1. Add `YOUTUBE_API_KEY`.
2. Add `CRON_SECRET`.
3. Create a Vercel Deploy Hook for the production branch.
4. Add that deploy hook URL as `VERCEL_DEPLOY_HOOK_URL`.

To manually update podcast cards without waiting for cron, trigger the same deploy hook or run a production deploy. For local development without a YouTube key, edit `data/site-content.js`.

## Design system

Shared styling is split intentionally:
- `css/globals.css` for tokens and base primitives
- `css/components.css` for shared component cleanup
- `css/nav.css` for navigation only
- `css/style.css` for page/section styling

Navigation is shared across every page from `sections/nav.html`.

## Environment variables

Environment variables for podcast refresh:

| Variable | Required | Purpose |
|---|---:|---|
| `YOUTUBE_API_KEY` | No | YouTube Data API access during `npm run build`; falls back to checked-in content if missing |
| `CRON_SECRET` | Yes, for cron | Protects the Vercel Cron endpoint |
| `VERCEL_DEPLOY_HOOK_URL` | Yes, for cron | Vercel deploy hook triggered once per day by cron |

If `YOUTUBE_API_KEY` is missing, the site still renders using checked-in static episode content.

## Deployment

```bash
vercel deploy
vercel deploy --prod
```

Vercel runs `npm run build` through `vercel.json`.

## Repo hygiene

- `.DS_Store`, logs, local env files, and `.claude/` are gitignored
- historical notes live in `docs/` instead of the repo root
- platform links and repeated card content should stay centralized in `data/site-content.js`
