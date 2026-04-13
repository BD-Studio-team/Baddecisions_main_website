// Vercel Serverless Function — live podcast feed from YouTube only
// Top section of /podcast is dynamic. Guest section remains curated in HTML.

const YT_CHANNEL_ID = 'UCOQ6GGRyyu8S3jahnUz2zHw';
const YT_API_KEY = process.env.YOUTUBE_API_KEY || '';
const MAX_RESULTS = 8;

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
  var d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[d.getMonth()] + ' ' + d.getFullYear();
}

function cleanDescription(text) {
  if (!text) return '';
  return text
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, 300);
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
  var videoId = item.videoId;
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
  var totalEpisodes = FALLBACK_EPISODES.length;
  return {
    totalEpisodes: totalEpisodes,
    episodes: FALLBACK_EPISODES.map(function(item, index) {
      return normalizeEpisode(item, index, totalEpisodes);
    }),
  };
}

async function fetchJson(url, label) {
  var response = await fetch(url);
  if (!response.ok) {
    throw new Error(label + ' returned ' + response.status);
  }
  return response.json();
}

async function getUploadsPlaylistId() {
  var channelUrl = 'https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=' + YT_CHANNEL_ID + '&key=' + YT_API_KEY;
  var channelData = await fetchJson(channelUrl, 'YouTube channels');
  var items = channelData.items || [];
  var uploadsId = items[0] && items[0].contentDetails && items[0].contentDetails.relatedPlaylists
    ? items[0].contentDetails.relatedPlaylists.uploads
    : '';

  if (!uploadsId) {
    throw new Error('YouTube uploads playlist not found');
  }

  return uploadsId;
}

async function getLatestYouTubeEpisodes() {
  if (!YT_API_KEY) return fallbackPayload();

  var uploadsId = await getUploadsPlaylistId();
  var playlistUrl =
    'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails,status'
    + '&playlistId=' + uploadsId
    + '&maxResults=' + MAX_RESULTS
    + '&key=' + YT_API_KEY;

  var playlistData = await fetchJson(playlistUrl, 'YouTube playlistItems');
  var rawItems = playlistData.items || [];
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

  var totalEpisodes = playlistData.pageInfo && playlistData.pageInfo.totalResults
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

export default async function handler(req, res) {
  try {
    var payload = await getLatestYouTubeEpisodes();
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.status(200).json(payload);
  } catch (err) {
    console.error('Podcast API error:', err.message);
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
    res.status(200).json(fallbackPayload());
  }
}
