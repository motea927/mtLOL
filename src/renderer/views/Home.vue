<template>
  <vue-custom-scrollbar class="scroll-area">
    <v-container fluid class="home">
      <!-- filter -->
      <v-chip-group mandatory v-model="filter" class="mx-3" active-class="grey darken-4 primary">
        <v-chip filter>所有紀錄</v-chip>
        <v-chip filter>單雙積分</v-chip>
        <v-chip filter>彈性積分</v-chip>
        <v-chip filter>一般對戰</v-chip>
      </v-chip-group>

      <!-- empty state -->
      <v-img src="static/empty.svg" width="150" class="mx-auto mt-10" v-if="myTeamPlayHistorys.length === 0"></v-img>
      <!--更改-->
      <v-simple-table dense v-else>
        <thead>
          <tr>
            <th class="text-left">ID</th>
            <th class="text-left">紀錄 1</th>
            <th class="text-left">紀錄 2</th>
            <th class="text-left">紀錄 3</th>
            <th class="text-left">紀錄 4</th>
          </tr>
        </thead>
        <tbody>
            <tr v-for="(myTeamPlayHistory, index) in myTeamPlayHistorys" :key="index" :class="getRowClass(index)">
            <td>
              <p class="my-2 subtitle-1 font-weight-bold">{{ myTeamPlayHistory.displayName }}</p>
              <p class="my-2" v-for="historyList in historyLists" :key="historyList.title">
                {{ historyList.title }}: {{ myTeamPlayHistory.rankData[historyList.attribute] ? myTeamPlayHistory.rankData[historyList.attribute] : '無牌位'}}
              </p>
              <v-chip class="grey darken-4 primary mb-2" label small v-for="(arrangeTeamList, index) in myTeamPlayHistory.arrangeTeamList" :key="index">
                與{{ arrangeTeamList.id }}雙排{{ arrangeTeamList.counts }}場
              </v-chip>
            </td>
            <v-hover v-slot:default="{ hover }" v-for="game in gamesfilter(myTeamPlayHistory.games)" :key="game.gameId">
              <td>
                <p class="my-2" :class="game.participants[0].stats.win ? 'success--text' : 'warning--text'">
                  <v-icon :class="game.participants[0].stats.win ? 'success--text' : 'warning--text'" small>
                     {{ game.participants[0].stats.win ? 'mdi-check-circle' : 'mdi-close-circle'}}
                    mdi-check-circle
                  </v-icon> 
                  {{ getChampNameStr(game.participants[0].championId) }}
                </p>
                <p class="my-2">{{ game.participants[0].stats.kills }}/{{ game.participants[0].stats.deaths }}/{{ game.participants[0].stats.assists }}</p>
                <p class="my-2">{{ getQueueIdStr(game.queueId) }}</p>
                <div v-if="hover" class="playerHistory--hover">
                  <p class="my-2">{{ formatDateYMD(new Date(game.gameCreation)) }}</p>
                  <p class="my-2">{{ formatDateHM(new Date(game.gameCreation)) }}</p>
                  <p class="my-2">{{ getLaneStr(game.participants[0].timeline.lane) }}</p>
                </div>
              </td>
            </v-hover>
            </tr>
        </tbody>
    </v-simple-table>
      <!--更改-->
      <!-- eachPlayerInfo -->
      

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
const Store = require('electron-store')
const electronStore = new Store()
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
        electronStore.set('isAutoAccept', isAutoAccept)
      }
    },
    myTeamPlayHistorys () {
      return this.$store.state.myTeamPlayHistorys
    },
    filter: {
      get () {
        return this.$store.state.filter
      },
      set (filter) {
        this.$store.commit('setFilter', filter)
        electronStore.set('filter', filter)
      }
    },
    isDarkTheme () {
      return this.$store.state.isDarkTheme
    }
  },
  data () {
    return {
      historyLists: [
        { title: '單雙', attribute: 'RANKED_SOLO_5x5' },
        { title: '彈性', attribute: 'RANKED_FLEX_SR' }
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
      const day = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`
      return `${month}/${day}`
    },
    getLaneStr (lane) {
      const laneTable = {
        TOP: '上路',
        MIDDLE: '中路',
        JUNGLE: '打野',
        BOTTOM: '下路',
        NONE: ''
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
    },
    getRowClass (index) {
      if (index % 2 !== 0) {
        if (this.isDarkTheme) {
          return 'home__evenrow--dark'
        } else {
          return 'home__evenrow--light'
        }
      }
      return ''
    }
  }
}
</script>

<style lang="scss">
  .playerHistory--hover {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .85);
    color: white;
    z-index: 1;
  }
  .scroll-area {
    position: relative;
    margin: auto;
    width: 100%;
    overflow: scroll;
    height: calc(100vh - 80px);
  }
  .home {
    & td {
      position: relative;
      overflow: hidden;
    }
    & tbody {
      overflow: hidden;
    }
    &__evenrow--dark {
      background-color: #212832;
    }
    &__evenrow--light {
      background-color: #f4f4f4;
    }
  }
</style>
