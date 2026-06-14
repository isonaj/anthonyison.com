# Astro Blog Migration Design

## Context

The existing `anthonyison.com` repository contains an older VuePress blog. The Ghost container and content backup live separately in `C:\dev\anthonyison-ghost`. The new site should not preserve the VuePress implementation. It should rebuild the blog as a clean Astro static site while using the latest Ghost export as the source of truth for posts and pages.

The current migration branch is `rebuild-astro-blog`.

## Goals

- Rebuild the blog as a minimal Astro static site.
- Preserve public slugs exactly, especially root-level post URLs such as `/load-testing-with-wrk/`.
- Import published Ghost posts and pages into Markdown or MDX files.
- Prefer external image URLs when Ghost content already uses them.
- Avoid copying downloaded image archives unless a post depends on a local Ghost image reference.
- Keep the first version plain and readable, with room to improve layout later.
- Deploy cleanly to either Cloudflare Pages or Netlify.

## Non-Goals

- Recreating the current VuePress theme.
- Running Ghost or any server-side publishing process.
- Building a full CMS or admin UI.
- Migrating comments or interactive widgets in the first pass.
- Optimizing the visual design beyond a simple, readable baseline.

## Recommended Approach

Create a fresh Astro project at the repository root. Replace the old VuePress app on this branch rather than trying to adapt it in place.

Use the latest Ghost export at `C:\dev\anthonyison-ghost\content\data\anthony-isons-blog.ghost.2025-01-29-09-14-54.json` as the import source. Convert published Ghost posts and pages into content files under Astro's content structure.

Local Ghost images should be handled conservatively. If a post has an external feature image or embeds external image URLs, keep those URLs as-is. If a post references `/content/images/...`, copy only the referenced files into the new site's public assets and rewrite those references to stable static paths.

## Site Structure

The new repo structure should follow Astro conventions:

```text
src/
  content/
    blog/
      <slug>.md
  layouts/
    BaseLayout.astro
    PostLayout.astro
  pages/
    index.astro
    posts.astro
    [...slug].astro
public/
  images/
```

The exact page filenames can change if Astro's routing is cleaner another way, but the generated public URLs must keep root-level slugs.

## Content Model

Each imported post should include frontmatter with:

- `title`
- `slug`
- `description` when available
- `publishedAt`
- `updatedAt` when available
- `tags`
- `featureImage` when available
- `type` for distinguishing posts from pages if needed

The body should be Markdown or MDX. Ghost export HTML may be converted to Markdown where the conversion is reliable. If a section cannot be converted safely, preserving HTML inside Markdown is acceptable for the first pass.

## Routing

Astro must generate URLs that match Ghost slugs at the site root:

```text
/<slug>/
```

The home page should list recent posts. A posts index at `/posts/` is useful but should not replace the root-level post URLs. The about page should also be mapped to a stable user-facing route, preferably `/about/`, with a redirect from `/about-me/` if the Ghost page slug is `about-me`.

Known slug compatibility matters more than visual fidelity.

## Deployment

The project should support both Cloudflare Pages and Netlify:

- Build command: `npm run build`
- Output directory: `dist`

No server runtime should be required. The production site should be entirely static HTML, CSS, JavaScript, images, RSS, and sitemap assets.

## Testing And Verification

Verification should include:

- The Astro production build succeeds.
- Imported post count matches published Ghost posts, excluding deliberate page handling.
- Important sample slugs render as static pages.
- Root-level slug URLs are preserved.
- External image URLs remain external.
- Any copied local image references resolve.
- RSS and sitemap generation work if included in the first implementation pass.

Manual browser verification should check the home page, a post page, and the about page.

## Open Decisions

- Whether to publish drafts from Ghost: initial decision is no.
- Whether to include RSS and sitemap in the first pass: include if straightforward with Astro integrations or small local code.
- Whether to keep Disqus/comment references: initial decision is no.
