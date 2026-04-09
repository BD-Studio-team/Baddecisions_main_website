# Bad Decisions Studio — Website

Production website for [Bad Decisions Studio](https://www.baddecisions.studio), a creative technology education and content brand.

## Stack

- **HTML/CSS/JS** — vanilla, no framework
- **Vercel** — hosting, CDN, serverless functions
- **Upstash Redis** — podcast episode cache (via Vercel Marketplace)
- **Google Fonts** — Cormorant Garamond, DM Sans, Syne

## Project Structure

```
├── build.js              Build script — inlines section partials into pages
├── templates/            Source page templates (with data-include markers)
│   ├── index.html
│   ├── learn.html
│   ├── podcast.html
│   └── careers.html
├── sections/             HTML partials (source of truth for editing)
│   ├── nav.html
│   ├── hero.html
│   ├── featured.html
│   ├── pillars.html
│   ├── stats.html
│   ├── highlights.html
│   ├── podcast-landing.html
│   ├── about.html
│   ├── sponsors.html
│   ├── footer.html
│   ├── learn.html
│   ├── podcast.html
│   └── careers.html
├── css/
│   ├── globals.css       Design system (tokens, typography, components)
│   └── style.css         Section-specific layouts
├── js/
│   └── main.js           Navigation, scroll reveal, podcast API, lazy video
├── api/
│   └── podcast.js        Serverless function — fetches live podcast episodes
├── assets/               Static assets (logos, videos, images)
├── vercel.json           Vercel config, cache headers, security headers
├── sitemap.xml           Sitemap for all pages
├── llms.txt              Machine-readable brand info for LLMs
└── CLAUDE.md             AI assistant instructions
```

## Setup

```bash
npm install
```

## Development

1. **Edit sections** in `sections/` — these are the HTML partials
2. **Edit templates** in `templates/` — these define page structure and `<head>` meta
3. **Build** to generate the final HTML pages:

```bash
npm run build
```

This inlines the section partials into the page templates and outputs complete HTML to the project root. The root `index.html`, `learn.html`, `podcast.html`, and `careers.html` are build outputs — do not edit them directly.

4. **Preview locally** — open the root HTML files in a browser, or use a local server:

```bash
npx serve .
```

Note: The podcast API (`/api/podcast`) only works on Vercel (serverless function).

## Deployment

The site auto-deploys to Vercel on push to main. Vercel runs `npm run build` before serving.

```bash
vercel deploy          # preview deploy
vercel deploy --prod   # production deploy
```

## Environment Variables

Set these in the Vercel dashboard (or `.env.local` for local testing):

| Variable | Required | Description |
|----------|----------|-------------|
| `YOUTUBE_API_KEY` | Optional | YouTube Data API key for episode thumbnail lookup |
| `KV_REST_API_URL` | Optional | Upstash Redis REST URL (auto-set via Vercel Marketplace) |
| `KV_REST_API_TOKEN` | Optional | Upstash Redis REST token (auto-set via Vercel Marketplace) |

The podcast API works without these — it falls back to Apple Podcasts artwork and a hardcoded YouTube cache.

## CSS Architecture

- **`globals.css`** — Design system foundation: custom properties, typography classes, button/card components, context-based color system (`--ctx-*` variables), animation utilities
- **`style.css`** — Section-specific layouts: nav, hero, pillars, podcast, learn, about, sponsors, footer, and all responsive breakpoints

## Key URLs

| Page | URL |
|------|-----|
| Home | https://www.baddecisions.studio |
| Podcast | https://www.baddecisions.studio/podcast |
| Learn | https://www.baddecisions.studio/learn |
| Careers | https://www.baddecisions.studio/careers |
| Course (external) | https://learn.baddecisions.studio |
| AI Program (external) | https://ai.baddecisions.studio |
| Academy LMS (external) | https://academy.baddecisions.studio |

## Notes

- Privacy Policy and Terms of Service pages are placeholder links (`#`) — need dedicated pages
- The `sections/` directory is publicly accessible but contains only HTML fragments
- Footer copyright year should be updated annually
