---
title: "Serverless markdown blogs with Hexo"
slug: "serverless-markdown-blogs-with-hexo"
publishedAt: "2019-05-03T11:27:00.000Z"
updatedAt: "2020-01-11T05:27:34.000Z"
tags:
  - "blogging"
  - "hexo"
featureImage: "__GHOST_URL__/content/images/2020/01/cover-3.jpg"
type: "post"
---

<p>Let me start this by saying I'm loving my ghost blog, and I get a kick out of running it on AKS. The thing is, the content only changes when I post and so I'm thinking about caching<!-- more --> and I realise the whole blog can be cached. It's not an API. I don't have changing data. (Ok, TECHNICALLY I have a db, but bear with me) My posts are markdown, and I could just store them in git and publish static pages when I push.</p>
<p>After some searching, I have found there are many static web site generators. The ones that stood out for me were:</p>
<ul>
<li><a href="https://jekyllrb.com/">Jekyll</a> - this is number 1 and the default in <a href="https://pages.github.com/">Github Pages</a>. It runs on Ruby.</li>
<li><a href="https://hexo.io/">Hexo</a> - this is huge in China and built on node</li>
<li><a href="https://vuepress.vuejs.org/">Vuepress</a> - built for Vue docs. I think I will love this when the project is a bit more mature.</li>
</ul>
<blockquote>
<p>I thought I'd review Jekyll and Hexo, so I pulled a jekyll container in one window and installed Hexo in another. Unfortunately, I was up and running with Hexo before my download even finished, so rather than having a post that contrasts the two, I seem to have already chosen Hexo.</p>
</blockquote>
<h2 id="jekyll">Jekyll</h2>
<p>This is far and away the most popular. It has a thiving community and is well supported by Github Pages. The main disadvantage is that it becomes exponentially slower as pages are added, which wouldn't likely be an issue for my blog but is worth noting.</p>
<h2 id="hexo">Hexo</h2>
<p>Hexo is number 2 in popularity (mostly in China) and is growing fast. It also has many themes, and most of the demo sites are in Chinese.</p>
<h3 id="installinghexo">Installing Hexo</h3>
<p>Since it's built on node, Hexo is super easy to install (assuming you already have node installed!) We will be using npm to install.</p>
<pre><code class="language-bash"># Install Hexo:
$ npm install hexo-cli -g

# Create a site:
$ hexo init my-site

# Create a post:
$ hexo new post &quot;This is going to be a great post&quot;

# Serve your site locally:
$ hexo serve

# Generate the static site:
$ hexo generate
</code></pre>
<p>You can also:</p>
<ul>
<li>Create a draft with <code>hexo new draft &quot;This is a draft post&quot;</code></li>
<li>Publish a draft with <code>hexo publish post this-is-a-draft-post</code></li>
<li>Deploy your site: <code>hexo deploy</code></li>
</ul>
<h3 id="themes">Themes</h3>
<p>There are many themes around. Usually, you pull a git repo into your themes/theme-name folder. Themes basically wrap the whole presentation process, which means each theme has specific capabilities. (eg. some have google analytics, some have disqus comments). If you want to mix and match, you quickly find yourself editing your theme.</p>
<h3 id="plugins">Plugins</h3>
<p>There are different types of plugins. They seem to hook into the build process and provide various services. I haven't looked into them too much yet.</p>
<h3 id="migrators">Migrators</h3>
<p>There are migrators available and you can pull them in with npm install. I quickly found migrators for Wordpress and Ghost blogs.</p>
<h2 id="summary">Summary</h2>
<p>Hexo is node-based and provides a familiar interface for an Angular developer. It is a fantasic tool for getting a blog up and running and has capability to migrate from existing platforms. Since it is git based, it's a bit harder to manage from my phone, however I LOVE that my markdown content is in git so I can review changes and I know it won't be lost in a corrupt database.</p>
<p>What do you think? Would you use Hexo?</p>
