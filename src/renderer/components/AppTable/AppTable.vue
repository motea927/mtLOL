<template>
  <table class="table" v-show="playerHistory.length !== 0">
      <tr class="table__row--blue">
        <th>玩家資訊</th>
        <th>戰績1</th>
        <th>戰績2</th>
        <th>戰績3</th>
        <th>戰績4</th>
      </tr>
      <tr v-for="(history, index) in playerHistory" :key="index" class="table__row">
        <td>
          <p>{{ history.displayName }}</p>
          <p>{{ tierTable[history.rankData.tier] }} {{ history.rankData.division }}</p>
          <p>{{ history.rankData.leaguePoints }} 分</p>
        </td>
        <td v-for="(game, index) in history.games" :key="index">
          <p><span :class=" game.participants[0].stats.win ? 'icon--win' : 'icon--defeat'"></span></p>
          <p>{{ getChampName(game.participants[0].championId) }}</p>
          <p>{{ game.participants[0].stats.kills }}/{{ game.participants[0].stats.deaths }}/{{ game.participants[0].stats.assists }}</p>
          <p>{{ formatDate(new Date(game.gameCreation)) }}</p>
        </td>
      </tr>
      
  </table>
</template>

<script>
  export default {
    props: ['playerHistory', 'championList'],
    watch: {
      playerHistory: function (val) {
      }
    },
    methods: {
      formatDate (date) {
        const year = date.getUTCFullYear()
        const month = date.getUTCMonth() + 1
        const day = date.getUTCDate()
        return `${year}/${month}/${day}`
      },
      getChampName (id) {
        for (var i in this.championList) {
          if (this.championList[i].key === id.toString()) {
            return this.championList[i].name
          }
        }
      }
    },
    data () {
      return {
        tierTable: {
          BRONZE: '銅牌',
          SILVER: '銀牌',
          GOLD: '金牌',
          PLATINUM: '白金',
          DIAMOND: '鑽石',
          MASTER: '大師',
          CHALLENGER: '菁英',
          NONE: '無牌位'
        }
      }
    }
  }
</script>

<style lang="scss">
  .table {
    width: 80%;
    margin-top: .3rem;
    font-size: .16rem;
    & * {
      color: black;
    }
    &__row {
      width: 100%;
      background-color: #f6f6f6;
      text-align: center;
      &:nth-of-type(odd) {
        background-color: #e9e9e9;
      }
      & *, &--blue * {
        padding: .06rem .12rem;
      }
      &--blue {
        background-color: #2980b9;
        color: #FFF;
      }
    }
  }
  .icon--defeat {
    padding: 0;
    display: inline-block;
    margin: 0 auto;
    font-size: .3rem;
    color: red;
    cursor: pointer;
    &::before {
      content: "\2716";
    }
  }
  .icon--win {
    padding: 0;
    display: inline-block;
    margin: 0 auto;
    font-size: .3rem;
    color: green;
    cursor: pointer;
    &::before {
      content: "\2714";
    }
  }
</style>