<template>
  <div>
    <v-ons-splitter>
      <v-ons-splitter-side
        width="150px" collapse="" side="right"
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
        };

        // let analitics = await app.$axios.$get(apiUrl + '/planfix/analitics');
        // store.commit('analitics', analitics.Analitics);

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
      },

      async updateData() {
        this.entries = this.entries || { current: [], today: [], pending: [], last: [] };

        this.entries.current = [await this.$axios.$get(this.$store.state.apiUrl + '/toggl/entries/current')];
        this.entries.today = await this.$axios.$get(this.$store.state.apiUrl + '/toggl/entries', {params: {type: 'today'}});
        this.entries.pending = await this.$axios.$get(this.$store.state.apiUrl + '/toggl/entries', {params: {type: 'pending'}});
        this.entries.last = await this.$axios.$get(this.$store.state.apiUrl + '/toggl/entries', {params: {type: 'last'}});

        // check for empty current
        // console.log('this.entries.current: ', this.entries.current);
        if(this.entries.current[0].id == 0){
          this.entries.current = [];
        }

        // sort by date desc
        this.entries.today.sort((a, b) => b.id - a.id);
        this.entries.pending.sort((a, b) => b.id - a.id);
        this.entries.last.sort((a, b) => b.id - a.id);

        this.updateTabs();
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
          this.entries.today = await this.$axios.$get(this.$store.state.apiUrl + '/toggl/entries', {params: {type: 'today'}});
          this.entries.pending = await this.$axios.$get(this.$store.state.apiUrl + '/toggl/entries', {params: {type: 'pending'}});
          this.entries.last = await this.$axios.$get(this.$store.state.apiUrl + '/toggl/entries', {params: {type: 'last'}});
          // console.log('this.entries: ', this.entries);
          this.updateTabs();
        }, otherTimeout);
      }
    },
    created() {
      // console.log('created');

      this.pages = [
        {name: 'Записи', page: EntriesTabsPage},
        {name: 'Настройки', page: SettingsPage},
      ];

      const tabs = [
        {label: 'Сейчас', props: {entries: []}},
        {label: 'Сегодня', props: {entries: []}},
        {label: 'Ожидают', props: {entries: []}},
        {label: 'Неделя', props: {entries: []}},
      ];
      this.$store.commit('tabs', tabs);

      this.updateData();
      this.setUpdateIntervals(10000, 600000);
    },

    mounted() {
      // #settings
      if (this.$route.hash == '#settings') {
        this.$route.hash == '';
        this.currentPage = 'SettingsPage'
      }

      // #today
      if (this.$route.hash == '#today') {
        this.$route.hash == '';
        this.currentPage = 'EntriesTabsPage';
        setTimeout(() => {
          this.$store.commit('tabIndex', 1);
        }, 50);
      }
    },

    onIdle() {
      // console.log('idle');
      this.setUpdateIntervals(300000, 1800000);
    },

    async onActive() {
      // console.log('active');

      this.updateData();
      this.setUpdateIntervals(10000, 600000);
    },

    head() {
      if (!this.entries.current) return 'planfix-toggl';
      return { title: `${this.entries.current[0].description} - planfix-toggl` };
    }
  }
</script>
