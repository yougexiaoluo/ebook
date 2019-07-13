import * as types from './mutations-type'

export default {
  [types.SET_FILENAME]: (state, fileName) => { // 设置state中的fileName属性
    state.fileName = fileName
  },
  [types.SET_MENUTVISIBLE]: (state, menuVisible) => { // 用于控制title的显示与隐藏
    state.menuVisible = menuVisible
  },
  [types.SET_SETTING_VISIBLE]: (state, settingVisible) => { // 用于控制字体控件的显示与隐藏
    state.settingVisible = settingVisible
  },
  [types.SET_DEFAULT_FONT_SIZE]: (state, defaultFontSize) => { // 用于控制字体控件的显示与隐藏
    state.defaultFontSize = defaultFontSize
  },
  [types.SET_DEFAULT_FONT_FAMILY]: (state, font) => {
    state.defaultFontFamily = font
  },
  [types.SET_FONT_FAMILY_VISIBLE]: (state, visible) => {
    state.fontFamilyVisible = visible
  },
  [types.SET_DEFAULT_THEME]: (state, theme) => {
    state.defaultTheme = theme
  },
  [types.SET_BOOK_AVAILABLE]: (state, bookAvailable) => {
    state.bookAvailable = bookAvailable
  },
  [types.SET_PROGRESS]: (state, progress) => {
    state.progress = progress
  },
  [types.SET_SECTION]: (state, section) => {
    state.section = section
  },
  [types.SET_IS_PAGINATING]: (state, isPaginating) => {
    state.isPaginating = isPaginating
  },
  [types.SET_CURRENT_BOOK]: (state, currentBook) => {
    state.currentBook = currentBook
  },
  [types.SET_NAVIGATION]: (state, navigation) => {
    state.navigation = navigation
  },
  [types.SET_COVER]: (state, cover) => {
    state.cover = cover
  },
  [types.SET_METADATA]: (state, metadata) => {
    state.metadata = metadata
  },
  [types.SET_PAGINATE]: (state, paginate) => {
    state.paginate = paginate
  },
  [types.SET_PAGELIST]: (state, pagelist) => {
    state.pagelist = pagelist
  },
  [types.SET_OFFSETY]: (state, offsetY) => {
    state.offsetY = offsetY
  },
  [types.SET_IS_BOOKMARK]: (state, isBookmark) => {
    state.isBookmark = isBookmark
  }
}
