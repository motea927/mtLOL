<template>
  <div>
    <v-app-bar dense>
      <v-row align="center">
        <v-app-bar-nav-icon @click="setDrawerShow"></v-app-bar-nav-icon>
        <h2 class="font-weight-medium">{{ title }}</h2>
        <v-spacer></v-spacer>
        <v-icon class="mr-3">mdi-lightbulb-on</v-icon>
        <v-switch v-model="darkTheme" class="mt-6 mr-1"></v-switch>
        <v-icon class="mr-3">mdi-moon-waning-crescent</v-icon>
      </v-row>
    </v-app-bar>
  </div>
</template>

<script>
const Store = require('electron-store')
const electronStore = new Store()
export default {
  name: 'AppBar',
  computed: {
    title () {
      const title = {
        Home: '首頁-我方戰績',
        About: '關於',
        Enemy: '敵方戰績'
      }
      return title[this.$route.name]
    },
    darkTheme: {
      get () {
        return this.$store.state.isDarkTheme
      },
      set (val) {
        this.$vuetify.theme.dark = val
        this.$store.commit('setDarkTheme', val)
        electronStore.set('isDarkTheme', val)
      }
    }
  },
  methods: {
    setDrawerShow () {
      this.$store.commit('setDrawerShow', true)
    }
  }
}
</script>
