module.exports = {
  title: 'Anthony Ison',
  description: 'Software development and DevOps. Bringing solutions to life.',
  //theme: 'casper',
  dest: './dist',
  author: 'Anthony Ison',

  themeConfig: {
    cover: 'https://res.cloudinary.com/isonaj/image/upload/f_auto,w_auto,c_scale/anthonyison.com/images/cover_tesif3.jpg',
    logo: 'https://res.cloudinary.com/isonaj/image/upload/f_auto,w_auto,c_scale/anthonyison.com/images/logo_clymv4.jpg',
    
    /* For SEO plugin */
    author: 'Anthony Ison',
    domain: 'https://anhtonyison.com',
    
    disqus: 'anthonyison',
    google_analytics: 'UA-131919757-1',
    momentlyId: '1mJ1TwAKARA',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Posts', link: '/posts/' },
      { text: 'Tags', link: '/tag/' },
      //{ text: 'Categories', link: '/category/' },
      { text: 'About', link: '/about/' }
    ],
    footer: [
      { text: 'Netlify', link: '/' },
      { text: 'Vuepress', link: '/' },
      { text: 'Casper theme', link: '/' }
    ],
    social: {
      github: 'https://github.com/isonaj',
      twitter: 'https://twitter.com/isonaj',
      linkedin: 'https://www.linkedin.com/in/anthony-ison-4a759a28/',
      youtube: 'https://www.youtube.com/channel/UC4_sgo322GFudAjSXbyQdmw',
      rss: 'https://anthonyison.com/rss.xml'
    },
  },
  head: [
    ['link', {rel: 'shortcut icon', href: '/images/logo.jpg'}],
    ['link', {rel: 'apple-touch-icon', href: '/images/logo.jpg'}]
  ],
  plugins: [
    [ 
      '@vuepress/google-analytics',
      {
        'ga': 'UA-131919757-1'
      }
    ], 
    [
      'blog-multidir',
      { 
        permalink: '/:slug',
        postLayout: 'Layout'
      }
    ],
    ['vuepress-plugin-reading-time'],
    ['container', { type: 'tip' }],
    ['container', { type: 'warning' }],
    ['container', { type: 'danger' }],
    ['feed', { canonical_base: 'https://anthonyison.com' }],
    ['sitemap', { hostname: 'https://anthonyison.com' }],
    ['@limdongjin/vuepress-plugin-simple-seo', { 
      root_url: 'https://anthonyison.com',
      default_site_name: 'Anthony Ison',
      default_image: '/images/logo.jpg',
      default_image_type: 'image/jpeg',
      default_image_width: 400,
      default_image_width: 500,
      //default_twitter_creator: '@isonaj',
      //default_twitter_site: '@isonaj'
    }]
    /*
    ['seo', {
      image: ($page, $site) => $page.frontmatter.image,
      publishedAt: $page => $page.frontmatter.publish && new Date($page.frontmatter.publish),
    }]
    */
  ]
}  
