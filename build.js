#!/usr/bin/env node

// Build script — inlines section partials into page templates
// Replaces client-side fetch() assembly with pre-rendered HTML

const fs = require('fs');
const path = require('path');
const siteContent = require(path.join(__dirname, 'data', 'site-content.js'));

const ROOT = __dirname;
const TEMPLATES_DIR = path.join(ROOT, 'templates');

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderPodcastPlatformButtons() {
  return siteContent.podcastPlatformOrder.map(function(key) {
    var platform = siteContent.platforms[key];
    var label = key === 'youtube' ? 'Podcast on YouTube' : 'Listen on ' + platform.alt;
    var lockup = '';

    if (key === 'apple') {
      lockup = [
        '              <span class="pod-platforms-lockup pod-platforms-lockup--apple">',
        '                <img src="' + escapeHtml(platform.asset) + '" alt="' + escapeHtml(platform.alt) + '" class="pod-platforms-logo pod-platforms-logo--apple" loading="lazy">',
        '                <span class="pod-platforms-stack">',
        '                  <span class="pod-platforms-overline">Podcast on</span>',
        '                  <span class="pod-platforms-wordmark">Apple Podcasts</span>',
        '                </span>',
        '              </span>'
      ].join('\n');
    } else if (key === 'youtube' && platform.lockupAsset) {
      lockup = [
        '              <span class="pod-platforms-lockup pod-platforms-lockup--youtube">',
        '                <img src="' + escapeHtml(platform.lockupAsset) + '" alt="' + escapeHtml(platform.alt) + '" class="pod-platforms-logo pod-platforms-logo--youtube-lockup" loading="lazy">',
        '              </span>'
      ].join('\n');
    } else {
      lockup = [
        '              <span class="pod-platforms-lockup pod-platforms-lockup--' + key + '">',
        '                <img src="' + escapeHtml(platform.asset) + '" alt="' + escapeHtml(platform.alt) + '" class="pod-platforms-logo pod-platforms-logo--' + key + '" loading="lazy">',
        '                <span class="pod-platforms-wordmark">' + escapeHtml(platform.alt) + '</span>',
        '              </span>'
      ].join('\n');
    }

    return [
      '            <a href="' + escapeHtml(platform.href) + '" target="_blank" rel="noopener noreferrer" class="pod-platforms-btn pod-platforms-btn--' + key + '" aria-label="' + escapeHtml(label) + '">',
      lockup,
      '            </a>'
    ].join('\n');
  }).join('\n');
}

function renderFooterSocialButtons() {
  return siteContent.footerSocialOrder.map(function(key) {
    var platform = siteContent.platforms[key];
    return '<a href="' + escapeHtml(platform.href) + '" target="_blank" rel="noopener noreferrer" class="footer-social-btn" title="' + escapeHtml(platform.alt) + '"><img src="' + escapeHtml(platform.asset) + '" alt="' + escapeHtml(platform.alt) + '" class="footer-social-icon footer-social-icon--' + key + '" loading="lazy"></a>';
  }).join('\n            ');
}

function renderFooterPodcastLinks() {
  return siteContent.footerPodcastOrder.map(function(key) {
    var platform = siteContent.platforms[key];
    return '<li><a href="' + escapeHtml(platform.href) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(platform.alt) + '</a></li>';
  }).join('\n            ');
}

function renderFindUsIcons() {
  return siteContent.findUsOrder.map(function(key) {
    var platform = siteContent.platforms[key];
    return '<a href="' + escapeHtml(platform.href) + '" target="_blank" rel="noopener noreferrer" class="find-us-icon" aria-label="' + escapeHtml(platform.alt) + '">\n' +
      '            <img src="' + escapeHtml(platform.asset) + '" alt="' + escapeHtml(platform.alt) + '" class="find-us-icon-img find-us-icon-img--' + key + '" loading="lazy">\n' +
      '          </a>';
  }).join('\n          ');
}

function renderLearnFreeRows() {
  return siteContent.learnFreeRows.map(function(row) {
    return [
      '          <a href="' + escapeHtml(row.href) + '" target="_blank" rel="noopener noreferrer" class="learn-free-row">',
      '            <div class="learn-free-thumb">',
      '              <img src="' + escapeHtml(row.image) + '" alt="' + escapeHtml(row.imageAlt) + '" width="1280" height="720" loading="lazy">',
      '            </div>',
      '            <div class="learn-free-body">',
      '              <h3 class="learn-free-title">' + row.titleHtml + '</h3>',
      '              <div class="learn-free-foot">',
      '                <p class="learn-free-byline">' + escapeHtml(row.subtitle) + '</p>',
      '              </div>',
      '            </div>',
      '            <div class="learn-free-action">',
      '              <span class="learn-free-action-label">Learn</span>',
      '              <span class="learn-free-action-arrow" aria-hidden="true">',
      '                <svg viewBox="0 0 16 16" role="presentation"><path d="M3 8 L13 8 M9 4 L13 8 L9 12" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>',
      '              </span>',
      '            </div>',
      '          </a>'
    ].join('\n');
  }).join('\n\n');
}

function renderPodcastRecentCards() {
  return siteContent.podcastRecentEpisodes.map(function(episode) {
    return [
      '          <a href="' + escapeHtml(episode.href) + '" target="_blank" rel="noopener noreferrer" class="pod-showcase-card">',
      '            <div class="pod-showcase-thumb">',
      '              <img src="' + escapeHtml(episode.image) + '" alt="' + escapeHtml(episode.imageAlt) + '" width="1280" height="720" loading="lazy">',
      '            </div>',
      '            <div class="pod-showcase-name">',
      '              <span class="pod-card-meta">' + escapeHtml(episode.episode) + '</span>',
      '              <h3>' + escapeHtml(episode.title) + '</h3>',
      '            </div>',
      '          </a>'
    ].join('\n');
  }).join('\n');
}

function renderPodcastGuestTiles() {
  return siteContent.podcastGuests.map(function(guest) {
    var width = guest.width || 1024;
    var height = guest.height || 1024;
    var imageClass = guest.imageClass ? ' class="' + guest.imageClass + '"' : '';
    return [
      '        <a href="' + escapeHtml(guest.href) + '" target="_blank" rel="noopener noreferrer" class="pod-guest-tile reveal">',
      '          <div class="pod-guest-image-wrap">',
      '            <img src="' + escapeHtml(guest.image) + '" alt="' + escapeHtml(guest.imageAlt) + '" width="' + width + '" height="' + height + '" loading="lazy"' + imageClass + '>',
      '            <span class="pod-guest-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" role="presentation"><path d="M7 17L17 7M9 7H17V15"></path></svg></span>',
      '          </div>',
      '          <div class="pod-guest-meta">',
      '            <h3>' + escapeHtml(guest.name) + '</h3>',
      '            <span>' + guest.role + '</span>',
      '          </div>',
      '        </a>'
    ].join('\n');
  }).join('\n');
}

function applyDataReplacements(html) {
  return html
    .replace(/\{\{learn_free_rows\}\}/g, renderLearnFreeRows())
    .replace(/\{\{podcast_recent_cards\}\}/g, renderPodcastRecentCards())
    .replace(/\{\{podcast_guest_tiles\}\}/g, renderPodcastGuestTiles())
    .replace(/\{\{podcast_platform_buttons\}\}/g, renderPodcastPlatformButtons())
    .replace(/\{\{footer_podcast_links\}\}/g, renderFooterPodcastLinks())
    .replace(/\{\{footer_social_buttons\}\}/g, renderFooterSocialButtons())
    .replace(/\{\{find_us_icons\}\}/g, renderFindUsIcons());
}

// Regex to match <div data-include="/sections/xyz.html"></div>
const INCLUDE_RE = /<div\s+data-include="(\/sections\/[^"]+)"\s*><\/div>/g;

// Regex to match the inline loader IIFE script block
const LOADER_IIFE_RE = /\s*<script>\s*\(function\(\)\s*\{[\s\S]*?sections-loaded[\s\S]*?\}\)\(\);\s*<\/script>/;

// Regex to match <script src="/js/loader.js"></script>
const LOADER_SCRIPT_RE = /\s*<script\s+src="\/js\/loader\.js"\s*><\/script>/;

// Inject shared CSS around style.css (regex matches both plain and fetchpriority variants)
const STYLE_LINK_RE = /<link rel="stylesheet" href="\/css\/style\.css"([^>]*?)\s*\/?\s*>/;
const SHARED_STYLES_INJECT = (match, attrs) => {
  const cleanAttrs = attrs.trim();
  const styleTag = cleanAttrs
    ? `<link rel="stylesheet" href="/css/style.css" ${cleanAttrs} />`
    : `<link rel="stylesheet" href="/css/style.css" />`;
  return `<link rel="stylesheet" href="/css/globals.css" />\n  ${styleTag}\n  <link rel="stylesheet" href="/css/components.css" />\n  <link rel="stylesheet" href="/css/nav.css" />`;
};

function buildPage(templateFile) {
  const templatePath = path.join(TEMPLATES_DIR, templateFile);
  let html = fs.readFileSync(templatePath, 'utf8');

  // 1. Inline all section partials
  while (true) {
    INCLUDE_RE.lastIndex = 0;
    if (!INCLUDE_RE.test(html)) break;
    INCLUDE_RE.lastIndex = 0;
    html = html.replace(INCLUDE_RE, (match, sectionPath) => {
      const filePath = path.join(ROOT, sectionPath);
      if (!fs.existsSync(filePath)) {
        // Fail loud: missing includes should break the build, not silently produce broken HTML
        throw new Error(`Missing section include: ${sectionPath} (referenced in ${templateFile})`);
      }
      const content = fs.readFileSync(filePath, 'utf8');
      return content.trim();
    });
  }

  // 2. Remove the inline loader IIFE
  html = html.replace(LOADER_IIFE_RE, '');

  // 3. Remove <script src="/js/loader.js"></script>
  html = html.replace(LOADER_SCRIPT_RE, '');

  // 4. Inject shared styles around style.css
  if (!STYLE_LINK_RE.test(html)) {
    throw new Error(`Template ${templateFile} is missing /css/style.css link — cannot inject shared CSS`);
  }
  html = html.replace(STYLE_LINK_RE, SHARED_STYLES_INJECT);

  // 5. Replace build-time content tokens
  html = applyDataReplacements(html);

  // 6. Write to output (preserving subdirectory structure)
  const outPath = path.join(ROOT, templateFile);
  const outDir = path.dirname(outPath);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outPath, html, 'utf8');
  console.log(`  Built: ${templateFile}`);
}

// Recursively find all .html files in templates/
function findTemplates(dir, prefix) {
  prefix = prefix || '';
  var results = [];
  var entries = fs.readdirSync(dir, { withFileTypes: true });
  entries.forEach(function(entry) {
    var rel = prefix ? prefix + '/' + entry.name : entry.name;
    if (entry.isDirectory()) {
      results = results.concat(findTemplates(path.join(dir, entry.name), rel));
    } else if (entry.name.endsWith('.html')) {
      results.push(rel);
    }
  });
  return results;
}

// Run
console.log('Building BDS pages...');
var templates = findTemplates(TEMPLATES_DIR);

if (templates.length === 0) {
  console.error('No templates found in templates/');
  process.exit(1);
}

templates.forEach(buildPage);
console.log(`Done. ${templates.length} pages built.`);
