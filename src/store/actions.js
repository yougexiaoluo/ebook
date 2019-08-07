import * as types from './mutations-type'

export default {
  // 阅读器
  setFileName: ({ commit }, fileName) => { // 异步操作，类似于Promise，可以链式变成 .then(() => {})
    return commit(types.SET_FILENAME, fileName)
  },
  setMenuVisible: ({ commit }, menuVisible) => { // 控制标题
    return commit(types.SET_MENUTVISIBLE, menuVisible)
  },
  setSettingVisible: ({ commit }, settingVisible) => { // 控制标题
    return commit(types.SET_SETTING_VISIBLE, settingVisible)
  },
  setDefaultFontSize: ({ commit }, defaultFontSize) => { // 控制标题
    return commit(types.SET_DEFAULT_FONT_SIZE, defaultFontSize)
  },
  setFontFamilyVisible: ({ commit }, visible) => {
    return commit(types.SET_FONT_FAMILY_VISIBLE, visible)
  },
  setDefaultFontFamily: ({ commit }, font) => {
    return commit(types.SET_DEFAULT_FONT_FAMILY, font)
  },
  setDefaultTheme: ({ commit }, theme) => {
    return commit(types.SET_DEFAULT_THEME, theme)
  },
  setBookAvailable: ({ commit }, bookAvailable) => {
    return commit(types.SET_BOOK_AVAILABLE, bookAvailable)
  },
  setProgress: ({ commit }, progress) => {
    return commit(types.SET_PROGRESS, progress)
  },
  setSection: ({ commit }, section) => {
    return commit(types.SET_SECTION, section)
  },
  setIsPaginating: ({ commit }, isPaginating) => {
    return commit(types.SET_IS_PAGINATING, isPaginating)
  },
  setCurrentBook: ({ commit }, book) => {
    return commit(types.SET_CURRENT_BOOK, book)
  },
  setNavigation: ({ commit }, navigation) => {
    return commit(types.SET_NAVIGATION, navigation)
  },
  setCover: ({ commit }, cover) => {
    return commit(types.SET_COVER, cover)
  },
  setMetadata: ({ commit }, metadata) => {
    return commit(types.SET_METADATA, metadata)
  },
  setPaginate: ({ commit }, paginate) => {
    return commit(types.SET_PAGINATE, paginate)
  },
  setPagelist: ({ commit }, pagelist) => {
    return commit(types.SET_PAGELIST, pagelist)
  },
  setIsBookmark: ({ commit }, isBookmark) => {
    return commit(types.SET_IS_BOOKMARK, isBookmark)
  },
  setOffsetY: ({ commit }, offsetY) => {
    return commit(types.SET_OFFSETY, offsetY)
  },

  // 书城
  setHotSearchOffsetY: ({ commit }, offsetY) => {
    return commit(types.SET_HOT_SEARCH_OFFSETY, offsetY)
  },
  setFlapCardVisible: ({ commit }, bol) => {
    return commit(types.SET_FLAP_CARD_VISIBLE, bol)
  },
  setIsEditMode: ({ commit }, isEditMode) => {
    return commit(types.SET_IS_EDIT_MODE, isEditMode)
  },
  setShelfList: ({ commit }, list) => {
    return commit(types.SET_SHELF_LIST, list)
  },
  setShelfSelected: ({ commit }, selected) => {
    return commit(types.SET_SHLEF_SELECTED, selected)
  },
  setShelfTitleVisible: ({ commit }, visible) => {
    return commit(types.SET_SHELF_TITLE_VISIBLE, visible)
  },
  setShelfCategory: ({ commit }, category) => {
    return commit(types.SET_SHELF_CATEGORY, category)
  },
  setCurrentType: ({ commit }, type) => {
    return commit(types.SET_CURRENT_TYPE, type)
  }
}
