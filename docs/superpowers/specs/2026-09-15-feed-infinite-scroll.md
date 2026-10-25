# Feed with infinite scroll

## Context

The home page listed only the 10 newest posts. Every post was reachable from `/posts/`, linked in the
nav, but that was a second place to browse and easy to miss. The site is static, with no server.

## Goals

- The home page becomes the only list of posts, growing as the reader scrolls until none remain.
- Every post reachable without JavaScript.
- Restore URLs the site used to serve, rather than redirecting them away.
- Simplify and tidy the home page.

## Non-Goals

- A visual refresh or new palette.
- Image optimisation.
- Publishing any of the unpublished VuePress-era drafts.

## Decisions

### Terms

`CONTEXT.md` defines **Post**, **Page**, **Feed**, **Batch** and **Tag**. A Batch is a fixed-size,
consecutive run of Posts appended to the Feed as one unit, and readable on its own as a numbered page.

### Feed

- Batch size is 10, set once in `src/site.ts` and read by every feed route.
- The home page is the Feed's first page. `/posts/` is removed and redirects to `/`.
- Later batches are ordinary pages at `/page/N/`, each with the site header, styling, an "Older posts"
  link and a "Newer posts" link back. `/page/2/` is a URL the old Hexo site served.
- With JavaScript, the next page is fetched about one screen before the reader reaches the bottom, its
  posts are lifted out and appended, and the marker takes on that page's next address. Loading
  continues while the end of the feed stays in reach.
- The "Older posts" link is hidden while the script is working and comes back if a load fails.
- The loaded batch count and scroll position are kept for the session and restored **only** when the
  reader arrives by the back or forward button. Any other visit starts at the top with one batch.
- The end of the feed reads "That's all N posts" with a link to RSS.

### Feed items

- Each item shows the date and reading time, the title as a link, the post's description, and its tags.
- Dates are written out in Australia/Brisbane time, on feed items and post pages.
- Reading time is total words divided by 230, rounded up.
- Tags link to that tag's feed.

### Content

- Every post carries a one-sentence description of at most 160 characters, used in the feed item, the
  page's meta description and RSS. A post without one fails the build; pages are exempt.
- The 16 covers that still pointed at `__GHOST_URL__` are restored from the originals in git history.
- The Ghost importer is retired: see ADR 0001. The CWL page is removed.

### Tags

- Each tag has a feed at `/tag/<name>/`, paginating at `/tag/<name>/page/N/`.
- There is no page listing all tags; `/tag/` redirects to `/`.

### Old URLs

All 301s in `public/_redirects`: `/posts/`, `/archives/`, `/archives/page/2/` → `/page/2/`, `/tag/`,
`/tags/:name/` → `/tag/:name/`, `/tag/ghost-tag/` → `/tag/ghost/`, `/author/anthony/` → `/about/`,
`/rss/` → `/rss.xml`, the Ghost sitemaps → `/sitemap-index.xml`, `/:slug/amp/` → `/:slug/`, and two
earlier post slugs. `/page/2/` must **not** redirect, since it is a real page again.

## Testing

Tests run against the built site and the content files:

- the home page holds exactly the first batch
- following the feed reaches every post exactly once, newest first
- a numbered page is a whole page with navigation and a link back
- only the last page has no older posts, and it carries the end-of-feed line
- no post slug collides with a site route
- every tag has a page listing its posts
- numbered pages appear in the sitemap
- each known old URL redirects, and `/page/2/` is served rather than redirected
- no content points at `__GHOST_URL__`, every local cover exists, every post has a short description

Behaviour needing a browser is checked by hand: loading on scroll, returning by the back button, the
no-JavaScript path, a tag page, and dark mode.
