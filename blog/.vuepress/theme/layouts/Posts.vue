<template>
  <main id="site-main" class="site-main outer">
    <div class="inner">
      <div class="post-feed">
        <card v-for="(post, index) in posts" :post="post" :key="index" />
      </div>
    </div>
    <pagination></pagination>
  </main>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Card from '../partials/Card'
  import Error from '../partials/Error'
  import Pagination from '../partials/Pagination'

  export default {
    components: { Card, Error, Pagination },
    computed: mapGetters(['posts'])
  }
</script>

<style lang="scss">
  @import '../styles/post-feed';
</style>
