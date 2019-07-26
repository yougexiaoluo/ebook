<template>
  <div class="ebook-reader">
    <div id="read"></div>
    <!-- 借助其它的空标签实现某些功能 -->
    <div class="ebook-reader-mask"
         @click="onMaskClick"
         @touchmove="move"
         @touchend="moveEnd"
         @mousedown.left="mouseDown"
         @mousemove.left="mouseMove"
         @mouseup.left="mouseUp"
    ></div>
  </div>
</template>

<script>
import Epub from 'epubjs'
import { ebookMixin } from '@/utils/mixin/ebookMixin'
import { flatent } from '@/utils/book'
import { getFontFamily,
         saveFontFamily,
         getFontSize,
         saveFontSize,
         getTheme,
         saveTheme,
         getLocation
} from '@/utils/localStorage'

global.ePub = Epub

export default {
  mounted () {
    let fileName = this.$route.params.fileName.split('|').join('/') // 获取路由地址
    this.setFileName(fileName).then(() => {
      this.initEpub()
    })
  },
  mixins: [ebookMixin],
  methods: {
    initEpub () {
      const url = `${process.env.VUE_APP_RES_URL}/epub/${this.fileName}.epub` // nginx 服务器静态资源地址
      this.book = new Epub(url)
      this.setCurrentBook(this.book) // 将this.book存储到store中，进行共享
      this.initRendition()
      // this.initGesture()  实现书签功能，不能使用了
      this.parseBook()
      // 初始化完成后，进行书籍分页
      this.book.ready.then(() => {
        return this.book.locations.generate(750 * (window.innerWidth / 375) * getFontSize(this.fileName) / 16)
      }).then(locations => {
        this.setBookAvailable(true)
        this.refreshLocation() // 重新回去进度，分页未完成的时候获取progress为null
      })
    },
    // 上一页
    prevPage () {
      if (this.rendition) {
        this.rendition.prev().then(() => {
          this.refreshLocation()
        })
        this.hideTitleAndMenu()
      }
    },
    // 下一页
    nextPage () {
      if (this.rendition) {
        this.rendition.next().then(() => {
          this.refreshLocation()
        })
        this.hideTitleAndMenu()
      }
    },
    // 显示标题、menu 导航
    toggleTitleAndMenu () {
      if (this.menuVisible) {
        this.setSettingVisible(-1)
        this.setFontFamilyVisible(false)
      }
      // this.$store.dispatch('setMenuVisible', !this.menuVisible)
      this.setMenuVisible(!this.menuVisible)
    },
    // 初始化数据
    initFontSize () {
      let fontSize = getFontSize(this.fileName)
      if (!fontSize) {
        saveFontSize(this.fileName, this.defaultFontSize)
      } else {
        this.setDefaultFontSize(fontSize)
        this.rendition.themes.fontSize(fontSize)
      }
    },
    initFontFamily () {
      let font = getFontFamily(this.fileName)

      if (!font) {
        saveFontFamily(this.fileName, this.defaultFontFamily)
      } else {
        this.rendition.themes.font(font)
        this.setDefaultFontFamily(font)
      }
    },
    initTheme () {
      // 从本地中获取主题
      let defaultTheme = getTheme(this.fileName)

      if (!defaultTheme) {
        defaultTheme = this.themeList[0].name
        saveTheme(this.fileName, defaultTheme)
      }
      this.setDefaultTheme(defaultTheme)
      // 注册主题
      this.themeList.forEach(theme => {
        this.rendition.themes.register(theme.name, theme.style)
      })
      // 选择默认主题
      this.rendition.themes.select(defaultTheme)
    },
    initRendition () {
      // 生成rendition对象
      this.rendition = this.book.renderTo('read', {
        width: innerWidth,
        height: innerHeight,
        method: 'default' // 兼容微信
      })
      // 开始渲染电子书
      const location = getLocation(this.fileName)
      this.display(location, () => {
        this.initTheme()
        this.initFontFamily()
        this.initFontSize()
        this.initGlobalStyle()
        this.refreshLocation()
      })
      // 渲染完成，并且可以获取内容的时候
      this.rendition.hooks.content.register(contents => {
        // 需要传入的是url地址
        Promise.all([
          // 使用环境变量，为了解决上产品线之后，当用户预览时静态嵌入客户端中
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/family/cabin.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/family/daysOne.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/family/montserrat.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/family/tangerine.css`)
        ]).then(() => {
          // 字体加载完成之后
        })
      })
    },
    initGesture () {
      // 手势操作(判断左滑、右滑)
      this.rendition.on('touchstart', event => {
        this.touchStartX = event.changedTouches[0].clientX
        this.startTime = event.timeStamp
      })
      this.rendition.on('touchend', event => {
        // 计算滑动位置、以及滑动时间
        const offsetX = event.changedTouches[0].clientX - this.touchStartX
        const time = event.timeStamp - this.startTime
        // 限制条件
        if (time < 500 && offsetX > 40) {
          this.prevPage()
        } else if (time < 500 && offsetX < -40) {
          this.nextPage()
        } else {
          this.toggleTitleAndMenu()
        }
        // 阻止事件冒泡、浏览器默认行为
        event.preventDefault() // 这里epubjs会带来版本问题
        event.stopPropagation()
      })
    },
    // 解析电子书
    parseBook () {
      /**
       * 需求：
       *    1. 获取书籍封面
       *    2. 获取标题、作者信息
       *    3. 获取目录
      */
      // 1
      this.book.loaded.cover.then(cover => {
        this.book.archive.createUrl(cover).then(url => {
          this.setCover(url)
        })
      })
      // 2
      this.book.loaded.metadata.then(metadata => {
        this.setMetadata(metadata)
      })
      // 3
      this.book.loaded.navigation.then(navigation => {
        let newItem = flatent(navigation.toc)

        // 查询是否有子目录(使用递归的方式取查询)
        function find (item, level = 0) {
          if (!item.parent) {
            return level
          } else {
            return find(newItem.filter(parentItem => parentItem.id === item.parent)[0], ++level)
          }
        }
        // 添加level字段
        newItem.forEach((item, i) => {
          item.level = find(item)
        })
        this.setNavigation(newItem)
      })
    },
    // 注册事件，实现其它逻辑
    onMaskClick (event) {
      if (this.mouseState && (this.mouseState === 2 || this.mouseState === 3)) {
        return
      }
      const offsetX = event.offsetX
      const width = window.innerWidth
      if (offsetX > 0 && offsetX < width * 0.3) {
        this.prevPage()
      } else if (offsetX > 0 && offsetX > width * 0.7) {
        this.nextPage()
      } else {
        this.toggleTitleAndMenu()
      }
    },
    move (event) {
      let offsetY = 0
      if (this.firstOffsetY) {
        offsetY = event.changedTouches[0].clientY - this.firstOffsetY
        this.setOffsetY(offsetY)
        event.preventDefault() // 解决设备上下拉造成整体下拉的问题
        event.stopPropagation()
      } else {
        this.firstOffsetY = event.changedTouches[0].clientY
      }
    },
    moveEnd (event) {
      this.firstOffsetY = 0
      this.setOffsetY(0)
    },
    // 兼容pc端事件
    // 1 - 鼠标进入
    // 2 - 鼠标进入后移动
    // 3 - 鼠标从移动转态松手
    // 4 - 鼠标还原
    mouseDown (event) {
      this.mouseState = 1
      this.mosueStartTime = event.timeStamp
      event.preventDefault()
      event.stopPropagation()
    },
    mouseMove (event) {
      if (this.mouseState === 1) {
        this.mouseState = 2
      } else if (this.mouseState === 2) {
        let offsetY = 0
        if (this.firstOffsetY) {
          offsetY = event.clientY - this.firstOffsetY
          this.setOffsetY(offsetY)
        } else {
          this.firstOffsetY = event.clientY
        }
      }
      event.preventDefault()
      event.stopPropagation()
    },
    mouseUp (event) {
      if (this.mouseState === 2) {
        this.firstOffsetY = null
        this.setOffsetY(0)
        this.mouseState = 3
      } else {
        this.mouseState = 4
      }
      let time = event.timeStamp - this.mosueStartTime
      // 解决点击有手抖的而不能触发事件的情况(使用时间戳进行判断)
      if (time < 100) {
        this.mouseState = 4
      }
      event.preventDefault()
      event.stopPropagation()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/scss/global.scss';

  .ebook-reader {
    width: 100%;
    height: 100%;
    .ebook-reader-mask {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 150;
      width: 100%;
      height: 100%;
      background: transparent;
    }
  }
</style>
