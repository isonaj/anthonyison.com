---
title: "Migrating from Ghost to Hexo"
slug: "migrating-from-ghost-to-hexo"
publishedAt: "2019-05-04T05:27:00.000Z"
updatedAt: "2020-01-11T05:29:50.000Z"
tags:
  - "blogging"
  - "ghost"
  - "hexo"
featureImage: "__GHOST_URL__/content/images/2020/01/cover-4.jpg"
type: "post"
---

<p>It was surprisingly easy to migrate my blog out of ghost, but there were a few missed steps along the way. Often, I would find a better way after I had done the heavy lifting.<!-- more --></p>
<h2 id="1installhexoandcreatetheblog">1. Install Hexo and create the blog</h2>
<pre><code class="language-bash">$ npm install hexo-cli -g
$ hexo init myblog
$ cd myblog
</code></pre>
<h2 id="2installthehexocaspertheme">2. Install the hexo-casper theme</h2>
<pre><code class="language-bash">$ git clone https://github.com/xzhih/hexo-theme-casper.git themes/hexo-casper
</code></pre>
<h2 id="3configurethethemeandsite">3. Configure the theme and site</h2>
<p>Edit <code>_config.yaml</code></p>
<pre><code class="language-yaml"># Site
title: Anthony Ison
subtitle: Software development and DevOps. Bringing solutions to life.
description: My meandering thoughts on development, devops and technology
keywords: software development,devops,azure,kubernetes,angular,serverless,docker
author: Anthony Ison
language: en
timezone: Australia/Brisbane  # From http://momentjs.com/timezone/
url: http://anthonyison.com
root: /

# Set these to create lowercase, title-only permalinks (like ghost)
permalink: :title/
filename_case: 1

# consider creating a folder with each post to hold any assets
post_asset_folder: true
</code></pre>
<p>Edit <code>themes/hexo-casper/_config.yaml</code></p>
<h2 id="4migratepostsfromghosttohexo">4. Migrate posts from ghost to hexo</h2>
<p>In Ghost:<br>
Labs &gt; Export content</p>
<pre><code class="language-bash">$ npm install hexo-migrator-ghost --save
$ hexo migrate ghost my-ghost.json
</code></pre>
<p><em>FAILED!</em></p>
<pre><code class="language-bash">$ npm install hexo-migrator-tryghost --save
$ hexo migrate ghost my-ghost.json
</code></pre>
<p><em>FAILED!</em></p>
<p>These probably failed because I was running Ghost 2.x and the export format has changed. If you've got an earlier version, maybe this will work for you.</p>
<pre><code class="language-bash">$ docker run -it -v $(pwd):/temp golang
$ go get -v github.com/jqs7/ghost-hexo-migrator
$ cd /temp
$ ghost-hexo-migrator my-ghost.json
</code></pre>
<p><em>FAILED!</em></p>
<p>This got a little closer, and actually pulled content across, but now I'm out of options. Fortunately, I don't have many posts and will manually migrate instead. I hope you have better luck.</p>
<h2 id="5reattachthepostimages">5. Reattach the post images</h2>
<p>Many of the migration tools will bring content across without images. So afterwards, you will need to copy the images in and link them to posts manually.</p>
<p>Also, it's worth configuring an image optimizer, using:</p>
<pre><code class="language-bash">$ npm i hexo-filter-responsive-images --save
</code></pre>
<p>Then add to the <code>_config.yaml</code>:</p>
<pre><code class="language-yaml"># hexo-filter-responsive-images
responsive_images:
  pattern: '**/*.+(png|jpg|jpeg)'
  sizes:
    small:
      width: 800
      withoutEnlargement: true
    large:
      width: 2000
      withoutEnlargement: true
</code></pre>
<p>To each of the blog post headers, add:</p>
<pre><code class="language-yaml">image: my-blog-post/small_cover.jpg
feature_img: large_cover.jpg
</code></pre>
<p>where <code>cover.jpg</code> is the original image for the post cover.</p>
<h2 id="6configurerss">6. Configure RSS</h2>
<pre><code class="language-bash">$ npm install hexo-generator-feed --save
</code></pre>
<p>Add this to your <code>_config.yaml</code>:</p>
<pre><code class="language-yaml">feed:
  type: atom
  path: atom.xml
  limit: 20
  hub:
  content:
  content_limit: 140
  content_limit_delim: ' '
  order_by: -date
  icon: icon.png
</code></pre>
<h2 id="7configuredeploy">7. Configure deploy</h2>
<pre><code class="language-bash">$ npm install hexo-deployer-git --save
</code></pre>
<p>Edit <code>_config.yaml</code></p>
<pre><code class="language-yaml">deploy:
  type: git
  repo: https://github.com/isonaj/isonaj.github.io.git
  branch: master
</code></pre>
