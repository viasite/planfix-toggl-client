<template>
  <v-ons-toolbar>
    <div class="center">{{ title }}</div>
    <div class="right">
      <v-ons-toolbar-button @click="action">
        Меню
        <!--<v-ons-icon icon="ion-navicon, material: md-menu"></v-ons-icon>-->
      </v-ons-toolbar-button>
    </div>
  </v-ons-toolbar>
</template>

<script>
  export default {
    props: ['title', 'action'],
  }
</script>