# anthonyison.com

Static blog for <https://anthonyison.com>, built with Astro.

The Markdown in `src/content/blog/` is the source of truth for all content: see
[ADR 0001](docs/adr/0001-markdown-is-the-source-of-truth.md). `CONTEXT.md` defines the terms used
throughout the site.

## Commands

```bash
npm install
npm run dev
npm run build
npm run verify
```

## Deployment

Use `npm run build` as the build command and `dist` as the output directory on Cloudflare Pages or Netlify.
