---
title: So... Cloudflare...
tags: CDN
cover_img: /so-cloudflare/small_jakob-owens-1417197-unsplash.jpg
feature_img: jakob-owens-1417197-unsplash.jpg
date: 2019-05-05 20:40:42
description:
keywords:
---

I went to a great talk by Troy Hunt in Brisbane a while ago. Well, it was great at the time. It didn't take long before I started to realise that most of the struggles I've had with HTTPS my blog could have actually been side stepped quite nicely by using [Cloudflare](https://www.cloudflare.com/).

Let me be clear. This wasn't the first time I heard of Cloudflare. To be honest, I didn't actually know what it was before now though, and Troy has a way of presenting things so that they seem really quite simple. Cloudflare seems to provide a service that just puts a bow on hosted services: Free SSL, CDN/caching, DNS, traffic management. Cloudflare aim to have an edge within 10ms of every client on the planet.

Since I already had my HTTPS sorted, I didn't worry too much about it at the time. Now, I'm looking for CDN and it wouldn't hurt to have an overlay on my site that allows some modifications to requests and responses (like HTTP/2, which Cloudflare seem to enable by default).

Getting set up is easy enough.
1. Create an account with [Cloudflare](https://www.cloudflare.com/).
2. Add a site (eg. anthonyison.com).
3. Set up the DNS servers with your domain provider.
4. Add an A record to cloudflare to point to your IP (eg. for AKS) or CNAME to redirect to your alternate domain (eg. GitHub pages or web app)
5. Wait for the change to take effect. This can take up to 48 hours.

Once CDN is in place, we've got one small problem. When we change the content, we need to be able to purge the cache. Cloudflare provides an API for achieving this. We just need to add it to the build pipeline. One way of doing it would be to create a Logic App that punches the API whenever there's a new commit on the github pages repo.

I might do that later on...

For now, I've hosted both blogs, just for comparison. I'm running [Lighthouse](https://developers.google.com/web/tools/lighthouse/) against both to see if there's much of a difference.

Running Ghost:
![Ghost Summary](/so-cloudflare/ghost_summary.png)
![Ghost Performance](/so-cloudflare/ghost_performance.png)

Running Hexo on Github Pages:
![Ghost Summary](/so-cloudflare/github_summary.png)
![Ghost Performance](/so-cloudflare/github_performance.png)

Running Hexo on Github Pages behind Cloudflare:
![Ghost Summary](/so-cloudflare/cloudflare_summary.png)
![Ghost Performance](/so-cloudflare/cloudflare_performance.png)


With Cloudflare in place, I have CDN, HTTPS, HTTP/2 in place. I've enable Rocket Loader to improve paint time and auto-minify so that I can pull that from my build process. I can enable HSTS automatically, but not sure it's necessary?

For now, I think the numbers are heading in the right direction, even though I seem to have introduced a couple of new issues while migrating to hexo.