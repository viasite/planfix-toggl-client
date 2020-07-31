<template>
  <v-ons-card class="entry">
    <span class="entry__group-count">{{ entry.planfix.group_count }}</span>
    <span class="entry__name">{{ entry.description | rejoin(', ') }}</span>
    <span class="entry__duration">{{ duration }}</span>
    <div class="entry__second">
      <span class="entry__project" :style="'color:' + entry.project_hex_color">{{ entry.project }}</span>
      <a v-if="entry.planfix.task_id" class="entry__link"
         :href="taskUrl"
         target="_blank">
        #{{ entry.planfix.task_id }}
      </a>
    </div>
  </v-ons-card>
</template>

<style>
.entry__name {
}
.entry__duration {
  margin-left: 1rem;
  float: right;
}
.entry__group-count {
  color: #999;
  display: inline-block;
  width: 2rem;
}
.entry__second {
  margin-left: 2.3rem;
}
.entry__project {
}
.entry__link {
  color: #4573b1;
  text-decoration: none;
  font-size: 0.9rem;
  margin-left: 1rem;
}
</style>

<script type="text/javascript">
export default {
  props: {
    entry: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      interval: false,
      currentTickTime: 0
    };
  },

  filters: {
    round: value => Math.round(value),
    replace: (value, search, replace) => value.replace(search, replace),
    rejoin: (value, delim) => value.split('\n').join(delim),
    brize: (value, search, replace) => value.replace('\n', '<br>')
  },

  computed: {
    duration() {
      // normal entry
      // console.log('entry: ', this.entry);
      if (this.entry.dur > 0) return Math.round(this.entry.dur / 1000 / 60);

      if (this.entry.dur === 0) return 0;

      // running entry
      const seconds = Math.round(this.entry.dur + this.currentTickTime / 1000);
      const t = {
        h: Math.floor(seconds / 3600),
        m: Math.floor((seconds % 3600) / 60),
        s: seconds % 60
      };
      t.m = t.m.toString().padStart(2, '0');
      t.s = t.s.toString().padStart(2, '0');
      return `${t.h}:${t.m}:${t.s}`;
    },

    taskUrl() {
      return 'https://' + this.$store.state.config.PlanfixAccount
      + '.planfix.ru/task/' + this.entry.planfix.task_id;
    }
  },

  methods: {
    startTick() {
      this.currentTickTime = new Date().getTime();
      this.interval = setInterval(() => {
        this.currentTickTime = new Date().getTime();
      }, 1000);
    },

    stopTick() {
      clearInterval(this.interval);
    }
  },

  created() {
    // current running entry
    if (this.entry.dur < 1) {
      this.startTick();

      // https://localhost:8097/#current-go
      if (this.$route.hash == '#current-go' && this.entry.planfix.task_id > 0) {
        this.$route.hash == '';
        window.location.href = this.taskUrl
      }
    }
  },

  beforeDestroy() {
    this.stopTick();
  }
};
</script>
