import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)

const opts = {
  theme: {
    dark: true,
    themes: {
      light: {
        success: '#33691E',
        warning: '#E9422E'
      }
    }
  }
}

export default new Vuetify(opts)
