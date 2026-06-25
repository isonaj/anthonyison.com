---
title: "So... Cloudflare..."
slug: "so-cloudflare"
publishedAt: "2019-05-05T10:40:00.000Z"
updatedAt: "2020-01-11T05:41:41.000Z"
tags:
  - "cdn"
  - "cloudflare"
featureImage: "__GHOST_URL__/content/images/2020/01/cover-6.jpg"
type: "post"
---

<p>I went to a great talk by Troy Hunt in Brisbane a while ago. Well, it was great at the time. It didn't take long before I started to realise that most of the struggles I've had with HTTPS on my blog<!-- more --> could have actually been side stepped quite nicely by using <a href="https://www.cloudflare.com/">Cloudflare</a>.</p>
<p>Let me be clear. This wasn't the first time I heard of Cloudflare. To be honest, I didn't actually know what it was before now though, and Troy has a way of presenting things so that they seem really quite simple. Cloudflare seems to provide a service that just puts a bow on hosted services: Free SSL, CDN/caching, DNS, traffic management. Cloudflare aim to have an edge within 10ms of every client on the planet.</p>
<p>Since I already had my HTTPS sorted, I didn't worry too much about it at the time. Now, I'm looking for CDN and it wouldn't hurt to have an overlay on my site that allows some modifications to requests and responses (like HTTP/2, which Cloudflare seem to enable by default).</p>
<p>Getting set up is easy enough.</p>
<ol>
<li>Create an account with <a href="https://www.cloudflare.com/">Cloudflare</a>.</li>
<li>Add a site (eg. anthonyison.com).</li>
<li>Set up the DNS servers with your domain provider.</li>
<li>Add an A record to cloudflare to point to your IP (eg. for AKS) or CNAME to redirect to your alternate domain (eg. GitHub pages or web app)</li>
<li>Wait for the change to take effect. This can take up to 48 hours.</li>
</ol>
<p>Once CDN is in place, we've got one small problem. When we change the content, we need to be able to purge the cache. Cloudflare provides an API for achieving this. We just need to add it to the build pipeline. One way of doing it would be to create a Logic App that punches the API whenever there's a new commit on the github pages repo.</p>
<p>I might do that later on...</p>
<p>For now, I've hosted both blogs, just for comparison. I'm running <a href="https://developers.google.com/web/tools/lighthouse/">Lighthouse</a> against both to see if there's much of a difference.</p>
<p>Running Ghost:<br>
<img src="/images/ghost/2020/01/ghost_summary.png" alt="Ghost Summary" loading="lazy"><br>
<img src="/images/ghost/2020/01/ghost_performance.png" alt="Ghost Performance" loading="lazy"></p>
<p>Running Hexo on Github Pages:<br>
<img src="/images/ghost/2020/01/github_summary.png" alt="Github Summary" loading="lazy"><br>
<img src="/images/ghost/2020/01/github_performance.png" alt="Github Performance" loading="lazy"></p>
<p>Running Hexo on Github Pages behind Cloudflare:<br>
<img src="/images/ghost/2020/01/cloudflare_summary.png" alt="Cloudflare Summary" loading="lazy"><br>
<img src="/images/ghost/2020/01/cloudflare_performance.png" alt="Cloudflare Performance" loading="lazy"></p>
<p>With Cloudflare in place, I have CDN, HTTPS, HTTP/2 in place. I've enable Rocket Loader to improve paint time and auto-minify so that I can pull that from my build process. I can enable HSTS automatically, but not sure it's necessary?</p>
<p>For now, I think the numbers are heading in the right direction, even though I seem to have introduced a couple of new issues while migrating to hexo.</p>
