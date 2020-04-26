<template>
  <div>
    <v-app-bar dense>
      <v-app-bar-nav-icon @click="setDrawerShow"></v-app-bar-nav-icon>
      <h2>{{ title }}</h2>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  name: 'AppBar',
  created () {
    console.log(this.$route.name)
  },
  computed: {
    title () {
      if (this.$route.name === 'Home') {
        return '首頁'
      } else {
        return '關於'
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
