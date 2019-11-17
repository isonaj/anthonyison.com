---
title: Host your blog with Netlify
tags:
- blogging
image:
feature_img:
description:
keywords:
---
I have a confession. I am a scrooge when it comes to my blog. If I can get away with free hosting, I will do it. To that end, I've been looking at GitHub pages, Azure storage, etc (that is, storage, not compute) to keep my hosting costs way down. While recently looking into [Vuepress](https://vuepress.vuejs.org/), I kept hearing about a service called [Netify](https://www.netlify.com/) and it has changed the game for me and my blog.

I'll be honest. I try not to run off after every hot new topic. I just don't have that much time. That said, there are some things that I believe make a genuine difference in the life of a developer. One of those things is DevOps. If I can commit and push, preferably with pull requests, and deployment just happens, I am one happy camper. The separation of creating the product and deploying the product is huge! That said, my blog wasn't that big and DevOps can be time consuming, so I thought I'd come back to it one day. That was, until I found Netlify.

## Netlify
I can't remember why I looked at Netlify, I only remember that I did. Wow! Netlify provides an amazing service! It is simple to use, automatically detects things that it knows about and just works. The experience of running my site on Netlify involved:
1. Provide access to my GitHub repository
2. Netlify provided the steps to build, which I accepted
3. Click Save

After that, Netlify built my blog and published it. So, so simple! If you want a few more extras, Netlify also offers branch deployments (so you can test those changes before applying to master), DNS and SSL certificates from [Let's Encrypt](https://letsencrypt.org/).

## DevOps
While using [Hexo](https://hexo.io/) to generate my blog, I've been manually generating and deploying to GitHub pages from my laptop. I knew this wasn't ideal for two reasons.
1. I might forget to commit my changes.
2. I might forget how to publish my changes.

Ok. That might not be the usual way to talk about DevOps, but that's what counts to me. If it's automated, there are fewer things for me to remember and that's a Good Thing<sup>TM</sup>.

## Getting started

