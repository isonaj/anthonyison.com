import { getCollection, type CollectionEntry } from 'astro:content';
import { BATCH_SIZE, yearOf } from '../site';

export type Post = CollectionEntry<'blog'>;

/**
 * Every post, newest first. Pages are never part of a feed. Posts published at
 * the same moment fall back to slug order, so the feed doesn't depend on the
 * order the build happens to read the files in.
 */
export async function getPosts(): Promise<Post[]> {
  const entries = await getCollection('blog');
  return entries
    .filter((entry) => entry.data.type === 'post')
    .sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf() || a.slug.localeCompare(b.slug));
}

export function batchCount(posts: Post[]): number {
  return Math.max(1, Math.ceil(posts.length / BATCH_SIZE));
}

export function batchOf(posts: Post[], batch: number): Post[] {
  return posts.slice((batch - 1) * BATCH_SIZE, batch * BATCH_SIZE);
}

/**
 * How a post relates to the year headings: 'start' when it is the first of its
 * year in the whole feed, 'continued' when it only opens a batch partway
 * through a year, and undefined otherwise.
 */
export type YearMark = 'start' | 'continued' | undefined;

/** A batch's posts, each with its year mark, judged against the whole feed so batches agree. */
export function batchWithYears(posts: Post[], batch: number): { post: Post; year: YearMark }[] {
  const offset = (batch - 1) * BATCH_SIZE;
  return batchOf(posts, batch).map((post, index) => {
    const previous = posts[offset + index - 1];
    const year: YearMark =
      !previous || yearOf(previous.data.publishedAt) !== yearOf(post.data.publishedAt)
        ? 'start'
        : index === 0
          ? 'continued'
          : undefined;
    return { post, year };
  });
}

/** Tag name to its posts, newest first. */
export function postsByTag(posts: Post[]): Map<string, Post[]> {
  const tags = new Map<string, Post[]>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      tags.set(tag, [...(tags.get(tag) ?? []), post]);
    }
  }
  return tags;
}
