import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(repoRoot, 'dist');
const blogDir = path.join(repoRoot, 'src/content/blog');
const BATCH_SIZE = 10;

function exists(relativePath) {
  return fs.existsSync(path.join(repoRoot, relativePath));
}

function read(relativePath) {
  return fs.readFileSync(path.join(distDir, relativePath), 'utf8');
}

/** The page at a site path, as built. */
function readPage(sitePath) {
  return read(path.join(sitePath, 'index.html'));
}

/** Posts newest first, read from the content files rather than from the built site. */
function expectedPosts() {
  return fs.readdirSync(blogDir)
    .filter((name) => name.endsWith('.md'))
    .map((name) => {
      // Content files carry a mix of line endings on Windows, so read them flat.
      const frontmatter = fs.readFileSync(path.join(blogDir, name), 'utf8')
        .replace(/\r\n/g, '\n')
        .split('---')[1] ?? '';
      return {
        slug: name.replace(/\.md$/, ''),
        type: frontmatter.match(/^type:\s*"?(\w+)"?$/m)?.[1] ?? 'post',
        publishedAt: new Date(frontmatter.match(/^publishedAt:\s*"?([^"\n]+)"?$/m)?.[1]),
        tags: [...(frontmatter.match(/^tags:\n((?:[ \t]+-[^\n]*\n)+)/m)?.[1] ?? '')
          .matchAll(/^[ \t]+-\s*"?([^"\n]+?)"?\s*$/gm)].map((m) => m[1])
      };
    })
    .filter((entry) => entry.type === 'post')
    .sort((a, b) => b.publishedAt - a.publishedAt);
}

/** The slugs a feed page links to, in the order they appear. */
function feedSlugs(html) {
  return [...html.matchAll(/<a class="post-title" href="\/([^/"]+)\/"/g)].map((m) => m[1]);
}

/**
 * The address of the next page of the feed, or '' at the end. An empty
 * attribute is rendered without a value, so both spellings have to be read.
 */
function nextPage(html) {
  const match = html.match(/data-next-page(?:="([^"]*)")?[\s>]/);
  assert.ok(match, 'expected a feed marker carrying a data-next-page attribute');
  return match[1] ?? '';
}

test('important slug pages are generated', () => {
  assert.equal(exists('dist/load-testing-with-wrk/index.html'), true);
  assert.equal(exists('dist/ghost-on-digital-ocean-with-docker/index.html'), true);
  assert.equal(exists('dist/about/index.html'), true);
});

test('rss feed is generated', () => {
  assert.equal(exists('dist/rss.xml'), true);
});

test('the home page holds exactly the first batch of the feed', () => {
  const posts = expectedPosts();
  assert.deepEqual(feedSlugs(read('index.html')), posts.slice(0, BATCH_SIZE).map((p) => p.slug));
});

test('following the feed from the home page reaches every post exactly once, newest first', () => {
  const posts = expectedPosts();
  let slugs = feedSlugs(read('index.html'));
  let next = nextPage(read('index.html'));
  const seen = new Set();

  while (next) {
    assert.equal(seen.has(next), false, `${next} is linked more than once`);
    seen.add(next);
    const html = readPage(next);
    slugs = slugs.concat(feedSlugs(html));
    next = nextPage(html);
  }

  assert.deepEqual(slugs, posts.map((p) => p.slug));
});

test('a numbered page is a whole page a reader can use on its own', () => {
  const html = readPage('/page/2/');
  assert.match(html, /<html/i, 'expected a full page, not a fragment');
  assert.match(html, /href="\/about\/"/, 'expected the site navigation');
  assert.match(html, /rel="prev"/, 'expected a link back to the newer posts');
  assert.match(html, /<title>Page 2 \| Anthony Ison<\/title>/);
});

test('page 2 points back to the home page, not to a page 1', () => {
  const html = readPage('/page/2/');
  assert.match(html, /<a href="\/" rel="prev"/);
  assert.equal(exists('dist/page/1/index.html'), false);
});

test('only the last page of the feed has no older posts', () => {
  const posts = expectedPosts();
  const lastBatch = Math.ceil(posts.length / BATCH_SIZE);
  assert.equal(nextPage(readPage(`/page/${lastBatch}/`)), '');
  assert.notEqual(nextPage(readPage('/page/2/')), '');
});

test('the end of the feed is marked for the reader', () => {
  const posts = expectedPosts();
  const lastBatch = Math.ceil(posts.length / BATCH_SIZE);
  assert.match(readPage(`/page/${lastBatch}/`), new RegExp(`That's all ${posts.length} posts`));
});

test('no post slug collides with the feed or tag routes', () => {
  const reserved = new Set(['page', 'tag', 'tags', 'batches']);
  for (const post of expectedPosts()) {
    assert.equal(reserved.has(post.slug), false, `post slug ${post.slug} collides with a site route`);
  }
});

test('the navigation no longer offers a separate posts page', () => {
  assert.equal(read('index.html').includes('href="/posts/"'), false);
  assert.equal(exists('dist/posts/index.html'), false);
});

test('every tag has a page listing its posts', () => {
  const posts = expectedPosts();
  const tags = new Map();
  for (const post of posts) {
    for (const tag of post.tags) tags.set(tag, (tags.get(tag) ?? 0) + 1);
  }
  assert.ok(tags.size > 0, 'expected the posts to carry tags');

  for (const [tag, count] of tags) {
    const html = readPage(path.join('tag', tag));
    const shown = feedSlugs(html).length;
    assert.equal(shown, Math.min(count, BATCH_SIZE), `tag ${tag} shows ${shown} of ${count} posts`);
  }
});

test('numbered pages are offered to search engines', () => {
  const sitemaps = fs.readdirSync(distDir).filter((name) => name.startsWith('sitemap'));
  const listed = sitemaps.map((name) => read(name)).join('');
  assert.match(listed, /\/page\/2\//, 'expected the feed pages in the sitemap');
  assert.equal(exists('dist/_headers'), false, 'no noindex rules are needed any more');
});

test('known old urls redirect to their current home', () => {
  const redirects = read('_redirects');
  const expected = [
    ['/about-me/', '/about/'],
    ['/posts/', '/'],
    ['/archives/', '/'],
    ['/archives/page/2/', '/page/2/'],
    ['/tag/', '/'],
    ['/author/anthony/', '/about/'],
    ['/rss/', '/rss.xml'],
    ['/sitemap.xml', '/sitemap-index.xml'],
    ['/tags/:name/', '/tag/:name/'],
    ['/tag/ghost-tag/', '/tag/ghost/'],
    ['/:slug/amp/', '/:slug/'],
    [
      '/azure-devops-unit-testing-and-code-coverage-with-dotnet-core/',
      '/azure-devops-unit-testing-and-code-coverage-with-net-core/'
    ],
    [
      '/static-angular-applications-and-dynamic-environment-settings/',
      '/dynamic-environment-in-your-static-angular-application/'
    ]
  ];

  for (const [from, to] of expected) {
    const line = redirects.split('\n').find((l) => l.trim().startsWith(`${from} `));
    assert.ok(line, `no redirect for ${from}`);
    assert.match(line, new RegExp(`^\\S+\\s+${to.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+301`));
  }
});

test('the feed pages the old site had are served, not redirected', () => {
  const redirects = read('_redirects');
  assert.equal(
    redirects.split('\n').some((line) => line.trim().startsWith('/page/2/ ')),
    false,
    '/page/2/ is a real page now, so a redirect would shadow it'
  );
  assert.equal(exists('dist/page/2/index.html'), true);
});
