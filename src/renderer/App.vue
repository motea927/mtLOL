<template>
  <v-app>
    <v-content>
      <div id="app">
        <app-system-bar></app-system-bar>
        <app-bar></app-bar>
        <app-nav-drawer></app-nav-drawer>
        <router-view></router-view>
      </div>
    </v-content>
  </v-app>
</template>

<script>
  import AppSystemBar from './components/AppSystemBar'
  import AppBar from './components/AppBar'
  import AppNavDrawer from './components/AppNavDrawer'
  // import AppTable from './components/AppTable/AppTable'
  // import { auth, request, connect } from 'league-connect'
  // const axios = require('axios')
  export default {
    name: 'mt-lol',
    components: {
      AppSystemBar,
      AppBar,
      AppNavDrawer
      // ,AppTable
    }
  }
</script>
