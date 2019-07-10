import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

import book from './modules/book'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        book
    }
    // state,
    // mutations,
    // getters,
    // actions
})
