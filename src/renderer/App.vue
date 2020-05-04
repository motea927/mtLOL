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
        this.proxy = `http://localhost:${port}/`
        // console.log('proxy server finish')
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
          // console.log(err)
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
        /*
        {
          summonerId: ,
          assignedPosition
        }
        */
        this.teamList = list.myTeam
        // console.log(`teamList`)
        // console.log(this.teamList)
      },
      async getAccountId () {
        const accountIdTemp = []
        this.accountIdList = []
        await Promise.all(this.teamList.map(async (el, index) => {
          const response = await request({
            url: `/lol-summoner/v1/summoners/${el.summonerId}`,
            method: 'GET'
          }, this.credentials)
          const json = await response.json()
          // console.log(json)
          const rankData = await this.getRankData(json.puuid)
          const newRankData = await this.detailRankData(rankData)
          // console.log(newRankData)
          accountIdTemp[index] = {
            accountId: json.accountId,
            displayName: json.displayName,
            puuid: json.puuid,
            rankData: newRankData
          }
          // console.log(this.accountIdList)
        }))
        this.accountIdList = accountIdTemp
        // console.log(`accountIdList`)
        // console.log(this.accountIdList)
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
      async getPlayerHistory () {
        const playerHistoryTemp = []
        await Promise.all(this.accountIdList.map(async (el, index) => {
          // test
          // /lol-acs/v1/matchlists/{accountId}
          // //lol-match-history/v1/recently-played-summoners//gg
          const response = await request({
            url: `/lol-clash/v1/historyandwinners`,
            method: 'GET'
          }, this.credentials)
          console.log(await response.json())
          // test
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
        this.playerHistory = playerHistoryTemp
        // console.log(playerHistoryTemp)
      },
      async getAllGamesTeamMateList () {
        this.$store.commit('setStatus', '戰積查詢完成，過濾雙排資訊中')
        // https://acs-garena.leagueoflegends.com/v1/stats/game/TW/1793285941/
        // each player
        let playerHistoryTemp = [...this.playerHistory]
        await Promise.all(playerHistoryTemp.map(async (eachPlayer, index) => {
          let allGamesTeamMateList = []
          // player each games
          await Promise.all(eachPlayer.games.map(async game => {
            const teamId = game.participants[0].teamId
            const gameHistory = await axios.get(`${this.proxy}https://acs-garena.leagueoflegends.com/v1/stats/game/TW/${game.gameId}`, {
              headers: {
                'X-Requested-With': 'XMLHttpRequest'
              }
            })
            // each games teammate ID
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
      },
      async checkArrangeTeam () {
        let playerHistoryTemp = [...this.playerHistory]
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
        // console.log(playerHistoryTemp)
        this.playerHistory = playerHistoryTemp
        this.$store.commit('setStatus', '戰積查詢完成')
        this.$store.commit('setMyTeamPlayHistorys', this.playerHistory)
      }
    },
    data: () => ({
      gameFlow: '',
      credentials: null,
      teamList: [],
      accountIdList: [],
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
      },
      playerHistory: []
    }),
    computed: {
      isAutoAccept () {
        return this.$store.state.isAutoAccept
      }
    },
    watch: {
      gameFlow: async function (gameflow) {
        // autoAccept
        if (gameflow === 'ReadyCheck') {
          if (this.$store.state.isAutoAccept) {
            this.clickAcceptBtn()
          }
        } else if (gameflow === 'ChampSelect') {
          await this.getTeamList()
          await this.getAccountId()
          await this.getPlayerHistory()
          await this.getAllGamesTeamMateList()
          await this.checkArrangeTeam()
          this.$store.commit('setStatus', '戰積查詢完成')
        }
      }
    }
  }
</script>

<style lang="scss">
  * {
    font-family: Roboto, '微軟正黑體';
  }
  html, body, #app {
    overflow: hidden !important;
  }
</style>
