<template>
<div class="titlebar">
  <div class="titlebar__info">
    <img src="static/icons.svg" alt="">
    <p>mtLOL v1.0.0</p>
  </div>
  <div class="titlebar__control">
    <div class="titlebar__control--btn" id="titlebar__control--min" @click="controlWindow('min')"></div> 
    <div class="titlebar__control--btn" id="titlebar__control--max" @click="controlWindow('max')"></div> 
    <div class="titlebar__control--btn" id="titlebar__control--close" @click="controlWindow('close')"></div>
  </div>
</div>
</template>

<script>
  const remote = require('electron').remote
  export default {
    name: 'AppTitleBar',
    data () {
      return {
        isWindowMaximized: false
      }
    },
    methods: {
      controlWindow (command) {
        const window = remote.getCurrentWindow()
        switch (command) {
          case 'min':
            window.minimize()
            break
          case 'max':
            if (this.isWindowMaximized) {
              window.unmaximize()
              this.isWindowMaximized = false
            } else {
              window.maximize()
              this.isWindowMaximized = true
            }
            break
          case 'close':
            window.close()
            break
        }
      }
    }
  }
</script>

<style lang="scss">
  .titlebar{
    display: flex;
    align-items: center;
    height: .3rem;
    width: 100%;
    background-color: rgba(232,232,237,.85);
    -webkit-user-select: none;
    -webkit-app-region: drag;
    border-top-left-radius: 0.05rem;
    border-top-right-radius: 0.05rem;
    &__info {
      height: 100%;
      display: flex;
      align-items: center;
      & img {
        margin: 0 .05rem;
        height: 80%;
        width: auto;
      }
      & p {
        font-size: .16rem;
      }
    }
    &__control {
      margin-left: auto;
      display: flex;
      &--btn {
        width: .17rem;
        height: .17rem;
        border-radius: 999em;
        margin: 0 .05rem;
        -webkit-app-region: no-drag;
        text-align: center;
        line-height: .17rem;
        font-size: .13rem;
        font-weight: 900;
        &:hover {
          opacity: .95;
        }
      }
    }
  }
  #titlebar__control--min {
    background-color: rgb(232, 200, 73);
    &:hover::before {
      content: "\2014";
      color: rgb(205, 169, 59);
    }
  }
  #titlebar__control--max {
    background-color: rgb(53, 203, 75);
    &:hover::before {
      content: "\271A";
      color: rgb(115, 143, 64);
    }
  }
  #titlebar__control--close {
    background-color: rgb(252, 98, 93);
    &:hover::before {
      content: "\2716";
      color: rgb(121, 48, 34);
    }
  }
</style>