# Website Design System Audit

Bad Decisions Studio marketing site  
Audit date: 2026-04-24  
Scope: `Main/` static marketing website generated from `templates/`, `sections/`, `data/site-content.js`, `css/`, and `js/`.

## 1. Executive Summary

The site has strong content, strong brand ingredients, and several premium moments already working: the cinematic home hero, podcast media, learning cards, work-with-us cards, and the media partnerships device composition all feel directionally right. The inconsistency comes from the visual system being split between reusable foundations in `css/globals.css` and a large set of page-specific overrides in `css/style.css`.

The biggest issue is that every page currently feels like it owns its own design language. Backgrounds shift between `bg-dark`, `bg-glow-gold`, `bg-glow-blue`, `bg-ember`, `bg-green`, `bg-brown`, custom gradients, tan paper texture, and section-local radial meshes. Typography also changes page to page: many major headings use PP Editorial New for the full line, while buttons and nav often use Inter instead of the intended Azeret Mono UI language. Card, CTA, and label systems repeat the same ideas with different sizes, borders, radii, shadows, and hover behavior.

Highest-impact fixes later:

1. Reduce all section backgrounds to exactly three reusable surfaces plus controlled accent usage.
2. Normalize the typography hierarchy so Inter carries structure and PP Editorial is used as emphasis, not as every heading by default.
3. Replace page-specific button and card variants with shared component classes.
4. Standardize section padding, header spacing, grid gaps, and mobile breakpoints.
5. Rebuild generated HTML with `npm run build` after source changes. Do not manually edit root generated HTML.

## 2. Proposed Design System Direction

### Typography System

The desired system should feel editorial without making every heading fragile or decorative.

- Hero titles: Inter for the main structure with PP Editorial New used for selected emphasized words or phrases inside `<em>`.
- Page titles: Inter or a mixed title treatment. Avoid full-line PP Editorial on every page title.
- Section titles: Inter medium/semibold with PP Editorial emphasis only when the section needs an editorial moment.
- Card titles: Inter for practical cards, PP Editorial only for hero cards, podcast guest names, and intentional editorial cards.
- Body copy: Inter, regular or light, consistent line-height.
- Labels, metadata, tags, buttons, nav: Azeret Mono.
- Footer/nav text: Azeret Mono for labels, Inter for plain links if readability wins.

Current drift:

- `css/globals.css` defines `.heading-hero`, `.heading-section`, and `.heading-card` as PP Editorial by default.
- `sections/hero.html`, `sections/podcast.html`, `sections/learn.html`, `sections/work-with-us/*.html` all use `.heading-hero` or full PP Editorial custom title classes.
- `css/nav.css` uses `var(--font-body)` for nav links and dropdown labels instead of `var(--font-mono)`.
- Buttons in `css/globals.css` use Inter, while the direction calls for Azeret Mono.
- Many card CTAs define their own font styles: `.wwu-card-cta`, `.premium-card-cta`, `.career-apply-btn`, `.pod-hero-cta`, `.nl-submit`, and `.services-card__cta`.

### Spacing System

The site already has spacing tokens in `css/globals.css`, but section styles do not consistently use them. Future implementation should move to reusable section-padding and component-gap variables.

Recommended rules:

- Desktop section padding: 112px primary, 88px compact, 140px hero/feature.
- Tablet section padding: 80px primary, 64px compact.
- Mobile section padding: 56px primary, 40px compact, with 72px reserved for major page transitions.
- Section header margin-bottom: 48px desktop, 36px tablet, 28px mobile.
- Card grid gap: 20px desktop, 16px tablet, 12px mobile.
- Internal card padding: 32px desktop, 24px tablet/mobile, 20px compact mobile.

### Color And Background System

The site should use only three section-level surfaces. Accent colors should appear inside components, not as arbitrary full-section backgrounds.

1. Base light surface
   - Variable: `--surface-base`
   - Suggested value: `#F5F2EA` or the existing warm cream/tan family.
   - Use for readable editorial sections, free learning rows, about copy, and calmer content.

2. Elevated light surface
   - Variable: `--surface-elevated`
   - Suggested value: `#FFFFFF` or `#FBF9ED`.
   - Use for cards, forms, logo strips, and light panels that need separation.

3. Dark premium surface
   - Variable: `--surface-premium`
   - Suggested value: `#050505` / `#0E0D0B`.
   - Use for heroes, strong CTAs, footer, and selected brand moments.

Supporting tokens:

- `--accent-yellow: #FFEF7B`
- `--text-primary: #0E0D0B`
- `--text-on-dark: #F5F2EA`
- `--text-muted: #6B6560`
- `--text-muted-on-dark: #A8A29E`
- `--border-soft: rgba(14, 13, 11, 0.10)`
- `--border-soft-on-dark: rgba(245, 242, 234, 0.08)`

### Component System

The site needs shared, named components for recurring patterns:

- `.site-button`, `.site-button--primary`, `.site-button--secondary`, `.site-button--ghost`
- `.site-card`, `.site-card--media`, `.site-card--editorial`, `.site-card--compact`
- `.section-shell`, `.section-shell--base`, `.section-shell--elevated`, `.section-shell--premium`
- `.section-heading`, `.section-title`, `.section-kicker`
- `.logo-strip`
- `.media-frame`
- `.cta-band`
- `.form-panel`

### Mobile-First Rules

- Mobile should not be a compressed desktop layout. Cards should stack before they become narrow.
- Avoid two-column card layouts below 768px unless content is genuinely tiny.
- All mobile buttons should use one shared full-width rule when stacked.
- Section padding should follow the same scale across every page.
- Mobile hero titles should be readable at 40px to 48px visual scale, not decorative at the expense of hierarchy.
- Horizontal sliders need consistent snap width, gutters, dot color, and overflow treatment.

## 3. Background System Recommendation

### Exactly Three Reusable Section Surfaces

```css
:root {
  --surface-base: #F5F2EA;
  --surface-elevated: #FFFFFF;
  --surface-premium: #050505;

  --surface-base-text: #0E0D0B;
  --surface-premium-text: #F5F2EA;
  --surface-muted: #6B6560;
  --surface-muted-on-premium: #A8A29E;
  --accent-yellow: #FFEF7B;
  --border-soft: rgba(14, 13, 11, 0.10);
  --border-soft-on-premium: rgba(245, 242, 234, 0.08);
}
```

Recommended classes:

- `.surface-base`
- `.surface-elevated`
- `.surface-premium`

Current classes to retire or collapse:

- `.bg-green`
- `.bg-yellow`
- `.bg-blue`
- `.bg-brown`
- `.bg-peach`
- `.bg-glow-gold`
- `.bg-glow-blue`
- `.bg-glow-peach`
- `.bg-ember`
- `.bg-mesh`
- `.bg-topwash`
- `.bg-paper-texture`

Some of these can become internal decorative overlays, but they should not be arbitrary section backgrounds.

### Page Rhythm Recommendation

Home:

- Hero: dark premium.
- Pillars: dark premium, but with less custom glow.
- Find Us/logo strip: dark premium or elevated light, depending on surrounding rhythm.
- Podcast landing: dark premium as a featured media moment.
- Newsletter: dark premium CTA band.
- About: base light, not brown.
- Footer: dark premium.

Podcast:

- Page hero and featured episode: dark premium.
- Recent episodes: dark premium.
- Guest grid: base light.
- Newsletter: dark premium.
- Footer: dark premium.

Learn:

- Hero/premium programs: dark premium.
- Free learning rows: base light or dark premium, but avoid standalone green as a full-section surface.
- Newsletter: dark premium.
- Footer: dark premium.

Work With Us:

- Hero and path cards: dark premium.
- Roles strip: dark premium/elevated dark card.
- Footer should attach directly without a sudden unrelated tone.

Services:

- Hero and bento: dark premium.
- About: base light recommended for readability, or dark premium if it is treated as a tighter brand manifesto.
- Tech stack: dark premium with standardized tiles.
- CTA: dark premium CTA band, not `bg-ember`.

Media Partnerships:

- Hero/devices: dark premium.
- Trust strip: dark premium or base light, but match the hero transition.
- Why partner: base light recommended. Avoid full `bg-green`.
- CTA: dark premium.

Open Roles:

- Hero: dark premium.
- Job list: dark premium with elevated cards.
- CTA: dark premium.

### Sections With Background Drift

- `sections/about.html`: uses `bg-brown`; this is the largest surface outlier on Home.
- `sections/learn.html`: `.learn-free-section` uses full `var(--color-green)`, which feels like a separate brand system.
- `sections/podcast.html`: `.pod-guests-section` uses tan paper texture while the page hero uses blue glow/dark.
- `sections/podcast-landing.html`: uses `bg-ember`, which is another dark gradient outside the proposed three surfaces.
- `sections/work-with-us/services.html`: hero uses `bg-glow-gold`, about/stack use `bg-dark`, CTA uses `bg-ember`.
- `sections/work-with-us/media-partnerships.html`: hero is dark, trust strip is dark, `mp-why` uses `bg-green`.
- `sections/work-with-us/open-roles.html`: hero uses `bg-glow-blue`, CTA uses `bg-ember`.
- `css/style.css`: `.workhub-page` has its own radial/grid background independent of `bg-dark`.

## 4. Typography Audit

### Current Inconsistencies

- `.heading-hero`, `.heading-section`, and `.heading-card` default to PP Editorial in `css/globals.css`. This makes almost every page title feel editorial, even practical pages like Services and Open Roles.
- `sections/hero.html` uses PP Editorial for the whole hero title. Direction asks for Inter structure with PP Editorial emphasis.
- `sections/podcast.html` page title and guest section title are full PP Editorial; podcast cards also use PP Editorial, creating a decorative-heavy page.
- `sections/learn.html` uses full PP Editorial for the page title, but `.learn-row-title` uses Inter, `.premium-card h2` uses PP Editorial, and `.premium-card-cta` uses Inter.
- `sections/work-with-us.html` uses full PP Editorial for both page title and card titles. This works emotionally but needs a standardized hero/card distinction.
- `sections/work-with-us/services.html` mixes `.heading-hero`, `.services-card__title` in Inter, `.services-card__title--hero` in PP Editorial, `.services-about-lede em` in PP Editorial, and `.services-cta-heading` in PP Editorial.
- `sections/work-with-us/media-partnerships.html` uses `.mp-h1` instead of shared `.heading-hero`, making hero styling page-specific.
- `sections/work-with-us/open-roles.html` uses `.heading-card` PP Editorial for job names, but job cards are practical UI where Inter may be stronger.
- `css/nav.css`: nav and dropdown labels use Inter, not Azeret Mono.
- `css/globals.css`: buttons use Inter, not Azeret Mono.

### Proposed Hierarchy

Hero title:

- Class: `.type-hero`
- Font: Inter 600/700 for default words.
- Size: `clamp(44px, 7vw, 88px)` desktop, `clamp(40px, 11vw, 56px)` mobile.
- Line-height: 0.98 to 1.05.
- Emphasis: `em` in PP Editorial New italic, 300/400, color `--accent-yellow` on dark and charcoal/green on light.

Page title:

- Class: `.type-page-title`
- Font: Inter 600.
- Size: `clamp(38px, 5vw, 72px)`.
- Use PP Editorial only inside `<em>`.

Section title:

- Class: `.type-section-title`
- Font: Inter 600.
- Size: `clamp(30px, 3.4vw, 48px)`.
- Use PP Editorial only for selected phrases.

Subsection title:

- Class: `.type-subsection-title`
- Font: Inter 600.
- Size: 22px to 28px.

Card title:

- Class: `.type-card-title`
- Font: Inter 600.
- Size: 18px to 24px.
- Editorial media cards may opt into `.type-card-title--editorial`.

Body paragraph:

- Class: `.type-body`
- Font: Inter 400.
- Size: 16px desktop, 15px mobile.
- Line-height: 1.65 to 1.75.

Small label / eyebrow:

- Class: `.type-label`
- Font: Azeret Mono 500.
- Size: 10px to 12px.
- Letter-spacing: 0.14em to 0.20em.

Button text:

- Class: `.type-button`
- Font: Azeret Mono 600.
- Size: 11px to 12px.
- Letter-spacing: 0.12em to 0.16em.

Footer/nav text:

- Nav primary: Azeret Mono 500, 12px.
- Dropdown: Inter is acceptable for longer labels, but current short labels can use Azeret Mono.
- Footer column labels: Azeret Mono.
- Footer links: Inter 13px or Azeret Mono 12px, but choose one consistent pattern.

## 5. Spacing Audit

### Current Inconsistencies

- Global `section { padding: 120px 0; }` in `css/style.css`, but many sections override it:
  - `.find-us-section`: 80px.
  - `.newsletter`: 140px.
  - `.learn-premium-section`: 40px top, 72px bottom.
  - `.learn-free-section`: 72px top, 80px bottom.
  - `.services-section`: 100px.
  - `.open-roles-header`: 80px top, 40px bottom.
  - `.open-roles-list-section`: 40px top, 80px bottom.
  - `.workhub-page`: 88px top, 12px bottom.
  - `.mp-hero`: clamp-based custom padding.
  - `.mp-cta`: 108px.
- Section headers vary:
  - `.section-header` is 64px in `style.css`.
  - `css/components.css` overrides `.section-header` to `clamp(40px, 6vw, 64px)`.
  - `.section-header-center` uses 80px.
  - `.learn-section-header` uses 36px.
  - `.pod-section-label` uses `margin: 64px 0 24px`.
  - `.mp-why-header` uses 56px.
- Card gaps vary:
  - `.pillars-grid`: 12px.
  - `.wwu-grid`: 24px.
  - `.premium-duo`: 16px.
  - `.pod-4grid`: 20px.
  - `.pod-guest-grid`: 28px.
  - `.services-bento`: 12px.
  - `.services-stack-grid`: 16px.
  - `.mp-why-grid`: 20px.
  - `.careers-list`: 12px.
- Internal card padding varies:
  - `.card`: 40px.
  - `.wwu-card`: 48px.
  - `.premium-card`: 48px 40px.
  - `.services-card__body`: 28px.
  - `.services-card--hero .services-card__body`: 40px 44px.
  - `.career-summary`: 28px 32px.
  - `.mp-why-card`: 32px 30px 34px.
  - `.nl-shell`: 56px.

### Proposed Spacing Tokens

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
  --space-28: 112px;
  --space-32: 128px;
}
```

### Recommended Section Padding Rules

Desktop:

- `.section-standard`: `padding: var(--space-28) 0`
- `.section-compact`: `padding: var(--space-20) 0`
- `.section-feature`: `padding: var(--space-32) 0`
- `.section-hero`: `padding: var(--space-24) 0 var(--space-28)`

Tablet:

- `.section-standard`: 80px.
- `.section-compact`: 64px.
- `.section-feature`: 96px.

Mobile:

- `.section-standard`: 56px.
- `.section-compact`: 40px.
- `.section-feature`: 72px.
- Hero after fixed nav: include consistent top offset of 56px to 72px depending on page.

## 6. Component Audit

### Navigation

Appears in:

- `sections/nav.html`
- `css/nav.css`
- `js/main.js`

What works:

- Shared source partial.
- Clean fixed nav.
- Mobile overlay behavior exists.
- Dropdown structure is clear.

What feels inconsistent:

- Nav typography uses Inter, while system direction says Azeret Mono for nav.
- Desktop nav only has a hamburger hidden on desktop; no visible CTA. This may be intentional, but it should be documented.
- Mobile overlay row typography is much larger than desktop and uses Inter.
- Nav background is always dark premium, even above future light pages. That is probably acceptable, but it must become a deliberate nav token.

Standardize later:

- Use `.type-nav` based on Azeret Mono.
- Define `--nav-height-desktop: 72px` and `--nav-height-mobile: 56px`.
- Make mobile overlay link padding and typography part of the nav component contract.
- Ensure page top padding always accounts for fixed nav.

Likely files:

- `sections/nav.html`
- `css/nav.css`
- `css/globals.css`
- `js/main.js`

### Buttons

Appears in:

- Hero: `.btn-primary`, `.btn-secondary`
- Podcast: `.pod-platforms-btn`, `.pod-hero-cta`
- Learn: `.premium-card-cta`
- Work With Us: `.wwu-card-cta`
- Services: `.btn-primary`, `.services-card__cta`
- Open Roles: `.career-apply-btn`
- Newsletter: `.nl-submit`

What feels inconsistent:

- Base buttons use Inter instead of Azeret Mono.
- Button radii range from 4px to 10px, while component direction wants tight, premium radii.
- `.btn-secondary` exists but hero mobile CSS only targets `.btn-outline`, so `.hero-actions .btn-secondary` may not receive the intended mobile full-width behavior in one rule set, though global mobile button rules partly cover it.
- Card CTAs are implemented as bespoke spans rather than using shared button classes.
- `btn-primary` color does not always adapt to light/dark context through context variables; it is hard-coded yellow.

Standardize later:

- Create `.site-button`.
- Use Azeret Mono.
- Keep one height scale: 48px standard, 40px compact.
- Use three variants: primary yellow, secondary outline, ghost text.
- Convert `.nl-submit`, `.premium-card-cta`, `.wwu-card-cta`, `.career-apply-btn`, and `.pod-hero-cta` to variants or aliases.

Likely files:

- `css/globals.css`
- `css/style.css`
- `sections/*.html`
- `sections/work-with-us/*.html`

### Cards

Appears in:

- `.pillar-panel`
- `.premium-card`
- `.learn-free-row`
- `.pod-showcase-card`
- `.pod-guest-tile`
- `.wwu-card`
- `.services-card`
- `.services-stack-tile`
- `.career-card`
- `.mp-why-card`
- `.nl-shell`

What feels inconsistent:

- Cards use different radii: 2px, 3px, 4px, 6px, 10px, 16px.
- Some cards have shadows from `css/components.css`, some have custom large shadows in `style.css`.
- Card borders are often local color values instead of surface tokens.
- Hover movement varies: 2px, 3px, 4px, 6px, scale, rotate, padding shifts.
- Practical cards sometimes use PP Editorial titles, while media cards sometimes use Inter.

Standardize later:

- Use `.site-card` with `--card-bg`, `--card-border`, `--card-radius`, `--card-padding`, and `--card-shadow`.
- Keep media cards and practical cards separate.
- Make hover treatment consistent: max translateY(-2px) for practical cards, richer media hover only for media cards.

Likely files:

- `css/components.css`
- `css/style.css`
- `sections/pillars.html`
- `sections/learn.html`
- `sections/podcast.html`
- `sections/work-with-us/*.html`

### CTAs

Appears in:

- `.newsletter`
- `.services-cta`
- `.mp-cta`
- `.open-roles-cta`
- `.careers-cta-section`
- Work With Us role strip `.wwu-roles`

What feels inconsistent:

- CTA backgrounds are mostly `bg-ember` or custom dark shells, but the treatment changes per page.
- CTA heading classes differ: `.nl-heading`, `.services-cta-heading`, `.mp-cta-heading`, `.careers-cta-heading`.
- CTA copy alignment and button placement differ.

Standardize later:

- Create `.cta-band.surface-premium`.
- Use one CTA heading type and one button variant.
- Use newsletter as a form-specific CTA pattern, not as the generic CTA model.

Likely files:

- `sections/newsletter.html`
- `sections/work-with-us/services.html`
- `sections/work-with-us/media-partnerships-cta.html`
- `sections/work-with-us/open-roles.html`
- `css/style.css`

### Forms

Appears in:

- `sections/newsletter.html`

What works:

- Accessible labels.
- Honeypot and feedback states exist.
- Fields are grouped clearly.

What feels inconsistent:

- Form button `.nl-submit` duplicates button styling.
- Form shell has its own premium panel treatment and shadow.
- Labels use Azeret Mono correctly, but field styling is separate from any global form component.

Standardize later:

- Create `.form-panel`, `.form-field`, `.form-label`, `.form-input`.
- Alias `.nl-*` classes to the shared system or migrate markup later.

Likely files:

- `sections/newsletter.html`
- `css/style.css`
- `css/components.css`

### Section Labels

Appears in:

- `.label`, `.section-label`, `.nl-eyebrow-text`, `.pod-section-label`, `.services-card__eyebrow`, `.mp-why-eyebrow`, `.career-apply-btn`, `.footer-col-title`

What feels inconsistent:

- Some labels include rules, some dots, some no decoration.
- Letter-spacing varies from 0.05em to 0.30em.
- Color varies by page and sometimes ignores context tokens.
- `.label` is reusable but many sections create custom label classes.

Standardize later:

- Keep `.label` as the only base.
- Add modifiers: `.label--rule`, `.label--dot`, `.label--muted`, `.label--center`.
- Limit letter-spacing to 0.16em or 0.18em.

Likely files:

- `css/globals.css`
- `css/style.css`
- `sections/*.html`

### Logo Strips

Appears in:

- Home hero shared `sections/trusted-marquee.html`
- Media Partnerships shared `sections/trusted-marquee.html`
- Find Us social strip in `sections/find-us.html`

What feels inconsistent:

- The client logo strip has been consolidated into the shared `.hero-featured` marquee.
- Older `.trust-logos` code should stay removed so the site does not drift back to two logo systems.
- Logo sizing is tuned per logo with many `img[alt="..."]` overrides.
- Find Us social icons have a separate card-like style and much larger radius.

Standardize later:

- Continue using one shared client logo partial for client logos.
- Use one `.social-strip` for platform icons.
- Keep marquee optional via modifier `.logo-strip--marquee`.

Likely files:

- `sections/hero.html`
- `sections/trusted-marquee.html`
- `sections/find-us.html`
- `sections/work-with-us/media-partnerships.html`
- `css/style.css`

### Podcast Cards

Appears in:

- `sections/podcast.html`
- `data/site-content.js`
- `css/style.css`
- `js/main.js`

What works:

- Strong thumbnails.
- Mobile horizontal swipe exists.
- Fallback content exists if `/api/podcast` fails locally.

What feels inconsistent:

- Episode title typography is full PP Editorial, while practical card text should likely be Inter or a controlled editorial card modifier.
- Recent episodes use dark cards; guest tiles use tan paper background.
- Platform buttons render as full cards on Home but inline icon/text links on Podcast using `.pod-platforms--inline`.
- Mobile swipe cards and guest tiles have separate sizing, dot color, and spacing.

Standardize later:

- Create `.podcast-card` and `.media-card`.
- Use one mobile slider pattern.
- Decide whether podcast pages stay fully dark or use a planned base-light guest section.

Likely files:

- `sections/podcast.html`
- `sections/podcast-landing.html`
- `data/site-content.js`
- `css/style.css`
- `js/main.js`

### Learn Rows

Appears in:

- `sections/learn.html`
- `data/site-content.js`
- `css/style.css`

What works:

- Horizontal editorial rows feel distinctive.
- Thumbnails are clear.
- Metadata labels are strong.

What feels inconsistent:

- Free learning section is full green, which is not part of a restrained three-surface system.
- Row titles are large PP Editorial, while page hero is also PP Editorial, making hierarchy too decorative.
- Row hover changes padding, which can create layout movement.
- Body text in green section uses `var(--color-fog)`, which is tuned for dark surfaces and can feel muddy against green.

Standardize later:

- Move section to `surface-base` or `surface-premium`.
- Keep row title editorial if the page title shifts to mixed Inter/PP.
- Replace hover padding shift with border/arrow/color changes.

Likely files:

- `sections/learn.html`
- `css/style.css`
- `data/site-content.js`

### Service Cards

Appears in:

- `sections/work-with-us/services.html`
- `css/style.css`

What works:

- Bento layout gives the page a premium productized feel.
- Hero card has stronger hierarchy than support cards.

What feels inconsistent:

- Tablet view can show narrow two-column cards with too much height and cramped copy. The one-column breakpoint should likely happen earlier, around 768px or 900px.
- Support cards use Inter titles while hero card uses PP Editorial, which is good directionally, but should be codified.
- The bento comments mention a 6-card layout, but markup has 5 service cards.
- Card CTAs are styled separately and are not present in current markup for every card.

Standardize later:

- Treat service bento as `.service-grid` using shared `.site-card`.
- Switch to one column earlier for tablet/mobile.
- Align comments, markup, and CSS.

Likely files:

- `sections/work-with-us/services.html`
- `css/style.css`

### Media Partnership Sections

Appears in:

- `sections/work-with-us/media-partnerships.html`
- `sections/work-with-us/media-partnerships-cta.html`
- `css/style.css`

What works:

- Device cluster is memorable and premium.
- Stats are clear.

What feels inconsistent:

- `.mp-h1` is a page-specific hero title instead of using the shared hero system.
- `mp-why` uses `bg-green`, creating a strong color jump after dark hero/trust sections.
- Trust strip duplicates hero-featured markup.
- Device order on mobile is visually good, but first viewport can become very media-heavy before the value proposition has a next action.

Standardize later:

- Use shared hero title classes.
- Move `mp-why` to base light or dark premium.
- Use shared logo strip.
- Add shared CTA/button treatment if conversion is desired above the fold.

Likely files:

- `sections/work-with-us/media-partnerships.html`
- `sections/work-with-us/media-partnerships-cta.html`
- `css/style.css`

### Image And Video Frames

Appears in:

- Home hero video.
- Pillar videos.
- Learn premium cards.
- Podcast thumbnails.
- Podcast guest portraits.
- Work-with-us cards.
- Media partnership devices.
- About video card.

What feels inconsistent:

- Media radii vary from 2px to 16px.
- Some images have strong dark overlays and filters; some are full color; some are paper-tinted.
- Video frame aspect ratios are mostly consistent, but devices and cards use different shadow systems.

Standardize later:

- Create `.media-frame`, `.media-frame--video`, `.media-frame--portrait`, `.media-frame--device`.
- Standard radius: 4px for frames, 6px only for major feature cards.
- Avoid global filters; keep overlays component-specific.

Likely files:

- `css/components.css`
- `css/style.css`
- `sections/*.html`

### Footer

Appears in:

- `sections/footer.html`
- `css/style.css`

What works:

- Shared source partial.
- Dark premium footer matches brand.
- Link groups are clear.

What feels inconsistent:

- Footer brand label uses Inter, while the system says small UI text should use Azeret Mono.
- Social icons use raw icon sizing and no shared social button component.
- Footer signoff logo feels like a separate decorative moment. It may work, but should be standardized as the footer lockup treatment.

Standardize later:

- Use Azeret Mono for footer labels and brand text.
- Use shared `.social-link` sizing.
- Keep footer on `surface-premium`.

Likely files:

- `sections/footer.html`
- `css/style.css`

## 7. Page-By-Page Audit

### Home

Source:

- `templates/index.html`
- `sections/hero.html`
- `sections/pillars.html`
- `sections/find-us.html`
- `sections/podcast-landing.html`
- `sections/newsletter.html`
- `sections/about.html`
- `sections/footer.html`

What works:

- Hero is cinematic and brand-forward.
- Three-pillar model is useful and clear.
- Podcast landing provides a strong content/media signal.
- Newsletter and footer support conversion and retention.

What feels off:

- Background rhythm jumps from dark hero/pillars/find-us to ember podcast, dark newsletter, then brown about.
- Home uses several special surface treatments before the user understands a stable system.
- Hero title is entirely PP Editorial, while desired direction calls for Inter structure with PP emphasis.
- Pillar title "Watch, learn, or services." feels grammatically and visually unfinished. It should likely be "Watch, learn, or work with us." or "Watch, learn, or build with us." as a content/layout recommendation.
- Client logo strip appears inside hero and another social strip appears shortly after; these need clearer component roles.
- About section `bg-brown` feels disconnected from the rest of the page.

Recommended fixes:

- Keep hero and pillars on dark premium.
- Convert About to base light or dark premium; remove brown as a full-section surface.
- Convert hero typography to Inter with PP emphasis on "age of AI".
- Use one logo strip component and one social strip component.
- Normalize spacing between hero-featured, pillars, find-us, and podcast landing.

Priority: High.

### Podcast

Source:

- `templates/podcast.html`
- `sections/podcast.html`
- `sections/newsletter.html`
- `sections/footer.html`
- `data/site-content.js`
- `js/main.js`

What works:

- The podcast page has clear purpose.
- Featured episode and recent episode cards are visually strong.
- Mobile horizontal episode slider works directionally.
- Guest list is valuable and content-rich.

What feels off:

- Page title is full PP Editorial and very decorative for a practical podcast page.
- Guest section jumps from dark/blue glow to tan paper texture.
- Podcast platform component is a full card grid on Home and an inline icon row on Podcast.
- Recent episodes and guest tiles feel like different card systems.
- Mobile dots and slider spacing are bespoke to podcast.

Recommended fixes:

- Use dark premium for page hero/recent episodes.
- Keep guest grid on base light only if it becomes part of the planned rhythm; otherwise keep the whole page dark.
- Standardize `.pod-platforms` with modifiers that preserve consistent sizing and typography.
- Use a shared mobile slider pattern.
- Make podcast card title typography either Inter card title or an explicit editorial media-card variant.

Priority: High.

### Learn

Source:

- `templates/learn.html`
- `sections/learn.html`
- `sections/newsletter.html`
- `sections/footer.html`
- `data/site-content.js`

What works:

- Premium program cards are visually persuasive.
- AI and Unreal cards are differentiated.
- Free learning rows are content-rich and editorial.

What feels off:

- Hero title, premium card titles, and free row titles all rely heavily on PP Editorial, so hierarchy flattens.
- Free learning section uses full green, which feels like another site.
- AI card CTA uses blue, Unreal uses yellow, while the rest of the site uses yellow as the primary CTA. This can work only if product-specific accent rules are documented.
- Mobile/tablet card order puts AI before Unreal via CSS order; confirm this is intentional.
- Row hover padding shift can feel unstable.

Recommended fixes:

- Convert hero title to mixed Inter/PP.
- Keep premium card titles editorial, but make support copy and labels standardized.
- Move free learning to base light or dark premium.
- Document product accent rules: AI may use blue as secondary accent, but primary CTA should still be system-controlled.
- Replace padding-shift hover with non-layout-changing hover.

Priority: High.

### Work With Us

Source:

- `templates/work-with-us.html`
- `sections/work-with-us.html`
- `sections/footer.html`

What works:

- The page is focused and easy to understand.
- Hire/Partner cards are dramatic and premium.
- Open roles strip is a useful third path.

What feels off:

- The page uses a custom `.workhub-page` background mesh separate from the global background system.
- Card CTAs are bespoke and do not share `.btn-*`.
- Card title treatment is powerful but full PP Editorial again.
- There is no newsletter/find-us bridge, so footer connection can feel abrupt depending on scroll depth.
- The Work With Us page has older unused `.workhub-*` card systems still present in CSS, creating maintenance risk.

Recommended fixes:

- Keep page dark premium, but move custom mesh into a controlled surface overlay token.
- Convert card CTAs to shared button styles.
- Use Inter structure for the page title and PP emphasis for "Bad Decisions".
- Remove or quarantine unused `.workhub-*` CSS in a later cleanup after verifying usage.

Priority: Medium.

### Services

Source:

- `templates/work-with-us/services.html`
- `sections/work-with-us/services.html`
- `sections/footer.html`

What works:

- Bento service layout has good premium potential.
- About and tech stack support trust.
- CTA is clear.

What feels off:

- Hero uses `bg-glow-gold`, about/stack use dark, CTA uses `bg-ember`; this is too many dark variants.
- Services support cards can become narrow/tall at tablet widths.
- About section may be too dark and text-heavy after the bento.
- Tech stack tiles use letter placeholders instead of recognizable brand marks; if intentional, standardize the visual language.
- CSS comment says 6-card layout, but source has 5 cards.

Recommended fixes:

- Use dark premium for hero/bento and CTA.
- Consider moving About to base light for editorial contrast and readability.
- Switch bento to single column earlier on tablet if card copy remains long.
- Align markup/CSS comments.
- Use `.site-card` and `.site-button` for card structure and CTAs.

Priority: High.

### Media Partnerships

Source:

- `templates/work-with-us/media-partnerships.html`
- `sections/work-with-us/media-partnerships.html`
- `sections/work-with-us/media-partnerships-cta.html`
- `sections/footer.html`

What works:

- Hero device cluster is one of the strongest page-specific moments.
- Stats create immediate credibility.
- "Your brand in the conversation" section has good messaging.

What feels off:

- `.mp-h1` is a bespoke hero type system.
- `mp-why bg-green` is the strongest background jump in this page.
- Trust strip duplicates the hero logo marquee instead of using a shared component.
- Mobile/tablet hero can become very tall because title, iPad, phone, and stats stack before the next section.
- CTA uses `bg-ember`, again adding a fourth/fifth dark surface.

Recommended fixes:

- Keep hero/device area dark premium.
- Move `mp-why` to base light or dark premium with elevated cards.
- Use shared logo strip.
- Use shared `.type-hero`, `.type-section-title`, `.site-card`, and `.cta-band`.
- Add a compact mobile rule for device cluster spacing and stats.

Priority: High.

### Open Roles

Source:

- `templates/work-with-us/open-roles.html`
- `sections/work-with-us/open-roles.html`
- `sections/footer.html`

What works:

- Page purpose is clear.
- Details/summary job cards are practical.
- CTA is straightforward.

What feels off:

- Hero uses `bg-glow-blue`; CTA uses `bg-ember`; list uses plain dark.
- Job titles use PP Editorial via `.heading-card`, which feels more decorative than recruitment/practical UI.
- `.career-apply-btn` has 10px radius while global button radius is 4px.
- On mobile/tablet, Apply Now and toggle controls can feel like separate design systems.

Recommended fixes:

- Keep all sections on dark premium with elevated dark cards.
- Use Inter for job titles or a controlled practical card-title style.
- Convert Apply Now to shared compact button.
- Normalize accordion controls with shared icon-button styles.

Priority: Medium.

## 8. Mobile Audit

Observed rendered mobile/tablet issues:

- The fixed mobile nav works, but nav typography does not match the intended Azeret Mono UI language.
- Hero pages often rely on full PP Editorial titles. They look premium, but the site lacks a repeatable mixed Inter/PP rule.
- Services bento can show narrow two-column cards at tablet/mobile-adjacent widths, producing tall cards with cramped copy. Consider switching to one column earlier.
- Podcast recent episodes use horizontal swipe and dots; guest grid also uses swipe and dots, but the slider pattern is not generalized.
- Media Partnerships mobile/tablet hero stacks title, device mockups, and stats into a long first section. It is visually impressive but needs tighter vertical rhythm.
- Learn mobile/tablet premium cards look strong, but product accent rules need consistency.
- Find Us social icons shrink aggressively on small screens and use a different radius/card style from footer social icons.
- Newsletter mobile form is good, but `.nl-submit` should inherit the shared button system.
- Background rhythm on mobile feels more abrupt because vertical stacking makes surface changes more visible.
- Reveal animations can temporarily blur content on initial screenshots/loading. Ensure reduced-motion and no-JS fallbacks keep content visible.

Recommended mobile-first rules:

- Use one page-top offset after fixed nav for all non-home pages.
- Stack cards at or before 768px if card copy exceeds two short lines.
- Use full-width primary buttons on stacked mobile CTAs.
- Use shared horizontal slider classes with consistent gutters: 20px container padding, 78vw to 84vw card width, 16px gap, 6px dots.
- Keep mobile section padding at 56px standard and 40px compact.
- Keep mobile hero titles within a consistent visual range.
- Avoid full-section color jumps on mobile unless the section is a major brand moment.

## 9. Implementation Plan For Later

### Phase 1: CSS Tokens And Global Design System

- Add the three surface tokens in `css/globals.css`.
- Add semantic text, border, accent, radius, shadow, and spacing tokens.
- Introduce `.surface-base`, `.surface-elevated`, and `.surface-premium`.
- Deprecate extra `bg-*` section classes or convert them to internal overlay modifiers.

### Phase 2: Typography And Spacing Normalization

- Replace default full-PP `.heading-*` usage with mixed Inter/PP classes.
- Update nav/buttons/labels to Azeret Mono.
- Normalize section header spacing and section padding.
- Standardize mobile heading sizes.

### Phase 3: Background Rhythm And Section Cleanup

- Update section wrappers in source partials, not generated HTML.
- Apply the three-surface rhythm page by page.
- Remove or alias `bg-green`, `bg-brown`, `bg-ember`, `bg-glow-*` where used as section backgrounds.
- Keep decorative glows only as controlled modifiers inside dark premium sections.

### Phase 4: Component Standardization

- Create shared button, card, CTA, logo strip, social strip, media frame, and form classes.
- Migrate bespoke classes gradually.
- Keep page-specific classes only for layout differences, not base styling.

### Phase 5: Page-By-Page Responsive Polish

- Home: hero/pillars/about rhythm.
- Podcast: cards, slider, guest section background.
- Learn: premium cards, free rows, product accents.
- Work With Us: card CTAs and page mesh.
- Services: bento breakpoints and about/stack rhythm.
- Media Partnerships: mobile device cluster and green section replacement.
- Open Roles: accordion/button normalization.

### Phase 6: QA, Build, And Visual Regression Check

- Run `npm run build`.
- Verify generated pages:
  - `/`
  - `/podcast`
  - `/learn`
  - `/work-with-us`
  - `/work-with-us/services`
  - `/work-with-us/media-partnerships`
  - `/work-with-us/open-roles`
- Check mobile, tablet, desktop, and wide desktop.
- Check nav dropdowns, mobile menu, podcast sliders, newsletter form UI states, and accordions.
- Confirm no generated root HTML was manually edited.

## 10. File-Level Recommendations

### `css/globals.css`

- Keep font faces and base reset.
- Add final semantic surface variables.
- Replace default `.heading-*` PP Editorial rules with mixed-system typography classes.
- Change button base font to Azeret Mono.
- Add final spacing scale.
- Add final surface classes.
- Deprecate excessive `bg-*` section backgrounds.

### `css/components.css`

- Move shared card, button, CTA, logo strip, social strip, media frame, form, and mobile slider rules here.
- Remove broad shadow overrides that touch many unrelated classes until card roles are standardized.
- Keep component-specific hover and focus behavior here rather than in page sections.

### `css/style.css`

- Reduce to section layout and page-specific composition only.
- Remove duplicated component styles after migration.
- Remove unused legacy blocks after verifying generated pages.
- Replace arbitrary padding and background values with tokens.

### `css/nav.css`

- Convert nav typography to Azeret Mono or a documented nav text token.
- Add nav height variables.
- Standardize mobile overlay rows and dropdown surfaces.

### `sections/*.html`

- Update section wrapper surface classes.
- Replace heading classes with the new hierarchy.
- Replace bespoke buttons with shared button classes.
- Use shared logo strip/social strip where possible.

### `sections/work-with-us/*.html`

- Services: normalize bento cards and CTA.
- Media Partnerships: replace `mp-h1`, `bg-green`, duplicated trust strip, and `bg-ember` CTA.
- Open Roles: normalize job cards, Apply buttons, accordion controls, and CTA surface.

### `templates/*.html`

- Usually no visual changes needed except if future work introduces page-level body classes or shared preload changes.
- Continue editing templates only for source-level structure, never generated root HTML.

### `data/site-content.js`

- Keep content centralized.
- If card components need consistent metadata or label fields, add data shape here rather than hardcoding in generated output.

### `js/main.js`

- Keep mobile slider behavior, but generalize slider naming if shared beyond podcast.
- Check reveal/no-JS fallback during QA.

## 11. Final Checklist

- [ ] No random section backgrounds.
- [ ] Only three reusable section surfaces are used.
- [ ] Yellow is used as a controlled accent, not as an arbitrary background.
- [ ] Dark sections connect visually to surrounding sections.
- [ ] All hero titles follow the mixed Inter plus PP Editorial rule.
- [ ] All section headings follow the hierarchy.
- [ ] Body copy uses Inter.
- [ ] Nav, buttons, labels, metadata, tags, and small UI text use Azeret Mono.
- [ ] All buttons use shared styles or documented component aliases.
- [ ] All cards use shared styles or documented component aliases.
- [ ] All CTAs use one CTA band system.
- [ ] All forms use shared form field/button styling.
- [ ] Logo strips use one shared component.
- [ ] Social icon strips use one shared component.
- [ ] Media frames use shared radius, border, and overlay rules.
- [ ] Mobile section spacing follows the scale.
- [ ] Mobile cards stack before they become cramped.
- [ ] Mobile sliders use shared snap, gap, and dot rules.
- [ ] Footer uses the dark premium surface and shared text styles.
- [ ] Generated pages are rebuilt with `npm run build`.
- [ ] No manual edits are made to generated root HTML files.
