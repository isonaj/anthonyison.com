module.exports = {
  title: 'Anthony Ison',
  description: 'Software development and DevOps. Bringing solutions to life.',
  header_image: '/images/imleedh-ali-677414-unsplash.jpg',
  theme: 'isonaj',
  dest: './public',
  author: 'Anthony Ison',

  themeConfig: {
    disqus: 'anthonyison',
    google_analytics: 'UA-131919757-1',
    feed: {
      canonical_base: 'https://anthonyison.com',
    }
  },
  plugins: [
    [ 
      '@vuepress/google-analytics',
      {
        'ga': 'UA-131919757-1'
      }
    ] 
  ]
}  

/*
rss: /rss.xml           # link
favicon: /images/Anthony-Square-Color.png
blog_logo: #/images/Anthony-Square-Color.png
header_image: /images/imleedh-ali-677414-unsplash.jpg
bio: Software development and DevOps. Bringing solutions to life.
post_toc: true

# Keywords
keywords: hexo, casper, ghost, theme

# Menu
menu:
  ABOUT: /about
  ARCHIVES: /archives
  # you can add here

# author
author_image: /images/Anthony-Square-Color.png  # link
author_bio: 
author_location: 

# Social Links
social:
  weibo: 
  github: https://github.com/isonaj
  twitter: https://twitter.com/isonaj
  linkedin: https://www.linkedin.com/in/anthony-ison-4a759a28/
  facebook: 
  telegram:
  bilibili: 
  youtube: https://www.youtube.com/channel/UC4_sgo322GFudAjSXbyQdmw
  rss: https://anthonyison.com/rss.xml

momentlyId: 1mJ1TwAKARA

*/