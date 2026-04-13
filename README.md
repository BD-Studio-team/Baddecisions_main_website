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
│   ├── work-with-us.html
│   └── work-with-us/
│       ├── services.html
│       ├── media-partnerships.html
│       └── open-roles.html
├── sections/             Shared HTML partials (content blocks)
│   ├── nav.html          Nav with dropdowns, mobile overlay, skip-link
│   ├── hero.html         Hero with video + integrated featured logo strip
│   ├── pillars.html      Three-pillar value prop (Watch / Learn / Work With Us)
│   ├── stats.html        Key metrics band
│   ├── highlights.html   Three video highlight cards
│   ├── podcast-landing.html   Podcast CTA with iPhone mockup
│   ├── about.html        "Why We Exist" — mission statement + contact
│   ├── sponsors.html     Partner logo grid (5-col)
│   ├── footer.html       Links, socials, copyright
│   ├── learn.html        Premium courses + free series grid
│   ├── podcast.html      Featured ep, recent eps, listen-on, guest grid
│   ├── work-with-us.html Commercial hub: pathways, services, proof, partnerships, roles
│   └── work-with-us/     Sub-page sections
│       ├── services.html
│       ├── media-partnerships.html
│       └── open-roles.html
├── css/
│   ├── globals.css       Design system tokens, @font-face, typography, buttons, badges
│   └── style.css         Section-specific layouts and responsive rules
├── js/
│   └── main.js           Nav, scroll reveal, word rotation, podcast API, lazy video
├── api/
│   └── podcast.js        Serverless — Apple Podcasts + YouTube Data API + Redis cache
├── assets/
│   ├── fonts-web/        Self-hosted woff2: PP Editorial New, Inter, Azeret Mono
│   ├── icons/            SVG sprite system (platforms.svg)
│   ├── logo/             SVG logos and marks
│   ├── clients/          Client/partner logos
│   ├── featured/         "As Featured On" logos
│   ├── platforms/        Social/podcast platform icons (legacy, see icons/)
│   ├── founders/         Founder photos
│   ├── podcast/          Podcast cover art, iPhone mockup
│   └── video/            Hero video, highlight reels, course previews
├── vercel.json           Build command, cache headers, security headers
├── sitemap.xml           All public pages
├── llms.txt              Machine-readable brand summary
└── CLAUDE.md             AI assistant build instructions + design rules
```

## Pages

| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Explain what BDS is, build trust, show 3 paths, prove credibility |
| Podcast | `/podcast` | Show, recent episodes, listen-on platforms, notable guests |
| Learn | `/learn` | Premium programs + free series |
| Work With Us | `/work-with-us` | Commercial hub — services, media partnerships, open roles |
| Services | `/work-with-us/services` | Detailed services offering + trusted-by logos |
| Media Partnerships | `/work-with-us/media-partnerships` | Multi-platform sponsorship packages, audience, formats |
| Open Roles | `/work-with-us/open-roles` | Current job openings |

## Development

```bash
npm install
npm run build        # Inlines sections into pages
npx serve .          # Local preview (podcast API won't work locally)
```

**Workflow:** Edit `sections/` or `templates/` → run `npm run build` → refresh browser.

Do NOT edit root HTML files directly — they are build outputs.

## Build Script

`build.js` reads each template from `templates/` (including subdirectories like `work-with-us/`), replaces `<div data-include="/sections/...">` markers with actual section content, injects `globals.css`, and writes final HTML to the project root.

## Navigation

Desktop: logo left, 3 center links (Watch, Learn with dropdown, Work With Us with dropdown), CTA right. Dropdowns appear on hover with animated entrance. Mobile: full-screen overlay with staggered link animations.

**Education dropdown:** AI Programs, Unreal Engine, Free Learning
**Work With Us dropdown:** Services, Media Partnerships, Open Roles

## Icon System

SVG sprite at `assets/icons/platforms.svg` with brand-accurate platform logos. Usage:

```html
<svg class="pi pi-md"><use href="/assets/icons/platforms.svg#icon-youtube"/></svg>
```

Available icons: `icon-youtube`, `icon-spotify`, `icon-apple-podcasts`, `icon-instagram`, `icon-x`, `icon-tiktok`, `icon-linkedin`, `icon-discord`, `icon-threads`

Size classes: `.pi-sm` (16px), `.pi-md` (20px), `.pi-lg` (24px), `.pi-xl` (32px)

## CSS Architecture

- **`globals.css`** (821 lines) — Design tokens, `@font-face`, typography classes, buttons, badges, cards, stats, icon utilities, scroll reveal, reduced-motion support
- **`style.css`** (3,484 lines) — Nav, hero, featured scroller, pillars, podcast, learn, work-with-us, sponsors, about, footer, media partnerships page styles, responsive breakpoints

### Design Tokens

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
2. `#FFEF7B` — yellow (stats bands, media partnerships hero)
3. `#3A5D5B` — teal (audience sections, CTAs)
4. `#FBF9ED` — paper (partnership formats, light inversions)
5. `#C17E59` — peach (guest sections)

## SEO & Accessibility

- Canonical tags on all pages
- Open Graph + Twitter Card meta on all pages
- JSON-LD structured data (Organization, WebSite, PodcastSeries, Course)
- Sitemap covering all public pages
- `llms.txt` for LLM crawlers
- Skip-nav link with `#main-content` target
- `rel="noopener noreferrer"` on all external links
- `prefers-reduced-motion` support (CSS + JS)
- Local font preloads with `font-display: swap`
- Lazy video autoplay via IntersectionObserver
- Sub-pages (`/work-with-us/*`) use `noindex,nofollow` until ready

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

Vercel runs `npm run build` automatically via `vercel.json` `buildCommand`.
