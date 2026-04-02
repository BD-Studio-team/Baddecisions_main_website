// Vercel Serverless Function — fetches live podcast episodes from Apple Podcasts API
// Show ID: 1677462934 (Bad Decisions Podcast)

const SHOW_ID = '1677462934';
const LIMIT = 20;
const LOOKUP_URL = `https://itunes.apple.com/lookup?id=${SHOW_ID}&media=podcast&entity=podcastEpisode&limit=${LIMIT}&sort=recent`;

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
  // Strip HTML tags and decode basic entities
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

export default async function handler(req, res) {
  try {
    const response = await fetch(LOOKUP_URL);
    if (!response.ok) {
      throw new Error('Apple API returned ' + response.status);
    }

    const data = await response.json();
    const results = data.results || [];

    // First result is the show itself, rest are episodes
    const show = results.find(r => r.wrapperType === 'track' && r.kind === 'podcast');
    const episodes = results
      .filter(r => r.wrapperType === 'podcastEpisode' || r.kind === 'podcast-episode')
      .map((ep, index) => ({
        id: ep.trackId,
        episodeNumber: ep.trackCount ? ep.trackCount - index : null,
        title: ep.trackName || 'Untitled',
        description: cleanDescription(ep.description || ep.shortDescription || ''),
        date: formatDate(ep.releaseDate),
        duration: formatDuration(ep.trackTimeMillis),
        artworkUrl: ep.artworkUrl160 || ep.artworkUrl600 || '',
        trackViewUrl: ep.trackViewUrl || ep.collectionViewUrl || ''
      }));

    const totalEpisodes = show ? show.trackCount : episodes.length;

    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.status(200).json({
      totalEpisodes,
      episodes
    });
  } catch (err) {
    console.error('Podcast API error:', err.message);
    res.status(500).json({
      error: 'Failed to fetch podcast data',
      totalEpisodes: 0,
      episodes: []
    });
  }
}
