<template>
  <div>
    <PageToolbar title="planfix-toggl" :action="() => openSide = !openSide"></PageToolbar>
    <v-ons-splitter>
      <v-ons-splitter-side
        swipeable width="150px" collapse="" side="right"
        :open.sync="openSide"
      >
        <v-ons-page>
          <v-ons-list>
            <v-ons-list-item v-for="page in pages" v-bind:key="page.name"
                             tappable
                             @click="currentPage = page.page; openSide = false"
            >
              <div class="center">{{ page.name }}</div>
            </v-ons-list-item>
          </v-ons-list>
        </v-ons-page>
      </v-ons-splitter-side>

      <v-ons-splitter-content>
        <component :is="currentPage"></component>
      </v-ons-splitter-content>
    </v-ons-splitter>
  </div>
</template>

<script>
  import PageToolbar from '~/components/PageToolbar'
  import EntriesTabsPage from '~/pages/EntriesTabsPage'

  export default {
    components: {
      EntriesTabsPage,
      PageToolbar,
    },
    computed: {},
    async fetch ({ store, params }) {
      // store config in state
      await store.dispatch('fetchConfig');
    },
    async asyncData({app, store, params, query, error}) {
      let asyncData;
      let apiUrl = store.state.apiUrl;
      try {
        asyncData = {
          entries_today: await app.$axios.$get(apiUrl + '/toggl/entries', {params: {type: 'today'}}),
          entries_pending: await app.$axios.$get(apiUrl + '/toggl/entries', {params: {type: 'pending'}}),
          entries_last: await app.$axios.$get(apiUrl + '/toggl/entries', {params: {type: 'last'}}),
        };

        asyncData.tabs = [
          {label: 'Сегодня', props: {entries: asyncData.entries_today}},
          {label: 'Ожидают', props: {entries: asyncData.entries_pending}},
          {label: 'Последние', props: {entries: asyncData.entries_last}},
        ];

        asyncData.pages = [
          {name: '', page: ''},
          {name: 'Записи', page: EntriesTabsPage},
        ];

        console.log('commit tabs');
        store.commit('tabs', asyncData.tabs);
      }
      catch (e) {
        console.log('error while get data');
        throw Error(e)
      }
      return asyncData;
    },
    data() {
      return {
        currentPage: 'EntriesTabsPage',
        openSide: false
      }
    },
  }
</script>
