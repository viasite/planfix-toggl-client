<template>
  <v-ons-list-item>
    <div class="center">
      <span class="list-item__title" v-html="name"></span>
      <span class="list-item__subtitle"
            v-html="text"
            v-bind:class="{
              'list-item__subtitle--success': success === true,
              'list-item__subtitle--error': success === false
            }"
      ></span>

      <!-- input -->
      <v-ons-input v-if="['text', 'number', 'password'].includes(type)"
                   :type="type" style="width:100%"
                   v-model="$store.state.config[configName]"
                   @input="delayedStoreConfig"
      ></v-ons-input>

      <!-- slider -->
      <v-ons-range v-if="type=='slider'"
                   v-model="$store.state.config[configName]"
                   :min="min" :max="max"
                   style="width: 100%;"
                   @input="delayedStoreConfig"
      ></v-ons-range>
    </div>

    <!-- switch -->
    <div class="right" v-if="type=='switch'">
      <v-ons-switch
        v-model="$store.state.config[configName]"
        @change="delayedStoreConfig"
      ></v-ons-switch>
    </div>

    <!-- check -->
    <div class="right" v-if="type=='check'">
      <v-ons-button modifier="outline" @click="checkAction" :disabled="isSending"
      >{{ buttonName }}
      </v-ons-button>
    </div>
  </v-ons-list-item>
</template>

<style type="text/css">
  .list-item__subtitle--success { color: #060; }
  .list-item__subtitle--error { color: #600; }
</style>

<script type="text/javascript">
  import isEqual from 'lodash/isEqual';

  export default {
    props: ['name', 'configName', 'type', 'min', 'max', 'action', 'buttonName', 'description'],
    data() {
      return {
        success: null,
        message: null,
        isSending: false,
      }
    },
    computed: {
      text() {
        return this.message || this.description
      },
    },
    methods: {
      async checkAction(event) {
        this.isSending = true;

        // store config
        await this.$store.dispatch('storeConfig');
        // reload config
        await this.$axios.post(this.$store.state.apiUrl + '/config/reload');

        // action
        let {ok, message} = await this.action(event);

        this.isSending = false;
        this.success = ok;
        this.message = message;
        console.log(message);
      },

      delayedStoreConfig() {
        let isequal = isEqual;
        let self = this;
        let config;
        // console.log('try to save...');
        setTimeout(() => {
          config = JSON.parse(JSON.stringify(this.$store.state.config))
        }, 100);
        setTimeout(() => {
          let newConfig = JSON.parse(JSON.stringify(self.$store.state.config));
          if (isequal(config, newConfig)) {
            // console.log('saving!');
            self.$store.dispatch('storeConfig');
          }
        }, 2000)
      },
    }
  }
</script>
