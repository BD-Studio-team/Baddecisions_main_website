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
│       └── media-partnerships.html
├── sections/                 HTML partials (source of truth for content)
│   ├── nav.html
│   ├── hero.html
│   ├── pillars.html
│   ├── find-us.html          "Find Bad Decisions" social icon bar
│   ├── podcast-landing.html
│   ├── newsletter.html       Klaviyo newsletter signup (reusable on any page)
│   ├── about.html
│   ├── _trust-logos.html     Shared trusted-by logo strip
│   ├── footer.html
│   ├── learn.html
│   ├── podcast.html
│   ├── work-with-us.html
│   └── work-with-us/
│       ├── open-roles.html
│       ├── services.html
│       ├── media-partnerships-cta.html
│       └── media-partnerships.html
├── css/
│   ├── globals.css           Design system tokens, @font-face, typography, buttons, badges
│   ├── style.css             Section-specific layouts and responsive rules
│   ├── components.css        Shared system overrides and component normalization
│   └── nav.css               Shared nav layout and mobile overlay styling
├── js/
│   └── main.js               Nav toggle, scroll reveal, podcast API, lazy video
├── api/
│   └── podcast.js            Serverless — YouTube Data API + Upstash Redis cache
├── assets/
│   ├── fonts-web/            Self-hosted woff2: PP Editorial New, Inter, Azeret Mono
│   ├── bd-logo/              SVG logos and marks
│   ├── client-logos/         Client/partner logos
│   ├── platform-logos/       Social/podcast platform assets
│   ├── podcast/              Podcast cover art, iPhone mockup
│   ├── podcast/guests/       Locally-hosted podcast guest thumbnails
│   ├── learn/                Locally-hosted free-learning thumbnails
│   └── video/                Hero video, highlight reels, course previews
├── vercel.json
├── sitemap.xml
├── llms.txt
└── README.md
```

**Build flow:** Edit `sections/` or `templates/` → run `npm run build` → outputs pre-rendered HTML to root. Do NOT edit root `.html` files directly.

---

## Pages

| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Explain what BDS is, build trust, show 3 paths, prove credibility |
| Podcast | `/podcast` | Premium content destination — explain the show, recent episodes, platforms, guest credibility |
| Learn | `/learn` | Premium programs + free series |
| Work With Us | `/work-with-us` | Commercial hub — services, media partnerships, open roles |
| Services | `/work-with-us/services` | Detailed services offering |
| Media Partnerships | `/work-with-us/media-partnerships` | Multi-platform sponsorship packages + stats |
| Open Roles | `/work-with-us/open-roles` | Current job openings |

---

## Visual Direction — Editorial Cinematic

The site should feel like opening a premium publication meets a cinematic studio portfolio. Every section should feel intentionally designed — not generated from a card template.

**Three principles govern every design decision:**

1. **Opinionated** — The design never hedges. Bold type, strong contrast, decisive layout. Every element earns its space.
2. **Cinematic** — Deep blacks, warm highlights, desaturated imagery, dramatic scale shifts. The visual language borrows from film and real-time 3D.
3. **Editorial** — Asymmetric grids, strong typographic hierarchy, intentional whitespace. It should feel designed by a magazine art director.

**Critical rules:**
- No two adjacent sections should use the same layout pattern. Alternate between full-bleed imagery, tight text blocks, asymmetric splits, stat strips, and editorial breaks.
- The eye should never be able to predict what's coming next as it scrolls.

---

## Design System — globals.css Tokens

All design tokens live in `globals.css` as CSS custom properties on `:root`. Every section, component, and page references these tokens — never hardcoded values. This ensures a single edit to `globals.css` cascades everywhere.

### Color Tokens

```css
:root {
  /* ── Brand Palette (7 core colors) ── */
  --color-yellow:      #FFEF7B;   /* Identity, CTAs, PP Editorial italic accent */
  --color-blue:        #97C7CD;   /* Calm authority, podcast/show sections */
  --color-green:       #3A5D5B;   /* Depth, education, premium buttons */
  --color-tan:         #FBF9ED;   /* Paper/light sections, breathing room */
  --color-brown:       #937E67;   /* Heritage, warmth, origin story sections */
  --color-peach:       #C17E59;   /* Warm accent, CTA backgrounds */
  --color-black:       #000000;   /* Pure black */

  /* ── Neutral Scale (warm-shifted, never pure) ── */
  --color-void:        #050505;   /* Primary dark background — NOT #000 */
  --color-ink:         #0E0D0B;   /* Slightly lighter dark bg */
  --color-soot:        #1A1814;   /* Card/box backgrounds on dark */
  --color-charcoal:    #222019;   /* Subtle surface elevation */
  --color-stone:       #2E2B26;   /* Borders, faint UI lines */
  --color-ash:         #6B6560;   /* Body text on LIGHT backgrounds only (15px+, wt 500) */
  --color-fog:         #A8A29E;   /* Body text on DARK backgrounds — primary readable gray */
  --color-bone:        #D6D0C8;   /* Body text on green/brown backgrounds */
  --color-cream:       #F5F2EA;   /* Headings on dark backgrounds */

  /* ── Signal Tonal Variants ── */
  --color-yellow-deep: #E8D94F;
  --color-blue-deep:   #6FA8B0;
  --color-green-light: #4A7472;
  --color-peach-light: #D4956E;   /* Use for peach text on dark at sizes < 18px */

  /* ── Glow / Radial tokens ── */
  --glow-yellow:       rgba(255, 239, 123, 0.08);
  --glow-blue:         rgba(151, 199, 205, 0.06);
  --glow-green:        rgba(58, 93, 91, 0.15);
  --glow-peach:        rgba(193, 126, 89, 0.10);

  /* ── Radii ── */
  --radius-button:     4px;
  --radius-badge:      2px;
  --radius-card:       4px;
  --radius-card-lg:    6px;

  /* ── Typography ── */
  --font-editorial:    'PP Editorial New', Georgia, serif;
  --font-body:         'Inter', -apple-system, sans-serif;
  --font-mono:         'Azeret Mono', 'DM Mono', 'Courier New', monospace;
}
```

### CRITICAL — Contrast Rules

These are non-negotiable. Every text/background pairing must pass WCAG AA (4.5:1 for body, 3:1 for large 18px+).

**On dark backgrounds (void, ink, soot):**
| Text Color | Token | Ratio | Use For |
|---|---|---|---|
| Cream #F5F2EA | `--color-cream` | 18.3:1 ✅ | Headings, large display text |
| Yellow #FFEF7B | `--color-yellow` | 15.1:1 ✅ | PP Editorial italic accent, eyebrows |
| Blue #97C7CD | `--color-blue` | 9.4:1 ✅ | Eyebrows, tags, accent labels |
| **Fog #A8A29E** | **`--color-fog`** | **7.2:1 ✅** | **ALL body text on dark** |
| Peach #C17E59 | `--color-peach` | 4.8:1 ⚠️ | 18px+ only. Use `--color-peach-light` for smaller |
| Ash #6B6560 | `--color-ash` | 4.5:1 ⚠️ | **NEVER for body on dark.** Decorative/large only |
| Brown #937E67 | `--color-brown` | 3.8:1 ❌ | **BANNED on dark backgrounds** |
| Green #3A5D5B | `--color-green` | 2.8:1 ❌ | **BANNED as text on dark.** Use as backgrounds only |

**On light backgrounds (tan, paper):**
| Text Color | Token | Ratio | Use For |
|---|---|---|---|
| Void #050505 | `--color-void` | 18.8:1 ✅ | Headings |
| Green #3A5D5B | `--color-green` | 5.8:1 ✅ | Eyebrows, accent text, italic accent, buttons |
| Ash #6B6560 | `--color-ash` | 4.1:1 ⚠️ | Body text at 15px+ with font-weight: 500 |
| Brown #937E67 | `--color-brown` | 3.2:1 ❌ | **BANNED as text on tan.** Use Green instead |
| Yellow #FFEF7B | `--color-yellow` | 1.3:1 ❌ | **INVISIBLE on tan. Never pair these.** |

**On colored backgrounds:**
| Background | Heading | Accent (italic) | Body | Eyebrow | Button |
|---|---|---|---|---|---|
| Green `#3A5D5B` | Tan `#FBF9ED` (5.8:1) | Yellow `#FFEF7B` (7.8:1) | Bone `#D6D0C8` (5.0:1) | Yellow | Yellow bg |
| Yellow `#FFEF7B` | Void `#050505` (15.1:1) | Green `#3A5D5B` (5.2:1) | Void 60% | Green | Void bg |
| Blue `#97C7CD` | Void `#050505` (9.4:1) | Green `#3A5D5B` (3.3:1 large) | Void 55% | Void wt 500 | Void bg |
| Peach `#C17E59` | Void `#050505` (5.2:1 — 24px+) | `#3A2010` | Void 55% | Void wt 500 | Void bg |
| Brown `#937E67` | Tan `#FBF9ED` (large) | Yellow `#FFEF7B` (5.5:1) | Cream `#F5F2EA` wt 400 | Yellow | Yellow bg |

---

## Typography

| Role | Font | Token | Notes |
|------|------|-------|-------|
| Display headings | PP Editorial New | `--font-editorial` | Self-hosted. **Italic = always `--color-yellow` on dark, `--color-green` on light.** No exceptions. |
| Body text | Inter | `--font-body` | Self-hosted variable. `--color-fog` on dark, `--color-ash` (wt 500, 15px+) on light. |
| Labels, meta, timestamps | Azeret Mono | `--font-mono` | 10–11px, uppercase, letter-spacing 0.15em–0.2em |

**Type scale (serif display):**
- Hero: clamp(48px, 7vw, 96px)
- Section title: clamp(28px, 3.5vw, 44px)
- Card heading: 16–28px
- Editorial break (full-width statement): clamp(36px, 5.5vw, 80px)

**Rule:** PP Editorial New italic at large scale should be used for "confidence moments" — full-width one-liners like *"103 episodes and counting."* that break the card rhythm. Use at least one per page.

All fonts are self-hosted in `assets/fonts-web/` and loaded via `@font-face` in `globals.css`.

---

## Buttons

- `border-radius: var(--radius-button)` (4px) on ALL buttons — never pill, never 0
- Primary: `--color-yellow` bg, `--color-void` text
- Green: `--color-green` bg, `--color-tan` text
- Blue: `--color-blue` bg, `--color-void` text
- Peach: `--color-peach` bg, `--color-void` text
- Outline: transparent bg, `1.5px solid rgba(245,242,237,0.15)`, `--color-cream` text
- Ghost: transparent bg, `border-bottom: 1px solid --color-stone`, `--color-fog` text
- On light sections: `--color-void` bg, `--color-cream` or section-color text
- Hover: `translateY(-1px)` + colored `box-shadow` glow matching button color

---

## Badge/Tag System

- `border-radius: var(--radius-badge)` (2px)
- Yellow glow: `rgba(255,239,123,0.10)` bg, `--color-yellow` text, `1px solid rgba(255,239,123,0.08)`
- Blue glow: `rgba(151,199,205,0.10)` bg, `--color-blue` text, `1px solid rgba(151,199,205,0.08)`
- Green glow: `rgba(58,93,91,0.15)` bg, `--color-green-light` text, `1px solid rgba(58,93,91,0.10)`
- Peach glow: `rgba(193,126,89,0.12)` bg, `--color-peach` text, `1px solid rgba(193,126,89,0.08)`
- Outline: transparent bg, `--color-ash` text, `1px solid --color-stone`
- Solid: `--color-soot` bg, `--color-fog` text
- Font: `--font-mono`, 9–10px, uppercase, letter-spacing 1.5px

---

## Section Background Recipes

Every section must declare its background using one of these recipes. **Never** leave a section as bare `--color-void` without intention.

### Recipe: Dark Default
**Use for:** Hero, proof sections, guest grids, editorial breaks
```
Background: --color-void
Heading:    --color-cream
Accent/Italic: --color-yellow
Body:       --color-fog  (NOT --color-ash)
Eyebrow:    --color-yellow
Box/Card:   --color-soot + 1px solid rgba(245,242,237,0.06)
Button:     --color-yellow bg
```

### Recipe: Dark + Blue Accent
**Use for:** Podcast sections, episode grids, show player
```
Background: --color-void
Heading:    --color-cream
Accent/Italic: --color-blue
Body:       --color-fog
Eyebrow:    --color-blue
Box/Card:   --color-green bg + Tan/Bone text inside
Button:     --color-blue bg, --color-void text
```

### Recipe: Tan (Paper)
**Use for:** Pillars, education hub, free learning, about sections, guest grids
```
Background: --color-tan (add paper texture SVG noise at 2.5% opacity)
Heading:    --color-void
Accent/Italic: --color-green
Body:       --color-ash (font-weight: 500 if under 16px)
Eyebrow:    --color-green
Box/Card:   #FFFFFF + 1px solid rgba(58,93,91,0.1) + subtle shadow
Button:     --color-green bg, --color-tan text
```

### Recipe: Green
**Use for:** Education features, trust sections, stat strips, schedule bars
```
Background: --color-green
Heading:    --color-tan
Accent/Italic: --color-yellow
Body:       --color-bone
Eyebrow:    --color-yellow
Box/Card:   rgba(0,0,0,0.25) + 1px solid rgba(251,249,237,0.08)
Button:     --color-yellow bg, --color-void text
```

### Recipe: Yellow (Statement)
**Use for:** Stat dividers, big quotes, highlight CTAs — use sparingly
```
Background: --color-yellow
Heading:    --color-void
Accent/Italic: --color-green
Body:       rgba(5,5,5,0.6)
Eyebrow:    --color-green
Box/Card:   rgba(0,0,0,0.08) + 1px solid rgba(0,0,0,0.06)
Button:     --color-void bg, --color-yellow text
```

### Recipe: Blue
**Use for:** Podcast features, show highlights, listen/platform sections
```
Background: --color-blue
Heading:    --color-void
Accent/Italic: --color-green (large text only, 3.3:1)
Body:       rgba(5,5,5,0.55)
Eyebrow:    --color-void (font-weight: 500)
Box/Card:   rgba(255,255,255,0.35) + 1px solid rgba(255,255,255,0.2)
Button:     --color-void bg, --color-blue text
```

### Recipe: Brown
**Use for:** About/origin story, why we exist, founder sections
```
Background: --color-brown
Heading:    --color-tan (large text only)
Accent/Italic: --color-yellow
Body:       --color-cream (font-weight: 400)
Eyebrow:    --color-yellow
Box/Card:   rgba(0,0,0,0.2) + 1px solid rgba(251,249,237,0.08)
Button:     --color-yellow bg, --color-void text
```

### Recipe: Peach (variant K — light text)
**Use for:** CTA sections, warm closers, contact sections
```
Background: --color-peach + radial-gradient(ellipse at 50% 100%, rgba(0,0,0,0.08), transparent 50%)
Heading:    --color-tan
Accent/Italic: --color-yellow
Body:       --color-tan at 70% opacity
Eyebrow:    --color-tan (font-weight: 500)
Button:     --color-tan bg, --color-void text
```

### CTA Section Options (approved — use any of these)
- **A** Yellow bg, Green accent, Void button
- **B** Green bg, Yellow accent, Yellow button
- **C** Tan paper bg, Green accent, Green button
- **D** Void + gold radial glow, Yellow accent, Yellow button
- **E** Void + ember (peach bottom glow), Peach accent, Peach button
- **F** Blue bg, Green accent, Void button
- **G** Brown bg, Yellow accent, Yellow button
- **H** Green card (border-radius 8px) floating on Void bg, Yellow accent
- **J** Dark card (border-radius 8px) floating on Tan bg, Yellow accent
- **K** Peach bg with light text (Tan), Yellow accent, Tan button

---

## Background Treatments

Flat color sections are not enough. Layer these atmospheric treatments to create cinematic depth. Define them as utility classes in `globals.css`.

```css
/* ── Radial Glow ── */
.bg-glow-gold    { background: radial-gradient(ellipse at 30% 80%, var(--glow-yellow), var(--color-void) 55%); }
.bg-glow-blue    { background: radial-gradient(ellipse at 80% 20%, var(--glow-blue), transparent 50%), var(--color-void); }
.bg-glow-peach   { background: radial-gradient(ellipse at 50% 80%, var(--glow-peach), var(--color-void) 55%); }

/* ── Ambient Orbs (use ::before + ::after pseudo-elements) ── */
/* Two blurred radial circles at opposite corners, filter: blur(40px+) */

/* ── Diagonal Gradient ── */
.bg-diagonal     { background: linear-gradient(135deg, var(--color-void) 0%, var(--color-soot) 50%, rgba(58,93,91,0.15) 100%); }

/* ── Edge Bleed (editorial accent bar) ── */
/* border-left: 3px solid var(--color-yellow) + linear-gradient bleed from left */

/* ── Warm Vignette ── */
.bg-vignette     { box-shadow: inset 0 0 160px rgba(193,126,89,0.06), inset 0 0 60px rgba(0,0,0,0.3); }

/* ── Horizon Line ── */
.bg-horizon      { background: linear-gradient(180deg, var(--color-void) 55%, rgba(151,199,205,0.06) 75%, rgba(255,239,123,0.04) 100%); }

/* ── Paper Texture (for Tan sections) ── */
.bg-paper-texture {
  background-image: url("data:image/svg+xml,...feTurbulence baseFrequency='0.65'...");
  /* SVG noise overlay at 2.5% opacity on --color-tan base */
}

/* ── Gradient Mesh ── */
.bg-mesh {
  background:
    radial-gradient(ellipse at 20% 20%, rgba(58,93,91,0.2) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(255,239,123,0.06) 0%, transparent 50%),
    var(--color-void);
}

/* ── Top Wash ── */
.bg-topwash      { background: linear-gradient(180deg, rgba(151,199,205,0.08) 0%, var(--color-void) 40%); }

/* ── Ember (warm bottom glow) ── */
.bg-ember        { background: linear-gradient(0deg, rgba(193,126,89,0.1) 0%, rgba(147,126,103,0.05) 35%, var(--color-void) 65%); }
```

**Mandatory global treatment:** Film grain overlay on every page via `body::after`:
```css
body::after {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.022;
  background-image: url("data:image/svg+xml,...feTurbulence baseFrequency='0.9' numOctaves='4'...");
  background-size: 200px;
}
```

---

## Image Treatment

Use images at their natural saturation and brightness. Do not apply global `.img-cinematic` or `.img-warm` filter classes — they make the site feel muted and strip personality out of thumbnails, product shots, and course posters.

**When filters ARE appropriate (case by case only):**
- Full-bleed hero backgrounds behind text overlays — drop brightness to 50–65% so text stays readable, usually via a gradient overlay on top rather than a filter on the image itself.
- Decorative background images where tone matters more than clarity.

**Rules:**
- Full-bleed images are preferred over small thumbnails whenever possible.
- When text overlays an image, use a gradient overlay (`linear-gradient(transparent → void)`) rather than filtering the image.
- Raw YouTube thumbnails, product shots, and partner logos should render at full color.

---

## Footer

- Layout: 4-column grid — brand info (1.8fr), Podcast links (1fr), Education links (1fr), Work With Us links (1fr)
- Brand column: BD mark (yellow, 4px radius) + "BAD DECISIONS STUDIO" in uppercase, tagline in `--color-ash`, location "Vancouver · Dubai" in `--font-mono`
- Link columns: `--font-mono` 10px uppercase headers in `--color-ash`, links in `--color-fog` (hover → `--color-cream`)
- Bottom: hairline border, copyright in `--font-mono` 10px `--color-stone`
- Social icons: 36x36px, `border-radius: 4px`, `rgba(255,255,255,.06)` bg
- Identical on every page. No variations.

---

## Navigation

**Desktop (64px height):**
- Logo left: BD mark (yellow square, 4px radius) + "BAD DECISIONS" in `--font-body` uppercase bold, `--color-yellow`
- Center: Watch (plain link), Learn (dropdown), Work With Us (dropdown)
- CTA right: "Learn AI →" yellow button
- Transparent on load, `rgba(5,5,5,0.8)` + `backdrop-filter: blur(24px)` on scroll
- Active page link: `--color-cream`. Others: `--color-fog`

**Education dropdown:** AI Programs, Unreal Engine, Free Learning
**Work With Us dropdown:** Services, Media Partnerships, Open Roles

**Mobile (below 768px):** Full-screen overlay, links in PP Editorial New at 26px, stagger animation.

---

## Motion & Animation

- Film grain: Always present (body::after)
- Scroll reveal: `.reveal` class with IntersectionObserver, `opacity: 0 → 1`, `translateY(20px → 0)`, 0.6s ease
- Hover lifts: `translateY(-1px)` on buttons, `translateY(-3px)` on cards
- Image hover: `scale(1.03–1.05)` + slight filter restore
- Hero content: staggered `fadeUp` animations with 0.15s delays between elements
- `prefers-reduced-motion` must disable all JS animations

**Philosophy:** Stillness is the default. Motion is earned. One well-orchestrated page load beats scattered micro-interactions.

---

## Podcast API

`/api/podcast.js` is a Vercel serverless function fetching the latest episodes from the YouTube Data API (channel `UCOQ6GGRyyu8S3jahnUz2zHw`). Optionally layered with **Upstash Redis** caching when `KV_REST_API_URL` and `KV_REST_API_TOKEN` are set — reduces YouTube API quota burn and cold-start latency.

**Cache strategy:**
- Redis key `bds:podcast:feed:v1` wrapped as `{ fetchedAt, payload }`
- Fresh window: **1 hour** (returns immediately with `X-Cache: HIT`)
- Stale window: **24 hours** (returns cached data immediately + kicks off background refresh, `X-Cache: STALE`)
- Cold cache: fetches live, caches, returns (`X-Cache: MISS`)
- Any failure: returns hardcoded `FALLBACK_EPISODES` with short edge cache (`X-Cache: FALLBACK`)
- Every failure mode degrades gracefully — the API never errors out

**Vercel edge cache:** `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400` for successful responses, `s-maxage=300` for fallback. Sits in front of Redis, so most requests never reach the function.

**Observability:** Responses include `X-Cache` and `X-Cache-Age` headers for debugging.

**Dynamic / static split:** Only the **top section of `/podcast`** is dynamic. The featured hero (`.pod-hero`) and recent episodes grid (`.pod-4grid .pod-showcase-card`) are updated at runtime from this API. The **8 guest cards** are static — thumbnails are downloaded once to `/assets/podcast/guests/*.jpg` and referenced as local files. Same for `/learn` free-series thumbnails in `/assets/learn/*.jpg`.

```json
{
  "totalEpisodes": 103,
  "episodes": [
    {
      "id": "xRx7yKg0n-U",
      "episodeNumber": 103,
      "title": "Episode Title",
      "description": "Cleaned plain text...",
      "date": "Apr 2026",
      "duration": "",
      "artworkUrl": "https://i.ytimg.com/vi/.../maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=...",
      "trackViewUrl": "https://www.youtube.com/watch?v=..."
    }
  ]
}
```

Do not modify the contract without updating both sides (`api/podcast.js` + `js/main.js:initPodcastData`).

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
| `YOUTUBE_API_KEY` | Optional | YouTube Data API key. Without it, the podcast API returns `FALLBACK_EPISODES`. |
| `KV_REST_API_URL` | Optional | Upstash Redis REST URL. Adds cache layer in front of YouTube. |
| `KV_REST_API_TOKEN` | Optional | Upstash Redis REST token. |

All three are optional. With none set, the podcast API still works (returns hardcoded fallback episodes with Vercel edge caching). With `YOUTUBE_API_KEY` only, the API fetches live but hits YouTube on every edge cache miss. With all three set, you get the full cache chain: Redis (fresh/stale) → YouTube → fallback.

---

## Deployment

```bash
npm install
npm run build
vercel deploy --prod
```

Vercel runs `npm run build` automatically via `vercel.json` `buildCommand`.

---

## CSS Naming Convention

**All class names use kebab-case with prefix-based namespacing.** No BEM `__element` / `--modifier` syntax, no camelCase, no snake_case. Section-specific classes are prefixed with the section's short identifier so styles are easy to grep:

| Prefix | Owner | Example |
|--------|-------|---------|
| `pod-*`  | `sections/podcast.html` and podcast partials | `.pod-hero`, `.pod-showcase-card`, `.pod-platforms` |
| `mp-*`   | `sections/work-with-us/media-partnerships.html` | `.mp-hero`, `.mp-platform-card`, `.mp-cta-grid` |
| `wwu-*`  | `sections/work-with-us.html` (hub) | `.wwu-card`, `.wwu-card-media` |
| `learn-*` | `sections/learn.html` | `.learn-row`, `.learn-card` |
| `pillar-*` | `sections/pillars.html` | `.pillar-panel`, `.pillar-panel-img` |
| `nl-*`   | `sections/newsletter.html` | `.nl-shell`, `.nl-submit` |
| `nav-*` / `site-nav` | `sections/nav.html` | `.nav-dropdown`, `.site-nav` |
| `find-us-*` | `sections/find-us.html` | `.find-us-bar` |
| `trust-logos__*` | `sections/_trust-logos.html` | `.trust-logos__grid`, `.trust-logos__cell` |

**Conventions:**
- Section prefix → child element: `parent-child` (e.g., `mp-platform-card`, `mp-platform-head`).
- Modifier on a child: append after another hyphen — `mp-platform-icon--show` is the only exception (true BEM modifier with `--`).
- Shared utility classes from `globals.css` are short and unprefixed: `.card`, `.label`, `.btn-primary`, `.bg-dark`, `.container`, `.reveal`.
- Avoid inventing new top-level prefixes for one-off elements. Reuse an existing prefix or use `globals.css` utilities.

When adding a new section partial, pick a 2–4 letter prefix and use it consistently for every class in that section.

---

## Brand Voice

- Premium, modern, clear, confident, minimal
- Not corporate, not vague, not overly startup-like
- The brand is "Bad Decisions Studio" — always full name or "BDS", never just "Bad Decisions"
- Feels like a serious company at the intersection of tech, AI, content, education, and execution
