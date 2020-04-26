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
  import isAdmin from 'is-admin'
  // import AppTable from './components/AppTable/AppTable'
  import { auth, request, connect } from 'league-connect'
  // const axios = require('axios')
  export default {
    name: 'mt-lol',
    components: {
      AppSystemBar,
      AppBar,
      AppNavDrawer
      // ,AppTable
    },
    async created () {
      const checkAdmin = await isAdmin()
      if (checkAdmin) {
        this.$store.commit('setStatus', '檢查權限完成')
        this.createProxyServer()
        await this.connectLOLLoop()
      } else {
        this.$store.commit('setStatus', '執行失敗！請使用系統管理員權限重新執行')
      }
    },
    methods: {
      sleep (time) {
        return new Promise((resolve) => {
          setTimeout(resolve, time)
        })
      },
      createProxyServer () {
        const host = '0.0.0.0'
        const port = 8783
        const corsProxy = require('cors-anywhere')
        corsProxy.createServer({
          originWhitelist: [], // Allow all origins
          requireHeader: ['origin', 'x-requested-with'],
          removeHeaders: ['cookie', 'cookie2']
        }).listen(port, host)
        console.log('proxy server finish')
      },
      async connectLOL () {
        this.$store.commit('setStatus', '偵測LOL中')
        try {
          const credentials = await auth()
          this.credentials = credentials
          this.$store.commit('setStatus', '已偵測到LOL，待配對成功即可顯示戰績')
        } catch (err) {
          this.playerHistory = []
          this.$store.commit('setStatus', '偵測不到LOL，請啟動LOL，5秒後重新偵測')
          this.credentials = null
        }
      },
      async connectLOLLoop () {
        this.gameFlow = ''
        while (true) {
          await this.connectLOL()
          if (this.credentials) {
            break
          }
          await this.sleep(5000)
        }
        await this.checkGameFlow()
      },
      async checkGameFlow () {
        try {
          const response = await request({
            url: '/lol-gameflow/v1/gameflow-phase',
            method: 'GET'
          }, this.credentials)
          this.gameFlow = await response.json()
        } catch (err) {
          console.log(err)
          this.$store.commit('setStatus', '已關閉遊戲，重新偵測中')
          this.connectLOLLoop()
        }
        const websocket = await connect(this.credentials)
        websocket.subscribe('/lol-gameflow/v1/gameflow-phase', (data, event) => {
          this.gameFlow = data
        })
        websocket.on('close', () => {
          this.$store.commit('setStatus', '已關閉遊戲，重新偵測中')
          this.connectLOLLoop()
        })
      },
      async clickAcceptBtn () {
        await request(
          {
            url: '/lol-matchmaking/v1/ready-check/accept',
            method: 'POST'
          }, this.credentials
        )
      }
    },
    data: () => ({
      playerHistory: [],
      gameFlow: '',
      credentials: null
      //
    }),
    computed: {
      isAutoAccept () {
        return this.$store.state.isAutoAccept
      }
    },
    watch: {
      gameFlow: function (gameflow) {
        // autoAccept
        if (gameflow === 'ReadyCheck') {
          if (this.$store.state.isAutoAccept) {
            this.clickAcceptBtn()
          }
        }
        console.log(gameflow)
      }
    }
  }
</script>

<style lang="scss">
  * {
    font-family: Roboto, '微軟正黑體';
  }
</style>
