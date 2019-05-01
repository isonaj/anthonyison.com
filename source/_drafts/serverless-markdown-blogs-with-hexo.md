---
title: Serverless markdown blogs with Hexo
tags:
---
Let me start this by saying I'm loving my ghost blog, and I get a kick out of running it on AKS. The thing is, the content only changes when I post and so I'm thinking about caching and I realise the whole blog can be cached. It's not an API. I don't have changing data. (Ok, TECHNICALLY I have a db, but bear with me) My posts are markdown, and I could just store them in git and publish static pages when I push.

After some searching, I have found there are many static web site generators. The ones that stood out for me were: 
* [Jekyll] - this is number 1 and the default in [Github Pages](). It runs on Ruby.
* [Hexo] - this is huge in China and built on node
* [Vuepress] - built for Vue docs

> I thought I'd review Jekyll and Hexo, so I pulled a jekyll container in one window and installed Hexo in another. Unfortunately, I was up and running with Hexo before my download even finished, so rather than having a post that contrasts the two, I seem to have already chosen Hexo.

# Jekyll
This is far and away the most popular. It has a thiving community and is well supported by Github Pages. The main disadvantage is that it becomes exponentially slower as pages are added, which wouldn't likely be an issue for my blog but is worth noting.

# Hexo
Hexo is number 2 in popularity (mostly in China) and is growing fast. It also has many themes, and most of the demo sites are in Chinese.

# Installing Hexo
Since it's built on node, Hexo is super easy to install (assuming you already have node installed!) We will be using npm to install.

Install Hexo:
```
npm install hexo-cli -g
```

Create a site:
```
hexo init my-site
```

Create a post:
```
hexo new post "This is going to be a great post"
```

Serve your site locally:
```
hexo serve
```

Generate the static site:
```
hexo generate
```

You can also:
* Create a draft with `hexo new draft "This is a draft post"`
* Publish a draft with `hexo publish ...`
* Deploy your site: `hexo deploy`

### Themes

### Migrators
There are migrators available and you can pull them in with npm install. I quickly found migrators for Wordpress and Ghost blogs. 

# Summary
Hexo seems to be a fantasic tool for getting a blog up and running and capability to migrate from existing platforms. Since it is git based, it's a bit harder to manage from my phone, however I LOVE that my markdown content is in git so I can review changes and I know it won't be lost in a corrupt database.

What do you think? Would you use Hexo?