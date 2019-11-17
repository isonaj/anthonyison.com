---
title: How to create a blog with Vuepress
image: /how-to-create-a-blog-with-vuepress/cover.jpg
tags:
- blogging
- vuepress
---
In [this blog](/static-site-generation-with-vuepress), I looked at Vuepress to see if it was worth moving to, but it was a bit light on the details and was running on the assumption that it didn't have blogging support. Vuepress 1.0 was released a earlier this year and has changed everything. In this post, I will walk you through the process of creating a blog with Vuepress 1.x.

> You can get the code from this post from [here](https://github.com/isonaj/test-blog).

## Getting started
To get started, you will need to have [Node](https://nodejs.org/en/download/) installed. We will use [yarn](https://yarnpkg.com/en/) to install packages instead on [npm](https://www.npmjs.com/). Without getting too much into the details of yarn vs npm, I've had a few issues with Vuepress and npm that were resolved by using yarn. To install yarn, run `npm i yarn -g` on the command line.

Create a new folder for the blog and initialise it with:
```bash
$ yarn init
$ yarn add vuepress -D
```

To make things easier later, update the new `package.json` with the scripts section:
```js{4-7}
{
  "name": "test-blog",
  "version": "1.0.0",
  "scripts": {
    "dev": "vuepress dev blog",
    "build": "vuepress build blog"
  },
  "devDependencies": {
    "vuepress": "^1.2.0",
  }
}
```

You should then set up a folder structure that looks like this:
```
+-- blog
    +-- .vuepress
    |   +-- config.js
    +-- posts
```

**config.js**
```js
module.exports = {
  title: 'My blog',
  description: 'Taking Vuepress for a spin'
}
```

### Select a theme
With a blog, it's a good idea to start with a theme. Even though a theme should only be presentation, the choices from the theme builder will often impact (limit) your options later. As such, it's a good idea to start with the theme you want where possible. We will talk more around the limitations from the theme later. 

In this post, I will be using the [ououe](https://github.com/tolking/vuepress-theme-ououe) theme. There are a few reasons for this.
1. It is like Casper. (I love the Casper theme!)
2. It has great [documentation](https://tolking.github.io/vuepress-theme-ououe/)!

To apply the theme, we need to download it with:
```sh
$ yarn add vuepress-theme-ououe -D
```

Next, update the `config.js` to use the theme:
```js{4}
module.exports = {
  title: 'My blog',
  description: 'Taking Vuepress for a spin',
  theme: 'ououe'
}
```

### Create a post
We're almost there, I promise! If we ran the blog now, it would show a pretty 404 page because there are no posts to show yet. So let's add a post and see what we've got!

**./blog/posts/test-post.md**
```markdown
---
title: Test post
display: home
---
This is a test post.
```

### Run it locally
So far we have:
* Installed vuepress and the ououe theme
* Configured vuepress with a title, description and selected the ououe theme
* Created a post

We can now run the blog to see the results of our labours!
```sh
$ yarn      # This will download everything you need to run the blog
$ yarn dev  # This is the command we will use to run locally
```
Browse to http://localhost:8080 to see what has been created so far.

![First run](first-run)
**Figure: First run**

I guess TECHNICALLY it's a blog, but we've got a long way to go. Let's make it LOOK like a blog next.

## Configure blog header, footer and logo
To look like a real blog, we need header menu, cover image, logo and probably some footer links while we're at it. Let's go with the default [Casper](https://github.com/TryGhost/Casper) look. Save [cover.jpg]() and [logo.png]() into the `blog\.vuepress\public` folder. This is the root folder for assets.

Next, update `config.js` again, to set up header, footer and images. We will do this by using the themeConfig property, since this is all related to configuring the ououe theme.
```js
module.exports = {
  title: 'My blog',
  description: 'Taking Vuepress for a spin',
  theme: 'ououe',
  themeConfig: {
    cover: '/cover.jpg',
    logo: '/logo.png',
  }
}
```

## Storing images in Git
Storing a blog like this in Git is fine, except when we start adding images. Git doesn't do well with binaries. Fortunately, [Git Large File Storage](https://git-lfs.github.com/) is a good solution!
You will need to download the plugin to manage it, but once installed, simply identify the files that are likely to be large binaries.

```sh
$ git lfs install
$ git lfs track "*.png"
$ git lfs track "*.jpg"
$ git add .gitattributes
```

Now we're free to add images to the repository without causing problems.






![Create Vuepress command prompt](create-vuepress.png)
**Figure: Wizard to create Vuepress blog

Hey Presto! You have a blog. The create-vuepress script will ask all kinds of questions, but basically it is setting up your package.json file and working out which theme to apply. Since we're building a blog, it also goes ahead and creates some sample posts (in a _posts folder) so that you have somewhere to start. That is very cool!

Let's take a look at the new site.
```bash
$ yarn
$ yarn dev
```
Browse to http://localhost:8080 to see what has been created so far.

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

## Customising the blog
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
**./blog/_posts/2019-07-18-first-post.md**
```markdown
---
date: 2019-07-18
tags:
- blog
- sometag
---
I have created a new post with `markdown` content.
<!-- more -->

## Secondary header

I can do *cool markdown things*.

> I can quote myself

```markdown
# Also
I can even make code blocks and specify the code type!
This is a sample `markdown` code block.
```

> Take note that we added 'blog' and 'sometag' tags to this post. Tags are pretty much managed straight out of the box. Click on the Tags link to find the new post under the appropriate tags!

## Adding a theme
## Static Pages
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

## Tags
You may have noticed that we added tags to our post earlier, specifically 'blob' and 'sometag'. If you browse to the Tags link now, you will see that 'sometag' has been created in the tags list. So tags are pretty much done, straight out of the box. But don't worry, there is still plenty to do!

## Google Analytics
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

## RSS Feed
RSS is important for blogs. It notifies your audience that you've posted something new.

Similar to Google Analytics, we need to install the plugin and configure it.
```bash
$ yarn add vuepress-plugin-feed -D
```

**config.js**
```js
// ...
plugins: [
  // ...
  [ 
    'vuepress-plugin-feed',
    {
      canonical_url: 'https://anthonyison.com'
    }
  ]  
  // ...
],
// ...
```


## Sitemap
Sitemap config goes here

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
    ['vuepress-plugin-reading-time'],
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

## User Comments with Disqus

## Draft / Future Posts

## SEO

https://github.com/lorisleiva/vuepress-plugin-seo


## PWA

pwa: true on the themConfig file.

## Responsive Images
https://github.com/ktquez/vuepress-theme-ktquez


### Big files don't belong in git
So use this: https://git-lfs.github.com/
do this to install
files go here, etc etc

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

https://medium.com/vue-mastery/how-to-create-a-custom-vuepress-theme-with-vuetify-651b7d7e5092
https://willwillems.com/posts/write-a-custom-theme-with-vuepress.html



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



### Big files don't belong in git
So use this: https://git-lfs.github.com/
do this to install
files go here, etc etc

https://tolking.github.io/vuepress-theme-ououe/guide/#features

https://git-lfs.github.com/
https://www.netlify.com/products/large-media/

https://github.com/meteorlxy/vssue ???
https://vuepress.vuejs.org/theme/writing-a-theme.html#content-outlet
https://vuepress.vuejs.org/guide/assets.html#relative-urls

https://developer.github.com/v3/repos/contents/
