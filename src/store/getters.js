export default {
  fileName: state => state.fileName, // 获取state中fileName属性
  menuVisible: state => state.menuVisible, // 获取state中menuVisible属性
  settingVisible: state => state.settingVisible, // 获取state中settingVisible属性
  defaultFontSize: state => state.defaultFontSize, // 获取默认字体大小
  defaultFontFamily: state => state.defaultFontFamily,
  fontFamilyVisible: state => state.fontFamilyVisible,
  defaultTheme: state => state.defaultTheme,
  bookAvailable: state => state.bookAvailable,
  progress: state => state.progress,
  section: state => state.section,
  isPaginating: state => state.isPaginating,
  currentBook: state => state.currentBook,
  navigation: state => state.navigation,
  cover: state => state.cover,
  metadata: state => state.metadata,
  paginate: state => state.paginate,
  pagelist: state => state.pagelist,
  offsetY: state => state.offsetY,
  isBookmark: state => state.isBookmark
}
