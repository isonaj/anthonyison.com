---
title: Static Site Generation with Vuepress
publish: 2019-07-10 22:20:34
type: post
image: /static-site-generation-with-vuepress/cover.jpg
tags:
- blogging
- vuepress
---
When I was reviewing static site generators, [Vuepress](https://vuepress.vuejs.org/) caught my eye but I passed over it quickly because their web site admitted that they [lacked blogging support](https://vuepress.vuejs.org/guide/#todo).<!-- more --> I really liked the approach though. It uses the [Vue.js](https://vuejs.org/) server-side processing to generate static sites. It's time to have a closer look.

> **UPDATE 2019-07-18:** "Vuepress lacks blogging support" is no longer accurate. Vuepress has added A LOT of features in [version 1.0](https://medium.com/@_ulivz/intro-to-vuepress-1-x-7e2b7885f95f) that addresses the issues I experienced while writing this post. Stay tuned for another post on Vuepress soon!

## Creating content
My first measure of a tool is how easy it is to get started. For Vuepress, that means I want to create a couple of posts. It's really easy to create some quick content, like so:
```bash
# Create a folder for the blog
$ mkdir myblog
$ cd myblog

# Create a package.json file and add vuepress
$ npm init    # Enter through to accept all defaults
$ npm i vuepress --save
```
Create the following files:
**post1.md:**
```markdown
# My first post
Here is some content
```

**post2.md:**
```markdown
# My second post
Here is some more content
```

**index.md:**
```markdown
# Index
* [First post](/post1.md)
* [Second post](/post2.md)
```

Next, we need to configure npm to run vuepress for us. Edit the newly created `package.json` file in the current folder and change the scripts section to:
```js
  "scripts": {
    "dev": "vuepress dev",
    "build": "vuepress build"
  },
```
You can now run `npm run dev` to serve your blog.

Ok, so it wasn't THAT easy to get started. I would really prefer to see some kind of init stage here instead, but it's not too bad and you only have to get set up once. I'm guessing these concerns would be addressed if/when they add blogging support. 

Looking at the new site, it's pretty barebones but it already has a search box that can look up my posts by title, so there's that. What we have at this point is basically a wiki page. While that's ok, I actually just want to create blog posts. I don't want to have to build links from my main page to each post.

Let's take a look at themes.

## Adding a theme
Vuepress provides a clear separation between the content and the theme. The theme pieces will all live in the `.vuepress` folder. That is, any site configuration, layouts, components, etc can be found in this folder. Let's try out some of this now.

### Configuration
Create the `.vuepress` folder and add a `config.js` file with the following:
```js
module.exports = {
  title: 'My Vuepress Blog',
  description: 'Taking Vuepress for a spin'
}
```

### Default Layout
You can easily export the starting default theme by running `npx vuepress extract`. This will save the default layout in the `.vuepress\theme` folder. I'm not going to open up themes too much just yet. That would be a whole blog post to itself, but if you're interested in digging in, I recommend [this post](https://www.amie-chen.com/blog/20190211-build-a-site-with-vuepress-part2.html).

![Vuepress site with default layout](screenshot1.png)
**Figure: Vuepress site with default layout**

## Downloading a theme
If you're like me, you're not interested in the absolute nitty-gritty of the theme. You just want to generate content. What I like about Vuepress is that the theme is Vue.js and I can have a good crack at trying to maintain my theme, or tweak the theme as needed.

As you can see in my blog, I am captivated by the Casper theme and fortunately, Vuepress has a Casper theme [here](https://github.com/alexander-heimbuch/vuepress-theme-casper). In my mind though, this theme leaves a lot to be desired when compared to my current (tweaked) hexo casper theme. This one requires the reading time to be added to the frontmatter, but that could possibly be automated with [this plugin](https://github.com/darrenjennings/vuepress-plugin-reading-time).

![Vuepress site with Casper layout](screenshot2.png)
**Figure: Vuepress site with Casper layout**

## Blogging support
In [this post](/blogging-for-consistency), I looked at some of the expectations for a blog. Let's take a look at which parts we can hit with Vuepress.

### Comments
I use Disqus for comments. It uses JS to plugin to your page so should be able to run pretty much anywhere.

### RSS
Vuepress has a plugin for doing RSS feeds [here](https://github.com/webmasterish/vuepress-plugin-feed). I have no idea of the quality of the feed. RSS seems to be a bit of a mashup these days and I've had to hack the one I use with Hexo to get it to work in the places where it's missed a step.

### Email subscriptions
I don't currently do email subscriptions, but I imagine you can easily offload this to an external service like [MailChimp](https://mailchimp.com) or [TinyLetter](https://tinyletter.com/).

## Vuepress vs Hexo
Alright, I would never have looked into Vuepress if this wasn't in the back of my mind. Let's take a look at some of the strengths and weaknesses of the two.

### Hexo
**Pros:**
* Simple to create new posts
* Flexible theme options

**Cons:** 
* Themes have inconsistent technologies
* Most of the community seems to be Chinese (different social media stacks, language barriers)
* Easier for non-developers (slightly?)

### Vuepress
**Pros:**
* Very easy to get up and going with a basic CMS
* Easy to create new posts
* Themes have consistent Vue.js approach
* Seems to have a thriving community

**Cons:**
* Not really aimed at blogging just yet (but it's coming)
* Very developer centric

I guess when the chips are down, there is not a whole lot between them. If you're not a developer with an interest in [Vue.js](https://vuejs.org/), you might not be that interested in Vuepress. For me, I like the accessibility provided for creating themes. There seems to be less magic happening in Vuepress than there seems to be with Hexo. If I were starting over, maybe I'd look at Vuepress more seriously, but I'm happy with my current process with Hexo.

## Summary
Is Vuepress worth considering for blogs? I think so. There seems to be a thriving community, and it provides a great balance between content and theming concerns. I prefer the Vue.js components to most other templating engines, though I would probably jump at an Angular-based static site generator if I found one. Finally, if you want to take a look at a whole lot of resources related to Vuepress, [this](https://github.com/ulivz/awesome-vuepress) is a great place to start.

Other references:
* https://willwillems.com/posts/building-a-website-with-vuepress.html
* https://willwillems.com/posts/write-a-custom-theme-with-vuepress.html
