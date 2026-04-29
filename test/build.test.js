const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const ROOT = path.resolve(__dirname, '..');

const EXPECTED_OUTPUTS = [
  '404.html',
  'education.html',
  'index.html',
  'podcast.html',
  'work-with-us.html',
  'work-with-us/media-partnerships.html',
  'work-with-us/open-roles.html',
  'work-with-us/services.html',
  'sitemap.xml',
  'llms-full.txt'
];

function readOutput(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

test('build emits expected static outputs with resolved includes, tokens, JSON-LD, and asset hashes', () => {
  const result = spawnSync(process.execPath, ['build.js'], {
    cwd: ROOT,
    env: {
      ...process.env,
      YOUTUBE_API_KEY: ''
    },
    encoding: 'utf8'
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);

  EXPECTED_OUTPUTS.forEach((relPath) => {
    assert.ok(fs.existsSync(path.join(ROOT, relPath)), `${relPath} should exist after build`);
  });

  const htmlOutputs = EXPECTED_OUTPUTS.filter((relPath) => relPath.endsWith('.html'));

  htmlOutputs.forEach((relPath) => {
    const html = readOutput(relPath);

    assert.equal(/\bdata-include=/.test(html), false, `${relPath} should not contain unresolved data-include markup`);
    assert.equal(/\{\{[^{}]+\}\}/.test(html), false, `${relPath} should not contain unresolved build tokens`);

    const unversionedAsset = html.match(/(?:href|src)="\/(?:css|js)\/[^"?#]+\.(?:css|js)(?!\?v=[0-9a-f]{10})"/);
    assert.equal(unversionedAsset, null, `${relPath} has an unversioned CSS/JS reference`);

    const jsonLdBlocks = Array.from(html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/g));
    jsonLdBlocks.forEach((match, index) => {
      assert.doesNotThrow(() => JSON.parse(match[1]), `${relPath} JSON-LD block ${index + 1} should parse`);
    });
  });
});
