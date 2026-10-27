# anthonyison.com

Static blog for <https://anthonyison.com>, built with Astro.

The Markdown in `src/content/blog/` is the source of truth for all content: see
[ADR 0001](docs/adr/0001-markdown-is-the-source-of-truth.md). `CONTEXT.md` defines the terms used
throughout the site, and `VOICE.md` sets how its writing should sound.
Unfinished posts live in `drafts/`, which git ignores so they never reach the public repo; move one into
`src/content/blog/` to publish it.

## Commands

```bash
npm install
npm run dev
npm run build
npm run verify
```

## Deployment

The site deploys as a Cloudflare Worker that serves only static assets (`wrangler.jsonc`). There is no
Worker script: Cloudflare serves `dist/` directly and applies `dist/_redirects`.

```bash
npx wrangler login
npm run preview:worker
npm run deploy
```

`npm run preview:worker` serves the built site locally the way Cloudflare will. `npm run deploy` runs
`npm run verify` before uploading.
