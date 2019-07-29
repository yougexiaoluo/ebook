// 此文件用于存放相同的代码
import { mapGetters, mapActions } from 'vuex'
import { themeList, addCss, removeAllCss, getReadTimeByMinute } from '../book'
import { saveLocation, getBookmark } from '../localStorage'

const storeHomeMixin = {
  computed: {
    ...mapGetters([
      'offsetY',
      'hotSearchOffsetY',
      'flapCardVisible'
    ])
  },
  methods: {
    ...mapActions([
      'setOffsetY',
      'setHotSearchOffsetY',
      'setFlapCardVisible'
    ]),
    showBookDetail (book) {
      this.$router.push({
        path: '/store/detail',
        query: {
          fileName: book.fileName,
          category: book.categoryText
        }
      })
    }
  }
}

const ebookMixin = {
  computed: {
    ...mapGetters([
      'fileName',
      'menuVisible',
      'settingVisible',
      'defaultFontSize',
      'defaultFontFamily',
      'fontFamilyVisible',
      'defaultTheme',
      'bookAvailable',
      'progress',
      'section',
      'isPaginating',
      'currentBook',
      'navigation',
      'cover',
      'metadata',
      'paginate',
      'pagelist',
      'offsetY',
      'isBookmark',
      'speakingIconBottom'
    ]),
    themeList () {
      return themeList(this)
    },
    // 获取章节标题
    getSectionName () {
      // if (this.section) {
      //   const sectionInfo = this.currentBook.section(this.section)
      //   if (sectionInfo && sectionInfo.href) {
      //     return this.currentBook.navigation.get(sectionInfo.href).label
      //   }
      // }

      return this.section ? this.navigation[this.section].label : ''
    }
  },
  methods: {
    ...mapActions([
      'setFileName',
      'setMenuVisible',
      'setSettingVisible',
      'setDefaultFontSize',
      'setDefaultFontFamily',
      'setFontFamilyVisible',
      'setDefaultTheme',
      'setBookAvailable',
      'setProgress',
      'setSection',
      'setIsPaginating',
      'setCurrentBook',
      'setNavigation',
      'setCover',
      'setMetadata',
      'setPaginate',
      'setPagelist',
      'setOffsetY',
      'setIsBookmark',
      'setSpeakingIconBottom'
    ]),
    initGlobalStyle () {
      removeAllCss()
      switch (this.defaultTheme) {
        case 'Default':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
          break
        case 'Eye':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
          break
        case 'Gold':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
          break
        case 'Night':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
          break
        default:
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
          break
      }
    },
      // 重新刷新进度
      refreshLocation () {
      const currentLocation = this.currentBook.rendition.currentLocation() // 得到当前进度位置
      if (currentLocation && currentLocation.start) {
        const startCfi = currentLocation.start.cfi // 当前章节
        const progress = this.currentBook.locations.percentageFromCfi(startCfi) // 当前章节进度
        this.setProgress(Math.floor(progress * 100)) // 保存进度
        this.setSection(currentLocation.start.index) // 获取章节标题
        saveLocation(this.fileName, startCfi) // 保存进度位置
        // 控制书签是否添加
        let bookmark = getBookmark(this.fileName)
       if (bookmark) {
        if (bookmark.some(item => item.cfi === startCfi)) {
          this.setIsBookmark(true)
        } else {
          this.setIsBookmark(false)
        }
       }
      }
    },
    display (target, callback) {
      if (target) {
        this.currentBook.rendition.display(target).then(() => {
          this.refreshLocation()
          callback && callback()
        })
      } else {
        this.currentBook.rendition.display().then(() => {
          this.refreshLocation()
          callback && callback()
        })
      }
    },
    hideTitleAndMenu () {
      this.setMenuVisible(false)
      this.setSettingVisible(-1)
      this.setFontFamilyVisible(false)
    },
    // 获取阅读时间
    getReadTimeText () {
      return this.$t('book.haveRead').replace('$1', getReadTimeByMinute(this.fileName))
    }
  }
}

export { ebookMixin, storeHomeMixin }
