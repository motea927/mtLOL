<template>
  <vue-custom-scrollbar class="scroll-area">
    <v-container fluid class="home">
      <!-- filter -->
      <app-filter></app-filter>

      <!-- playHistorys -->
      <app-play-historys :historys="myTeamPlayHistorys"></app-play-historys>
      
      <!-- autoAccept -->
      <v-row class="mt-3">
        <app-auto-accept></app-auto-accept>
      </v-row>
      <p class="text-center mt-6">{{ status }}</p>
    </v-container>
  </vue-custom-scrollbar>
</template>

<script>
import vueCustomScrollbar from 'vue-custom-scrollbar'
import AppPlayHistorys from '../components/AppPlayHistorys'
import AppFilter from '../components/AppFilter'
import AppAutoAccept from '../components/AppAutoAccept'
export default {
  components: {
    vueCustomScrollbar,
    AppPlayHistorys,
    AppFilter,
    AppAutoAccept
  },
  computed: {
    status () {
      return this.$store.state.status
    },
    myTeamPlayHistorys () {
      return this.$store.state.myTeamPlayHistorys
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
