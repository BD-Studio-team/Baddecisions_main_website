# Bad Decisions Studio — Website

Production marketing site for [Bad Decisions Studio](https://www.baddecisions.studio), focused on three core pathways: podcast, learning, and working with the studio.

## Stack

- **HTML/CSS/JS** — vanilla, no framework
- **Vercel** — hosting, CDN, security headers, serverless functions
- **Upstash Redis** — optional podcast episode cache (via Vercel Marketplace)
- **Local Web Fonts** — PP Editorial New, Inter, Azeret Mono

## Project Structure

```text
├── build.js              Build script — inlines section partials into final pages
├── templates/            Source page templates (head, meta, layout)
│   ├── index.html
│   ├── learn.html
│   ├── podcast.html
│   └── work-with-us.html
├── sections/             Shared HTML partials (content blocks)
│   ├── nav.html          Nav with skip-link, mobile toggle, a11y attrs
│   ├── hero.html         Hero with video + integrated featured logo strip
│   ├── pillars.html      Three-pillar value prop
│   ├── stats.html        Key metrics band
│   ├── highlights.html   Three video highlight cards
│   ├── podcast-landing.html   Podcast CTA with iPhone mockup
│   ├── about.html        Founder story + blockquote
│   ├── sponsors.html     Partner logo grid (5-col)
│   ├── footer.html       Links, socials, copyright
│   ├── learn.html        Premium courses + free series grid
│   ├── podcast.html      Featured ep, recent eps, listen-on, guest grid
│   └── work-with-us.html Commercial hub: services, sponsorships, roles, inquiry routes
├── css/
│   ├── globals.css       Design system tokens, typography, buttons, badges, utilities
│   └── style.css         Section-specific layouts and responsive rules
├── js/
│   └── main.js           Nav toggle, scroll reveal, word rotation, podcast API, lazy video
├── api/
│   └── podcast.js        Serverless — Apple Podcasts + YouTube Data API + Redis cache
├── assets/               Logos, videos, thumbnails, platform icons, source font files
├── assets/fonts-web/     Production web fonts used by the site
├── llms.txt              Machine-readable brand summary
├── sitemap.xml           All public pages
├── vercel.json           Build command, cache headers, security headers
├── CLAUDE.md             AI assistant build instructions + design rules
└── index.html            ← Build output (do not edit directly)
```

## Pages

| Page | URL | Sections |
|------|-----|----------|
| Home | `/` | Hero (with featured strip), pillars, stats, highlights, podcast landing, about, sponsors, footer |
| Podcast | `/podcast` | Header, featured episode, recent episodes, listen-on platforms, notable guests (peach bg), footer |
| Learn | `/learn` | Premium programs, featured playlist, free series grid, footer |
| Work With Us | `/work-with-us` | Work-with-us hero, pathways, services, proof, sponsorships, roles, inquiry routes, final CTA |

## Development

```bash
npm install
npm run build        # Inlines sections into pages
npx serve .          # Local preview (podcast API won't work locally)
```

**Workflow:** Edit `sections/` or `templates/` → run `npm run build` → refresh browser.

Do NOT edit root HTML files directly — they are build outputs.

## Build Script

`build.js` reads each template from `templates/`, replaces `<div data-include="/sections/...">` markers with the actual section content, injects `globals.css`, and writes the final HTML to the project root.

## CSS Architecture

- **`globals.css`** — Design tokens, local `@font-face` loading, typography primitives, buttons, badges, utilities, focus states, and reduced-motion support
- **`style.css`** — Section-specific layouts for nav, hero, pillars, podcast, learn, work-with-us, sponsors, about, footer, and responsive rules

### Design Tokens (from brand review)

| Token | Value |
|-------|-------|
| `--color-void` | `#000000` |
| `--color-paper` | `#FBF9ED` |
| `--color-yellow` | `#FFEF7B` |
| `--color-teal-dark` | `#3A5D5B` |
| `--color-teal-light` | `#97C7CD` |
| `--color-peach` | `#C17E59` |
| `--color-brown` | `#937E67` |
| `--radius-button` | `4px` |
| `--radius-badge` | `2px` |
| `--radius-card` | `4px` |
| `--font-editorial` | PP Editorial New |
| `--font-body` | Inter |
| `--font-mono` | Azeret Mono |

### Section Background Rotation

Sections rotate through brand colors — never all the same background:
1. `#000000` — void (hero, main content)
2. `#FFEF7B` — yellow (stats bands)
3. `#3A5D5B` — teal (featured content)
4. `#FBF9ED` — paper (light inversions)
5. `#C17E59` — peach (CTAs, guest sections)

## SEO & Accessibility

- Canonical tags on all pages
- Open Graph + Twitter Card meta on all pages
- JSON-LD structured data (Organization, WebSite, PodcastSeries, Course)
- Sitemap covering all public pages
- `llms.txt` for LLM crawlers
- Skip-nav link with `#main-content` target
- `rel="noopener noreferrer"` on all external links
- `prefers-reduced-motion` support (CSS + JS)
- Local font preloads plus `font-display: swap`
- Lazy below-the-fold video playback via IntersectionObserver

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `YOUTUBE_API_KEY` | Optional | YouTube Data API key for episode thumbnails |
| `KV_REST_API_URL` | Optional | Upstash Redis REST URL |
| `KV_REST_API_TOKEN` | Optional | Upstash Redis REST token |

Falls back to Apple Podcasts artwork + hardcoded YouTube cache if not set.

## Deployment

```bash
vercel deploy          # Preview
vercel deploy --prod   # Production
```

Vercel runs `npm run build` automatically before serving.
