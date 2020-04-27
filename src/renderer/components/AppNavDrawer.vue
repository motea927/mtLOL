<template>
  <v-navigation-drawer disable-resize-watcher temporary fixed v-model="isDrawerShow">
    <v-list>
      <v-list-item v-for="link in links" :key="link.text" router :to="link.route">
        <v-list-item-icon>
          <v-icon>{{ link.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ link.text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data () {
    return {
      links: [
        { icon: 'mdi-home', text: '首頁', route: '/' },
        { icon: 'mdi-information', text: '關於', route: '/about' }
      ]
    }
  },
  computed: {
    isDrawerShow: {
      get () {
        return this.$store.state.isDrawerShow
      },
      set (val) {
        this.$store.commit('setDrawerShow', val)
      }
    }
  }
}
</script>
