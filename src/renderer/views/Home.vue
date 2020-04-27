<template>
  <vue-custom-scrollbar class="scroll-area">
    <v-container fluid>
      <!-- filter -->
      <v-chip-group mandatory v-model="filter" class="mx-3" active-class="grey darken-4 primary">
        <v-chip filter>所有紀錄</v-chip>
        <v-chip filter>單雙積分</v-chip>
        <v-chip filter>彈性積分</v-chip>
        <v-chip filter>一般對戰</v-chip>
      </v-chip-group>
      <v-img src="static/empty.svg" width="150" class="mx-auto mt-10" v-if="myTeamPlayHistorys.length === 0"></v-img>
      <!-- eachPlayerInfo -->
      <v-card class="mx-3 mt-5" v-for="myTeamPlayHistory in myTeamPlayHistorys" :key="myTeamPlayHistory.displayName">
        <v-row>
          <v-col>
            <v-card-title>{{ myTeamPlayHistory.displayName }}</v-card-title>
          </v-col>
        </v-row>
        <v-card-text class="text--secondary my-0 py-1">
          <span v-for="historyList in historyLists" :key="historyList.title">
            <v-icon class="mx-1" color="rgba( 255, 255, 255, 0.7)" >{{ historyList.icon }}</v-icon>
              <span class="mr-1">
                {{ historyList.title }}: {{ myTeamPlayHistory.rankData[historyList.attribute] ? myTeamPlayHistory.rankData[historyList.attribute] : '無牌位'}}
              </span>
          </span>
        </v-card-text>

        <!-- eachPlayerHistory -->
        <v-row class="px-5">
          <v-col sm="3" md="2" v-for="game in gamesfilter(myTeamPlayHistory.games)" :key="game.gameId">
            <v-hover v-slot:default="{ hover }">
              <v-card>
                <div v-if="hover" class="playerHistory--hover">
                  <v-card-text>{{ formatDateYMD(new Date(game.gameCreation)) }}</v-card-text>
                  <v-card-text>{{ formatDateHM(new Date(game.gameCreation)) }}</v-card-text>
                </div>
                <v-card-title>
                  <v-icon class="mr-5" :color="game.participants[0].stats.win ? 'success' : 'warning'">
                    {{ game.participants[0].stats.win ? 'mdi-check' : 'mdi-close'}}
                  </v-icon>
                  <span :class="game.participants[0].stats.win ? 'success--text' : 'warning--text'">
                    {{ getChampNameStr(game.participants[0].championId) }}
                  </span>
                </v-card-title>
                <v-card-text>{{ game.participants[0].stats.kills }}/{{ game.participants[0].stats.deaths }}/{{ game.participants[0].stats.assists }} {{ getLaneStr(game.participants[0].timeline.lane) }}</v-card-text>
                <v-card-text class="pt-0">{{ getQueueIdStr(game.queueId) }}</v-card-text>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-card>

    <!-- autoAccept -->
    <v-row class="mt-3">
      <v-switch class="mx-auto mt-4" label="自動接受配對" v-model="isAutoAccept"></v-switch>
    </v-row>
      <p class="text-center mt-6">{{ status }}</p>
    </v-container>
  </vue-custom-scrollbar>
</template>

<script>
import vueCustomScrollbar from 'vue-custom-scrollbar'
const axios = require('axios')
export default {
  components: {
    vueCustomScrollbar
  },
  computed: {
    status () {
      return this.$store.state.status
    },
    isAutoAccept: {
      get () {
        return this.$store.state.isAutoAccept
      },
      set (isAutoAccept) {
        this.$store.commit('setAutoAccept', isAutoAccept)
      }
    },
    myTeamPlayHistorys () {
      return this.$store.state.myTeamPlayHistorys
    }
  },
  data () {
    return {
      filter: 0,
      historyLists: [
        { icon: 'mdi-account-box', title: '單雙', attribute: 'RANKED_SOLO_5x5' },
        { icon: 'mdi-account-group', title: '彈性', attribute: 'RANKED_FLEX_SR' },
        { icon: 'mdi-chess-knight', title: '戰棋', attribute: 'RANKED_TFT' }
      ],
      championList: []
    }
  },
  async created () {
    const champion = await axios.get('static/champion.json')
    this.championList = await champion.data.data
  },
  methods: {
    formatDateHM (date) {
      const hour = date.getHours() >= 10 ? date.getHours() : `0${date.getHours()}`
      const minute = date.getMinutes() >= 10 ? date.getMinutes() : `0${date.getMinutes()}`
      return `${hour}:${minute}`
    },
    formatDateYMD (date) {
      const month = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`
      const day = date.getDate()
      return `${month}/${day}`
    },
    getLaneStr (lane) {
      const laneTable = {
        TOP: '上路',
        MIDDLE: '中路',
        JUNGLE: '打野',
        BOTTOM: '下路',
        NONOE: ''
      }
      return laneTable[lane]
    },
    getQueueIdStr (queueId) {
      const queueIdTable = {
        '420': '單雙積分',
        '430': '一般對戰',
        '440': '彈性積分',
        '450': '隨機單中',
        '830': '入門電腦',
        '840': '初階電腦',
        '850': '中階電腦',
        '1020': '無限死鬥'
      }
      if (queueIdTable[queueId]) {
        return queueIdTable[queueId]
      }
      return queueId
    },
    getChampNameStr (champId) {
      for (let i in this.championList) {
        if (this.championList[i].key === champId.toString()) {
          return this.championList[i].name
        }
      }
    },
    gamesfilter (games) {
      if (this.filter === 0) {
        // console.log(games)
        return games.slice(-4)
      }
      // 無, 單雙, 彈性, 一般
      const gamesTable = [0, 420, 440, 430]
      const filterResult = games.filter((game) => game.queueId === gamesTable[this.filter])
      return filterResult.slice(-4)
    }
  }
}
</script>

<style lang="scss">
  .playerHistory--hover {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .85);
    z-index: 1;
  }
  .scroll-area {
    position: relative;
    margin: auto;
    width: 100%;
    overflow: scroll;
    height: calc(100vh - 80px);
  }
</style>
