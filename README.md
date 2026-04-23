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
│   ├── nav.html          Edge-to-edge nav with dropdowns, mobile overlay, scroll blur
│   ├── hero.html         Full-bleed cinematic video hero with bottom-anchored content
│   ├── pillars.html      Three image cards on tan paper (Watch / Learn / Work With Us)
│   ├── stats.html        Key metrics on green background
│   ├── highlights.html   Three video highlight cards on diagonal gradient
│   ├── podcast-landing.html   Podcast CTA with iPhone mockup on ember gradient
│   ├── about.html        "Why We Exist" on brown — mission statement + contact
│   ├── sponsors.html     Partner logo grid on mesh gradient
│   ├── footer.html       4-column footer with BD mark, links, socials, copyright
│   ├── learn.html        Premium courses + free series grid
│   ├── podcast.html      Featured ep, recent eps, listen-on, guest grid
│   ├── work-with-us.html Commercial hub: pathways, services, proof, partnerships, roles
│   └── work-with-us/     Sub-page sections
│       ├── services.html
│       ├── media-partnerships.html
│       └── open-roles.html
├── css/
│   ├── globals.css       Design tokens, @font-face, typography, buttons, badges, bg treatments
│   └── style.css         Section-specific layouts and responsive rules
├── js/
│   └── main.js           Nav scroll, reveal animations, podcast API, lazy video
├── api/
│   └── podcast.js        Serverless — Apple Podcasts + YouTube Data API + Redis cache
├── assets/
│   ├── fonts-web/        Self-hosted woff2: PP Editorial New, Inter, Azeret Mono
│   ├── icons/            SVG sprite system (platforms.svg)
│   ├── logo/             SVG logos and marks
│   ├── clients/          Client/partner logos
│   ├── featured/         "As Featured On" logos
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

Homepage rotates through distinct backgrounds — no two adjacent sections share the same treatment:

1. **Void** — hero (cinematic video + gradient overlay)
2. **Tan paper** — pillars (paper texture SVG noise)
3. **Diagonal gradient** — highlights (void → soot → green tint)
4. **Ember** — podcast landing (warm bottom glow)
5. **Mesh gradient** — sponsors (dual radial gradients)
6. **Brown** — about (origin story)

### Background Treatment Classes

`globals.css` provides atmospheric utility classes: `.bg-glow-gold`, `.bg-glow-blue`, `.bg-glow-peach`, `.bg-diagonal`, `.bg-vignette`, `.bg-horizon`, `.bg-ember`, `.bg-mesh`, `.bg-topwash`, `.bg-paper-texture`

### Image Treatment

Per CLAUDE.md, images render at natural saturation. Use gradient overlays (`linear-gradient(transparent → void)`) for text legibility on hero backgrounds rather than CSS filters. The `.img-cinematic` / `.img-warm` filter classes were removed (2026-04-23).

## Navigation

Edge-to-edge fixed nav (64px). Transparent on load, dark backdrop-blur on scroll. Logo left (SVG), 3 center links (Watch, Learn dropdown, Work With Us dropdown), yellow CTA right. Mobile: full-screen overlay with staggered PP Editorial links.

## Icon System

SVG sprite at `assets/icons/platforms.svg` with brand-accurate platform logos. Usage:

```html
<svg class="pi pi-md"><use href="/assets/icons/platforms.svg#icon-youtube"/></svg>
```

Available icons: `icon-youtube`, `icon-spotify`, `icon-apple-podcasts`, `icon-instagram`, `icon-x`, `icon-tiktok`, `icon-linkedin`, `icon-discord`, `icon-threads`

Size classes: `.pi-sm` (16px), `.pi-md` (20px), `.pi-lg` (24px), `.pi-xl` (32px)

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
