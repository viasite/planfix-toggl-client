import Vue from 'vue';
import IdleVue from 'idle-vue';

const eventsHub = new Vue();

const options = {
  eventEmitter: eventsHub,
  idleTime: 60000
};

Vue.use(IdleVue, options);
