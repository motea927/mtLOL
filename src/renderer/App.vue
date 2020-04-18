<template>
  <div id="app" class="md-layout md-alignment-center-center">
    <app-title-bar></app-title-bar>
    <div class="container">
      <app-table></app-table>
      <div class="status">
        <p class="text--white">status: {{ status }}</p>
        <p class="text--white">gameflow: {{ gameFlow }}</p>
      </div>
      
    </div>
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
        while (true) {
          await this.connectLOL()
          if (this.credentials) {
            break
          }
          await this.sleep(5000)
        }
        await this.checkGameFlow()
      } else {
        this.status = '執行失敗!請使用系統管理員權限重新執行'
      }
    },
    methods: {
      sleep (time) {
        return new Promise((resolve) => {
          setTimeout(resolve, time)
        })
      },
      async connectLOL () {
        this.status = '偵測LOL中'
        try {
          const credentials = await auth()
          this.credentials = credentials
          this.status = '已偵測到LOL，待配對成功即可顯示戰績'
        } catch (err) {
          this.status = '偵測不到LOL，請啟動LOL，5秒後重新偵測'
          this.credentials = null
        }
      },
      async checkGameFlow () {
        const response = await request({
          url: '/lol-gameflow/v1/gameflow-phase',
          method: 'GET'
        }, this.credentials)
        // ChampSelect階段
        this.gameFlow = await response.json()
        await this.sleep(500)
        this.checkGameFlow()
      },
      async getTeamList () {
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
        this.getAccountId()
      },
      async getAccountId () {
        this.accountIdList = []
        await Promise.all(this.teamList.map(async el => {
          const response = await request({
            url: `/lol-summoner/v1/summoners/${el.summonerId}`,
            method: 'GET'
          }, this.credentials)
          const json = await response.json()
          await this.accountIdList.push(json)
          console.log(json)
          console.log(this.accountIdList)
          /*
          {
           accountId: ,
           displayName:
          }
          */
        }))
        this.getPlayerHistory()
      },
      async getPlayerHistory () {
        this.playerHistory = []
        await Promise.all(this.accountIdList.map(async el => {
          const data = await axios.get(`${this.proxy}https://acs-garena.leagueoflegends.com/v1/stats/player_history/TW/${el.accountId}?begIndex=0&endIndex=3&`)
          this.playerHistory.push(await data.data)
        }))
      }
    },
    watch: {
      gameFlow: function (val) {
        if (val === 'ChampSelect') {
          this.getTeamList()
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
        proxy: 'https://cors-anywhere.herokuapp.com/'
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
  }
  .container {
    background-color: #2b2b2b;
    height: calc(100% - .3rem);
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .status {
    margin: .5rem;
  }
  .text--white {
    font-size: .16rem;
    color: #FFF;
  }
</style>
