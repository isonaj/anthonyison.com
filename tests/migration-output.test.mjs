import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function exists(relativePath) {
  return fs.existsSync(path.join(repoRoot, relativePath));
}

test('important slug pages are generated', () => {
  assert.equal(exists('dist/load-testing-with-wrk/index.html'), true);
  assert.equal(exists('dist/ghost-on-digital-ocean-with-docker/index.html'), true);
  assert.equal(exists('dist/about/index.html'), true);
});

test('rss feed is generated', () => {
  assert.equal(exists('dist/rss.xml'), true);
});

test('imported manifest contains 30 published Ghost entries', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(repoRoot, 'src/data/import-manifest.json'), 'utf8'));
  assert.equal(manifest.posts.length, 30);
});
