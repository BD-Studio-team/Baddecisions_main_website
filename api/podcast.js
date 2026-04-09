// Vercel Serverless Function — podcast episodes with cached YouTube thumbnails
// Apple Podcasts (show ID: 1677462934) + YouTube Data API + Upstash Redis cache

import { Redis } from '@upstash/redis';

const SHOW_ID = '1677462934';
const LIMIT = 20;
const LOOKUP_URL = `https://itunes.apple.com/lookup?id=${SHOW_ID}&media=podcast&entity=podcastEpisode&limit=${LIMIT}&sort=recent`;
const YT_CHANNEL_ID = 'UCOQ6GGRyyu8S3jahnUz2zHw';
const YT_API_KEY = process.env.YOUTUBE_API_KEY || '';

// Initialize Redis (env vars set automatically when you add Upstash via Vercel Marketplace)
let redis = null;
try {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });
  } else if (process.env.KV_REDIS_URL) {
    redis = Redis.fromEnv({ UPSTASH_REDIS_REST_URL: '', UPSTASH_REDIS_REST_TOKEN: '' });
    // Use the connection URL directly
    const url = new URL(process.env.KV_REDIS_URL);
    redis = new Redis({
      url: 'https://' + url.hostname,
      token: url.password,
    });
  }
} catch (e) { /* redis not configured yet */ }

// Hardcoded fallback cache for when Redis isn't set up yet
const FALLBACK_CACHE = {
  "The BEST AI tool for Artists? 👀": "xRx7yKg0n-U",
  "Seedance 2.0 Is Finally Here but ... 🤯": "ETeL0mYJxQs",
  "$122 BILLION to make CHATGPT the AI Super App 👀": "SJlxJMQkkgg",
  "Can we Create Quality Visuals and Music with AI?": "dQ66PVD3oVY",
  "The Most Powerful AI MODEL Leaked 👀": "315kvYywUGU",
  "Why Claude AI is becoming #1 AI APP🔥?": "DxfMhTIU0Ss",
  "Higgsfield AI releases their First AI Film and It's really GOOD??": "bY6iVUcI6K8",
  "NVIDIA's DLSS 5, Dune Part 3 and China's First Commercial Brain Chip 🤯": "DiLC7VZrBHo",
};

function formatDuration(ms) {
  if (!ms) return '';
  const totalMin = Math.round(ms / 60000);
  if (totalMin < 60) return totalMin + 'm';
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h + 'h ' + (m > 0 ? m + 'm' : '');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[d.getMonth()] + ' ' + d.getFullYear();
}

function cleanDescription(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, 300);
}

// Get cached YouTube video ID from Redis
async function getCachedVideoId(title) {
  if (!redis) return FALLBACK_CACHE[title] || null;
  try {
    const key = 'yt:' + title.slice(0, 80);
    return await redis.get(key);
  } catch (e) {
    return FALLBACK_CACHE[title] || null;
  }
}

// Save YouTube video ID to Redis (never expires)
async function cacheVideoId(title, videoId) {
  if (!redis) return;
  try {
    const key = 'yt:' + title.slice(0, 80);
    await redis.set(key, videoId);
  } catch (e) { /* skip */ }
}

// Search YouTube for a single episode — only called for uncached episodes
async function searchYouTube(title) {
  if (!YT_API_KEY) return null;
  try {
    const q = title.replace(/[^\w\s]/g, '').slice(0, 50);
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${YT_CHANNEL_ID}&q=${encodeURIComponent(q)}&type=video&maxResults=1&key=${YT_API_KEY}`;
    const resp = await fetch(url);
    if (!resp.ok) return null;
    const data = await resp.json();
    if (data.items && data.items.length > 0) {
      return {
        videoId: data.items[0].id.videoId,
        thumbnail: data.items[0].snippet.thumbnails.high?.url || data.items[0].snippet.thumbnails.default.url
      };
    }
  } catch (e) { /* quota exceeded or network error */ }
  return null;
}

// Get YouTube data for an episode — cache-first, search only if missing
async function getYouTubeData(title) {
  // 1. Check cache
  const cached = await getCachedVideoId(title);
  if (cached) {
    return {
      videoId: cached,
      thumbnail: `https://i.ytimg.com/vi/${cached}/hqdefault.jpg`
    };
  }

  // 2. Search YouTube (uses 100 quota units)
  const result = await searchYouTube(title);
  if (result) {
    // 3. Cache permanently
    await cacheVideoId(title, result.videoId);
    return result;
  }

  return null;
}

export default async function handler(req, res) {
  try {
    // Fetch from Apple
    const response = await fetch(LOOKUP_URL);
    if (!response.ok) throw new Error('Apple API returned ' + response.status);

    const data = await response.json();
    const results = data.results || [];

    const show = results.find(r => r.wrapperType === 'track' && r.kind === 'podcast');
    const totalEpisodes = show ? show.trackCount : 0;
    const episodeResults = results
      .filter(r => r.wrapperType === 'podcastEpisode' || r.kind === 'podcast-episode');

    // Get YouTube data for each episode (cached = free, uncached = 100 units each)
    const ytPromises = episodeResults.map(ep => getYouTubeData(ep.trackName || ''));
    const ytResults = await Promise.all(ytPromises);

    const episodes = episodeResults.map((ep, index) => {
      const yt = ytResults[index];
      return {
        id: ep.trackId,
        episodeNumber: totalEpisodes > 0 ? totalEpisodes - index : null,
        title: ep.trackName || 'Untitled',
        description: cleanDescription(ep.description || ep.shortDescription || ''),
        date: formatDate(ep.releaseDate),
        duration: formatDuration(ep.trackTimeMillis),
        artworkUrl: yt ? yt.thumbnail : (ep.artworkUrl600 || ep.artworkUrl160 || ''),
        youtubeUrl: yt ? 'https://www.youtube.com/watch?v=' + yt.videoId : '',
        trackViewUrl: ep.trackViewUrl || ep.collectionViewUrl || ''
      };
    });

    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.status(200).json({ totalEpisodes, episodes });
  } catch (err) {
    console.error('Podcast API error:', err.message);
    res.status(500).json({ error: 'Failed to fetch podcast data', totalEpisodes: 0, episodes: [] });
  }
}
