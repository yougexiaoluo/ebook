<template>
  <div class="ebook-bookmark" ref="bookmark">
    <div class="ebook-bookmark-text-wrapper">
      <div class="ebook-bookmark-down-wrapper" ref="iconDown">
        <span class="icon-down"></span>
      </div>
      <div class="ebook-bookmark-text">{{ text }}</div>
    </div>
    <div class="ebook-bookmark-icon-wrapper" :style=" isFixed ? fixedStyle : {}">
      <book-mark :color="color" :width="15" :height="35" />
    </div>
  </div>
</template>

<script>
import { ebookMixin } from '@/utils/mixin/ebookMixin'
import { realPx } from '@/utils/utils'
import { getBookmark, saveBookmark } from '@/utils/localStorage'
import BookMark from '@/components/common/BookMark'

const BLUE = '#346cbc'
const WHITE = '#fff'

export default {
  mixins: [ebookMixin],
  data () {
    return {
      text: this.$t('book.pulldownAddMark'),
      color: WHITE,
      isFixed: false
    }
  },
  computed: {
    height () {
      return realPx(35)
    },
    threshold () { // 零界值
      return realPx(55)
    },
    fixedStyle () {
      return {
        position: 'fixed',
        top: 0,
        right: 0
        // right: `${(window.innerWidth - this.$refs.bookmark.clientWidth) / 2}px`
      }
    }
  },
  watch: {
    offsetY (v) {
      // 解决书籍分页未完成时，下拉能够添加书签的bug ⭐
      if (!this.bookAvailable || this.menuVisible || this.settingVisible >= 0) {
        return
      }
      if (v >= this.height && v < this.threshold) {
        this.beforeThreshold(v)
      } else if (v >= this.threshold) {
       this.afterThreshold(v)
      } else if (v > 0 && v < this.height) {
        this.beforeHeight()
      } else if (v === 0) {
        this.restore()
      }
    },
    isBookmark (isBookmark) {
        this.isFixed = isBookmark
      if (isBookmark) {
        this.color = BLUE
      } else {
        this.color = WHITE
      }
    }
  },
  methods: {
    // 状态1 未超过书签的高度
    beforeHeight () {
      if (this.isBookmark) {
        this.text = this.$t('book.pulldownDeleteMark')
        this.color = BLUE
        this.isFixed = true
      } else {
        this.text = this.$t('book.pulldownAddMark')
        this.color = WHITE
        this.isFixed = false
      }
    },
    // 状态2 未达到零界状态
    beforeThreshold (v) {
      this.$refs.bookmark.style.top = `${-v}px`
      let iconDown = this.$refs.iconDown
      this.beforeHeight()
      if (iconDown.style.transform === 'rotate(180deg)') {
        iconDown.style.transform = 'rotate(0deg)'
      }
      this.isFixed = false
    },
    // 状态3 超越零界状态
    afterThreshold (v) {
      this.$refs.bookmark.style.top = `${-v}px`
      if (this.isBookmark) {
        this.text = this.$t('book.releaseDeleteMark')
        this.color = WHITE
        this.isFixed = false
      } else {
        this.text = this.$t('book.releaseAddMark')
        this.color = BLUE
        this.isFixed = true
      }
      let iconDown = this.$refs.iconDown
      if (iconDown.style.transform === '' || iconDown.style.transform === 'rotate(0deg)') {
        iconDown.style.transform = 'rotate(180deg)'
      }
    },
    // 状态4 归位
    restore () {
      setTimeout(() => {
        this.$refs.bookmark.style.top = `${-this.height}px`
        this.$refs.iconDown.style.transform = 'rotate(0deg)'
      }, 200)
      // 固定书签
      if (this.isFixed) {
        this.setIsBookmark(true)
        this.addBookMark()
      } else {
        this.setIsBookmark(false)
        this.removeBookMark()
      }
    },
    // 删除书签
    removeBookMark () {
      let currentLocation = this.currentBook.rendition.currentLocation()
      let cfi = currentLocation.start.cfi
      this.bookmark = getBookmark(this.fileName)
      if (this.bookmark) {
        this.bookmark = this.bookmark.filter(item => item.cfi !== cfi)
        saveBookmark(this.fileName, this.bookmark)
      }
      this.setIsBookmark(false)
    },
    // 增加书签
    addBookMark () {
      this.bookmark = getBookmark(this.fileName)
      if (!this.bookmark) {
        this.bookmark = []
      }
      let currentLocation = this.currentBook.rendition.currentLocation()
      let cfi = currentLocation.start.cfi
      let cfiBase = cfi.replace(/!.*/, '')
      let startCfi = cfi.replace(/.*!/, '').replace(/\)$/, '')
      let endCfi = currentLocation.end.cfi.replace(/.*!/, '').replace(/\)$/, '')

      let cfiRange = `${cfiBase}!,${startCfi},${endCfi})`
      this.currentBook.getRange(cfiRange).then(range => {
        let text = range.toString().replace(/\s\s/g, '') // 替换可能换行的文本
        this.bookmark.push({ cfi, text })
        saveBookmark(this.fileName, this.bookmark)
      })
    }
  },
  components: {
    BookMark
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/scss/global.scss";

.ebook-bookmark {
  position: absolute;
  top: px2rem(-35);
  left: 0;
  z-index: 200;
  width: 100%;
  height: px2rem(35);
  box-sizing: border-box;
  .ebook-bookmark-text-wrapper {
    position: absolute;
    right: px2rem(45);
    bottom: 0;
    display: flex;
    font-size: px2rem(14);
    color: white;
    .ebook-bookmark-down-wrapper {
      transition: all .2s linear;
      @include center;
    }
  }
  .ebook-bookmark-icon-wrapper {
    position: absolute;
    right: 0;
    bottom: 0;
    height: px2rem(35);
    margin-right: px2rem(15);
  }
}
</style>
