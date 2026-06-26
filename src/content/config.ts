import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
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

