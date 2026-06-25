---
title: "Static Site Generation with Vuepress"
slug: "static-site-generation-with-vuepress"
publishedAt: "2019-07-10T06:10:00.000Z"
updatedAt: "2020-01-11T06:17:08.000Z"
tags:
  - "blogging"
  - "vuepress"
featureImage: "__GHOST_URL__/content/images/2020/01/cover-10.jpg"
type: "post"
---

<p>When I was reviewing static site generators, <a href="https://vuepress.vuejs.org/">Vuepress</a> caught my eye but I passed over it quickly because their web site admitted that they <a href="https://vuepress.vuejs.org/guide/#todo">lacked blogging support</a>.<!-- more --> I really liked the approach though. It uses the <a href="https://vuejs.org/">Vue.js</a> server-side processing to generate static sites. It's time to have a closer look.</p>
<blockquote>
<p><strong>UPDATE 2019-07-18:</strong> &quot;Vuepress lacks blogging support&quot; is no longer accurate. Vuepress has added A LOT of features in <a href="https://medium.com/@_ulivz/intro-to-vuepress-1-x-7e2b7885f95f">version 1.0</a> that addresses the issues I experienced while writing this post. Stay tuned for another post on Vuepress soon!</p>
</blockquote>
<h2 id="creatingcontent">Creating content</h2>
<p>My first measure of a tool is how easy it is to get started. For Vuepress, that means I want to create a couple of posts. It's really easy to create some quick content, like so:</p>
<pre><code class="language-bash"># Create a folder for the blog
$ mkdir myblog
$ cd myblog

# Create a package.json file and add vuepress
$ npm init    # Enter through to accept all defaults
$ npm i vuepress --save
</code></pre>
<p>Create the following files:<br>
<strong>post1.md:</strong></p>
<pre><code class="language-markdown"># My first post
Here is some content
</code></pre>
<p><strong>post2.md:</strong></p>
<pre><code class="language-markdown"># My second post
Here is some more content
</code></pre>
<p><strong>index.md:</strong></p>
<pre><code class="language-markdown"># Index
* [First post](/post1.md)
* [Second post](/post2.md)
</code></pre>
<p>Next, we need to configure npm to run vuepress for us. Edit the newly created <code>package.json</code> file in the current folder and change the scripts section to:</p>
<pre><code class="language-js">  &quot;scripts&quot;: {
    &quot;dev&quot;: &quot;vuepress dev&quot;,
    &quot;build&quot;: &quot;vuepress build&quot;
  },
</code></pre>
<p>You can now run <code>npm run dev</code> to serve your blog.</p>
<p>Ok, so it wasn't THAT easy to get started. I would really prefer to see some kind of init stage here instead, but it's not too bad and you only have to get set up once. I'm guessing these concerns would be addressed if/when they add blogging support.</p>
<p>Looking at the new site, it's pretty barebones but it already has a search box that can look up my posts by title, so there's that. What we have at this point is basically a wiki page. While that's ok, I actually just want to create blog posts. I don't want to have to build links from my main page to each post.</p>
<p>Let's take a look at themes.</p>
<h2 id="addingatheme">Adding a theme</h2>
<p>Vuepress provides a clear separation between the content and the theme. The theme pieces will all live in the <code>.vuepress</code> folder. That is, any site configuration, layouts, components, etc can be found in this folder. Let's try out some of this now.</p>
<h3 id="configuration">Configuration</h3>
<p>Create the <code>.vuepress</code> folder and add a <code>config.js</code> file with the following:</p>
<pre><code class="language-js">module.exports = {
  title: 'My Vuepress Blog',
  description: 'Taking Vuepress for a spin'
}
</code></pre>
<h3 id="defaultlayout">Default Layout</h3>
<p>You can easily export the starting default theme by running <code>npx vuepress extract</code>. This will save the default layout in the <code>.vuepress\theme</code> folder. I'm not going to open up themes too much just yet. That would be a whole blog post to itself, but if you're interested in digging in, I recommend <a href="https://www.amie-chen.com/blog/20190211-build-a-site-with-vuepress-part2.html">this post</a>.</p>
<p><img src="/images/ghost/2020/01/screenshot1.png" alt="Vuepress site with default layout" loading="lazy"><br>
<strong>Figure: Vuepress site with default layout</strong></p>
<h2 id="downloadingatheme">Downloading a theme</h2>
<p>If you're like me, you're not interested in the absolute nitty-gritty of the theme. You just want to generate content. What I like about Vuepress is that the theme is Vue.js and I can have a good crack at trying to maintain my theme, or tweak the theme as needed.</p>
<p>As you can see in my blog, I am captivated by the Casper theme and fortunately, Vuepress has a Casper theme <a href="https://github.com/alexander-heimbuch/vuepress-theme-casper">here</a>. In my mind though, this theme leaves a lot to be desired when compared to my current (tweaked) hexo casper theme. This one requires the reading time to be added to the frontmatter, but that could possibly be automated with <a href="https://github.com/darrenjennings/vuepress-plugin-reading-time">this plugin</a>.</p>
<p><img src="/images/ghost/2020/01/screenshot2.png" alt="Vuepress site with Casper layout" loading="lazy"><br>
<strong>Figure: Vuepress site with Casper layout</strong></p>
<h2 id="bloggingsupport">Blogging support</h2>
<p>In <a href="/blogging-for-consistency">this post</a>, I looked at some of the expectations for a blog. Let's take a look at which parts we can hit with Vuepress.</p>
<h3 id="comments">Comments</h3>
<p>I use Disqus for comments. It uses JS to plugin to your page so should be able to run pretty much anywhere.</p>
<h3 id="rss">RSS</h3>
<p>Vuepress has a plugin for doing RSS feeds <a href="https://github.com/webmasterish/vuepress-plugin-feed">here</a>. I have no idea of the quality of the feed. RSS seems to be a bit of a mashup these days and I've had to hack the one I use with Hexo to get it to work in the places where it's missed a step.</p>
<h3 id="emailsubscriptions">Email subscriptions</h3>
<p>I don't currently do email subscriptions, but I imagine you can easily offload this to an external service like <a href="https://mailchimp.com">MailChimp</a> or <a href="https://tinyletter.com/">TinyLetter</a>.</p>
<h2 id="vuepressvshexo">Vuepress vs Hexo</h2>
<p>Alright, I would never have looked into Vuepress if this wasn't in the back of my mind. Let's take a look at some of the strengths and weaknesses of the two.</p>
<h3 id="hexo">Hexo</h3>
<p><strong>Pros:</strong></p>
<ul>
<li>Simple to create new posts</li>
<li>Flexible theme options</li>
</ul>
<p><strong>Cons:</strong></p>
<ul>
<li>Themes have inconsistent technologies</li>
<li>Most of the community seems to be Chinese (different social media stacks, language barriers)</li>
<li>Easier for non-developers (slightly?)</li>
</ul>
<h3 id="vuepress">Vuepress</h3>
<p><strong>Pros:</strong></p>
<ul>
<li>Very easy to get up and going with a basic CMS</li>
<li>Easy to create new posts</li>
<li>Themes have consistent Vue.js approach</li>
<li>Seems to have a thriving community</li>
</ul>
<p><strong>Cons:</strong></p>
<ul>
<li>Not really aimed at blogging just yet (but it's coming)</li>
<li>Very developer centric</li>
</ul>
<p>I guess when the chips are down, there is not a whole lot between them. If you're not a developer with an interest in <a href="https://vuejs.org/">Vue.js</a>, you might not be that interested in Vuepress. For me, I like the accessibility provided for creating themes. There seems to be less magic happening in Vuepress than there seems to be with Hexo. If I were starting over, maybe I'd look at Vuepress more seriously, but I'm happy with my current process with Hexo.</p>
<h2 id="summary">Summary</h2>
<p>Is Vuepress worth considering for blogs? I think so. There seems to be a thriving community, and it provides a great balance between content and theming concerns. I prefer the Vue.js components to most other templating engines, though I would probably jump at an Angular-based static site generator if I found one. Finally, if you want to take a look at a whole lot of resources related to Vuepress, <a href="https://github.com/ulivz/awesome-vuepress">this</a> is a great place to start.</p>
<p>Other references:</p>
<ul>
<li><a href="https://willwillems.com/posts/building-a-website-with-vuepress.html">https://willwillems.com/posts/building-a-website-with-vuepress.html</a></li>
<li><a href="https://willwillems.com/posts/write-a-custom-theme-with-vuepress.html">https://willwillems.com/posts/write-a-custom-theme-with-vuepress.html</a></li>
</ul>
