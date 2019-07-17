// 此文件用于存放相同的代码
import { mapGetters, mapActions } from 'vuex'
import { themeList, addCss } from '../book'
import { saveLocation } from '../localStorage'

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
      this.removeCss()
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
    removeCss (href) {
      /**
       * 实现思路：
       *    1. 获取所有的link标签
       *    2. 通过遍历的方式，删除匹配的link标签
       */

       let links = document.querySelectorAll('link')

       for (let i = links.length; i >= 0; i--) {
         let link = links[i]
         if (link && link.getAttribute('href') && link.getAttribute('href') === href) {
           link.parentNode.removeChild(link)
         }
       }
    },
    removeAllCss () {
      this.removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
      this.removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
      this.removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
      this.removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
    },
     // 重新刷新进度
     refreshLocation () {
      const currentLocation = this.currentBook.rendition.currentLocation() // 得到当前进度位置
      const startCfi = currentLocation.start.cfi // 当前章节
      const progress = this.currentBook.locations.percentageFromCfi(startCfi) // 当前章节进度
      this.setProgress(Math.floor(progress * 100)) // 保存进度
      this.setSection(currentLocation.start.index) // 获取章节标题
      saveLocation(this.fileName, startCfi) // 保存进度位置
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
    }
  }
}

export { ebookMixin }
