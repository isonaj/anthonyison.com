import { getCollection, type CollectionEntry } from 'astro:content';
import { BATCH_SIZE } from '../site';

export type Post = CollectionEntry<'blog'>;

/** Every post, newest first. Pages are never part of a feed. */
export async function getPosts(): Promise<Post[]> {
  const entries = await getCollection('blog');
  return entries
    .filter((entry) => entry.data.type === 'post')
    .sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}

export function batchCount(posts: Post[]): number {
  return Math.max(1, Math.ceil(posts.length / BATCH_SIZE));
}

export function batchOf(posts: Post[], batch: number): Post[] {
  return posts.slice((batch - 1) * BATCH_SIZE, batch * BATCH_SIZE);
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
