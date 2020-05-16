<template>
  <td>
    <p class="my-2 subtitle-1 font-weight-bold">{{ info.displayName }}</p>
    <p class="my-2" v-for="historyList in historyLists" :key="historyList.title">
      {{ historyList.title }}: {{ info.rankData[historyList.attribute] ? info.rankData[historyList.attribute] : '無牌位'}}
    </p>
    <p v-for="(arrangeTeamList, index) in info.arrangeTeamList" :key="index" class="my-2">
      <v-chip class="grey darken-4 primary mb-2 home__arrangeTeam" label small >
      與{{ arrangeTeamList.id }}雙排{{ arrangeTeamList.counts }}場
      </v-chip>
    </p>
  </td>
</template>

<script>
export default {
  props: ['info'],
  data () {
    return {
      historyLists: [
        { title: '單雙', attribute: 'RANKED_SOLO_5x5' },
        { title: '彈性', attribute: 'RANKED_FLEX_SR' }
      ]
    }
  }
}
</script>