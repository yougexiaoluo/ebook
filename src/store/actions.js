import * as types from './mutations-type'

export default {
  setFileName ({ commit }, fileName) { // 异步操作，类似于Promise，可以链式变成 .then(() => {})
    return commit(types.SET_FILENAME, fileName)
  },
  setMenuVisible ({ commit }, menuVisible) { // 控制标题
    return commit(types.SET_MENUTVISIBLE, menuVisible)
  }
}
