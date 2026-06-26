# Astro Blog Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `anthonyison.com` as a minimal Astro static blog imported from the latest Ghost export while preserving public root-level slugs.

**Architecture:** The repo root becomes a fresh Astro site. A small Node import script reads the Ghost export, writes published posts/pages as Markdown files under `src/content/blog`, copies only referenced local Ghost images, and emits a manifest used by tests. Astro content collections, dynamic routes, RSS, and sitemap generation produce static output in `dist`.

**Tech Stack:** Astro, TypeScript-flavored Astro files, Node.js ESM scripts, Node built-in test runner, Markdown content collections, `@astrojs/rss`, `@astrojs/sitemap`.

---

## File Structure

- Create `astro.config.mjs`: Astro config, site URL, sitemap integration.
- Replace `package.json`: Astro scripts and dependencies.
- Delete `yarn.lock`: old VuePress lockfile should not describe the new app.
- Create `scripts/import-ghost.mjs`: Ghost JSON importer with deterministic Markdown/frontmatter output.
- Create `tests/import-ghost.test.mjs`: focused tests for importer helpers and generated manifest.
- Create `src/content/config.ts`: Astro content collection schema.
- Generate `src/content/blog/*.md`: imported Ghost posts/pages.
- Create `src/layouts/BaseLayout.astro`: minimal HTML shell and global styles.
- Create `src/layouts/PostLayout.astro`: post/article rendering wrapper.
- Create `src/pages/index.astro`: minimal home page with recent posts.
- Create `src/pages/posts.astro`: full post index.
- Create `src/pages/[...slug].astro`: root-level dynamic slug pages.
- Create `src/pages/rss.xml.js`: RSS feed.
- Create `public/_redirects`: Netlify redirects for `/about-me/` to `/about/`.
- Create `public/_routes.json`: Cloudflare Pages routing hint that keeps all pages static.
- Keep `docs/superpowers/specs/2026-06-14-astro-blog-migration-design.md`.
- Keep `docs/superpowers/plans/2026-06-14-astro-blog-migration.md`.
- Remove old VuePress app files after the Astro version builds: `blog/`, old `package.json` contents, and old lockfile.

---

### Task 1: Replace Project Shell With Astro

**Files:**
- Modify: `package.json`
- Create: `astro.config.mjs`
- Create: `src/content/config.ts`
- Delete: `yarn.lock`

- [ ] **Step 1: Replace `package.json`**

Set `package.json` to:

```json
{
  "name": "anthonyison.com",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "import:ghost": "node scripts/import-ghost.mjs",
    "test": "node --test tests/import-ghost.test.mjs"
  },
  "dependencies": {
    "@astrojs/rss": "^4.0.12",
    "@astrojs/sitemap": "^3.2.1",
    "astro": "^5.9.0"
  },
  "devDependencies": {}
}
```

- [ ] **Step 2: Add `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://anthonyison.com',
  output: 'static',
  integrations: [sitemap()]
});
```

- [ ] **Step 3: Add `src/content/config.ts`**

```ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string().optional(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    featureImage: z.string().optional(),
    type: z.enum(['post', 'page']).default('post'),
    canonicalUrl: z.string().optional()
  })
});

export const collections = { blog };
```

- [ ] **Step 4: Delete old lockfile**

Delete `yarn.lock`. Do not delete `blog/` yet; leave it until the Astro build and import are working.

- [ ] **Step 5: Install dependencies**

Run: `npm install`

Expected: `package-lock.json` is created and `node_modules` is installed.

- [ ] **Step 6: Commit project shell**

Run:

```bash
git add package.json package-lock.json astro.config.mjs src/content/config.ts yarn.lock
git commit -m "Set up Astro project shell"
```

Expected: commit succeeds on `rebuild-astro-blog`.

---

### Task 2: Build Ghost Importer

**Files:**
- Create: `scripts/import-ghost.mjs`
- Create: `tests/import-ghost.test.mjs`
- Create: `src/content/blog/.gitkeep`
- Create: `src/data/.gitkeep`
- Create: `public/images/.gitkeep`

- [ ] **Step 1: Add importer tests first**

Create `tests/import-ghost.test.mjs`:

```js
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
```

- [ ] **Step 2: Run tests to verify importer does not exist yet**

Run: `npm test`

Expected: FAIL with a module-not-found error for `scripts/import-ghost.mjs`.

- [ ] **Step 3: Add `scripts/import-ghost.mjs`**

```js
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

export const defaultGhostExportPath = path.resolve(
  repoRoot,
  '..',
  'anthonyison-ghost',
  'content',
  'data',
  'anthony-isons-blog.ghost.2025-01-29-09-14-54.json'
);

export const defaultGhostContentPath = path.resolve(repoRoot, '..', 'anthonyison-ghost', 'content');
export const contentOutputDir = path.join(repoRoot, 'src', 'content', 'blog');
export const publicGhostImageDir = path.join(repoRoot, 'public', 'images', 'ghost');
export const manifestPath = path.join(repoRoot, 'src', 'data', 'import-manifest.json');

export function cleanGhostHtml(html = '') {
  return html
    .replace(/<!--kg-card-begin: markdown-->/g, '')
    .replace(/<!--kg-card-end: markdown-->/g, '')
    .replace(/\r\n/g, '\n')
    .trim();
}

export function outputSlugForPost(post) {
  if (post.type === 'page' && post.slug === 'about-me') {
    return 'about';
  }

  return post.slug;
}

export function yamlString(value) {
  return JSON.stringify(String(value ?? ''));
}

export function frontmatterBlock(data) {
  const lines = ['---'];

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null || value === '') {
      continue;
    }

    if (Array.isArray(value)) {
      lines.push(`${key}:`);
      for (const item of value) {
        lines.push(`  - ${yamlString(item)}`);
      }
      continue;
    }

    lines.push(`${key}: ${yamlString(value)}`);
  }

  lines.push('---');
  return `${lines.join('\n')}\n`;
}

export function rewriteLocalGhostImageUrls(html, copyLocalImage) {
  return html.replace(/(["'(])\/content\/images\/([^"'()\\s]+)(["')])/g, (match, prefix, relativePath, suffix) => {
    const newPath = copyLocalImage(`/content/images/${relativePath}`);
    return `${prefix}${newPath}${suffix}`;
  });
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function emptyMarkdownOutput() {
  ensureDir(contentOutputDir);
  for (const entry of fs.readdirSync(contentOutputDir)) {
    if (entry.endsWith('.md')) {
      fs.rmSync(path.join(contentOutputDir, entry), { force: true });
    }
  }
}

function readGhostExport(exportPath) {
  const json = JSON.parse(fs.readFileSync(exportPath, 'utf8'));
  return json.data;
}

function tagsForPost(data, postId) {
  const tagIds = data.posts_tags
    .filter((link) => String(link.post_id) === String(postId))
    .map((link) => String(link.tag_id));

  return data.tags
    .filter((tag) => tagIds.includes(String(tag.id)) && !String(tag.slug).startsWith('hash-'))
    .map((tag) => tag.name)
    .sort((a, b) => a.localeCompare(b));
}

function copyLocalImageFactory(ghostContentPath) {
  return function copyLocalImage(ghostUrlPath) {
    const relative = ghostUrlPath.replace(/^\/content\/images\//, '');
    const source = path.join(ghostContentPath, 'images', relative);
    const destination = path.join(publicGhostImageDir, relative);

    if (fs.existsSync(source)) {
      ensureDir(path.dirname(destination));
      fs.copyFileSync(source, destination);
    }

    return `/images/ghost/${relative.replace(/\\/g, '/')}`;
  };
}

function markdownForPost(data, post, ghostContentPath) {
  const slug = outputSlugForPost(post);
  const tags = tagsForPost(data, post.id);
  const copyLocalImage = copyLocalImageFactory(ghostContentPath);
  const body = rewriteLocalGhostImageUrls(cleanGhostHtml(post.html), copyLocalImage);
  const frontmatter = frontmatterBlock({
    title: post.title,
    slug,
    description: post.custom_excerpt || post.meta_description || post.excerpt,
    publishedAt: post.published_at ? new Date(`${post.published_at}Z`).toISOString() : undefined,
    updatedAt: post.updated_at ? new Date(`${post.updated_at}Z`).toISOString() : undefined,
    tags,
    featureImage: post.feature_image,
    type: post.type || 'post',
    canonicalUrl: post.canonical_url
  });

  return `${frontmatter}\n${body}\n`;
}

export function importGhost({
  exportPath = defaultGhostExportPath,
  ghostContentPath = defaultGhostContentPath
} = {}) {
  const data = readGhostExport(exportPath);
  const published = data.posts
    .filter((post) => post.status === 'published')
    .sort((a, b) => String(a.published_at).localeCompare(String(b.published_at)));

  emptyMarkdownOutput();
  ensureDir(publicGhostImageDir);

  const manifest = [];

  for (const post of published) {
    const slug = outputSlugForPost(post);
    const outputPath = path.join(contentOutputDir, `${slug}.md`);
    fs.writeFileSync(outputPath, markdownForPost(data, post, ghostContentPath), 'utf8');
    manifest.push({
      id: post.id,
      sourceSlug: post.slug,
      outputSlug: slug,
      type: post.type || 'post',
      status: post.status,
      title: post.title
    });
  }

  ensureDir(path.dirname(manifestPath));
  fs.writeFileSync(manifestPath, `${JSON.stringify({ posts: manifest }, null, 2)}\n`, 'utf8');
  return manifest;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const manifest = importGhost();
  console.log(`Imported ${manifest.length} published Ghost entries.`);
}
```

- [ ] **Step 4: Add placeholder directories**

Create `src/content/blog/.gitkeep`, `src/data/.gitkeep`, and `public/images/.gitkeep` so the directories exist before import.

- [ ] **Step 5: Run importer tests**

Run: `npm test`

Expected: PASS for 4 tests.

- [ ] **Step 6: Commit importer**

Run:

```bash
git add scripts/import-ghost.mjs tests/import-ghost.test.mjs src/content/blog/.gitkeep src/data/.gitkeep public/images/.gitkeep
git commit -m "Add Ghost import script"
```

Expected: commit succeeds.

---

### Task 3: Import Ghost Content

**Files:**
- Generate: `src/content/blog/*.md`
- Generate: `src/data/import-manifest.json`
- Maybe create: `public/images/ghost/**`

- [ ] **Step 1: Run Ghost import**

Run: `npm run import:ghost`

Expected: output says `Imported 30 published Ghost entries.`

- [ ] **Step 2: Verify important imported files exist**

Run:

```bash
Test-Path src/content/blog/load-testing-with-wrk.md
Test-Path src/content/blog/ghost-on-digital-ocean-with-docker.md
Test-Path src/content/blog/about.md
```

Expected: all three commands print `True`.

- [ ] **Step 3: Verify manifest count**

Run:

```bash
node -e "const m=require('./src/data/import-manifest.json'); if (m.posts.length !== 30) throw new Error(String(m.posts.length)); console.log(m.posts.length)"
```

Expected: `30`.

- [ ] **Step 4: Verify external feature image URLs stayed external**

Run:

```bash
Select-String -Path src/content/blog/load-testing-with-wrk.md -Pattern 'featureImage: "https://'
```

Expected: at least one matching line.

- [ ] **Step 5: Commit imported content**

Run:

```bash
git add src/content/blog src/data/import-manifest.json public/images/ghost
git commit -m "Import published Ghost content"
```

Expected: commit succeeds.

---

### Task 4: Add Minimal Astro Layout And Pages

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/layouts/PostLayout.astro`
- Create: `src/pages/index.astro`
- Create: `src/pages/posts.astro`
- Create: `src/pages/[...slug].astro`

- [ ] **Step 1: Create `src/layouts/BaseLayout.astro`**

```astro
---
const {
  title = 'Anthony Ison',
  description = 'Software development and DevOps. Bringing solutions to life.'
} = Astro.props;
---

<!doctype html>
<html lang="en-AU">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <title>{title}</title>
    <link rel="alternate" type="application/rss+xml" title="Anthony Ison" href="/rss.xml" />
  </head>
  <body>
    <header class="site-header">
      <a class="brand" href="/">Anthony Ison</a>
      <nav aria-label="Main navigation">
        <a href="/posts/">Posts</a>
        <a href="/about/">About</a>
        <a href="/rss.xml">RSS</a>
      </nav>
    </header>
    <main>
      <slot />
    </main>
    <footer class="site-footer">
      <p>Software development and DevOps. Bringing solutions to life.</p>
    </footer>
  </body>
</html>

<style is:global>
  :root {
    color-scheme: light dark;
    --bg: #f8f7f3;
    --text: #1f2328;
    --muted: #5f6b76;
    --link: #1b6675;
    --border: #d9d6ce;
    --surface: #ffffff;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --bg: #161718;
      --text: #ece7de;
      --muted: #b8b1a6;
      --link: #7fc7d4;
      --border: #34383b;
      --surface: #1f2123;
    }
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    background: var(--bg);
    color: var(--text);
    font-size: 18px;
    line-height: 1.65;
  }

  a {
    color: var(--link);
  }

  img {
    display: block;
    max-width: 100%;
    height: auto;
  }

  pre {
    overflow-x: auto;
    padding: 1rem;
    border: 1px solid var(--border);
    background: var(--surface);
  }

  code {
    font-size: 0.92em;
  }

  blockquote {
    margin-inline: 0;
    padding-left: 1rem;
    border-left: 4px solid var(--border);
    color: var(--muted);
  }

  .site-header,
  .site-footer,
  main {
    width: min(100% - 2rem, 860px);
    margin-inline: auto;
  }

  .site-header {
    display: flex;
    gap: 1rem;
    align-items: center;
    justify-content: space-between;
    padding-block: 1.25rem;
  }

  .brand {
    color: var(--text);
    font-weight: 700;
    text-decoration: none;
  }

  nav {
    display: flex;
    gap: 0.85rem;
    flex-wrap: wrap;
  }

  nav a {
    text-decoration: none;
  }

  main {
    padding-block: 2rem 4rem;
  }

  h1,
  h2,
  h3 {
    line-height: 1.2;
  }

  h1 {
    font-size: clamp(2.2rem, 7vw, 4.4rem);
    margin: 0 0 1rem;
  }

  article {
    max-width: 760px;
  }

  .muted {
    color: var(--muted);
  }

  .post-list {
    display: grid;
    gap: 1.4rem;
    padding: 0;
    list-style: none;
  }

  .post-list a {
    color: var(--text);
    font-size: 1.25rem;
    font-weight: 700;
    text-decoration: none;
  }

  .site-footer {
    border-top: 1px solid var(--border);
    padding-block: 1.5rem;
    color: var(--muted);
    font-size: 0.95rem;
  }
</style>
```

- [ ] **Step 2: Create `src/layouts/PostLayout.astro`**

```astro
---
import BaseLayout from './BaseLayout.astro';

const { entry } = Astro.props;
const { title, description, publishedAt, updatedAt, tags, featureImage } = entry.data;
const pageTitle = `${title} | Anthony Ison`;
---

<BaseLayout title={pageTitle} description={description ?? title}>
  <article>
    <p class="muted">
      {publishedAt.toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' })}
      {updatedAt && updatedAt.getTime() !== publishedAt.getTime() ? ` · Updated ${updatedAt.toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' })}` : ''}
    </p>
    <h1>{title}</h1>
    {featureImage && <img src={featureImage} alt="" loading="eager" />}
    {tags.length > 0 && <p class="muted">{tags.join(', ')}</p>}
    <slot />
  </article>
</BaseLayout>
```

- [ ] **Step 3: Create `src/pages/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';

const posts = (await getCollection('blog'))
  .filter((entry) => entry.data.type === 'post')
  .sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf())
  .slice(0, 10);
---

<BaseLayout>
  <section>
    <p class="muted">Software development and DevOps</p>
    <h1>Anthony Ison</h1>
    <p>Notes on building, running, testing, and simplifying software.</p>
  </section>

  <section>
    <h2>Recent posts</h2>
    <ul class="post-list">
      {posts.map((post) => (
        <li>
          <a href={`/${post.data.slug}/`}>{post.data.title}</a>
          <p class="muted">{post.data.publishedAt.toLocaleDateString('en-AU')}</p>
          {post.data.description && <p>{post.data.description}</p>}
        </li>
      ))}
    </ul>
  </section>
</BaseLayout>
```

- [ ] **Step 4: Create `src/pages/posts.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';

const posts = (await getCollection('blog'))
  .filter((entry) => entry.data.type === 'post')
  .sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
---

<BaseLayout title="Posts | Anthony Ison" description="All posts by Anthony Ison">
  <h1>Posts</h1>
  <ul class="post-list">
    {posts.map((post) => (
      <li>
        <a href={`/${post.data.slug}/`}>{post.data.title}</a>
        <p class="muted">{post.data.publishedAt.toLocaleDateString('en-AU')}</p>
      </li>
    ))}
  </ul>
</BaseLayout>
```

- [ ] **Step 5: Create `src/pages/[...slug].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import PostLayout from '../layouts/PostLayout.astro';

export async function getStaticPaths() {
  const entries = await getCollection('blog');
  return entries.map((entry) => ({
    params: { slug: entry.data.slug },
    props: { entry }
  }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
---

<PostLayout entry={entry}>
  <Content />
</PostLayout>
```

- [ ] **Step 6: Run build to verify routing compiles**

Run: `npm run build`

Expected: build succeeds and creates `dist/load-testing-with-wrk/index.html`.

- [ ] **Step 7: Commit minimal pages**

Run:

```bash
git add src/layouts src/pages
git commit -m "Add minimal Astro blog pages"
```

Expected: commit succeeds.

---

### Task 5: Add RSS, Redirects, And Static Host Hints

**Files:**
- Create: `src/pages/rss.xml.js`
- Create: `public/_redirects`
- Create: `public/_routes.json`

- [ ] **Step 1: Create `src/pages/rss.xml.js`**

```js
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('blog'))
    .filter((entry) => entry.data.type === 'post')
    .sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());

  return rss({
    title: 'Anthony Ison',
    description: 'Software development and DevOps. Bringing solutions to life.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description ?? post.data.title,
      pubDate: post.data.publishedAt,
      link: `/${post.data.slug}/`
    }))
  });
}
```

- [ ] **Step 2: Create `public/_redirects` for Netlify**

```text
/about-me/ /about/ 301
/about-me /about/ 301
```

- [ ] **Step 3: Create `public/_routes.json` for Cloudflare Pages**

```json
{
  "version": 1,
  "include": ["/*"],
  "exclude": []
}
```

- [ ] **Step 4: Run build and inspect generated static files**

Run: `npm run build`

Expected:

- `dist/rss.xml` exists.
- `dist/sitemap-index.xml` or `dist/sitemap-0.xml` exists.
- `dist/_redirects` exists.

- [ ] **Step 5: Commit feeds and host hints**

Run:

```bash
git add src/pages/rss.xml.js public/_redirects public/_routes.json
git commit -m "Add feed and static hosting hints"
```

Expected: commit succeeds.

---

### Task 6: Remove Old VuePress App

**Files:**
- Delete: `blog/`
- Maybe modify: `README.md`

- [ ] **Step 1: Verify Astro build works before deleting old app**

Run: `npm run build`

Expected: PASS.

- [ ] **Step 2: Delete old VuePress `blog/` directory**

Delete `blog/` after the Astro site has imported and built successfully.

- [ ] **Step 3: Replace `README.md`**

Set `README.md` to:

```md
# anthonyison.com

Static blog for <https://anthonyison.com>, built with Astro from Markdown content imported from Ghost.

## Commands

```bash
npm install
npm run import:ghost
npm run dev
npm run build
```

## Deployment

Use `npm run build` as the build command and `dist` as the output directory on Cloudflare Pages or Netlify.
```

- [ ] **Step 4: Run tests and build**

Run:

```bash
npm test
npm run build
```

Expected: tests pass and build succeeds.

- [ ] **Step 5: Commit cleanup**

Run:

```bash
git add blog README.md
git commit -m "Remove old VuePress blog"
```

Expected: commit succeeds.

---

### Task 7: Add Migration Verification Script

**Files:**
- Create: `tests/migration-output.test.mjs`
- Modify: `package.json`

- [ ] **Step 1: Add output verification tests**

Create `tests/migration-output.test.mjs`:

```js
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
```

- [ ] **Step 2: Update `package.json` scripts**

Change scripts to:

```json
{
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "import:ghost": "node scripts/import-ghost.mjs",
  "test": "node --test tests/import-ghost.test.mjs",
  "test:output": "node --test tests/migration-output.test.mjs",
  "verify": "npm test && npm run build && npm run test:output"
}
```

- [ ] **Step 3: Run verification**

Run: `npm run verify`

Expected: tests pass, build succeeds, output tests pass.

- [ ] **Step 4: Commit verification**

Run:

```bash
git add package.json tests/migration-output.test.mjs
git commit -m "Add migration verification checks"
```

Expected: commit succeeds.

---

### Task 8: Browser Verification

**Files:**
- No source changes expected unless visual or routing issues are found.

- [ ] **Step 1: Start local dev server**

Run: `npm run dev -- --host 127.0.0.1`

Expected: Astro serves the site on a local port, usually `http://127.0.0.1:4321`.

- [ ] **Step 2: Open and inspect home page**

Open `http://127.0.0.1:4321/`.

Expected:

- Header shows `Anthony Ison`.
- Recent posts list appears.
- No obvious text overlap or broken layout.

- [ ] **Step 3: Open and inspect important post slug**

Open `http://127.0.0.1:4321/load-testing-with-wrk/`.

Expected:

- Page renders with title `Load testing with Wrk`.
- Feature image, if present, loads from an external URL.
- Code blocks are readable.

- [ ] **Step 4: Open and inspect about route**

Open `http://127.0.0.1:4321/about/`.

Expected:

- About content renders.
- Navigation stays visible and usable.

- [ ] **Step 5: Stop dev server and commit any fixes**

If fixes were required, run:

```bash
git add src public package.json tests
git commit -m "Fix Astro migration verification issues"
```

Expected: no commit is needed if browser verification passes unchanged.

---

## Final Verification

Run:

```bash
npm run verify
```

Expected:

- Importer unit tests pass.
- Astro build succeeds.
- `dist/load-testing-with-wrk/index.html` exists.
- `dist/ghost-on-digital-ocean-with-docker/index.html` exists.
- `dist/about/index.html` exists.
- `dist/rss.xml` exists.
- Imported manifest contains 30 published Ghost entries.

Then summarize:

- Branch: `rebuild-astro-blog`
- Build command: `npm run build`
- Output directory: `dist`
- Deployment targets: Cloudflare Pages or Netlify
