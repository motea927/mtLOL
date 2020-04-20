<template>
  <table class="table" v-if="playerHistory.length !== 0">
      <tr class="table__row--blue">
        <th>玩家資訊</th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
      <tr v-for="(history, index) in playerHistory" :key="index" class="table__row">
        <td class="table__playerInfo">
            <p style="font-weight: 600">{{ history.displayName }}</p>
            <p>單雙: <span v-if="history.rankData.RANKED_SOLO_5x5">{{ history.rankData.RANKED_SOLO_5x5 }}</span>
                     <span v-else>無牌位</span>
            </p>
            <p>彈性: <span v-if="history.rankData.RANKED_FLEX_SR">{{ history.rankData.RANKED_FLEX_SR }}</span>
                     <span v-else>無牌位</span>
            </p>
            <p>戰棋: <span v-if="history.rankData.RANKED_TFT">{{ history.rankData.RANKED_TFT }}</span>
                     <span v-else>無牌位</span>
            </p>
        </td>
        <td v-for="(game, index) in history.games" :key="index">
          <p><span :class=" game.participants[0].stats.win ? 'icon--win' : 'icon--defeat'"></span></p>
          <p>{{ getChampName(game.participants[0].championId) }}</p>
          <p>
            {{ game.participants[0].stats.kills }}/{{ game.participants[0].stats.deaths }}/{{ game.participants[0].stats.assists }}
          <p>{{ formatDateYMD(new Date(game.gameCreation)) }}</p>
          <p>{{ formatDateHM(new Date(game.gameCreation)) }}</p>
          <p>{{ getQueueId(game.queueId) }}</p>
        </td>
      </tr>
  </table>
  <div v-else class="emptyState">
    <img src="static/empty.svg" alt="">
  </div>
</template>

<script>
  export default {
    props: ['playerHistory', 'championList'],
    methods: {
      getQueueType (queueType) {
        const queueTypeStr = this.queueTypesTable[queueType]
        if (queueTypeStr) return queueTypeStr
        return queueType
      },
      getQueueId (queueId) {
        const queueIdStr = this.queueIdTable[queueId]
        if (queueIdStr) return queueIdStr
        return queueId
      },
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
        queueIdTable: {
          '420': '單雙積分',
          '430': '一般對戰',
          '440': '彈性積分',
          '450': '隨機單中',
          '830': '入門電腦',
          '840': '初階電腦',
          '850': '中階電腦',
          '1020': '無限死鬥'
        }
      }
    }
  }
</script>

<style lang="scss">
  .table {
    width: 80%;
    margin-top: .5rem;
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
      & th, & td, & p, &--blue th, &--blue td, &--blue p {
        padding: .06rem .12rem;
        vertical-align: middle;
      }
      &--blue {
        background-color: #2980b9;
        color: #FFF;
      }
    }
    &__playerInfo {
      text-align: left;
    }
  }
  .icon--defeat {
    padding: 0;
    display: inline-block;
    margin: 0 auto;
    font-size: .3rem;
    color: red;
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
    &::before {
      content: "\2714";
    }
  }
  .emptyState {
    margin-top: .5rem;
  }
  .text {
    padding: 0;
    &--kills {
      color: #3cbc8d;
    }
    &--deaths {
      color: #e9422e;
    }
    &--assists {
      color: #ceaf6c;
    }
  }
</style>