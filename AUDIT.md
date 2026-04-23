# Bad Decisions Studio — Website Audit

**Date:** 2026-04-14
**Scope:** Full design, code, and performance review against CLAUDE.md spec
**Pages audited:** index, podcast, learn, work-with-us, services, media-partnerships, open-roles

---

## Executive Summary

The site is in **good shape overall** — design tokens are complete, the editorial cinematic direction is consistently applied, and the code is well-structured. The main pain points are:

1. **Secondary pages (podcast, learn, work-with-us, services, open-roles) lack background variety** — most use only `--color-void` for every section, violating the "3+ backgrounds per page" rule.
2. **Missing confidence moments** on every page except the homepage.
3. **Hero video is not preloaded** — this is likely hurting LCP on the homepage.
4. **No `loading="eager"` on above-fold images** on podcast and learn pages.
5. **`font-weight: 700` is used but no PP Editorial Bold @font-face is declared** → browser synthesizes bold, degrading quality.
6. **10 hardcoded color values in style.css**, 3 of which are outside the brand palette entirely (`.premium-card` AI purple, etc.).

Nothing is broken. Everything listed is a real improvement opportunity — none of these need emergency fixes.

---

## 1. Design Review — Page by Page

### Home (`/`)

**Section order** (from `templates/index.html`):
`nav → hero → pillars → editorial-break → find-us → highlights → podcast-landing → newsletter → about → footer`

| Check | Status | Notes |
|---|---|---|
| ≥3 distinct backgrounds | ✅ Pass | Void + gold glow (hero), void + radial mesh (pillars), void + grid glow (editorial-break), void (find-us), dark diagonal (highlights), ember gradient (podcast-landing), void + glow (newsletter), brown (about). **6+ distinct.** |
| Body text = `--color-fog` on dark | ✅ Pass | No instances of `--color-ash` used as body text on dark. |
| Italic = yellow on dark / green on light | ⚠️ 1 violation | `sections/about.html:8` — italic inside heading on **brown** background has `style="color: var(--color-tan)"`. Brown recipe requires italic = `--color-yellow`. |
| Stripe bar above footer | ✅ Pass (removed per spec update) | CLAUDE.md no longer requires stripe bar; footer is clean. |
| Film grain `body::after` | ✅ Pass | `globals.css:250-259`, opacity 0.022. |
| Images use `.img-cinematic` | ⚠️ 2 violations | `podcast-landing.html:8` iPhone shot has no filter class. `highlights.html:13,22,31` — all 3 videos have no cinematic class. |
| Confidence moment | ✅ Pass | `editorial-break.html` — "One ecosystem. Three paths. *Zero boring takes.*" in giant PP Editorial. |
| Adjacent sections differ | ✅ Pass | Every pair uses a distinct layout pattern. |
| Footer matches spec | ✅ Pass | 4-column grid, BD mark SVG, uppercase name, social row, hairline border, mono copyright. |
| Nav matches spec | ✅ Pass | BD logo SVG, fog links, yellow CTA, backdrop-blur on scroll. |

---

### Podcast (`/podcast`)

**Section order:** `nav → podcast.html → newsletter.html → footer`

| Check | Status | Notes |
|---|---|---|
| ≥3 distinct backgrounds | ❌ **FAIL** | Entire page is void + an inline glow on the newsletter shell. Podcast section, guest section, and main page all share bare void. **1 distinct background.** |
| Body text = `--color-fog` on dark | ✅ Pass | |
| Italic = yellow on dark | ⚠️ Needs verify | `podcast.html:8` has `heading-section` with no italic text, OK. No italic accent in this page — might be a missed opportunity. |
| Film grain | ✅ Pass | |
| Images use `.img-cinematic` | ⚠️ Likely missing | `podcast.html:16` pod-hero-bg image, all `.pod-showcase-card` thumbnails, all `.pod-guest-card-v2` thumbnails — need to check if `.pod-hero-bg` and card rules apply a cinematic filter in CSS. If not, flag. |
| Confidence moment | ❌ **MISSING** | No large standalone italic statement anywhere on the page. The `heading-section` "A practical guide to modern tech, AI, and business." is plain (no italic accent). |
| Adjacent sections differ | ✅ Pass | Featured episode → 4-grid → listen row → guests header → guests grid → newsletter — all distinct patterns. |
| Footer / Nav match spec | ✅ Pass | |

---

### Learn (`/learn`)

**Section order:** `nav → learn.html → footer` (no newsletter)

| Check | Status | Notes |
|---|---|---|
| ≥3 distinct backgrounds | ❌ **FAIL** | `learn.html:3` `.learn-premium-section` uses `var(--color-void)`, `.learn-free-section` uses `var(--color-green)`. **Only 2 distinct.** Spec wants 3+. |
| Body text on dark | ✅ Pass | |
| Italic accents | ⚠️ Needs verify | `learn.html:8` "Learn to build *extraordinary* things." on void — should be yellow. `learn.html:66` "Start with the series *everyone shares.*" on green — should be yellow. Both use `heading-section em` which cascades from `globals.css:432` to `--color-yellow` globally, so they're **likely correct**. |
| Film grain | ✅ Pass | |
| Images | ⚠️ Needs verify | `.premium-card` video + overlay — need to verify the overlay gradient is in place and video has cinematic filter. `.learn-card-thumb img` — verify CSS applies a filter. |
| Confidence moment | ❌ **MISSING** | No standalone editorial break. Only section headers. |
| Footer / Nav | ✅ Pass | |
| No newsletter section | ⚠️ Inconsistent | Podcast page has newsletter, learn page doesn't. Either add it here or remove it from podcast for consistency. |

---

### Work With Us (`/work-with-us`)

**Section order:** `nav → work-with-us.html → footer`

| Check | Status | Notes |
|---|---|---|
| ≥3 distinct backgrounds | ❌ **FAIL** | Entire `.workhub-page` uses one radial-gradient background (`style.css:3407`). The two `.wwu-card` blocks have videos behind them but the section base is a single void/gradient. **1 distinct background section.** |
| Body text on dark | ✅ Pass | Cards use `--color-fog` for `.wwu-card-copy`. |
| Italic accents | ✅ Pass | `wwu-card-title em` uses `--color-cream` (cream italic, not the usual yellow — this is intentional for the card title style per my own redesign). Hero `workhub-hero-title em` "*Bad Decisions*" cascades to `--color-yellow`. |
| Film grain | ✅ Pass | |
| Images | ✅ Pass | `.wwu-card-video` has `filter: saturate(0.4) brightness(0.5) contrast(1.1)` inline in `style.css`. |
| Confidence moment | ❌ **MISSING** | No standalone editorial break. The hero title is bold but inside a centered container, not a full-width rhythm-breaking moment. |
| Adjacent sections differ | ✅ Pass | Hero → 2 cards → roles strip. |
| Footer / Nav | ✅ Pass | |

---

### Services (`/work-with-us/services`)

**Section order:** `nav → services.html → footer`

| Check | Status | Notes |
|---|---|---|
| ≥3 distinct backgrounds | ❌ **FAIL** | Single `section.section-padded-sm` on `.page-main` void. All subsections (header, service grid, sponsor logos, final CTA) share the same void background. **1 distinct background.** |
| Body text on dark | ✅ Pass | |
| Italic accents | ⚠️ Needs verify | `services.html:7` "Services built for brands that want to *stay ahead*." and `services.html:72` "Let's talk about what *you need*." — both cascade to yellow via global rule. Likely correct. |
| Film grain | ✅ Pass | |
| Images | ✅ Pass | `.sponsors-logo-cell img` has brightness/invert treatment. |
| Confidence moment | ❌ **MISSING** | |
| Footer / Nav | ✅ Pass | |
| Inline spacing styles | 🟡 Cleanup | `services.html:47,48,71` use `style="margin-top: 80px"`, `style="margin-bottom: 48px"`, `style="padding: 80px 0 0"` — should be utility classes. |

---

### Media Partnerships (`/work-with-us/media-partnerships`)

**Section order:** `nav → media-partnerships.html (8 subsections) → footer`

| Check | Status | Notes |
|---|---|---|
| ≥3 distinct backgrounds | ✅ **Pass (best page)** | mp-hero (yellow), mp-color-stripe, mp-why (black), mp-platforms (void), mp-audience (green), mp-formats (tan/paper), mp-partners (black), mp-cta (green). **6+ distinct.** |
| Body text | ✅ Pass | Uses rgba overlays instead of `--color-ash`; contrast is acceptable. |
| Italic accents | ✅ Pass | Inline CSS on lines 314, 316, 425: `.mp-h1 em { color: #3A5D5B }` on yellow bg (= green italic, correct), `.mp-h2 em { color: #FFEF7B }` on dark (= yellow italic, correct). |
| Film grain | ✅ Pass | |
| Images | ✅ Pass | Partner/sponsor logos exempt from filter. |
| Confidence moment | ✅ Pass (distributed) | Multiple italic accents throughout; not one standalone moment, but strong enough. |
| Inline platform icon backgrounds | 🟡 Cleanup | Lines 74, 98, 115 use `style="background: rgba(...)"` — could move to CSS classes. |
| Footer / Nav | ✅ Pass | |
| 5-color stripe bar | 🟡 Note | `mp-color-stripe` is decorative and only on this page. Fine as-is. |
| Hardcoded colors | 🟡 Fix | `media-partnerships.html:314` onward uses hex values like `#FFEF7B`, `#3A5D5B` directly in the inline `<style>` block instead of CSS vars. Works because of exact value match, but should use `var(--color-yellow)` etc for consistency. |

---

### Open Roles (`/work-with-us/open-roles`)

**Section order:** `nav → open-roles.html → footer`

| Check | Status | Notes |
|---|---|---|
| ≥3 distinct backgrounds | ❌ **FAIL** | Single void section. **1 distinct background.** |
| Body text | ✅ Pass | |
| Italic accents | ⚠️ Needs verify | `open-roles.html:7` "Open *Roles*" and line 57 "*Reach out anyway.*" — cascade to yellow via global rule. Likely correct. |
| Film grain | ✅ Pass | |
| Images | ✅ Pass (none in section) | |
| Confidence moment | ❌ **MISSING** | |
| Footer / Nav | ✅ Pass | |

---

### Design Review Summary

| Issue | Pages affected | Severity |
|---|---|---|
| Fewer than 3 backgrounds | podcast, learn, work-with-us, services, open-roles | 🟡 Important |
| Missing confidence moment | podcast, learn, work-with-us, services, open-roles | 🟡 Important |
| `about.html` italic uses `--color-tan` instead of `--color-yellow` on brown | index (about section) | 🟡 Important |
| Raw images without `.img-cinematic` | podcast-landing iPhone, 3× highlights videos | 🟡 Important |
| Newsletter on podcast but not learn | inconsistency | 🟢 Nice to have |

---

## 2. Code Review

### `css/globals.css`

**File size:** ~34 KB, clean structure.

| Check | Result |
|---|---|
| Brand palette tokens | ✅ 6/7 present |
| `--color-black` token | ❌ **MISSING** — spec says `#000000`, not declared in `:root` |
| Neutral scale (void→cream) | ✅ All 9 present |
| Tonal variants | ✅ All 4 present |
| Glow tokens | ✅ All 4 present |
| Radius tokens | ✅ All 4 present |
| Font tokens | ✅ All 3 present |
| `.bg-glow-gold/blue/peach` | ✅ Present (globals.css:891-899) |
| `.bg-diagonal` | ✅ Present (:902) |
| `.bg-vignette` | ✅ Present (:907) |
| `.bg-horizon` | ✅ Present (:912) |
| `.bg-ember` | ✅ Present (:917) |
| `.bg-mesh` | ✅ Present (:922) |
| `.bg-topwash` | ✅ Present (:930) |
| `.bg-paper-texture` | ✅ Present (:935) |
| `.img-cinematic` + `.img-warm` with hover states | ✅ Present (:942-959) |
| Film grain `body::after` | ✅ Present (:250-259) |
| `.reveal` scroll animation | ✅ Present (:764-770), with `prefers-reduced-motion` disable (:1079-1094) |
| Duplicate class definitions | ✅ None found |
| Dead tokens | ✅ None — all aliases are referenced in `style.css` (`--gold`, `--bg`, `--tan`, etc.) |

**Minor hardcoded values in `globals.css`:**
- Line 494: `.btn-primary:hover` box-shadow uses `rgba(0,0,0,0.3)` (overlay, acceptable)
- Line 838: focus ring uses `rgba(255, 239, 123, 0.14)` (could be a `--focus-ring` token)

**Verdict:** 95% compliant. Only action item is adding `--color-black: #000000;`.

---

### `css/style.css`

**File size:** ~113 KB, ~4,150 lines.

#### Hardcoded colors

| Line | Selector | Value | Severity | Recommended fix |
|---|---|---|---|---|
| 1501 | `.course-render` gradient | `#0a0a0a, #151515` | 🔴 High | Replace with `var(--color-void)` / `var(--color-soot)` |
| 2066 | `.tool-status.live` | `#4ac864` | 🔴 High | **Not in palette.** Use `var(--color-green-light)` or define a `--color-live` token |
| 2221 | `.newsletter-btn` | `color: #000` | 🟡 Medium | → `var(--color-void)` |
| 2679 | `.learn-card-play` | `color: white` | 🟡 Medium | → `var(--color-cream)` |
| 2760 | `.premium-card-ue` | `background: #13110d` | 🔴 High | Not in palette. Use `var(--color-ink)` |
| 2764 | `.premium-card-ai` gradient | `#12101a, #0a0810, #111` | 🔴 High | **Purple-tinted, outside palette entirely.** Replace with `var(--color-soot)` / `var(--color-void)` or define AI-specific accent |
| 2793 | `.premium-card-ai-icon` | `color: #a78bfa` | 🔴 High | **Purple, not in palette.** Decide: add AI accent token or use `var(--color-blue)` |
| 2842 | `.premium-card-ue .label` | `color: #000` | 🟡 Medium | → `var(--color-void)` |
| 2849 | `.premium-card-ai .label` | `background: #a78bfa` | 🔴 High | Same purple issue |
| 3526 | `.interview-card-play` | `color: white` | 🟡 Medium | → `var(--color-cream)` |

**3 critical values are off-palette purple (`#a78bfa` + related).** Decision needed: either officially add an "AI program accent" color to the palette, or replace with an existing brand color.

#### `!important` declarations

| Line | Selector | Property | Purpose | Removable? |
|---|---|---|---|---|
| 926 | `.nl-form [hidden]` | `display: none !important` | Override form success/error visibility | Yes — can remove `!important` if the base `.nl-success { display: none }` has higher specificity than `hidden` attribute. Already does. Safe to remove. |
| 4100 | `.sponsor-strip-item img` | `height: 32px !important; max-width: 100px !important` | Override responsive image sizing | Maybe — check if any other `.sponsor-strip-item img` rule elsewhere is getting overridden. |

**Only 2 `!important` in the whole file. Very clean.**

#### Responsive breakpoints

| Breakpoint | Used | Notes |
|---|---|---|
| 480px | 1-2× | Small mobile |
| 560px | 1-2× | **Too close to 640px** |
| 640px | 1-2× | Tablet/mobile transition |
| 768px | Multiple | Standard tablet |
| 900px | 1-2× | Tablet-to-desktop |
| 1024px | Multiple | Small desktop |
| 1180px | 1× | **Unusual — should be 1200px** |
| 2000px | 1× | 4K+ |
| 2560px | 1× | 5K+ |

**Action:** Merge `560px` into `640px`. Standardize `1180px` → `1200px`.

#### Duplicate/overlapping media queries

No exact duplicates, but several `@media (max-width: 1024px)` and `@media (max-width: 768px)` blocks are scattered through the file. Could be consolidated at the bottom of style.css for easier maintenance, but not blocking.

#### Vendor prefixes

Only `-webkit-` prefixes, all legitimate:
- `-webkit-backdrop-filter` (nav) — Safari still needs
- `-webkit-mask-image` (editorial-break grid mask) — Safari still needs
- `-webkit-box-shadow`, `-webkit-text-fill-color` (newsletter autofill) — required for autofill styling
- `-webkit-text-stroke` (marquee highlight) — decorative, could add a `text-shadow` fallback
- `::-webkit-scrollbar` — necessary for styled scrollbars

No dead prefixes to remove.

#### Dead CSS

| Class | CSS? | HTML? | Verdict |
|---|---|---|---|
| `.pillar-card`, `.pillar-card-image`, `.pillar-card-overlay` | ❌ | ❌ | Already removed, clean |
| `.pillar-card-content` | ✅ Line 4128 (mobile-only) | ❌ | 🟡 **Dead rule** — remove |
| `.pillar-number-mark*` | ❌ | ❌ | Clean |
| `.hero-split`, `.hero-video-wrap`, `.hero-rotating` | ❌ | ❌ | Clean |
| `.stripe-bar` | ❌ | ❌ | Clean |
| `.site-header`, `.nav-mobile-toggle`, `.nav-links` | ❌ | ❌ | Clean |
| `.workhub-path-card`, `.workhub-path-grid` | ✅ | ✅ | Active |
| `.stats-section`, `.stats-grid`, `.stat-number`, `.stat-label` | ✅ | ⚠️ In `sections/stats.html` but **stats.html is NOT included in the index template** (removed earlier) | 🟡 **Section file is dead**, but CSS rules are shared with other stat uses — investigate before deleting |
| `.newsletter-section`, `.newsletter-title`, `.newsletter-form`, `.newsletter-btn`, `.newsletter-input` | ✅ Lines 1369-1434 | ❌ (the new `.newsletter` / `.nl-*` is different) | 🔴 **Dead CSS** — legacy from an old newsletter implementation |

---

### `js/main.js`

| Check | Status | Notes |
|---|---|---|
| IntersectionObserver `unobserve` cleanup | ✅ Pass | Line 28 (`initReveal`) and line 117 (`initLazyVideos`) both unobserve. |
| Scroll listener `passive: true` | ✅ Pass | Line 12 (nav scroll). |
| Podcast API error handling | ✅ Pass | `.catch()` on line 194, logs warning, page renders without dynamic data. |
| `console.*` in production | ⚠️ 1 `console.warn` | Line 194 — non-critical, acceptable. |
| Dead functions | ✅ Pass | All 10 init functions called from `initBDS()`. |
| `prefers-reduced-motion` | ✅ Pass | Checked in 6 functions (reveal, hero rotation, managed videos, video cycling, lazy videos, staggered reveal). |
| Scroll handler throttled? | ✅ Pass | Only one scroll listener, O(1) classList toggle, passive. |
| Memory leaks | ⚠️ Minor | `setInterval` on line 59 (hero word rotation) — ID not stored, runs forever. Not an issue on static pages but would leak if embedded in SPA. |
| Querying | ✅ Pass | ~17 querySelector calls, all at init. |
| Word rotation cleanup | 🟡 Could improve | Store interval ID for future SPA support. |

**Verdict:** Production-ready. Only improvement is storing the setInterval ID.

---

### `api/podcast.js`

| Check | Status | Notes |
|---|---|---|
| try/catch on async fetches | ✅ Pass | Handler wraps all calls (lines 156-164). |
| Cache TTL strategy | ✅ Pass | Success = 1h edge cache + 24h stale-while-revalidate. Error = 5min edge + 1h SWR. |
| Fallback when API unavailable | ✅ Pass | Returns hardcoded `fallbackPayload()` on any failure (lines 8-39). |
| Description sanitization | ✅ Pass | `cleanDescription()` lines 49-55: collapses newlines, trims, slices to 300 chars. |
| Hardcoded secrets | ✅ Pass | Uses `process.env.YOUTUBE_API_KEY`, no secrets in code. |
| Response headers | ✅ Pass | Cache-Control set, JSON content-type auto. |
| Upstash Redis caching | ❌ **NOT IMPLEMENTED** | `@upstash/redis` is in package.json deps but **never imported or used** in `podcast.js`. Every request hits YouTube API directly. |

**Verdict:** Works well, but the Redis dependency is unused — either delete from package.json or actually implement caching. Direct YouTube API calls without cache risks quota burn on traffic spikes.

---

### `build.js`

| Check | Status | Notes |
|---|---|---|
| Handles nested subdirectory templates | ✅ Pass | `findTemplates()` is recursive (lines 57-71). |
| Missing section handling | ⚠️ Silent warn | Line 33: logs warning but continues with HTML comment placeholder. Should probably `throw` instead. |
| `globals.css` injection order | ✅ Pass | globals.css injected before style.css via regex replace (line 47). |
| Hardcoded paths | ✅ Pass | Uses `__dirname` and `path.join()`. |

**Verdict:** Solid. One minor improvement: fail loud on missing includes instead of silently placeholdering.

---

### `vercel.json`

| Check | Status | Notes |
|---|---|---|
| `buildCommand` | ✅ Pass | `npm run build` |
| Asset cache (fonts, SVG, video) | ✅ Pass | `/assets/(.*)` → `max-age=31536000, immutable` |
| HTML cache headers | ❌ **MISSING** | No rule for `*.html`. Browser/CDN default takes over. |
| `/css/*` and `/js/*` cache | ❌ **MISSING** | No specific rules. Would fall into generic `(.*)` rule with no cache-control. |
| X-Frame-Options | ✅ Pass | `SAMEORIGIN` |
| X-Content-Type-Options | ✅ Pass | `nosniff` |
| Referrer-Policy | ✅ Pass | `strict-origin-when-cross-origin` |
| Permissions-Policy | ✅ Pass | Denies camera, microphone, geolocation |
| Strict-Transport-Security | ✅ Pass | 2-year HSTS, includeSubDomains, preload |
| **Content-Security-Policy** | ❌ **MISSING** | No CSP header set. |
| Redirects | ✅ Pass | `/careers → /work-with-us` permanent. |
| `/api/*` cache | ✅ Pass | `s-maxage=3600, stale-while-revalidate=86400` |

**Action:** Add CSP, add explicit HTML cache rule (short/revalidate), add CSS/JS cache rule (long/immutable).

---

## 3. Performance Audit

### Font loading

**Files in `assets/fonts-web/`:**

| Font | Size | Preloaded? | Used? |
|---|---|---|---|
| pp-editorial-ultralight.woff2 | 34 KB | ✅ | ✅ |
| pp-editorial-ultralight-italic.woff2 | 36 KB | ✅ | ✅ |
| pp-editorial-regular.woff2 | 34 KB | ❌ | ✅ |
| pp-editorial-italic.woff2 | 36 KB | ❌ | ✅ |
| inter-var.woff2 | 134 KB | ✅ | ✅ |
| inter-var-italic.woff2 | 148 KB | ❌ | ✅ |
| azeret-mono-var.woff2 | 34 KB | ✅ | ✅ |
| azeret-mono-var-italic.woff2 | 38 KB | ❌ | ✅ |

**Total on disk:** 494 KB. **Preloaded:** 236 KB. **Over network (gzip):** ~150 KB.

**Issues:**

1. 🟡 `font-weight: 700` is used in `style.css` (lines 484, 506, 528, 546, 564 in `btn-*` rules) but **no PP Editorial Bold @font-face is declared.** The browser synthesizes bold from the 400 weight → degraded rendering. Either add a bold variant or change those buttons to Inter (they probably should be Inter anyway).
2. 🟢 Italic font variants (4 files, 256 KB) aren't preloaded but are used heavily. Consider preloading `pp-editorial-regular.woff2` and `inter-var-italic.woff2`.
3. ✅ All `@font-face` rules use `font-display: swap`.

### Images & videos

#### Hero (above the fold — LCP candidate)

| Asset | Size | Preloaded? | Issue |
|---|---|---|---|
| `/assets/video/hero-video.webm` | 2.7 MB | ❌ | 🔴 LCP-blocking. Should have `<link rel="preload" as="video">` OR a poster image preload |
| `/assets/video/hero-video.mp4` | 2.0 MB | ❌ | Same |
| `/assets/podcast/ep79.jpg` (poster) | **2.1 MB** | ❌ | 🔴 **Poster is larger than the videos!** Needs a downscaled thumbnail. |

#### Section videos (below the fold)

| Asset | Size | Lazy | Has `.img-cinematic` |
|---|---|---|---|
| `/assets/video/podcast-reel.mp4` | 881 KB | ✅ | In highlights: ❌. In pillars: ✅ (via CSS) |
| `/assets/video/education-reel.mp4` | 1.2 MB | ✅ | Same |
| `/assets/video/epic-featured.mp4` | 836 KB | ✅ | Same (highlights: ❌) |
| `/assets/video/before.mp4`, `after.mp4` | 606 KB, 675 KB | ✅ | About: ✅ |
| `/assets/video/ue-*.mp4` | 1.1–1.4 MB each | ✅ (carousel) | |
| `/assets/video/onemind-reel.mp4` | 889 KB | ✅ | |

#### Podcast & learn page thumbnails (YouTube CDN)

| Page | Above fold | Current `loading` | Needs |
|---|---|---|---|
| Podcast hero `xRx7yKg0n-U` | ✅ Yes | `lazy` | 🟡 Change to `eager` |
| Podcast 4-grid (first 2 cards) | Likely yes | `lazy` | 🟡 Change to `eager` or use fetchpriority |
| Learn hero | ✅ Yes | `lazy` | 🟡 Change to `eager` |
| Learn free-series grid | No | `lazy` | ✅ Correct |

#### Explicit width/height

**None** of the YouTube thumbnails (`<img src="https://i.ytimg.com/..."/>`) have `width`/`height` attributes. This causes **Cumulative Layout Shift** as images load. All YouTube maxresdefault images are 1280×720 — easy fix.

### External resources

**Domains referenced:**
- `i.ytimg.com` — 22+ image requests
- `r14hngokr8soy7ms.public.blob.vercel-storage.com` — 1 video (pillars Services card + work-with-us Services card)
- `open.spotify.com`, `podcasts.apple.com` — outbound links only (no resources)
- `ai.baddecisions.studio`, `learn.baddecisions.studio`, `academy.baddecisions.studio` — outbound links

**No `<link rel="preconnect">` anywhere.** Every page that uses YouTube thumbnails pays DNS + TLS setup on first image.

**Fix:** Add to `templates/index.html`, `podcast.html`, `learn.html`:
```html
<link rel="preconnect" href="https://i.ytimg.com" crossorigin>
<link rel="preconnect" href="https://r14hngokr8soy7ms.public.blob.vercel-storage.com" crossorigin>
```

### CSS/JS delivery

| Resource | Strategy | Size | Blocking |
|---|---|---|---|
| `globals.css` | `<link rel="stylesheet">` | 34 KB | Yes |
| `style.css` | `<link rel="stylesheet">` | 113 KB | Yes |
| `main.js` | `<script src>` at end of `<body>` | ~9 KB | No |

**Total CSS: ~147 KB uncompressed → ~40-45 KB gzipped.** Reasonable, but could be optimized with critical-CSS inlining for the hero viewport.

`main.js` is correctly placed at end of body so it doesn't block parsing. No `defer` needed but could be added for consistency.

### Podcast API caching

- **Vercel edge cache:** 1h (`s-maxage=3600`) + 24h SWR (success path)
- **Upstash Redis:** **Not implemented** despite being in `package.json`
- **Fallback on failure:** 5min edge cache + 1h SWR

Edge cache is solid. Redis would help if you want cross-region cache warmth, but edge cache covers most use cases.

---

## 4. Quick Wins

### 🔴 Critical — fix first

| # | Issue | Files | Fix effort |
|---|---|---|---|
| C1 | **Hero video not preloaded** → LCP suffering | `templates/index.html` | 2 min — add `<link rel="preload" as="video">` |
| C2 | **Hero poster image is 2.1 MB** (larger than the video) | `sections/hero.html` + create new thumb | 5 min — replace with a 50-150 KB JPEG/WebP |
| C3 | **`font-weight: 700` used without bold @font-face** → synthetic bold | `css/style.css` multiple btn rules | 3 min — either add bold font file or switch to Inter 700 |
| C4 | **3 hardcoded purple colors** in `.premium-card-ai-*` | `css/style.css:2764, 2793, 2849` | 5 min — decide on palette color or add AI accent token |
| C5 | **Missing CSP header** | `vercel.json` | 3 min — add CSP rule |

### 🟡 Important — do soon

| # | Issue | Files | Fix effort |
|---|---|---|---|
| I1 | Podcast/learn/wwu/services/open-roles pages have only 1 background color | All 5 subpage sections | 15 min each — add atmospheric background classes (`bg-diagonal`, `bg-glow-*`, `bg-mesh`, etc.) to subsections |
| I2 | Missing confidence moment on podcast, learn, work-with-us, services, open-roles | 5 section files | 5 min each — add one large `<em>` italic statement per page |
| I3 | `about.html:8` italic on brown uses `--color-tan` instead of `--color-yellow` | `sections/about.html` | 30 sec — delete inline style |
| I4 | Podcast landing iPhone image + 3 highlights videos missing `.img-cinematic` | `sections/podcast-landing.html`, `sections/highlights.html` | 2 min — add class |
| I5 | YouTube thumbnails missing `width="1280" height="720"` → CLS | `sections/podcast.html`, `sections/learn.html` | 5 min |
| I6 | Above-fold YouTube thumbnails use `loading="lazy"` | `sections/podcast.html`, `sections/learn.html` | 2 min — change to `eager` |
| I7 | No `<link rel="preconnect">` to `i.ytimg.com` | `templates/*.html` | 3 min |
| I8 | `vercel.json` missing HTML cache and CSS/JS cache rules | `vercel.json` | 3 min |
| I9 | Missing `--color-black` token in globals.css | `css/globals.css` | 30 sec |
| I10 | 10 hardcoded colors in `style.css` (non-AI-card ones) | `css/style.css` | 10 min bulk replace |
| I11 | Dead `.newsletter-section` CSS (lines 1369-1434) | `css/style.css` | 2 min delete |
| I12 | Dead `.pillar-card-content` rule at line 4128 | `css/style.css` | 30 sec delete |
| I13 | `sections/stats.html` is no longer included anywhere | `sections/stats.html` | Delete file OR re-add to template |
| I14 | Inline spacing styles in `services.html:47,48,71` | `sections/work-with-us/services.html` | 2 min — move to CSS |
| I15 | `api/podcast.js` imports `@upstash/redis` in deps but never uses it | `package.json` or `api/podcast.js` | Decide: remove dep or wire it up |

### 🟢 Nice to have — backlog

| # | Issue | Effort |
|---|---|---|
| N1 | Merge `560px` and `640px` breakpoints into `640px` | 10 min across style.css |
| N2 | Standardize `1180px` → `1200px` breakpoint | 1 min |
| N3 | Store hero rotation `setInterval` ID for future SPA support | 2 min in main.js |
| N4 | Preload italic font variants (pp-editorial-italic, inter-var-italic) | 2 min in templates |
| N5 | Remove 2 `!important` declarations by specificity | 5 min |
| N6 | Fail loud on missing template includes in `build.js` | 2 min |
| N7 | Add `-webkit-text-stroke` fallback for `.marquee-item.highlight` | 2 min |
| N8 | Inline critical CSS (first ~14 KB) for faster first paint | 30 min |
| N9 | Consider `defer` on `main.js` for consistency | 30 sec |
| N10 | Newsletter placement inconsistency (podcast has it, learn doesn't) | Decide + 1 min |
| N11 | Move media-partnerships inline hex colors (`#FFEF7B`, etc.) to CSS vars | 5 min |
| N12 | Add a downscaled `ep79-thumb.jpg` (50-150 KB) for hero poster | 5 min |

---

## Summary scorecard

| Category | Score | Headline |
|---|---|---|
| Design system adherence | 8.5/10 | Tokens complete, atmospheric treatments in place. Subpages need more variety. |
| CSS code quality | 7.5/10 | Clean structure, 2 `!important`, 10 hardcoded colors, small dead CSS. |
| JS code quality | 9/10 | Excellent error handling, observer cleanup, accessibility. |
| Build/config | 7/10 | Solid basics, missing CSP and cache granularity. |
| Performance | 6.5/10 | Hero LCP hurt by unoptimized video/poster. Fonts solid. No preconnects. |
| Accessibility | 9/10 | `prefers-reduced-motion`, skip-nav, proper alt attributes, WCAG AA contrast. |
| **Overall** | **7.9/10** | Production-ready with clear improvement roadmap. |

---

## Recommended next step

Start with the **Critical** list (C1–C5) — five items, ~20 minutes total, immediately improves LCP and polish. Then knock out I1–I8 for the biggest design-system wins. The **Nice to have** list can be a cleanup sprint later.

Tell me which items to action and I'll do them in order.
