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
  }).superRefine((entry, ctx) => {
    if (entry.type === 'post' && !entry.description) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['description'],
        message: 'Every post needs a description: it is used in the feed, the meta description and RSS.'
      });
    }
  })
});

export const collections = { blog };

