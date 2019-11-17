---
title: Migrating from Ghost to Hexo
date: 2019-05-04 23:12:56
image: /migrating-from-ghost-to-hexo/cover.jpg
tags:
- ghost
- hexo
- blogging
---
It was surprisingly easy to migrate my blog out of ghost, but there were a few missed steps along the way. Often, I would find a better way after I had done the heavy lifting.

## 1. Install Hexo and create the blog
```bash
$ npm install hexo-cli -g
$ hexo init myblog
$ cd myblog
```

## 2. Install the hexo-casper theme
```bash
$ git clone https://github.com/xzhih/hexo-theme-casper.git themes/hexo-casper
```

## 3. Configure the theme and site
Edit `_config.yaml`
```yaml
# Site
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
```

Edit `themes/hexo-casper/_config.yaml`

## 4. Migrate posts from ghost to hexo
In Ghost:
Labs > Export content

```bash
$ npm install hexo-migrator-ghost --save
$ hexo migrate ghost my-ghost.json
```
*FAILED!*

```bash
$ npm install hexo-migrator-tryghost --save
$ hexo migrate ghost my-ghost.json
```
*FAILED!*

These probably failed because I was running Ghost 2.x and the export format has changed. If you've got an earlier version, maybe this will work for you.

```bash
$ docker run -it -v $(pwd):/temp golang
$ go get -v github.com/jqs7/ghost-hexo-migrator
$ cd /temp
$ ghost-hexo-migrator my-ghost.json
```
*FAILED!*

This got a little closer, and actually pulled content across, but now I'm out of options. Fortunately, I don't have many posts and will manually migrate instead. I hope you have better luck.

## 5. Reattach the post images
Many of the migration tools will bring content across without images. So afterwards, you will need to copy the images in and link them to posts manually.

Also, it's worth configuring an image optimizer, using:
```bash
$ npm i hexo-filter-responsive-images --save
```

Then add to the `_config.yaml`:
```yaml
# hexo-filter-responsive-images
responsive_images:
  pattern: '**/*.+(png|jpg|jpeg)'
  sizes:
    small:
      width: 800
      withoutEnlargement: true
    large:
      width: 2000
      withoutEnlargement: true
```

To each of the blog post headers, add:
```yaml
image: my-blog-post/small_cover.jpg
feature_img: large_cover.jpg
```
where `cover.jpg` is the original image for the post cover.

## 6. Configure RSS
```bash
$ npm install hexo-generator-feed --save
```

Add this to your `_config.yaml`:
```yaml
feed:
  type: atom
  path: atom.xml
  limit: 20
  hub:
  content:
  content_limit: 140
  content_limit_delim: ' '
  order_by: -date
  icon: icon.png
```

## 7. Configure deploy
```bash
$ npm install hexo-deployer-git --save
```

Edit `_config.yaml`
```yaml
deploy:
  type: git
  repo: https://github.com/isonaj/isonaj.github.io.git
  branch: master
```

