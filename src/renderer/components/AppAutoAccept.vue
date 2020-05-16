<template>
  <v-switch class="mx-auto mt-4" label="自動接受配對" v-model="isAutoAccept"></v-switch>
</template>

<script>
const Store = require('electron-store')
const electronStore = new Store()
export default {
  computed: {
    isAutoAccept: {
      get () {
        return this.$store.state.isAutoAccept
      },
      set (isAutoAccept) {
        this.$store.commit('setAutoAccept', isAutoAccept)
        electronStore.set('isAutoAccept', isAutoAccept)
      }
    }
  }
}
</script>