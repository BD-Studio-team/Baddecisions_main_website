# Bad Decisions Studio — Website

## What This Is

Bad Decisions is a brand ecosystem website built around three business pillars: **Content**, **Education**, and **Services**. The website explains the ecosystem clearly, builds trust quickly, and routes visitors into the correct path.

The site is for: viewers, students, brands, sponsors, and future team members.

**Founders:** Faraz Shababi (Commander) and Farhad Shababi. Operating across Vancouver and Dubai.

---

## Brand Architecture

**Internal pillars** (for strategy, copy, design logic):
- Content
- Education
- Services

**User-facing homepage paths** (action-based, immediately understandable):
- Watch (Podcast)
- Learn (Education)
- Work With Us (Services, Media Partnerships, Open Roles)

**Work With Us sub-sections** (always these three, in this order):
- Services
- Media Partnerships
- Open Roles

Do not replace Services with Projects. Do not use Media as the main label. Do not mix naming systems.

---

## Project Structure

```text
├── build.js                  Build script — inlines section partials into pages
├── templates/                Source page templates (head, meta, layout)
│   ├── index.html
│   ├── learn.html
│   ├── podcast.html
│   ├── work-with-us.html
│   └── work-with-us/
│       ├── open-roles.html
│       ├── services.html
│       └── sponsorships.html
├── sections/                 HTML partials (source of truth for content)
│   ├── nav.html              Nav with dropdowns, mobile overlay, skip-link
│   ├── hero.html             Hero with video + integrated featured logo strip
│   ├── pillars.html          Three-pillar value prop (Watch / Learn / Work With Us)
│   ├── stats.html            Key metrics band
│   ├── highlights.html       Three video highlight cards
│   ├── podcast-landing.html  Podcast CTA with iPhone mockup
│   ├── about.html            "Why We Exist" — mission statement + contact
│   ├── sponsors.html         Partner logo grid (5-col)
│   ├── footer.html           Links, socials, copyright
│   ├── learn.html            Premium courses + free series grid
│   ├── podcast.html          Featured ep, recent eps, listen-on, guest grid
│   ├── work-with-us.html     Commercial hub: services, sponsorships, roles
│   └── work-with-us/         Sub-page sections
│       ├── open-roles.html
│       ├── services.html
│       └── sponsorships.html
├── css/
│   ├── globals.css           Design system tokens, @font-face, typography, buttons, badges
│   └── style.css             Section-specific layouts and responsive rules
├── js/
│   └── main.js               Nav, scroll reveal, word rotation, podcast API, lazy video
├── api/
│   └── podcast.js            Serverless — Apple Podcasts + YouTube + Redis cache
├── assets/
│   ├── fonts-web/            Self-hosted woff2: PP Editorial New, Inter, Azeret Mono
│   ├── logo/                 SVG logos and marks
│   ├── clients/              Client/partner logos
│   ├── featured/             "As Featured On" logos
│   ├── platforms/             Social/podcast platform icons
│   ├── founders/             Founder photos
│   ├── podcast/              Podcast cover art, iPhone mockup
│   └── video/                Hero video, highlight reels, course previews
├── vercel.json               Build command, cache headers, security headers
├── sitemap.xml               All public pages
├── llms.txt                  Machine-readable brand summary
└── README.md                 Setup, build, deploy, architecture
```

**Build flow:** Edit `sections/` or `templates/` → run `npm run build` → outputs pre-rendered HTML to root. Do NOT edit root `.html` files directly.

---

## Pages

| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Explain what BDS is, build trust, show 3 paths, prove credibility |
| Podcast | `/podcast` | Premium content destination — explain the show, recent episodes, platforms, guest credibility |
| Learn | `/learn` | Premium programs + free series |
| Work With Us | `/work-with-us` | Commercial hub — services, sponsorships, open roles |
| Services | `/work-with-us/services` | Detailed services offering |
| Media Partnerships | `/work-with-us/media-partnerships` | Multi-platform sponsorship packages + stats |
| Open Roles | `/work-with-us/open-roles` | Current job openings |

### Homepage Structure
1. Hero
2. Trusted by logo strip (integrated into hero)
3. Choose Your Path (pillars)
4. Proof / credibility (stats + highlights)
5. Podcast landing CTA
6. Why We Exist
7. Partners & sponsors
8. Footer

### Podcast Page Goals
1. Explain what the show is
2. Make recent episodes easy to consume
3. Show listening platforms clearly
4. Build credibility through notable guests

---

## Design Rules — Do Not Break These

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--color-void` | `#000000` | Primary background |
| `--color-paper` | `#FBF9ED` | Primary text on dark, light section bg |
| `--color-yellow` | `#FFEF7B` | Primary accent, CTA buttons, italic text |
| `--color-teal-dark` | `#3A5D5B` | Teal action buttons, section bg |
| `--color-teal-light` | `#97C7CD` | Secondary accent |
| `--color-peach` | `#C17E59` | Warm accent, section bg |
| `--color-brown` | `#937E67` | Secondary text, muted labels |

**Never** use pure white (`#fff`) for heading text on dark backgrounds. Use `#FBF9ED`.

### Typography
| Role | Font | Notes |
|------|------|-------|
| Display headings | PP Editorial New | Self-hosted. Italic = always `#FFEF7B`, no exceptions |
| Body text | Inter | Self-hosted variable font |
| Labels, meta, timestamps | Azeret Mono | 11px, uppercase, letter-spacing `.15em` |

All fonts are self-hosted in `assets/fonts-web/` and loaded via `@font-face` in `globals.css`.

### Buttons
- `border-radius: 4px` on ALL buttons — never pill, never 0
- Primary: `#FFEF7B` bg, `#000` text, Inter 700 13px
- Secondary: transparent bg, `1.5px solid rgba(255,255,255,.25)`, white text
- Teal: `#3A5D5B` bg, white text
- Peach: `#C17E59` bg, white text
- Light (on paper sections): `#000` bg, white text

### Section Background Rotation
Sections must NOT all be `#000`. Rotate through:
1. `#000000` — void (hero, main content)
2. `#FFEF7B` — yellow (stats bands) → all text `#000`
3. `#3A5D5B` — teal (featured content)
4. `#FBF9ED` — paper (light inversions)
5. `#C17E59` — peach (CTAs, guest sections)

Never use more than 2 accent colors in the same viewport.

### Badge/Tag System
- `border-radius: 2px`
- Episode: `#3A5D5B` bg, `#97C7CD` text
- New: `#FFEF7B` bg, `#000` text
- Bestseller: `#C17E59` bg, white text
- Free: `1.5px solid #FFEF7B` border, `#FFEF7B` text, transparent bg
- Live: `rgba(255,239,123,.1)` bg, `#FFEF7B` text, 5px pulsing dot

### Footer
- Top: 6px color bar — `#FFEF7B`, `#3A5D5B`, `#97C7CD`, `#C17E59`, `#937E67`
- Social icons: 36x36px, `border-radius: 4px`, `rgba(255,255,255,.06)` bg
- Newsletter: underline input only (border-bottom), no box border

### General Rules
- Preserve all `.reveal` scroll animations
- No drop shadows — use borders instead
- `prefers-reduced-motion` must disable JS animations (word rotation, lazy video, stagger)
- Custom cursor only on pointer devices (`pointer: fine`)

---

## Brand Voice

- Premium, modern, clear, confident, minimal
- Not corporate, not vague, not overly startup-like
- The brand is "Bad Decisions Studio" — always full name or "BDS", never just "Bad Decisions"
- Feels like a serious company at the intersection of tech, AI, content, education, and execution

---

## Navigation

**Desktop (64px height):**
- Logo left: "BADDECISIONS BD" text, BD in yellow
- Center: Podcast (plain link), Education (dropdown), Work With Us (dropdown)
- CTA right: "Learn AI →" yellow button
- Transparent on load, `rgba(0,0,0,.88)` + `backdrop-filter: blur(12px)` on scroll

**Education dropdown:** AI Programs, Unreal Engine, Free Learning
**Work With Us dropdown:** Services, Media Partnerships, Open Roles

**Mobile (below 768px):** Full-screen overlay, links in PP Editorial New at 26px, stagger animation.

---

## Key URLs (hardcoded, do not change)

```
Course:          https://learn.baddecisions.studio
AI Program:      https://ai.baddecisions.studio
Academy (LMS):   https://academy.baddecisions.studio
Spotify:         https://open.spotify.com/show/12jUe4lIJgxE4yst7rrfmW
Apple Podcasts:  https://podcasts.apple.com/us/podcast/bad-decisions-podcast/id1677462934
YouTube:         https://www.youtube.com/@badxstudio
Instagram:       https://www.instagram.com/badxstudio/
TikTok:          https://www.tiktok.com/@badxstudio
X:               https://x.com/badxstudio
LinkedIn:        https://ca.linkedin.com/company/badxstudio
Discord:         https://discord.gg/bWCBcmqYh9
Contact:         create@baddecisions.studio
```

External links (ai.baddecisions.studio, learn.baddecisions.studio) open in the same tab (`target="_self"`). All other external links use `rel="noopener noreferrer"`.

---

## Podcast API

`/api/podcast.js` is a Vercel serverless function fetching from Apple Podcasts (show ID: `1677462934`) + YouTube Data API with Upstash Redis caching.

```json
{
  "totalEpisodes": 103,
  "episodes": [
    {
      "id": 123456,
      "episodeNumber": 103,
      "title": "Episode Title",
      "description": "Cleaned plain text...",
      "date": "Apr 2026",
      "duration": "1h 12m",
      "artworkUrl": "https://...",
      "youtubeUrl": "https://www.youtube.com/watch?v=...",
      "trackViewUrl": "https://podcasts.apple.com/..."
    }
  ]
}
```

The podcast page JS updates the featured hero (`.pod-hero`) and episode grid (`.pod-4grid .pod-showcase-card`) from this API. Do not modify the contract without updating both sides.

---

## SEO & Accessibility

- Canonical tags on all pages
- Open Graph + Twitter Card meta on all pages
- JSON-LD: Organization (home), PodcastSeries (podcast), Course (learn)
- Sitemap at `/sitemap.xml`
- `llms.txt` at root
- Skip-nav link with `#main-content` target
- `prefers-reduced-motion` support (CSS + JS)
- Local font preloads with `font-display: swap`
- Lazy video autoplay via IntersectionObserver
- Sub-pages (`/work-with-us/*`) use `noindex,nofollow` until ready

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `YOUTUBE_API_KEY` | Optional | YouTube Data API key |
| `KV_REST_API_URL` | Optional | Upstash Redis REST URL |
| `KV_REST_API_TOKEN` | Optional | Upstash Redis REST token |

Falls back to Apple Podcasts artwork + hardcoded YouTube cache if not set.

---

## Deployment

```bash
npm install
npm run build         # Inlines sections into pages
vercel deploy --prod  # Production deploy
```

Vercel runs `npm run build` automatically via `vercel.json` `buildCommand`.
