<template>
  <v-system-bar window class="systembar" color="orange">
    <v-icon small color="grey darken-3">mdi-coffee-outline</v-icon>
    <h1 class="subtitle-1 grey--text text--darken-3">mtLOL 1.4.5</h1>
    <v-spacer></v-spacer>
    <v-btn icon small @click="controlWindow('min')" class="systembar__btn">
      <v-icon x-small color="grey darken-3">mdi-window-minimize</v-icon>
    </v-btn>
    <v-btn icon small @click="controlWindow('max')" class="systembar__btn">
      <v-icon x-small v-if="isWindowMaximized" color="grey darken-3">mdi-window-restore</v-icon>
      <v-icon x-small v-else color="grey darken-3">mdi-window-maximize</v-icon>
    </v-btn>
    <v-btn icon small @click="controlWindow('close')" class="systembar__btn">
      <v-icon x-small color="grey darken-3">mdi-close</v-icon>
    </v-btn>
  </v-system-bar>
</template>

<script>
const remote = require('electron').remote

export default {
  name: 'AppSystemBar',
  data () {
    return {
      isWindowMaximized: false
    }
  },
  methods: {
    controlWindow (command) {
      const window = remote.getCurrentWindow()
      switch (command) {
        case 'min':
          window.minimize()
          break
        case 'max':
          if (this.isWindowMaximized) {
            window.unmaximize()
            this.isWindowMaximized = false
          } else {
            window.maximize()
            this.isWindowMaximized = true
          }
          break
        case 'close':
          window.close()
          break
      }
    }
  }
}
</script>

<style lang="scss">
  .systembar {
    -webkit-user-select: none;
    -webkit-app-region: drag;
    &__btn {
      -webkit-app-region: no-drag;
    }
  }
</style>
