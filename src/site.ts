/** Posts appended to the feed as one unit. See CONTEXT.md. */
export const BATCH_SIZE = 10;

/** Dates are written for an Australian reader, wherever the site happens to be built. */
export const TIME_ZONE = 'Australia/Brisbane';

/** Words read per minute, used for a post's reading time. */
export const WORDS_PER_MINUTE = 230;

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-AU', {
    timeZone: TIME_ZONE,
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export function readingTime(body: string): string {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))} min read`;
}

/** Where a batch can be read on its own. Batch 1 is the feed's own page. */
export function pagePath(batch: number, tag?: string): string {
  const root = tag ? `/tag/${tag}/` : '/';
  return batch === 1 ? root : `${root}page/${batch}/`;
}
