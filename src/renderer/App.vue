<template>
  <div id="app">
    <app-title-bar></app-title-bar>
    <div class="container">
      <app-table :playerHistory="playerHistory" :championList="championList"></app-table>
      <div class="option">
          <input type="checkbox" id="autoAccept" v-model="isAutoAccept">
          <label for="autoAccept">
            <span :class="isAutoAccept ? 'icon--checked' : 'icon--checkbox'"></span>
            <p class="option__text">自動接受配對</p>
          </label>
      </div>
      <div class="status">
        <p class="text--white">{{ status }}</p>
      </div>
    </div>
      <!--button-- @click="openDev">偵錯</!--button-->
  </div>
</template>

<script>
  import AppTitleBar from './components/AppTitleBar/AppTitleBar'
  import AppTable from './components/AppTable/AppTable'
  import { auth, request } from 'league-connect'
  const axios = require('axios')
  export default {
    name: 'mt-lol',
    components: {
      AppTitleBar,
      AppTable
    },
    async mounted () {
      const isAdmin = require('is-admin')
      if (await isAdmin()) {
        this.status = '檢查權限完成'
        const champion = await axios.get('static/champion.json')
        this.championList = await champion.data.data
        await this.connectLOLLoop()
      } else {
        this.status = '執行失敗!請使用系統管理員權限重新執行'
      }
    },
    methods: {
      openDev () {
        const remote = require('electron').remote
        remote.getCurrentWebContents().openDevTools({mode: 'detach'})
      },
      sleep (time) {
        return new Promise((resolve) => {
          setTimeout(resolve, time)
        })
      },
      async connectLOLLoop () {
        while (true) {
          await this.connectLOL()
          if (this.credentials) {
            break
          }
          await this.sleep(5000)
        }
        await this.checkGameFlow()
      },
      async connectLOL () {
        this.status = '偵測LOL中'
        try {
          const credentials = await auth()
          this.credentials = credentials
          this.status = '已偵測到LOL，待配對成功即可顯示戰績'
        } catch (err) {
          this.playerHistory = []
          this.status = '偵測不到LOL，請啟動LOL，5秒後重新偵測'
          this.credentials = null
        }
      },
      async checkGameFlow () {
        try {
          const response = await request({
            url: '/lol-gameflow/v1/gameflow-phase',
            method: 'GET'
          }, this.credentials)
          this.gameFlow = await response.json()
          await this.sleep(500)
          this.checkGameFlow()
        } catch (err) {
          this.status = '已關閉遊戲，重新偵測中'
          this.connectLOLLoop()
        }
      },
      async getTeamList () {
        this.status = '查詢戰績中...'
        const response = await request({
          url: '/lol-champ-select/v1/session',
          method: 'GET'
        }, this.credentials)
        // ChampSelect階段
        const list = await response.json()
        /*
        {
          summonerId: ,
          assignedPosition
        }
        */
        this.teamList = list.myTeam
        // console.log(this.teamList)
        this.getAccountId()
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
      async getAccountId () {
        this.accountIdList = []
        await Promise.all(this.teamList.map(async el => {
          const response = await request({
            url: `/lol-summoner/v1/summoners/${el.summonerId}`,
            // url: `/lol-ranked/v1/ranked-stats/0e1e1b6c-74a1-5c6e-8e8b-d25aeb59e770`,
            method: 'GET'
          }, this.credentials)
          const json = await response.json()
          // console.log(json)
          const rankData = await this.getRankData(json.puuid)
          await this.accountIdList.push(
            {
              accountId: json.accountId,
              displayName: json.displayName,
              puuid: json.puuid,
              rankData
            }
          )
          // console.log(this.accountIdList)
        }))
        this.getPlayerHistory()
      },
      async getPlayerHistory () {
        this.playerHistory = []
        await Promise.all(this.accountIdList.map(async el => {
          const playerHistory = await axios.get(`${this.proxy}https://acs-garena.leagueoflegends.com/v1/stats/player_history/TW/${el.accountId}?begIndex=0&endIndex=4`, {
            headers: {
              'X-Requested-With': 'XMLHttpRequest'
            }
          })
          this.playerHistory.push(
            {
              displayName: el.displayName,
              rankData: el.rankData.queues[0],
              games: playerHistory.data.games.games
            }
          )
        }))
        // console.log(this.playerHistory)
        this.status = '查詢戰績完成'
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
    watch: {
      gameFlow: function (val) {
        if (val === 'ChampSelect') {
          this.getTeamList()
        } else if (val === 'ReadyCheck') {
          console.log('等待確認')
          if (this.isAutoAccept) {
            console.log('呼叫')
            this.clickAcceptBtn()
          }
        }
      }
    },
    data () {
      return {
        playerHistory: [],
        status: '',
        credentials: null,
        gameFlow: '',
        teamList: [],
        accountIdList: [],
        proxy: 'https://cors-anywhere.herokuapp.com/',
        championList: null,
        isAutoAccept: false
      }
    }
  }
</script>

<style lang="scss">
  /* CSS */
  /* 
   * 1rem = 100px
   * .1rem = 10px
  */
  html {
    font-size: 625%;
  }
  html, body, #app{
    width: 100%;
    height: 100%;
    font-family: "Helvetica", "Arial","LiHei Pro","黑體-繁","微軟正黑體", sans-serif;
    border-radius: .05rem;
    overflow: hidden;
  }
  .container {
    background-color: #2b2b2b;
    height: calc(100% - .3rem);
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: scroll;
  }
  .status {
    margin: .5rem;
  }
  .text--white {
    font-size: .16rem;
    color: #FFF;
  }
  .option {
    margin: .5rem;
    font-size: .16rem;
    color: #f4f4f4;
    & input {
      display: none;
    }
    & label {
      cursor: pointer;
    }
    &__text {
      display: inline-block;
    }
  }
  .icon--checkbox {
    padding: 0;
    display: inline-block;
    margin: 0 auto;
    font-size: .2rem;
    color: #f4f4f4;
    &::before {
      content: "\2610";
    }
  }
  .icon--checked {
    padding: 0;
    display: inline-block;
    margin: 0 auto;
    font-size: .2rem;
    color: #f4f4f4;
    &::before {
      content: "\2611";
    }
  }
  
</style>
