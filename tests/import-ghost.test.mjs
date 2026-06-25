import test from 'node:test';
import assert from 'node:assert/strict';
import {
  cleanGhostHtml,
  frontmatterBlock,
  outputSlugForPost,
  rewriteLocalGhostImageUrls
} from '../scripts/import-ghost.mjs';

test('cleanGhostHtml removes Ghost markdown card comments', () => {
  const html = '<!--kg-card-begin: markdown--><p>Hello</p><!--kg-card-end: markdown-->';
  assert.equal(cleanGhostHtml(html), '<p>Hello</p>');
});

test('frontmatterBlock serializes arrays and quoted strings', () => {
  const result = frontmatterBlock({
    title: 'A title: with colon',
    slug: 'a-title',
    publishedAt: '2020-01-01T00:00:00.000Z',
    tags: ['ghost', 'astro'],
    type: 'post'
  });

  assert.match(result, /title: "A title: with colon"/);
  assert.match(result, /tags:\n  - "ghost"\n  - "astro"/);
});

test('outputSlugForPost maps about-me page to about', () => {
  assert.equal(outputSlugForPost({ slug: 'about-me', type: 'page' }), 'about');
  assert.equal(outputSlugForPost({ slug: 'load-testing-with-wrk', type: 'post' }), 'load-testing-with-wrk');
});

test('rewriteLocalGhostImageUrls rewrites Ghost content image paths', () => {
  const copied = [];
  const rewritten = rewriteLocalGhostImageUrls(
    '<img src="/content/images/2020/09/example.jpg">',
    (path) => {
      copied.push(path);
      return '/images/ghost/2020/09/example.jpg';
    }
  );

  assert.equal(rewritten, '<img src="/images/ghost/2020/09/example.jpg">');
  assert.deepEqual(copied, ['/content/images/2020/09/example.jpg']);
});
