<template>
  <div id="app" class="md-layout md-alignment-center-center">
    <app-title-bar></app-title-bar>
    <div class="container">
      <app-table></app-table>
      <div class="status">
        <p class="text--white">status: 請使用系統管理員開啟!</p>
      </div>
      
    </div>
  </div>
</template>

<script>
  import AppTitleBar from './components/AppTitleBar/AppTitleBar'
  import AppTable from './components/AppTable/AppTable'
  export default {
    name: 'mt-lol',
    components: {
      AppTitleBar,
      AppTable
    },
    data () {
      return {
        record: 0,
        status: ''
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
