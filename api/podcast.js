// Vercel Serverless Function — live podcast feed from YouTube
// Cached in Upstash Redis (when configured) to reduce YouTube API quota usage.
//
// Cache strategy:
//   1. Check Redis for cached payload — if fresh (< CACHE_TTL_MS), return it.
//   2. If Redis has a stale copy (< STALE_TTL_MS), return it immediately AND kick off
//      a background refresh. This gives the user a fast response even when YouTube is slow.
//   3. If nothing in Redis, fetch from YouTube synchronously and cache.
//   4. On any error, return FALLBACK_EPISODES with a short edge cache TTL.
//
// Upstash is optional — if env vars aren't set, the function falls back to direct
// YouTube calls (which are still cached at the Vercel edge via s-maxage header).

import { Redis } from '@upstash/redis';

const YT_PODCAST_PLAYLIST_ID = 'PLIn-yd4vnXbg49orM_CENby6YNGK8k-U0';
const YT_API_KEY = process.env.YOUTUBE_API_KEY || '';
const MAX_RESULTS = 8;

// Redis cache TTLs
const CACHE_KEY = 'bds:podcast:feed:v2';
const CACHE_TTL_SECONDS = 3600;        // 1 hour — fresh
const STALE_TTL_SECONDS = 86400;       // 24 hours — serve stale while refreshing

// Initialize Redis client only if env vars are present.
// Upstash reads KV_REST_API_URL / KV_REST_API_TOKEN automatically via Redis.fromEnv(),
// but we check explicitly so the function works without Redis configured.
let redis = null;
if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
  try {
    redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Redis init failed, continuing without cache:', err.message);
    redis = null;
  }
}

const FALLBACK_EPISODES = [
  {
    videoId: 'xRx7yKg0n-U',
    title: 'The BEST AI tool for Artists? 👀',
    description: 'A breakdown of one of the most useful new AI tools for artists and creators.',
    publishedAt: '2026-04-01T00:00:00.000Z',
  },
  {
    videoId: 'ETeL0mYJxQs',
    title: 'Seedance 2.0 Is Finally Here but ...',
    description: 'A practical look at what changed, what matters, and what still needs work.',
    publishedAt: '2026-03-29T00:00:00.000Z',
  },
  {
    videoId: 'SJlxJMQkkgg',
    title: '$122 BILLION to make CHATGPT the AI Super App',
    description: 'What the latest AI platform push means for products, users, and competition.',
    publishedAt: '2026-03-26T00:00:00.000Z',
  },
  {
    videoId: 'dQ66PVD3oVY',
    title: 'Can we Create Quality Visuals and Music with AI?',
    description: 'A grounded conversation about how far AI tools can really take creative work.',
    publishedAt: '2026-03-23T00:00:00.000Z',
  },
  {
    videoId: '315kvYywUGU',
    title: 'The Most Powerful AI MODEL Leaked',
    description: 'A practical breakdown of the latest AI model leak and why it matters.',
    publishedAt: '2026-03-20T00:00:00.000Z',
  },
];

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[d.getMonth()] + ' ' + d.getFullYear();
}

function cleanDescription(text) {
  if (!text) return '';
  return text.replace(/\n{3,}/g, '\n\n').trim().slice(0, 300);
}

function bestThumbnail(thumbnails, videoId) {
  if (thumbnails && thumbnails.maxres && thumbnails.maxres.url) return thumbnails.maxres.url;
  if (thumbnails && thumbnails.standard && thumbnails.standard.url) return thumbnails.standard.url;
  if (thumbnails && thumbnails.high && thumbnails.high.url) return thumbnails.high.url;
  if (thumbnails && thumbnails.medium && thumbnails.medium.url) return thumbnails.medium.url;
  if (thumbnails && thumbnails.default && thumbnails.default.url) return thumbnails.default.url;
  return videoId ? 'https://i.ytimg.com/vi/' + videoId + '/hqdefault.jpg' : '';
}

function normalizeEpisode(item, index, totalEpisodes) {
  const videoId = item.videoId;
  return {
    id: videoId,
    episodeNumber: totalEpisodes > 0 ? totalEpisodes - index : null,
    title: item.title || 'Untitled',
    description: cleanDescription(item.description || ''),
    date: formatDate(item.publishedAt),
    duration: '',
    artworkUrl: bestThumbnail(item.thumbnails, videoId),
    youtubeUrl: videoId ? 'https://www.youtube.com/watch?v=' + videoId : '',
    trackViewUrl: videoId ? 'https://www.youtube.com/watch?v=' + videoId : '',
  };
}

function fallbackPayload() {
  const totalEpisodes = FALLBACK_EPISODES.length;
  return {
    totalEpisodes: totalEpisodes,
    episodes: FALLBACK_EPISODES.map(function(item, index) {
      return normalizeEpisode(item, index, totalEpisodes);
    }),
  };
}

async function fetchJson(url, label) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(label + ' returned ' + response.status);
  }
  return response.json();
}

async function fetchFromYouTube() {
  if (!YT_API_KEY) return fallbackPayload();

  const playlistUrl =
    'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails,status'
    + '&playlistId=' + YT_PODCAST_PLAYLIST_ID
    + '&maxResults=' + MAX_RESULTS
    + '&key=' + YT_API_KEY;

  const playlistData = await fetchJson(playlistUrl, 'YouTube playlistItems');
  const rawItems = playlistData.items || [];
  const publicItems = rawItems.filter(function(item) {
    const title = item && item.snippet ? item.snippet.title : '';
    const privacy = item && item.status ? item.status.privacyStatus : '';
    return privacy !== 'private'
      && title
      && title !== 'Private video'
      && title !== 'Deleted video'
      && item.contentDetails
      && item.contentDetails.videoId;
  });
  publicItems.sort(function(a, b) {
    const aDate = new Date((a.contentDetails && a.contentDetails.videoPublishedAt) || (a.snippet && a.snippet.publishedAt) || 0).getTime();
    const bDate = new Date((b.contentDetails && b.contentDetails.videoPublishedAt) || (b.snippet && b.snippet.publishedAt) || 0).getTime();
    return bDate - aDate;
  });

  const totalEpisodes = playlistData.pageInfo && playlistData.pageInfo.totalResults
    ? playlistData.pageInfo.totalResults
    : publicItems.length;

  return {
    totalEpisodes: totalEpisodes,
    episodes: publicItems.map(function(item, index) {
      return normalizeEpisode({
        videoId: item.contentDetails.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        publishedAt: item.contentDetails.videoPublishedAt || item.snippet.publishedAt,
        thumbnails: item.snippet.thumbnails,
      }, index, totalEpisodes);
    }),
  };
}

// ── Redis helpers ───────────────────────────────────────────────
// The cached value is wrapped with { fetchedAt, payload } so we can decide
// fresh vs stale without a separate TTL lookup.

async function getCached() {
  if (!redis) return null;
  try {
    const raw = await redis.get(CACHE_KEY);
    if (!raw) return null;
    // Upstash returns objects directly when stored with redis.set()
    const wrapped = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!wrapped || !wrapped.fetchedAt || !wrapped.payload) return null;
    const ageSeconds = Math.floor((Date.now() - wrapped.fetchedAt) / 1000);
    return { ...wrapped, ageSeconds };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Redis get failed:', err.message);
    return null;
  }
}

async function setCached(payload) {
  if (!redis) return;
  try {
    const wrapped = { fetchedAt: Date.now(), payload: payload };
    // Store for STALE_TTL_SECONDS; the "fresh vs stale" check uses fetchedAt.
    await redis.set(CACHE_KEY, wrapped, { ex: STALE_TTL_SECONDS });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Redis set failed:', err.message);
  }
}

async function refreshInBackground() {
  try {
    const fresh = await fetchFromYouTube();
    await setCached(fresh);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Background YouTube refresh failed:', err.message);
  }
}

// ── Handler ─────────────────────────────────────────────────────

export default async function handler(req, res) {
  // 1. Try Redis cache first (if configured)
  const cached = await getCached();

  if (cached) {
    const isFresh = cached.ageSeconds < CACHE_TTL_SECONDS;
    if (isFresh) {
      // Fresh cache hit — return immediately
      res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('X-Cache-Age', String(cached.ageSeconds));
      return res.status(200).json(cached.payload);
    }

    // Stale cache hit — serve immediately, refresh in background.
    // Vercel functions finish after the response, but because Redis writes
    // are fast we can usually complete the refresh inside the timeout.
    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=86400');
    res.setHeader('X-Cache', 'STALE');
    res.setHeader('X-Cache-Age', String(cached.ageSeconds));
    res.status(200).json(cached.payload);
    // Fire and forget — do not await
    refreshInBackground();
    return;
  }

  // 2. No cache — fetch live from YouTube
  try {
    const payload = await fetchFromYouTube();
    await setCached(payload);
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.setHeader('X-Cache', redis ? 'MISS' : 'BYPASS');
    return res.status(200).json(payload);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Podcast API error:', err.message);
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
    res.setHeader('X-Cache', 'FALLBACK');
    return res.status(200).json(fallbackPayload());
  }
}
