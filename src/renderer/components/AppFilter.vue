<template>
  <v-chip-group mandatory v-model="filter" class="mx-3" active-class="grey darken-4 primary">
    <v-chip filter>所有紀錄</v-chip>
    <v-chip filter>單雙積分</v-chip>
    <v-chip filter>彈性積分</v-chip>
    <v-chip filter>一般對戰</v-chip>
    <v-spacer></v-spacer>
    <v-btn :to="changeRoute.route">
      <v-icon small class="mr-1">mdi-location-enter</v-icon>
      {{ changeRoute.title }}
    </v-btn>
  </v-chip-group>
</template>

<script>
const Store = require('electron-store')
const electronStore = new Store()
export default {
  computed: {
    filter: {
      get () {
        return this.$store.state.filter
      },
      set (filter) {
        this.$store.commit('setFilter', filter)
        electronStore.set('filter', filter)
      }
    },
    changeRoute () {
      if (this.$route.name === 'Home') {
        return {title: '敵方戰績', route: '/enemy'}
      }
      return {title: '我方戰績', route: '/'}
    }
  }
}
</script>