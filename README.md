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
├── data/
│   └── site-content.js   Shared content/config for platforms, Learn rows, podcast cards, guests
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
│   ├── nav.html          Shared fixed nav with dropdowns and mobile overlay
│   ├── hero.html         Full-bleed cinematic video hero with bottom-anchored content
│   ├── pillars.html      Three image cards on tan paper (Watch / Learn / Work With Us)
│   ├── find-us.html      Social/platform icon strip
│   ├── podcast-landing.html   Podcast CTA with iPhone mockup on ember gradient
│   ├── newsletter.html   Shared newsletter signup section
│   ├── about.html        Studio positioning section on brown
│   ├── _trust-logos.html Shared trusted-by logo strip
│   ├── footer.html       4-column footer with BD mark, links, socials, copyright
│   ├── learn.html        Premium programs + free-learning rows
│   ├── podcast.html      Featured ep, recent eps, listen-on, guest grid
│   ├── work-with-us.html Commercial hub: pathways and roles
│   └── work-with-us/     Sub-page sections
│       ├── services.html
│       ├── media-partnerships.html
│       ├── media-partnerships-cta.html
│       └── open-roles.html
├── css/
│   ├── globals.css       Design tokens, @font-face, typography, buttons, badges, bg treatments
│   ├── style.css         Section-specific layouts and responsive rules
│   ├── components.css    Shared system overrides for cards, spacing, and surfaces
│   └── nav.css           Shared nav layout and mobile overlay styling
├── js/
│   └── main.js           Nav toggle, reveal animations, podcast API, lazy video
├── api/
│   └── podcast.js        Serverless — Apple Podcasts + YouTube Data API + Redis cache
├── assets/
│   ├── fonts-web/        Self-hosted woff2: PP Editorial New, Inter, Azeret Mono
│   ├── bd-logo/          SVG logos and brand marks
│   ├── client-logos/     Client/partner logos
│   ├── platform-logos/   Standalone social/podcast platform assets
│   ├── podcast/          Podcast cover art, iPhone mockup
│   ├── learn/            Free-learning thumbnails
│   └── video/            Hero video and course/program previews
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
| Media Partnerships | `/work-with-us/media-partnerships` | Fast sponsor-facing page with audience stats and partnership CTA |
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

`build.js` reads each template from `templates/` (including subdirectories like `work-with-us/`), replaces `<div data-include="/sections/...">` markers with actual section content, injects shared CSS (`globals.css`, `style.css`, `components.css`, `nav.css`), expands build-time content tokens from `data/site-content.js`, and writes final HTML to the project root.

## Design System

### Color Tokens

The design system uses a warm-shifted neutral scale (never pure greys) plus 6 brand colors:

| Token | Value | Use |
|-------|-------|-----|
| `--color-yellow` | `#FFEF7B` | CTAs, accent italic, eyebrows |
| `--color-blue` | `#97C7CD` | Podcast/show accent |
| `--color-green` | `#3A5D5B` | Education, trust, buttons on light |
| `--color-tan` | `#FBF9ED` | Light/paper sections |
| `--color-brown` | `#937E67` | Origin story, warmth |
| `--color-peach` | `#C17E59` | Warm CTA accent |
| `--color-void` | `#050505` | Primary dark background |
| `--color-ink` | `#0E0D0B` | Slightly lighter dark bg |
| `--color-soot` | `#1A1814` | Card backgrounds on dark |
| `--color-charcoal` | `#222019` | Surface elevation |
| `--color-stone` | `#2E2B26` | Borders, UI lines |
| `--color-ash` | `#6B6560` | Body text on light (15px+, wt 500) |
| `--color-fog` | `#A8A29E` | Body text on dark |
| `--color-bone` | `#D6D0C8` | Body text on green/brown |
| `--color-cream` | `#F5F2EA` | Headings on dark |

### Typography

| Role | Font | Token |
|------|------|-------|
| Display headings | PP Editorial New | `--font-editorial` |
| Body text | Inter | `--font-body` |
| Labels, meta | Azeret Mono | `--font-mono` |

### Section Backgrounds

Homepage rotates through distinct backgrounds to separate the three core pillars, podcast, newsletter, and studio positioning without relying on repeated section treatments.

### Background Treatment Classes

`globals.css` provides atmospheric utility classes: `.bg-glow-gold`, `.bg-glow-blue`, `.bg-glow-peach`, `.bg-diagonal`, `.bg-vignette`, `.bg-horizon`, `.bg-ember`, `.bg-mesh`, `.bg-topwash`, `.bg-paper-texture`

### Image Treatment

Per CLAUDE.md, images render at natural saturation. Use gradient overlays (`linear-gradient(transparent → void)`) for text legibility on hero backgrounds rather than CSS filters. The `.img-cinematic` / `.img-warm` filter classes were removed (2026-04-23).

## Navigation

Fixed shared nav across every page. Logo left, primary links in the middle, dropdowns for Learn and Work With Us, and a simplified mobile overlay. No route-specific CTA swapping.

## Platform Assets

All visible social and platform surfaces use standalone assets in `assets/platform-logos/`, with platform links and ordering centralized in `data/site-content.js`.

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
