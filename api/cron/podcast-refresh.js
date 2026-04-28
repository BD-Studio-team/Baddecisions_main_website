// Vercel Cron endpoint: trigger a production rebuild so podcast episodes are
// refreshed at build time and served as static HTML.

import crypto from 'node:crypto';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  if (!process.env.CRON_SECRET) {
    return res.status(500).json({ ok: false, error: 'CRON_SECRET is not configured' });
  }

  var provided = Buffer.from(req.headers.authorization || '');
  var expected = Buffer.from('Bearer ' + process.env.CRON_SECRET);
  if (provided.length !== expected.length || !crypto.timingSafeEqual(provided, expected)) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }

  var deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!deployHookUrl) {
    return res.status(500).json({ ok: false, error: 'VERCEL_DEPLOY_HOOK_URL is not configured' });
  }

  try {
    var response = await fetch(deployHookUrl, { method: 'POST' });
    if (!response.ok) {
      throw new Error('Deploy hook returned ' + response.status);
    }

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ ok: true, refreshedBy: 'deploy-hook' });
  } catch (err) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(502).json({ ok: false, error: err.message });
  }
}
