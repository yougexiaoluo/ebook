<template>
  <div class="ebook-reader">
    <div id="read"></div>
  </div>
</template>

<script>
import Epub from 'epubjs'
import { ebookMixin } from '../../utils/mixin/ebookMixin'
import { getFontFamily,
         saveFontFamily,
         getFontSize,
         saveFontSize
} from '@/utils/localStorage'

global.ePub = Epub

export default {
  mounted () {
    let fileName = this.$route.params.fileName.split('|').join('/') // 获取路由地址
    // 修改成功后获取本地nginx静态资源
    // this.$store.dispatch('setFileName', fileName).then(() => {
    //   this.initEpub()
    // })
    this.setFileName(fileName).then(() => {
      this.initEpub()
    })
  },
  mixins: [ebookMixin],
  methods: {
    initEpub () {
      const url = 'http://localhost:8081/epub/' + this.fileName + '.epub' // nginx 服务器静态资源地址
      this.book = new Epub(url)
      this.setCurrentBook(this.book) // 将this.book存储到store中，进行共享
      // 生成rendition对象
      this.rendition = this.book.renderTo('read', {
        width: innerWidth,
        height: innerHeight,
        method: 'default' // 兼容微信
      })
      // 开始渲染电子书
      this.rendition.display().then(() => {
        this.initFontFamily()
        this.initFontSize()
      })

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
      // 渲染完成，并且可以获取内容的时候
      this.rendition.hooks.content.register(contents => {
        // 需要传入的是url地址
        Promise.all([
          // 使用环境变量，为了解决上产品线之后，当用户预览时静态嵌入客户端中
          contents.addStylesheet(`${process.env.VUE_APP_RESOURCE}/fonts/family/cabin.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RESOURCE}/fonts/family/daysOne.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RESOURCE}/fonts/family/montserrat.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RESOURCE}/fonts/family/tangerine.css`)
        ]).then(() => {
          // 字体加载完成之后
        })
      })
    },
    // 上一页
    prevPage () {
      if (this.rendition) {
        this.rendition.prev()
        this.hideTitleAndMenu()
      }
    },
    // 下一页
    nextPage () {
      if (this.rendition) {
        this.rendition.next()
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
    hideTitleAndMenu () {
      //  this.$store.dispatch('setMenuVisible', false)
      this.setMenuVisible(false)
      this.setSettingVisible(-1)
      this.setFontFamilyVisible(false)
    },
    // 初始化本地缓存
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
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
