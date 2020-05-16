<template>
  <v-hover v-slot:default="{ hover }">
    <td>
      <p class="my-2" :class="game.participants[0].stats.win ? 'success--text' : 'warning--text'">
        <v-icon :class="game.participants[0].stats.win ? 'success--text' : 'warning--text'" small>
           {{ game.participants[0].stats.win ? 'mdi-check-circle' : 'mdi-close-circle'}}
        </v-icon> 
        {{ champName }}
      </p>
      <p class="my-2">{{ game.participants[0].stats.kills }}/{{ game.participants[0].stats.deaths }}/{{ game.participants[0].stats.assists }}</p>
      <p class="my-2">{{ getQueueIdStr }}</p>
      <div v-if="hover" class="playerHistory--hover">
        <p class="my-2">{{ dateYMD }}</p>
        <p class="my-2">{{ timeHM }}</p>
        <p class="my-2">{{ lane }}</p>
      </div>
    </td>
  </v-hover>
</template>

<script>
const axios = require('axios')
export default {
  props: ['game'],
  async created () {
    const champion = await axios.get('static/champion.json')
    this.championList = await champion.data.data
  },
  computed: {
    champName () {
      for (let i in this.championList) {
        if (this.championList[i].key === this.game.participants[0].championId.toString()) {
          return this.championList[i].name
        }
      }
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
        '900': '阿福快打',
        '1020': '無限死鬥'
      }
      if (queueIdTable[this.game.queueId]) {
        return queueIdTable[this.game.queueId]
      }
      return this.game.queueId
    },
    dateYMD () {
      const date = new Date(this.game.gameCreation)
      const month = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`
      const day = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`
      return `${month}/${day}`
    },
    timeHM () {
      const date = new Date(this.game.gameCreation)
      const hour = date.getHours() >= 10 ? date.getHours() : `0${date.getHours()}`
      const minute = date.getMinutes() >= 10 ? date.getMinutes() : `0${date.getMinutes()}`
      return `${hour}:${minute}`
    },
    lane () {
      const lane = this.game.participants[0].timeline.lane
      const laneTable = {
        TOP: '上路',
        MIDDLE: '中路',
        JUNGLE: '打野',
        BOTTOM: '下路',
        NONE: ''
      }
      return laneTable[lane]
    }
  },
  data () {
    return {
      championList: []
    }
  }
}
</script>