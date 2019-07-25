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
In my [last blog](/static-site-generation-with-vuepress), I looked at Vuepress to see if it was worth moving to, but it was a bit light on the details and was running on the assumption that it didn't have blogging support. Vuepress 1.0 was released a month ago and has changed everything. In this post, I will walk you through the process of creating a blog with Vuepress 1.x.

> You can get the code from this post from [here](https://github.com/isonaj/sample-vuepress-blog).

## Getting started
To get started, you will need to have [Node](https://nodejs.org/en/download/) installed. We will use [yarn](https://yarnpkg.com/en/) to install packages instead on [npm](https://www.npmjs.com/). Without getting too much into the details of yarn vs npm, I've had a few issues with Vuepress and npm that were resolved by using yarn. To install yarn, run `npm i yarn -g` on the command line.

Create a new folder for the blog and initialise it with:
```bash
$ yarn create vuepress  ## or npm 
```
![Create Vuepress command prompt](create-vuepress.png)
**Figure: Wizard to create Vuepress blog

Hey Presto! You have a blog. The create-vuepress script will ask all kinds of questions, but basically it is setting up your package.json file and working out which theme to apply. Since we're building a blog, it also goes ahead and creates some sample posts (in a _posts folder) so that you have somewhere to start. That is very cool!

Let's take a look at the new site.
```bash
$ yarn
$ yarn dev
```
Browse to http://localhost:8080 to see what we've created so far.

![First Go 404](first-go.png)
**Figure: Not what I was expecting**

> If you got the above 404 on the first go, edit `./blog/.vuepress/config.js` and remove the `modifyBlogPluginOptions` call in the themeConfig. It tries to address a bug that's already been fixed.

![First Go](first-go.png)
**Figure: Default Blog Layout**

That looks ok, but why are there 4 posts for 'Writing a VuePress theme'? If you look carefully, the `yarn create vuepress` command actually created 4 posts for that. So, while it looks strange, it's actually correctly displaying the posts in the `_posts` folder.

I know we've just started, but let's do a quick review.
Running the create-vuepress script has:
1. Created a `blog/_posts` folder to store our posts in.
2. Created a couple of sample posts.
3. Created a `blog/.vuepress` folder and a sample `config.js`.
4. Installed the `@vuepress/theme-blog` theme. 

Furthermore, the `@vuepress/theme-blog` has installed and configured a number of plugins, including `@vuepress/search`, `@vuepress/blog` and `@vuepress/pwa` (if configured). It also automatically generates a configurable 'summary' property to the page. Not bad!

> You can try out the search plugin now, by typing 'example' into the search box. As you can see, the search will go through the headers within posts, but not the content itself. When a header is found, it can be linked directly though, which I think makes this a powerful feature.

### First steps
We've generated a whole blog from a couple of commands, but it's not really ours yet. Let's update some of the defaults.

> The `.vuepress` folder is where all of the Vuepress stuff (themes, config, components, etc) lives. This provides a clean separation between content and site generation.

**./blog/.vuepress/config.js**
```js
module.exports = {
  title: 'My Vuepress Blog',
  description: 'Getting started with Vuepress'
  // ...
}
```

Create a new post:
**./blog/_posts/2019-7-18-first-post.md**
```markdown
---
date: 2019-07-18
tags:
  - blog
  - sometag
---
# My First Post
I have created a new post with `markdown` content.

## Secondary header

I can do *cool markdown things*.

> I can quote myself

```markdown
# Also
I can even make code blocks and specify the code type!
This is a sample `markdown` code block.
```

> Take note that we added 'blog' and 'sometag' tags to this post. Tags are pretty much managed straight out of the box. Click on the Tags link to find the new post under the appropriate tags!

### Static Pages
Every blog needs an 'About Me' link, so let's add one now.

**./blog/about-me.md**
```markdown
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
      { text: 'About', link: '/about-me/'}
    ]
  }
}
```

### Tags
You may have noticed that we added tags to our post earlier, specifically 'blob' and 'sometag'. If you browse to the Tags link now, you will see that 'sometag' has been created in the tags list. So tags are pretty much done, straight out of the box. But don't worry, there is still plenty to do!

### Google Analytics
```bash
$ yarn add @vuepress/plugin-google-analytics -D
```

**config.js**
```js
// ...
plugins: [
  // ...
  [ 
    '@vuepress/google-analytics',
    {
      'ga': 'UA-00000000-0' // Set this to your google analytics ID
    }
  ]  
  // ...
],
// ...
```
> Google anaylytics won't work from the vuepress dev server. It will inject the required code into the `app.js` during the `vuepress build` step and will work once you host those files.

### RSS Feed
RSS is important for blogs. It notifies your audience that you've posted something new.

Similar to Google Analytics, we need to install the plugin and configure it.
```bash
$ yarn add vuepress-plugin-rss -D
```

**config.js**
```js
// ...
plugins: [
  // ...
  [ 
    'vuepress-plugin-rss',
    {
      base_url: '/',
      site_url: 'https://mysite.com',
      filter: frontmatter => frontmatter.date <= new Date(currentDateUTC),
      count: 20
    }
  ]  
  // ...
],
// ...
```

Just like the Google Analytics
https://github.com/webmasterish/vuepress-plugin-feed
vs
https://github.com/dacsang97/vuepress-plugin-rss




### Reading Times on Posts
There's a great little plugin that calculates the reading time for a post and then attaches some data to the post that looks something like this:
```js
{
  text: '1 min read',
  minutes: 0.08,
  time: 4800,
  words: 16
}
```

Let's install it now.
```bash
$ yarn add vuepress-plugin-reading-time -D
```

And include it in the `config.js`.
```js
  plugins: [
    // ...
    'vuepress-plugin-reading-time',
    // ...
  ]
```

Finally, update the PostList component to show the readingTime.text value next to each post.
**PostList.vue**
```markup  
  <li v-for="(item, index) in posts">
    <a :href="item.path">{{item.title}}</a> ({{item.readingTime.text}})
  </li>
```

### User Comments with Disqus

### Draft / Future Posts

### SEO

https://github.com/lorisleiva/vuepress-plugin-seo


### PWA

pwa: true on the themConfig file.

### Responsive Images
https://github.com/ktquez/vuepress-theme-ktquez


## Deployment & Hosting

### GitHub pages + Azure

### Netlify + Zapier

https://www.netlify.com/



* https://github.com/bencodezen/vuepress-blog-boilerplate


Blogging support for Vuepress
https://github.com/vuejs/vuepress/issues/36
https://github.com/vuejs/vuepress/projects/1


https://v1.vuepress.vuejs.org/plugin/
https://vuepress-plugin-blog.ulivz.com/guide/getting-started.html#document-classifier
https://blog.logrocket.com/vuepress-in-all-its-glory-2f682e4f70c0/
https://books.google.com.au/books?id=OqScDwAAQBAJ&pg=PT288&lpg=PT288&dq=vuepress+google+analytics+doesn%27t+work&source=bl&ots=2lyqpb9ijp&sig=ACfU3U2jwopc87XSLaV37gsdaCAngBmCEA&hl=en&sa=X&ved=2ahUKEwjh-8OjsrPjAhUIbisKHdazCnQQ6AEwA3oECAkQAQ#v=onepage&q=vuepress%20google%20analytics%20doesn't%20work&f=false


https://medium.com/@_ulivz/intro-to-vuepress-1-x-7e2b7885f95f
https://snipcart.com/blog/vuepress-tutorial-vuejs-documentation


Tailwind css?
https://www.amie-chen.com/blog/20190206-build-a-site-with-vuepress-part1.html
https://www.amie-chen.com/blog/20190211-build-a-site-with-vuepress-part2.html
https://www.amie-chen.com/blog/20190212-build-a-site-with-vuepress-part3.html


https://alexjover.com/





### GitHub integration
The first part of GitHub integration is a 'Last Updated' tag, that can be added to the config. It uses the commits from git to determine when the document was last updated. Update the `config.js` to add a lastUpdated option like so:

```js
themeConfig: {
  // ...
  lastUpdated: 'Last Updated',
  // ...
}
```

#### Allow Editing
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
