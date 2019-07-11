import * as types from './mutations-type'

export default {
  [types.SET_FILENAME] (state, fileName) { // 设置state中的fileName属性
    state.fileName = fileName
  },
  [types.SET_MENUTVISIBLE] (state, menuVisible) { // 用于控制title的显示与隐藏
    state.menuVisible = menuVisible
  }
}
