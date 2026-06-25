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
      if (value.length === 0) {
        continue;
      }

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
  return html.replace(/(["'(])\/content\/images\/([^"'()\s]+)(["')])/g, (match, prefix, relativePath, suffix) => {
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
  const postTagLinks = data.posts_tags ?? [];
  const tags = data.tags ?? [];
  const tagIds = postTagLinks
    .filter((link) => String(link.post_id) === String(postId))
    .map((link) => String(link.tag_id));

  return tags
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

function rewriteFeatureImage(featureImage, copyLocalImage) {
  if (typeof featureImage === 'string' && featureImage.startsWith('/content/images/')) {
    return copyLocalImage(featureImage);
  }

  return featureImage;
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
    featureImage: rewriteFeatureImage(post.feature_image, copyLocalImage),
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
