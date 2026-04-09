# Bad Decisions Studio — Website Build Instructions for Claude Code

You are building the production website for **Bad Decisions Studio (BDS)**, a creative technology education and content brand run by brothers Faraz (Commander) and Farhad Shababi, operating across Vancouver and Dubai.

---

## Project Structure

```
bds-vercel/
├── CLAUDE.md              ← you are here
├── index.html             ← main site (single-page)
├── vercel.json            ← Vercel config + cache headers
├── api/
│   └── podcast.js         ← serverless function: fetches live podcast episodes
└── public/
    ├── favicon.ico
    ├── og-image.png        ← 1200×630 Open Graph image
    └── assets/
        ├── logo/
        │   ├── bd-logo.svg          ← primary BDS logo (SVG preferred)
        │   ├── bd-logo-dark.png     ← dark background version
        │   ├── bd-logo-light.png    ← light background version
        │   └── bd-mark.svg          ← just the "BD" mark / icon
        ├── founders/
        │   ├── faraz.jpg            ← Commander headshot (dark background, cinematic)
        │   └── farhad.jpg           ← Farhad headshot (dark background, cinematic)
        ├── clients/
        │   ├── epic-games.svg
        │   ├── dubai-police.svg
        │   ├── a2rl.svg
        │   ├── youtube.svg
        │   ├── snapchat.svg
        │   └── polycam.svg
        ├── platforms/
        │   ├── spotify.svg
        │   ├── apple-podcasts.svg
        │   ├── youtube.svg
        │   ├── instagram.svg
        │   ├── tiktok.svg
        │   ├── x.svg
        │   ├── linkedin.svg
        │   └── discord.svg
        └── one-mind/
            └── event-photos/        ← drop event photos here (jpg/webp)
```

---

## Your Tasks (in order)

### 1. Logo Integration
- Replace the CSS `BD` text mark in the nav (`div.nav-logo-mark`) with the actual SVG logo from `public/assets/logo/bd-mark.svg`
- Replace the footer logo the same way
- If `bd-logo.svg` exists, use it in full — otherwise compose: mark + wordmark text
- Logo should be white/light on dark background
- Max nav logo height: **32px**

### 2. Founder Photos
- In `#about` section, find the two `.founder-card` elements
- Replace the letter-avatar divs (`.founder-avatar`) with actual `<img>` tags pointing to `public/assets/founders/faraz.jpg` and `public/assets/founders/farhad.jpg`
- Style: `width: 64px; height: 64px; object-fit: cover; object-position: top;`
- If photos are larger/cinematic, increase to `80×80` or add a full founder photo section above the story text

### 3. Client & Partner Logos
- In `#about` → `.clients-grid`, replace the plain text cells with actual logo images
- Source from `public/assets/clients/`
- Each logo: max height `28px`, `filter: brightness(0) invert(0.4)` (muted), hover → `invert(1)` (full white)
- If an SVG is missing for a client, keep the text fallback

### 4. Platform/Social Icons
- In `#community` → `.socials-grid`, each `.social-card` currently shows text platform names
- Add the matching SVG icon from `public/assets/platforms/` above the platform name
- Icon size: `24px × 24px`, color: `#888888`, hover: `#C8A44A`
- In the footer `.footer-social-btn` elements — same treatment, icons instead of text abbreviations

### 5. One Mind Event Photos
- In `#one-mind` section, there is currently a quote block and stats
- If photos exist in `public/assets/one-mind/event-photos/`, add a photo strip between the grid and the testimonials:
  ```html
  <div class="event-photos-strip">
    <!-- 3–5 photos, horizontal scroll on mobile -->
  </div>
  ```
- Photos: `height: 320px`, `object-fit: cover`, aspect ratio preserved
- Add `loading="lazy"` to all images

### 6. Favicon + OG Meta
- Set `<link rel="icon" href="/favicon.ico">` in `<head>`
- Add Open Graph tags using `public/og-image.png`:
  ```html
  <meta property="og:title" content="Bad Decisions Studio" />
  <meta property="og:description" content="Creative technology education and content. Podcast. Courses. Events." />
  <meta property="og:image" content="/og-image.png" />
  <meta property="og:url" content="https://www.baddecisions.studio" />
  <meta property="twitter:card" content="summary_large_image" />
  ```

### 7. Hero Visual Enhancement
- The hero currently uses CSS geometric shapes as stand-ins for a cinematic render
- If a hero image/render exists at `public/assets/hero-render.jpg` or `.webp`, replace the `.hero-visual` CSS-only section with:
  ```html
  <img src="/assets/hero-render.jpg" class="hero-render-img" alt="" aria-hidden="true" loading="eager" />
  ```
  With CSS: `position: absolute; right: 0; top: 0; height: 100%; width: 55%; object-fit: cover; object-position: left; mask-image: linear-gradient(to right, transparent 0%, black 30%);`
- Keep the geometric shapes as a fallback if no image is present

### 8. Performance Pass
After all assets are in place:
- Add `width` and `height` attributes to all `<img>` tags to prevent layout shift
- Add `loading="lazy"` to all below-fold images
- Add `loading="eager"` + `fetchpriority="high"` to any hero image
- Verify all font imports are preconnected (already done for Google Fonts)
- Run a quick check that no image paths are broken (all resolve from `public/`)

---

## Design Rules — Do Not Break These

| Rule | Value |
|------|-------|
| Primary text | `#FBF9ED` (tan, never pure white) |
| Display font | PP Editorial New (italic = always #FFEF7B) |
| Body font | Inter |
| Mono font | Azeret Mono (eyebrow labels, metadata, timestamps) |
| Animations | Preserve all existing `.reveal` scroll animations |

**Never:**
- Use pure white (#fff) for heading text on dark backgrounds
- Use the same gray for body text on dark and light backgrounds
- Add drop shadows (use borders instead)

### Button System
- border-radius: 4px on ALL buttons — never pill/rounded, never 0px
- Primary: background `#FFEF7B`, color `#000`, font-weight 700
- Secondary: background transparent, border `1.5px solid rgba(255,255,255,.25)`, color `#fff`
- Teal action: background `#3A5D5B`, color `#fff`
- Peach action: background `#C17E59`, color `#fff`
- Light (on paper sections): background `#000`, color `#fff`
- Font: Inter, font-size 13px, letter-spacing .02em

### Section Background Rotation
Sections must NOT all be #000. Rotate through:
1. `#000000` — void (hero, podcast section)
2. `#FFEF7B` — yellow (stats band) → all text #000
3. `#3A5D5B` — teal (podcast grid, features)
4. `#FBF9ED` — paper/tan (courses, light inversion)
5. `#C17E59` — peach (CTA blocks, events)
Never use more than 2 accent colors in the same viewport.

### Typography Rules
- PP Editorial New italic = always color `#FFEF7B`, no exceptions
- Eyebrow labels = Azeret Mono, 11px, letter-spacing `.15em`, text-transform uppercase
- Stats numbers = PP Editorial New, large, bold
- Metadata/timestamps = Azeret Mono only

### Badge/Tag System
- border-radius: 2px (nearly square)
- Episode tag: background `#3A5D5B`, color `#97C7CD`
- New: background `#FFEF7B`, color `#000`
- Bestseller: background `#C17E59`, color `#fff`
- Free: border `1.5px solid #FFEF7B`, color `#FFEF7B`, background transparent
- Live: background `rgba(255,239,123,.1)`, color `#FFEF7B`, with 5px pulsing dot

### Footer
- Top: 6px colour bar split across 5 divs — `#FFEF7B`, `#3A5D5B`, `#97C7CD`, `#C17E59`, `#937E67`
- Social icons: 36x36px, border-radius 4px, background `rgba(255,255,255,.06)`
- Newsletter input: underline style only (border-bottom), no box border

---

## Brand Voice (for any copy edits)

- Confident, not boastful
- Direct, not corporate
- Technical, not jargon-heavy
- The brand is "Bad Decisions Studio" — always full name or "BDS", never just "Bad Decisions"
- Founders: Faraz Shababi (goes by Commander) and Farhad Shababi

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
Contact email:   create@baddecisions.studio
```

---

## Podcast API

`/api/podcast.js` is a Vercel serverless function. It fetches live episode data from the Apple Podcasts API (show ID: `1677462934`) and returns:

```json
{
  "totalEpisodes": 78,
  "episodes": [
    {
      "id": 123456,
      "episodeNumber": 78,
      "title": "Episode Title",
      "description": "Cleaned plain text description...",
      "date": "Mar 2025",
      "duration": "1h 12m",
      "artworkUrl": "https://...",
      "trackViewUrl": "https://podcasts.apple.com/..."
    }
  ]
}
```

The `index.html` calls this at `/api/podcast` on page load. Do not modify the API contract without updating both sides.

---

## Deploy Checklist

- [ ] All logo files placed in `public/assets/logo/`
- [ ] Founder photos placed in `public/assets/founders/`
- [ ] Client logos placed in `public/assets/clients/`
- [ ] Platform icons placed in `public/assets/platforms/`
- [ ] `public/favicon.ico` present
- [ ] `public/og-image.png` present (1200×630)
- [ ] No broken image paths
- [ ] `vercel.json` unchanged
- [ ] `api/podcast.js` unchanged unless intentional
- [ ] `vercel deploy` from project root

<!-- VERCEL BEST PRACTICES START -->
## Best practices for developing on Vercel

These defaults are optimized for AI coding agents (and humans) working on apps that deploy to Vercel.

- Treat Vercel Functions as stateless + ephemeral (no durable RAM/FS, no background daemons), use Blob or marketplace integrations for preserving state
- Edge Functions (standalone) are deprecated; prefer Vercel Functions
- Don't start new projects on Vercel KV/Postgres (both discontinued); use Marketplace Redis/Postgres instead
- Store secrets in Vercel Env Variables; not in git or `NEXT_PUBLIC_*`
- Provision Marketplace native integrations with `vercel integration add` (CI/agent-friendly)
- Sync env + project settings with `vercel env pull` / `vercel pull` when you need local/offline parity
- Use `waitUntil` for post-response work; avoid the deprecated Function `context` parameter
- Set Function regions near your primary data source; avoid cross-region DB/service roundtrips
- Tune Fluid Compute knobs (e.g., `maxDuration`, memory/CPU) for long I/O-heavy calls (LLMs, APIs)
- Use Runtime Cache for fast **regional** caching + tag invalidation (don't treat it as global KV)
- Use Cron Jobs for schedules; cron runs in UTC and triggers your production URL via HTTP GET
- Use Vercel Blob for uploads/media; Use Edge Config for small, globally-read config
- If Enable Deployment Protection is enabled, use a bypass secret to directly access them
- Add OpenTelemetry via `@vercel/otel` on Node; don't expect OTEL support on the Edge runtime
- Enable Web Analytics + Speed Insights early
- Use AI Gateway for model routing, set AI_GATEWAY_API_KEY, using a model string (e.g. 'anthropic/claude-sonnet-4.6'), Gateway is already default in AI SDK
  needed. Always curl https://ai-gateway.vercel.sh/v1/models first; never trust model IDs from memory
- For durable agent loops or untrusted code: use Workflow (pause/resume/state) + Sandbox; use Vercel MCP for secure infra access
<!-- VERCEL BEST PRACTICES END -->
