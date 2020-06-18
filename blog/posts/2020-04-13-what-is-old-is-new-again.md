---
title: What is old is new again
publish: 2020-04-13 18:00
type: post
image: https://images.unsplash.com/photo-1542241834-ab7bb554663f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=2000&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ
tags:
- blogging
- ghost
---
I really enjoy writing content for my blog. For the last 5 months or so, it's been getting harder to write. That's not because I'm lacking content or the desire to write. It's mostly related to converting my blog to Vuepress.

[Vuepress](https://vuepress.vuejs.org/) is great and I really recommend it. It is brilliant for doing a technical documentation and it is perfectly capable as a blogging engine. I found 2 different themes that were almost good enough for my blog. I wanted to make a few tweaks and release it as a theme, along with a blog post describing how to make a blog using Vuepress. It sounds like a good way to generate content, but it hasn't worked for me. I've been building a Vuepress blog theme instead of writing content.

When I first started my blog, I received some really good advice.

> Don't let your blog technology become a project or you will spend more time tinkering with your blog than writing content. - [Jason Taylor](http://codingflow.net)

## Focus requires priorities
> You can do anything, but not everything.

One of the benefits of agile processes is that tasks are worked on according to priorities. You might be wondering what benefit this provides. It's about saying "No". Say "No" to everything that's not at the top of the list. This reduces distractions and increases focus.

## Focus on your value
> Only write the code that only you can write

I'm a software developer and I build things. They say, "When you have a hammer, everything looks like a nail." I think this is a common thing for developers. As builders, we want to build things, often ALL the things.

## Blogs are for blogging
With all this in mind, I want a blogging platform that I can just use.

The common choices for blogging platforms seem to be:
* Wordpress
* Ghost


| Blogging platform | Hosting | Cost |
|-------------------|---------|------|
| Wordpress with Bluehost | Managed | $5/mth |
| Hosted Ghost            | Managed | $30/mth |
| Self hosted Ghost       | Self hosted | FREE-ish |

## Hosting on Azure
When I first started out, I wanted to run on Azure Web Apps and I still do. I want to run serverless to reduce running costs, or run containers. Ghost COULD be run in a serverless way (even though it hasn't really been designed for that, but it will be a lot of effort and I've already flagged that as an issue). If not serverless, containers are my next choice. When I first started, I ran Ghost in a container, hit a problem in Web Apps and side stepped it with Kubernetes because it just worked.

The pricing for Kubernetes is just not stable enough for my liking. Yes, you can prepay and get discounts. Yes, it's probably (possibly?) cheaper. But Web Apps are just so nice to work with. No VM + disk + routing + logging, plus, plus, plus. It's one price and does what it says on the box. So, let's run Ghost in a Web App. It's not straight forward, but it can be done (I hope :)). Next time!

## Final thoughts
> Coming back to where you started is not the same as never leaving.

So, it seems I've come full circle and ended up back on Ghost. As in the hero journey, coming back to the same place is not the same as having never left.

Some things I've learned:
* Performance isn't necessary when you're starting out
* A CDN will cover a myriad of sins with website performance
* Website performance is mostly about images
* Responsive images have client side and server side parts to consider
* I don't want to build my own theme
