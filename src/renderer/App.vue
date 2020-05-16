<template>
  <v-app>
    <v-content>
      <div id="app" :class="isDarkTheme ? '' : 'app--light'">
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
  const axios = require('axios')
  export default {
    name: 'mt-lol',
    components: {
      AppSystemBar,
      AppBar,
      AppNavDrawer
    },
    async created () {
      const checkAdmin = await isAdmin()
      if (checkAdmin) {
        this.initElectronStore()
        this.$store.commit('setStatus', '檢查權限完成')
        this.createProxyServer()
        await this.connectLOLLoop()
      } else {
        this.$store.commit('setStatus', '執行失敗！請使用系統管理員權限重新執行')
      }
    },
    methods: {
      initElectronStore () {
        const Store = require('electron-store')
        const electronStore = new Store()
        const storeDefaultVal = [
          {
            name: 'isDarkTheme',
            defaultVal: true,
            commitName: 'setDarkTheme'
          },
          {
            name: 'isAutoAccept',
            defaultVal: false,
            commitName: 'setAutoAccept'
          },
          {
            name: 'filter',
            defaultVal: 0,
            commitName: 'setFilter'
          }
        ]
        storeDefaultVal.forEach(el => {
          if (electronStore.has(el.name)) {
            this.$store.commit(el.commitName, electronStore.get(el.name))
            if (el.name === 'isDarkTheme') this.$vuetify.theme.dark = electronStore.get(el.name)
          } else {
            electronStore.set(el.name, el.defaultVal)
            this.$store.commit(el.commitName, electronStore.get(el.name))
          }
        })
        electronStore.has('isDarkTheme')
        // electronStore.has('isAutoAccept')
        // electronStore.has('filter')
      },
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
        this.proxy = `http://localhost:${port}/`
      },
      async connectLOL () {
        this.$store.commit('setStatus', '偵測LOL中')
        try {
          const credentials = await auth()
          this.credentials = credentials
          this.$store.commit('setStatus', '已偵測到LOL，待配對成功即可顯示戰績')
        } catch (err) {
          this.$store.commit('setMyTeamPlayHistorys', [])
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
      },
      async getTeamList () {
        this.$store.commit('setStatus', '查詢戰績中')
        const response = await request({
          url: '/lol-champ-select/v1/session',
          method: 'GET'
        }, this.credentials)
        const list = await response.json()
        return list.myTeam
      },
      async getAccountId (teamList) {
        const accountIdList = []
        await Promise.all(teamList.map(async (el, index) => {
          const response = await request({
            url: `/lol-summoner/v1/summoners/${el.summonerId}`,
            method: 'GET'
          }, this.credentials)
          const json = await response.json()
          const rankData = await this.getRankData(json.puuid)
          const newRankData = await this.detailRankData(rankData)
          accountIdList[index] = {
            accountId: json.accountId,
            displayName: json.displayName,
            puuid: json.puuid,
            rankData: newRankData
          }
        }))
        return accountIdList
      },
      async getRankData (puuid) {
        const response = await request(
          {
            url: `/lol-ranked/v1/ranked-stats/${puuid}`,
            method: 'GET'
          },
          this.credentials
        )
        return response.json()
      },
      async detailRankData (rankData) {
        const newRankData = {}
        rankData.queues.forEach((el, index) => {
          if (el.tier === 'NONE') {
            return newRankData
          }
          newRankData[el.queueType] = `${this.tierTable[el.tier]} ${el.division}  ${el.leaguePoints}`
        })
        return newRankData
      },
      async getPlayerHistory (accountIdList) {
        const playerHistoryTemp = []
        await Promise.all(accountIdList.map(async (el, index) => {
          const playerHistory = await axios.get(`${this.proxy}https://acs-garena.leagueoflegends.com/v1/stats/player_history/TW/${el.accountId}?begIndex=0&endIndex=20`, {
            headers: {
              'X-Requested-With': 'XMLHttpRequest'
            }
          })
          playerHistoryTemp[index] = {
            displayName: el.displayName,
            rankData: el.rankData,
            games: playerHistory.data.games.games
          }
        }))
        return playerHistoryTemp
      },
      async getAllGamesTeamMateList (playerHistory) {
        // https://acs-garena.leagueoflegends.com/v1/stats/game/TW/1793285941/
        // each player
        let playerHistoryTemp = [...playerHistory]
        await Promise.all(playerHistoryTemp.map(async (eachPlayer, index) => {
          let allGamesTeamMateList = []
          // player each games
          await Promise.all(eachPlayer.games.slice(-15).map(async game => {
            const teamId = game.participants[0].teamId
            const gameHistory = await axios.get(`${this.proxy}https://acs-garena.leagueoflegends.com/v1/stats/game/TW/${game.gameId}`, {
              headers: {
                'X-Requested-With': 'XMLHttpRequest'
              }
            })
            let eachGamesTeammateIdList
            if (teamId === 100) {
              eachGamesTeammateIdList = gameHistory.data.participantIdentities.slice(0, 5)
            } else {
              eachGamesTeammateIdList = gameHistory.data.participantIdentities.slice(5, 10)
            }
            // each games summonerName
            const eachGamesSummonerName = eachGamesTeammateIdList.map(teammate => {
              if (teammate.player.summonerName !== eachPlayer.displayName) return teammate.player.summonerName
            })
            allGamesTeamMateList.push(...eachGamesSummonerName)
          }))
          playerHistoryTemp[index].allGamesTeamMateList = allGamesTeamMateList
        }))
        return playerHistoryTemp
      },
      async checkArrangeTeam (playerHistory) {
        let playerHistoryTemp = [...playerHistory]
        // use eachPlayer find arrangeTeamList
        playerHistoryTemp.forEach((currentPlayer, index) => {
          const currentId = currentPlayer.displayName
          const arrangeTeamList = []
          // compare allGamesTeamMateList === anotherPlayer
          playerHistoryTemp.forEach(anotherPlayer => {
            if (anotherPlayer.displayName !== currentId) {
              const teammateCounts = currentPlayer.allGamesTeamMateList.filter(name => {
                return name === anotherPlayer.displayName
              })
              if (teammateCounts.length > 0) {
                arrangeTeamList.push({id: anotherPlayer.displayName, counts: teammateCounts.length})
              }
            }
          })
          // 找完
          playerHistoryTemp[index].arrangeTeamList = arrangeTeamList
        })
        return playerHistoryTemp
      },
      async getGame () {
        const response = await request({
          url: `/lol-gameflow/v1/session`,
          method: 'GET'
        }, this.credentials)
        return response.json()
      },
      async getChat () {
        const response = await request({
          url: '/lol-chat/v1/me',
          method: 'GET'
        }, this.credentials)
        return response.json()
      },
      findEnemyTeamByMyName (game, myName) {
        const myNameIndex = game.teamOne.findIndex(el => el.summonerName === myName)
        if (myNameIndex !== -1) return game.teamTwo
        return game.teamOne
      }
    },
    data: () => ({
      gameFlow: '',
      credentials: null,
      proxy: '',
      tierTable: {
        IRON: '鐵牌',
        BRONZE: '銅牌',
        SILVER: '銀牌',
        GOLD: '金牌',
        PLATINUM: '白金',
        DIAMOND: '鑽石',
        MASTER: '大師',
        CHALLENGER: '菁英',
        NONE: '無牌位'
      }
    }),
    computed: {
      isAutoAccept () {
        return this.$store.state.isAutoAccept
      },
      isDarkTheme () {
        return this.$store.state.isDarkTheme
      }
    },
    watch: {
      gameFlow: async function (gameflow) {
        /*
         * gameflow_list = ['None', 'Lobby', 'Matchmaking',
                            'ReadyCheck', 'ChampSelect', 'GameStart',
                            'InProgress', 'Reconnect', 'PreEndOfGame', 'EndOfGame'
           ]
        */
        // autoAccept
        if (gameflow === 'ReadyCheck') {
          if (this.$store.state.isAutoAccept) {
            this.clickAcceptBtn()
          }
        } else if (gameflow === 'ChampSelect') {
          const teamList = await this.getTeamList()
          const accountIdList = await this.getAccountId(teamList)
          this.$store.commit('setMyTeamPlayHistorys', [])
          const playerHistory = await this.getPlayerHistory(accountIdList)
          this.$store.commit('setStatus', '戰積查詢完成，過濾雙排資訊中')
          const playerHistoryWithTeamMateList = await this.getAllGamesTeamMateList(playerHistory)
          const finalPlayerHistory = await this.checkArrangeTeam(playerHistoryWithTeamMateList)
          this.$store.commit('setStatus', '戰積查詢完成')
          this.$store.commit('setMyTeamPlayHistorys', finalPlayerHistory)
        } else if (gameflow === 'InProgress') {
          const chat = await this.getChat()
          const game = await this.getGame()
          const enemyTeam = this.findEnemyTeamByMyName(game.gameData, chat.name)
          const accountIdList = await this.getAccountId(enemyTeam)
          this.$store.commit('setEnemyPlayHistorys', [])
          const playerHistory = await this.getPlayerHistory(accountIdList)
          const playerHistoryWithTeamMateList = await this.getAllGamesTeamMateList(playerHistory)
          const finalPlayerHistory = await this.checkArrangeTeam(playerHistoryWithTeamMateList)
          this.$store.commit('setEnemyPlayHistorys', finalPlayerHistory)
        }
      }
    }
  }
</script>

<style lang="scss">
  * {
    font-family: 'Microsoft JhengHei';
  }
  html, body, #app {
    overflow: hidden !important;
  }
  .app--light {
    background-color: #EEEEEE;
  }
</style>
