import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    isAutoAccept: false,
    isDrawerShow: false,
    status: '',
    myTeamPlayHistorys: [],
    isDarkTheme: true,
    filter: 0
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
    },
    setMyTeamPlayHistorys (state, myTeamPlayHistorys) {
      state.myTeamPlayHistorys = myTeamPlayHistorys
    },
    setDarkTheme (state, isDarkTheme) {
      state.isDarkTheme = isDarkTheme
    },
    setFilter (state, filter) {
      state.filter = filter
    }
  }
})

export default store
