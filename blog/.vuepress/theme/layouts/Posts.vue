<template>
  <main id="site-main" class="site-main outer">
    <div class="inner">
      <div class="post-feed">
        <card v-for="(post, index) in posts" :post="post" :key="index" />
      </div>
    </div>
  </main>
</template>

<script>
  import Card from '../partials/Card'
  import Error from '../partials/Error'

  export default {
    components: { Card, Error },
    computed: {
      posts () {
        return this.$lists.map.posts.posts;
      }
    }
  }
</script>

<style lang="scss">
  @import '../styles/post-feed';
</style>
