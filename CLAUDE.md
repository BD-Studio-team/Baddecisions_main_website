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
| Background | `#080808` |
| Card surface | `#111111` |
| Primary text | `#EBEBEB` |
| Gold accent | `#C8A44A` |
| Display font | Cormorant Garamond (Google Fonts, already loaded) |
| UI font | Syne (Google Fonts, already loaded) |
| Border style | `1px solid #202020` — never rounded, always sharp |
| Spacing unit | Grid of `2px` gaps between cards/cells — maintain this |
| All-caps | Only for `.label` and `.section-label` elements — nowhere else |
| Animations | Preserve all existing `.reveal` scroll animations |

**Never:**
- Add border-radius to cards, buttons, or the logo mark
- Use purple, blue, or any accent other than gold
- Use Inter, Roboto, or system-ui as a display font
- Add drop shadows (use borders instead)
- Break the 2px grid gap between cards

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
