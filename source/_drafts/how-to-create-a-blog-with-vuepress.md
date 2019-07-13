---
title: How to create a blog with Vuepress
tags:
  - vuejs
  - blogging
  - vuepress
image: /how-to-create-a-blog-with-vuepress/small_cover.jpg
feature_img: cover.jpg
description:
keywords:
---
In my [last blog](/static-site-generation-with-vuepress), I looked at Vuepress to see if it was worth moving to, but it was a bit light on the details. In this post, I will explore the nitty gritty of what it actually takes to create a functional blog. Will I migrate my blog? Who knows? You will have to wait and see!

> You can get the code from this post from [here](https://github.com/isonaj/sample-vuepress-blog).

# Getting started
To get started, you will need to have [Node](https://nodejs.org/en/download/) installed.
Create a new folder for the blog and initialise it with:
```bash
$ git init
$ npm init
$ npm install vuepress --save-dev
$ echo node_modules > .gitignore
```

> You may or may not want to have a blog folder in this directory. I'm not going to use one for this example.

## Create some content
This base folder will be where the blog posts go. However, rather than create the markdown files directly in the base folder, I recommend creating a folder per post so that you can keep any other post-specific assets with the post.

Create two folders (`my-first-post` and `a-second-post`) and in each folder create an `index.md` file. These files will be converted to `index.html`, allowing access to the folder name as the path to the post. Put some content in each file and make sure you start each with a header.

> You can use `README.md` instead of `index.md`. They both generate `index.html` files. I prefer `README.md` if it's generating readme content (like on github) and `index.md` in this case.

Now that we have some content, we want to be able to access it.

## First steps
Run vuepress to serve the page with `npx vuepress dev`. This will serve the page at http://localhost:8080 by default. 
Point your browser there and you see:
!(first-go.png)

That's ok. We don't have a main (home) page yet. Let's create one now. 

Create a new `index.md` file in the root folder with the following:
```markdown
---
home: true
---
```
The triple dash indicates *frontmatter*, which is metadata for the content. Here, we've indicated that this page is a Home page and it has no content. Now, refresh the page.  It's not much, but it's a start. Let's give it a title.

Create a `.vuepress` folder and add a new config.

*.vuepress/config.js*
```js
module.exports = {
  title: 'My Vuepress Blog',
  description: 'Getting started with Vuepress'
}
```

> The `.vuepress` folder is where all of the Vuepress stuff (themes, config, components, etc) lives. This provides a clean separation between content and site generation.

You can navigate directly to the content at either http://localhost:8080/my-first-post or http://localhost:8080/a-second-post (assuming you are running the server) or you can use the search box on any headings in your content. (This only seems to work if the post has a heading on the first line)

We are currently using the default theme from Vuepress and that's not really good for blogs. We will take a look at that next.

## Create a base theme
A blog usually consists of 3 main page types:
1. A list of posts (eg. the main page)
2. A single post
3. A static page (eg. About Me)

We can provide a totally new layout for each page type, but we won't. Instead, we will keep the basic shell and use different components to display the content, depending on the content type. We can also start over with the theme or start with the default and make some changes. In this example, we will be modifying the theme.

To get access to the default theme:
```bash
$ npx vuepress eject
```
This drops all of the default theme's files into the `.vuepress/theme` folder. 

A few things to take note of: 
1. The `components` and `global-components` folder contains .vue files. These are the Vue.js components that make up the site.
2. The `styles` folder contains .styl files. They are Stylus files and produce the CSS for the site. The layout is similar to yaml.
3. The `layouts` folder also contains .vue files. Each page can select which layout to use in the frontmatter, but we'll get to that later.

For now, let's create a new `PostList` component.
```vuejs
<template>
	<div>  
    <h2>Posts</h2>
    <ul>
      <li v-for="(item, index) in posts">
        <a :href="item.path">{{item.title}}</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'PostList',
  computed: {
    posts() {
      return this.$site.pages.filter(item => item.frontmatter.type === 'post');
    }
  }
}
</script>
```

Hook it into the `Home.vue` file by adding it into the template and importing the component for use:
```vue.js
  // ...
  <PostList />

  <Content class="theme-default-content custom"/>
  // ...

<script>
import NavLink from '@theme/components/NavLink.vue'
import PostList from '@theme/components/PostList.vue'

export default {
  components: { NavLink, PostList },
// ...
```

The `PostList` component is checking the frontmatter to see if the page's type is post.
Go and edit the posts and add this to the top:
```markdown
---
type: post
---
```

That's it! This is now a semi-functional blog! It could obviously use a bit more pizzazz, but I leave that as an exercise for the reader. ;)

## Static Pages
Every blog needs an 'About Me' link, so let's add one now.

Create an `about-me` folder with an `index.md` that looks like this:
```markdown
---
type: page
---
# About Me
Every blog needs an About Me page.
```

Then, update `config.js` to configure the navbar.
```js
module.exports = {
  title: 'My Vuepress Blog',
  description: 'Getting started with Vuepress',
  themeConfig: {
    "nav": [
      { text: 'About Me', link: '/about-me/'}
    ]
  }
}
```

## GitHub integration
The first part of GitHub integration is a 'Last Updated' tag, that can be added to the config. It uses the commits from git to determine when the document was last updated. Update the `config.js` to add a lastUpdated option like so:

```js
themeConfig: {
  // ...
  lastUpdated: 'Last Updated',
  // ...
}
```

### Allow Editing
This doesn't really apply to a blog, but it really helps with general documentation. Firstly, here's the config changes:
```js
themeConfig: {
  // ...
  repo: 'isonaj/sample-vuepress-blog',
  repoLabel: 'Contribute!',
  editLinks: true,
  editLinkText: 'Help us improve this page!',
  // ...
}
```

The editLinks config items will add a link to each post that redirects to the markdown page on GitHub to allow editing. (assuming the user has access) The `repoLabel` config item puts an entry in the menu that links directly to the main GitHub page.

## Tags

## Draft / Future Posts

## Google Analytics

## User Comments with Disqus

## Reading Times on Posts


