export default {
  // 阅读器
  fileName: '', // 文件名称
  menuVisible: false, // 标题(显示、隐藏)
  settingVisible: -1, // -1: 不显示, 0: 显示, 1: 主题, 2: 进度, 3: 菜单
  defaultFontSize: 16, // 默认字体大小
  defaultFontFamily: 'Default', // 默认字体类型
  fontFamilyVisible: false, // 切换字体面板显示、隐藏
  defaultTheme: 'Default', // 默认主体
  bookAvailable: false,
  progress: 0, // 阅读进度
  section: 0,
  isPaginating: true,
  currentBook: null,
  navigation: null,
  cover: null,
  metadata: null,
  paginate: '',
  pagelist: null,
  offsetY: 0,
  isBookmark: null,

  // 书城首页
  hotSearchOffsetY: 0,
  flapCardVisible: false
}
