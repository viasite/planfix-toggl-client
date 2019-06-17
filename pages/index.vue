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
          entries: {
            current: [await app.$axios.$get(apiUrl + '/toggl/entries/current')],
            today: await app.$axios.$get(apiUrl + '/toggl/entries', {params: {type: 'today'}}),
            pending: await app.$axios.$get(apiUrl + '/toggl/entries', {params: {type: 'pending'}}),
            last: await app.$axios.$get(apiUrl + '/toggl/entries', {params: {type: 'last'}}),
          }
        };

        if(asyncData.entries.current[0].id == 0){
          asyncData.entries.current = [];
        }

        // sort by date desc
        asyncData.entries.today.sort((a, b) => b.id - a.id);
        asyncData.entries.pending.sort((a, b) => b.id - a.id);
        asyncData.entries.last.sort((a, b) => b.id - a.id);

        asyncData.tabs = [
          {label: 'Сейчас', props: {entries: asyncData.entries.current}},
          {label: 'Сегодня', props: {entries: asyncData.entries.today}},
          {label: 'Ожидают', props: {entries: asyncData.entries.pending}},
          {label: 'Неделя', props: {entries: asyncData.entries.last}},
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
        openSide: false,
        entries: {}
      }
    },
    methods: {
      updateTabs() {

        const tabs = [
          {label: 'Сейчас', props: {entries: this.entries.current}},
          {label: 'Сегодня', props: {entries: this.entries.today}},
          {label: 'Ожидают', props: {entries: this.entries.pending}},
          {label: 'Неделя', props: {entries: this.entries.last}},
        ];
        this.$store.commit('tabs', tabs);

        this.$store.commit('title', `${this.entries.current[0].description} - planfix-toggl`);
      },

      setUpdateIntervals(currentTimeout, otherTimeout) {
        clearInterval(this.currentInterval);
        clearInterval(this.otherInterval);

        this.currentInterval = setInterval(async () => {
          // console.log('current data');
          // console.log(new Date());
          this.entries.current = [await this.$axios.$get(this.$store.state.apiUrl + '/toggl/entries/current')];
          this.updateTabs();
        }, currentTimeout);

        this.otherInterval = setInterval(async () => {
          // console.log('other data');
          // console.log(new Date());
          this.entries.today = await app.$axios.$get(apiUrl + '/toggl/entries', {params: {type: 'today'}});
          this.entries.pending = await app.$axios.$get(apiUrl + '/toggl/entries', {params: {type: 'pending'}});
          this.entries.last = await app.$axios.$get(apiUrl + '/toggl/entries', {params: {type: 'last'}});
          this.updateTabs();
        }, otherTimeout);
      }
    },
    created() {
      // console.log('created');
      this.setUpdateIntervals(10000, 600000);
    },

    onIdle() {
      // console.log('idle');
      this.setUpdateIntervals(300000, 1800000);
    },
    onActive() {
      // console.log('active');
      this.setUpdateIntervals(10000, 600000);
    },

    head() {
      return { title: this.$store.state.title };
    }
  }
</script>
