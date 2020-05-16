<template>
  <div>
    <v-img src="static/empty.svg" width="150" class="mx-auto mt-10" v-if="historys.length === 0"></v-img>
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
        <tr v-for="(history, index) in historys" :key="index" :class="getRowClass(index)">
          <app-play-historys-info :info="history"></app-play-historys-info>
          <app-play-historys-games v-for="game in gamesfilter(history.games)" :key="game.gameId" :game="game"></app-play-historys-games>
        </tr>
      </tbody>
    </v-simple-table>
  </div>
</template>

<script>
import AppPlayHistorysInfo from './AppPlayHistorysInfo'
import AppPlayHistorysGames from './AppPlayHistorysGames'
export default {
  props: ['historys'],
  components: {
    AppPlayHistorysInfo,
    AppPlayHistorysGames
  },
  computed: {
    filter () {
      return this.$store.state.filter
    },
    isDarkTheme () {
      return this.$store.state.isDarkTheme
    }
  },
  methods: {
    getRowClass (index) {
      if (index % 2 !== 0) {
        if (this.isDarkTheme) {
          return 'home__evenrow--dark'
        } else {
          return 'home__evenrow--light'
        }
      }
      return ''
    },
    gamesfilter (games) {
      if (this.filter === 0) {
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