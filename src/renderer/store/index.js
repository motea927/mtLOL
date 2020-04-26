import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    isAutoAccept: false,
    isDrawerShow: false,
    status: ''
  },
  mutations: {
    setDrawerShow (state, val) {
      state.isDrawerShow = val
    },
    setStatus (state, status) {
      state.status = status
    },
    setAutoAccept (state, isAutoAccept) {
      state.isAutoAccept = isAutoAccept
    }
  }
})

export default store
