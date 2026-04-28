#!/usr/bin/env node

// Build script — inlines section partials into page templates
// Replaces client-side fetch() assembly with pre-rendered HTML

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const siteContent = require(path.join(__dirname, 'data', 'site-content.js'));

const ROOT = __dirname;
const TEMPLATES_DIR = path.join(ROOT, 'templates');
const YT_PODCAST_PLAYLIST_ID = 'PLIn-yd4vnXbg49orM_CENby6YNGK8k-U0';
const PODCAST_EPISODE_COUNT = 6;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatPodcastDate(dateStr) {
  if (!dateStr) return '';
  var d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[d.getMonth()] + ' ' + d.getDate();
}

function bestPodcastThumbnail(thumbnails, videoId) {
  if (thumbnails && thumbnails.maxres && thumbnails.maxres.url) return thumbnails.maxres.url;
  if (thumbnails && thumbnails.standard && thumbnails.standard.url) return thumbnails.standard.url;
  if (thumbnails && thumbnails.high && thumbnails.high.url) return thumbnails.high.url;
  if (thumbnails && thumbnails.medium && thumbnails.medium.url) return thumbnails.medium.url;
  if (thumbnails && thumbnails.default && thumbnails.default.url) return thumbnails.default.url;
  return videoId ? 'https://i.ytimg.com/vi/' + videoId + '/maxresdefault.jpg' : '';
}

async function refreshPodcastRecentEpisodes() {
  var apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.log('  Podcast: using checked-in episode data (YOUTUBE_API_KEY not set)');
    return;
  }

  var playlistUrl =
    'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails,status'
    + '&playlistId=' + encodeURIComponent(YT_PODCAST_PLAYLIST_ID)
    + '&maxResults=' + PODCAST_EPISODE_COUNT
    + '&key=' + encodeURIComponent(apiKey);

  try {
    var response = await fetch(playlistUrl);
    if (!response.ok) throw new Error('YouTube playlistItems returned ' + response.status);
    var data = await response.json();
    var rawItems = data.items || [];
    var publicItems = rawItems.filter(function(item) {
      var title = item && item.snippet ? item.snippet.title : '';
      var privacy = item && item.status ? item.status.privacyStatus : '';
      return privacy !== 'private'
        && title
        && title !== 'Private video'
        && title !== 'Deleted video'
        && item.contentDetails
        && item.contentDetails.videoId;
    });

    publicItems.sort(function(a, b) {
      var aDate = new Date((a.contentDetails && a.contentDetails.videoPublishedAt) || (a.snippet && a.snippet.publishedAt) || 0).getTime();
      var bDate = new Date((b.contentDetails && b.contentDetails.videoPublishedAt) || (b.snippet && b.snippet.publishedAt) || 0).getTime();
      return bDate - aDate;
    });

    if (publicItems.length === 0) throw new Error('YouTube returned no public podcast items');

    var totalEpisodes = data.pageInfo && data.pageInfo.totalResults ? data.pageInfo.totalResults : publicItems.length;
    siteContent.podcastRecentEpisodes = publicItems.slice(0, PODCAST_EPISODE_COUNT).map(function(item, index) {
      var videoId = item.contentDetails.videoId;
      var publishedAt = item.contentDetails.videoPublishedAt || item.snippet.publishedAt;
      return {
        href: 'https://www.youtube.com/watch?v=' + videoId,
        image: bestPodcastThumbnail(item.snippet.thumbnails, videoId),
        imageAlt: (item.snippet.title || 'Podcast episode') + ' thumbnail',
        episode: 'Ep. ' + (totalEpisodes - index),
        date: formatPodcastDate(publishedAt),
        title: item.snippet.title || 'Untitled episode'
      };
    });
    console.log('  Podcast: refreshed recent episodes from YouTube at build time');
  } catch (err) {
    console.warn('  Podcast: YouTube refresh failed; using checked-in episode data:', err.message);
  }
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
  var episodes = siteContent.podcastRecentEpisodes.slice(0, 6);
  if (episodes.length === 0) return '';

  function episodeNumber(episode) {
    return String(episode.episode || '').replace(/^Ep\.\s*/i, '');
  }

  function episodeDate(episode) {
    return episode.date || '';
  }

  function episodeDuration(episode) {
    return episode.duration || '';
  }

  var hero = episodes[0];
  var rows = episodes.slice(1, 6).map(function(episode) {
    var duration = episodeDuration(episode);
    return [
      '          <a href="' + escapeHtml(episode.href) + '" target="_blank" rel="noopener noreferrer" class="re-row">',
      '            <div class="re-row-thumb">',
      '              <img src="' + escapeHtml(episode.image) + '" alt="' + escapeHtml(episode.imageAlt) + '" width="1280" height="720" loading="lazy">',
      duration ? '              <span class="re-row-dur">' + escapeHtml(duration) + '</span>' : '',
      '            </div>',
      '            <div class="re-row-body">',
      '              <div class="re-row-meta">',
      '                <span class="ep">EP. ' + escapeHtml(episodeNumber(episode)) + '</span>',
      episodeDate(episode) ? '                <span class="sep">&middot;</span>' : '',
      episodeDate(episode) ? '                <span class="date">' + escapeHtml(episodeDate(episode)) + '</span>' : '',
      '              </div>',
      '              <h3 class="re-row-title">' + escapeHtml(episode.title) + '</h3>',
      '            </div>',
      '            <span class="re-row-arrow" aria-hidden="true">&rarr;</span>',
      '          </a>'
    ].filter(Boolean).join('\n');
  }).join('\n');

  return [
    '        <div class="re-grid">',
    '          <a href="' + escapeHtml(hero.href) + '" target="_blank" rel="noopener noreferrer" class="re-hero">',
    '            <div class="re-hero-thumb">',
    '              <img src="' + escapeHtml(hero.image) + '" alt="' + escapeHtml(hero.imageAlt) + '" width="1280" height="720" loading="eager" fetchpriority="high">',
    '            </div>',
    '            <div class="re-hero-body">',
    '              <div class="re-hero-row">',
    '                <div class="re-hero-text">',
    '                  <div class="re-hero-meta">',
    '                    <span class="ep">EP. ' + escapeHtml(episodeNumber(hero)) + '</span>',
    episodeDate(hero) ? '                    <span class="sep">&middot;</span>' : '',
    episodeDate(hero) ? '                    <span class="date">' + escapeHtml(episodeDate(hero)) + '</span>' : '',
    '                  </div>',
    '                  <h2 class="re-hero-title">' + escapeHtml(hero.title) + '</h2>',
    '                </div>',
    '                <span class="re-hero-arrow" aria-hidden="true">&rarr;</span>',
    '              </div>',
    '            </div>',
    '          </a>',
    '          <div class="re-rows">',
    rows,
    '          </div>',
    '        </div>'
  ].filter(Boolean).join('\n');
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
    .replace(/\{\{find_us_icons\}\}/g, renderFindUsIcons())
    .replace(/\{\{footer_year\}\}/g, String(new Date().getFullYear()));
}

// Regex to match <div data-include="/sections/xyz.html"></div>
const INCLUDE_RE = /<div\s+data-include="(\/sections\/[^"]+)"\s*><\/div>/g;

// Regex to match the inline loader IIFE script block
const LOADER_IIFE_RE = /\s*<script>\s*\(function\(\)\s*\{[\s\S]*?sections-loaded[\s\S]*?\}\)\(\);\s*<\/script>/;

// Regex to match <script src="/js/loader.js"></script>
const LOADER_SCRIPT_RE = /\s*<script\s+src="\/js\/loader\.js"\s*><\/script>/;

// Content-hash cache buster for static assets we serve immutable.
// We don't rename files (Vercel cleanUrls + simple hosting), we append ?v=<hash>.
const ASSET_HASHES = {};
function assetHash(relPath) {
  if (ASSET_HASHES[relPath]) return ASSET_HASHES[relPath];
  var full = path.join(ROOT, relPath);
  if (!fs.existsSync(full)) { ASSET_HASHES[relPath] = ''; return ''; }
  var hash = crypto.createHash('md5').update(fs.readFileSync(full)).digest('hex').slice(0, 10);
  ASSET_HASHES[relPath] = hash;
  return hash;
}

function bustAssetUrls(html) {
  // CSS + JS only — fonts, images, and videos use long-cache via /assets/* immutable rule.
  return html.replace(/(href|src)="(\/(?:css|js)\/[^"?#]+\.(?:css|js))"/g, function(_, attr, url) {
    var h = assetHash(url);
    return h ? attr + '="' + url + '?v=' + h + '"' : attr + '="' + url + '"';
  });
}

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

  // 6. Append content hashes to /css/* and /js/* references so they can cache immutable
  html = bustAssetUrls(html);

  // 7. Write to output (preserving subdirectory structure)
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

function buildSitemap() {
  var today = new Date().toISOString().slice(0, 10);
  var entries = [
    { loc: 'https://www.baddecisions.studio/',                                    changefreq: 'weekly',  priority: '1.0' },
    { loc: 'https://www.baddecisions.studio/podcast',                             changefreq: 'weekly',  priority: '0.8' },
    { loc: 'https://www.baddecisions.studio/education',                           changefreq: 'monthly', priority: '0.8' },
    { loc: 'https://www.baddecisions.studio/work-with-us',                        changefreq: 'monthly', priority: '0.7' },
    { loc: 'https://www.baddecisions.studio/work-with-us/services',               changefreq: 'monthly', priority: '0.7' },
    { loc: 'https://www.baddecisions.studio/work-with-us/media-partnerships',     changefreq: 'monthly', priority: '0.7' },
    { loc: 'https://www.baddecisions.studio/work-with-us/open-roles',             changefreq: 'monthly', priority: '0.5' }
  ];
  var urlBlocks = entries.map(function(e) {
    return [
      '  <url>',
      '    <loc>' + e.loc + '</loc>',
      '    <lastmod>' + today + '</lastmod>',
      '    <changefreq>' + e.changefreq + '</changefreq>',
      '    <priority>' + e.priority + '</priority>',
      '  </url>'
    ].join('\n');
  }).join('\n');
  var xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urlBlocks + '\n</urlset>\n';
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml, 'utf8');
  console.log('  Built: sitemap.xml');
}

async function main() {
  console.log('Building BDS pages...');
  await refreshPodcastRecentEpisodes();

  var templates = findTemplates(TEMPLATES_DIR);

  if (templates.length === 0) {
    console.error('No templates found in templates/');
    process.exit(1);
  }

  templates.forEach(buildPage);
  buildSitemap();
  console.log(`Done. ${templates.length} pages built.`);
}

main().catch(function(err) {
  console.error(err);
  process.exit(1);
});
