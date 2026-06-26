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
      link: `/${post.slug}/`
    }))
  });
}
