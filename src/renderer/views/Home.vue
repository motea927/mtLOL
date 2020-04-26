<template>
  <v-container>
    <v-chip-group mandatory v-model="filter" class="mx-3">
      <v-chip filter>所有紀錄</v-chip>
      <v-chip filter>單雙積分</v-chip>
      <v-chip filter>彈性積分</v-chip>
      <v-chip filter>戰棋積分</v-chip>
    </v-chip-group>
    <v-card class="mx-3 mt-5">
      <v-row>
        <v-col>
          <v-card-title>不信命只逆命</v-card-title>
        </v-col>
      </v-row>
      <v-card-text class="text--secondary my-0 py-1">
            <v-icon class="mx-1" color="rgba( 255, 255, 255, 0.7)">mdi-account-box</v-icon>
            <span class="mr-1">
              單雙: 金牌 100分
            </span>
            <v-icon class="mx-1" color="rgba( 255, 255, 255, 0.7)">mdi-flag</v-icon>
            <span class="mr-1">
              彈性: 金牌 100分
            </span>
            <v-icon class="mx-1" color="rgba( 255, 255, 255, 0.7)">mdi-chess-knight</v-icon>
            <span class="mr-1">
              戰棋: 金牌 100分
            </span>
      </v-card-text>
      <v-row class="px-5">
        <v-col sm="3" md="2" v-for="i in 4" :key="i">
          <v-hover v-slot:default="{ hover }">
            <v-card>
              <div v-if="hover" class="playerHistory--hover">
                <v-card-text>2020/04/53</v-card-text>
                <v-card-text>17:39</v-card-text>
              </div>
              <v-card-title>
                <v-icon class="mr-5">mdi-check</v-icon>
                安妮
              </v-card-title>
              <v-card-text>13/51/20 中路</v-card-text>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
    </v-card>
    <v-row>
      <v-switch class="mx-auto mt-4" label="自動接受配對" v-model="isAutoAccept"></v-switch>
    </v-row>
    <p class="text-center mt-6">{{ status }}</p>
  </v-container>
</template>

<script>
export default {
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
    }
  },
  data () {
    return {
      filter: 0
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
</style>
