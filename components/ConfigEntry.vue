<template>
  <v-ons-list-item>
    <div class="center">
      <span class="list-item__title">{{ name }}</span>
      <span class="list-item__subtitle">{{ description }}</span>

      <v-ons-input v-if="['text', 'number', 'password'].includes(type)"
                   :type="type" style="width:100%"
                   v-model="$store.state.config[configName]"
                   v-on:change="delayedStoreConfig"
      ></v-ons-input>

      <v-ons-range v-if="type=='slider'"
                   v-model="$store.state.config[configName]"
                   :min="min" :max="max"
                   style="width: 100%;"
      ></v-ons-range>
    </div>

    <div class="right" v-if="type=='switch'">
      <v-ons-switch
        v-model="$store.state.config[configName]"
        v-on:change="delayedStoreConfig"
      ></v-ons-switch>
    </div>
  </v-ons-list-item>

</template>

<script type="text/javascript">
  export default {
    props: ['name', 'description', 'configName', 'type', 'min', 'max'],
    methods: {
      delayedStoreConfig() {
        let self = this;
        let config = JSON.parse(JSON.stringify(this.$store.state.config));
        setTimeout(() => {
          let newConfig = JSON.parse(JSON.stringify(self.$store.state.config));
          // always false
          if (config == newConfig) {
            console.log('config not modified for last 2 sec');
          }
          else {
            console.log('config modified');
          }
          self.$store.dispatch('storeConfig');
        }, 2000)
      }
    }
  }
</script>