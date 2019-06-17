<template>
  <v-ons-tabbar position="auto" swipeable :index.sync="index" :visible="true">
    <template slot="pages">
      <EntriesPage v-for="tab in $store.state.tabs"
                   v-bind:key="tab.label"
                   :entries="tab.props.entries"
                   :label="tab.label"
      ></EntriesPage>
    </template>
    <v-ons-tab v-for="tab in $store.state.tabs"
               v-bind:key="tab.label"
               :label="tab.label + ' (' + tab.props.entries.length + ')'"
    ></v-ons-tab>
  </v-ons-tabbar>
</template>

<style>
ons-list-header {
  z-index: 20003;
}
</style>

<script>
  import EntriesList from '~/components/EntriesList';
  import EntriesPage from '~/components/EntriesPage';

  export default {
    props: ['tabs'],
    components: {
      EntriesPage,
      EntriesList,
    },
    computed: {
      index: {
        get() {
          return this.$store.state.tabIndex
        },
        set(newValue) {
          this.$store.commit('tabIndex', newValue)
        }
      }
    },
  }
</script>
