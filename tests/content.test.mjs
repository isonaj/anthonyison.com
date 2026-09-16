import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const blogDir = path.join(repoRoot, 'src/content/blog');

function entries() {
  return fs.readdirSync(blogDir)
    .filter((name) => name.endsWith('.md'))
    .map((name) => ({
      slug: name.replace(/\.md$/, ''),
      frontmatter: fs.readFileSync(path.join(blogDir, name), 'utf8').split('---')[1] ?? ''
    }));
}

function field(frontmatter, name) {
  const match = frontmatter.match(new RegExp(`^${name}:\\s*"?([^"\n]*)"?$`, 'm'));
  return match?.[1];
}

test('no content still points at the old Ghost site', () => {
  for (const entry of entries()) {
    assert.equal(entry.frontmatter.includes('__GHOST_URL__'), false, `${entry.slug} still has a Ghost placeholder URL`);
  }
});

test('every local cover image exists', () => {
  for (const entry of entries()) {
    const cover = field(entry.frontmatter, 'featureImage');
    if (!cover || !cover.startsWith('/')) continue;
    assert.equal(
      fs.existsSync(path.join(repoRoot, 'public', cover)),
      true,
      `${entry.slug} points at a missing cover image: ${cover}`
    );
  }
});
