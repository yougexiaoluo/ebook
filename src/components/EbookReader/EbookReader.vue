<template>
  <div class="ebook-reader">
    <div id="read"></div>
  </div>
</template>

<script>
import Epub from 'epubjs'
import { ebookMixin } from '../../utils/mixin/ebookMixin'

global.ePub = Epub

export default {
  mounted () {
    let fileName = this.$route.params.fileName.split('|').join('/') // 获取路由地址
    // 修改成功后获取本地nginx静态资源
    this.$store.dispatch('setFileName', fileName).then(() => {
      this.initEpub()
    })
  },
  mixins: [ebookMixin],
  methods: {
    initEpub () {
      const url = 'http://localhost:8081/epub/' + this.fileName + '.epub' // nginx 服务器静态资源地址
      this.book = new Epub(url)
      // 生成rendition对象
      this.rendition = this.book.renderTo('read', {
        width: innerWidth,
        height: innerHeight,
        method: 'default' // 兼容微信
      })
      // 开始渲染电子书
      this.rendition.display()

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
          this.prevPage() // 上一页
        } else if (time < 500 && offsetX < -40) {
          this.nextPage() // 下一页
        } else {
          this.toggleTitleAndMenu() // 显示标题、menu 导航
        }
        // 阻止事件冒泡、浏览器默认行为
        event.preventDefault()
        event.stopPropagation()
      })
    },
    prevPage () {
      if (this.rendition) {
        this.rendition.prev()
        this.hideTitleAndMenu()
      }
    },
    nextPage () {
      if (this.rendition) {
        this.rendition.next()
        this.hideTitleAndMenu()
      }
    },
    toggleTitleAndMenu () {
      this.$store.dispatch('setMenuVisible', !this.menuVisible)
    },
    hideTitleAndMenu () {
       this.$store.dispatch('setMenuVisible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
