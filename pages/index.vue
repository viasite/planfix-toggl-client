<template>
  <div>
    <v-ons-splitter>
      <v-ons-splitter-side
        swipeable width="150px" collapse="" side="right"
        :open.sync="$store.state.openSide"
      >
        <v-ons-page>
          <v-ons-list>
            <v-ons-list-item v-for="page in pages" v-bind:key="page.name"
                             tappable
                             @click="currentPage = page.page; $store.state.openSide = false; $store.state.title = page.name"
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
  import EntriesTabsPage from '~/components/EntriesTabsPage'
  import SettingsPage from '~/components/SettingsPage'

  export default {
    components: {
      EntriesTabsPage,
      SettingsPage,
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
          entries_current: [await app.$axios.$get(apiUrl + '/toggl/entries/current')],
          entries_today: await app.$axios.$get(apiUrl + '/toggl/entries', {params: {type: 'today'}}),
          entries_pending: await app.$axios.$get(apiUrl + '/toggl/entries', {params: {type: 'pending'}}),
          entries_last: await app.$axios.$get(apiUrl + '/toggl/entries', {params: {type: 'last'}}),
        };

        if(asyncData.entries_current[0].id == 0){
          asyncData.entries_current = [];
        }

        // sort by date desc
        asyncData.entries_today.sort((a, b) => b.id - a.id);
        asyncData.entries_pending.sort((a, b) => b.id - a.id);
        asyncData.entries_last.sort((a, b) => b.id - a.id);

        asyncData.tabs = [
          {label: 'Сейчас', props: {entries: asyncData.entries_current}},
          {label: 'Сегодня', props: {entries: asyncData.entries_today}},
          {label: 'Ожидают', props: {entries: asyncData.entries_pending}},
          {label: 'Неделя', props: {entries: asyncData.entries_last}},
        ];

        // let analitics = await app.$axios.$get(apiUrl + '/planfix/analitics');
        // store.commit('analitics', analitics.Analitics);

        asyncData.pages = [
          {name: 'Записи', page: EntriesTabsPage},
          {name: 'Настройки', page: SettingsPage},
        ];

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
    created() {
      setInterval(() => {
        window.location.reload(true);
      }, 300000);
    }
  }
</script>
