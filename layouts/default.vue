<template>
  <v-ons-page>
    <PageToolbar :title="$store.state.title" :action="() => $store.state.openSide = !$store.state.openSide"></PageToolbar>
    <nuxt/>
  </v-ons-page>
</template>

<style>
  ons-page {
    max-width: 600px;
    margin: 0 auto;
  }
</style>

<script>
  import PageToolbar from '~/components/PageToolbar'

  export default {
    components: {
      PageToolbar,
    }
  }
</script>