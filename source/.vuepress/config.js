module.exports = {
  title: 'Anthony Ison',
  description: 'Software development and DevOps. Bringing solutions to life.',
  theme: 'isonaj',
  dest: './public',
  themeConfig: {
    disqus_shortname: 'anthonyison',
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
