<template>
  <div class="book-detail">
    <detail-title @back="back"
                  :showShelf="true"
                  ref="title" />
    <scroll class="content-wrapper"
            :top="42"
            :bottom="52"
            @onScroll="onScroll"
            ref="scroll">
      <!-- 书籍基本信息 -->
      <book-info :cover="cover"
                 :title="title"
                 :author="author"
                 :desc="desc" />
      <!-- 版权 -->
      <div class="book-detail-content-wrapper">
        <div class="book-detail-content-title">{{ $t('detail.copyright') }}</div>
        <div class="book-detail-content-list-wrapper">
          <div class="book-detail-content-row">
            <div class="book-detail-content-label">{{ $t('detail.publisher') }}</div>
            <div class="book-detail-content-text">{{ publisher }}</div>
          </div>
          <div class="book-detail-content-row">
            <div class="book-detail-content-label">{{ $t('detail.category') }}</div>
            <div class="book-detail-content-text">{{ categoryText }}</div>
          </div>
          <div class="book-detail-content-row">
            <div class="book-detail-content-label">{{ $t('detail.lang') }}</div>
            <div class="book-detail-content-text">{{ lang }}</div>
          </div>
          <div class="book-detail-content-row">
            <div class="book-detail-content-label">{{ $t('detail.ISBN') }}</div>
            <div class="book-detail-content-text">{{ isbn }}</div>
          </div>
        </div>
      </div>
      <!-- 书籍目录 -->
      <div class="book-detail-content-wrapper">
        <div class="book-detail-content-title">{{ $t('detail.navigation') }}</div>
        <div class="book-detail-content-list-wrapper">
          <div class="loading-text-wrapper" v-if="!this.navigation">
            <span class="loading-text">{{ $t('detail.loading') }}</span>
          </div>
          <div class="book-detail-content-item-wrapper">
            <div class="book-detail-content-item"
                 v-for="(item, index) in flatNavigation"
                 :key="index"
                 @click="read(item)">
              <div class="book-detail-content-navigation-text"
                   :class="{'is-sub': item.deep > 1}"
                   :style="itemStyle(item)"
                   v-if="item.label">
                {{ item.label }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 试读区域 -->
      <div class="book-detail-content-wrapper">
        <div class="book-detail-content-title">{{$t('detail.trial')}}</div>
        <!-- loading -->
        <div class="book-detail-content-list-wrapper">
          <div class="loading-text-wrapper" v-if="!this.displayed">
            <span class="loading-text">{{ $t('detail.loading') }}</span>
          </div>
        </div>
        <!-- 试读文本容器 -->
        <div id="preview" v-show="this.displayed" ref="preview"></div>
      </div>
    </scroll>
    <div class="bottom-wrapper">
      <div class="bottom-btn" @click.stop.prevent="readBook">{{ $t('detail.read') }}</div>
      <div class="bottom-btn" @click.stop.prevent="trialListening">{{ $t('detail.listen') }}</div>
      <div class="bottom-btn" @click.stop.prevent="addOrRemoveShelf">
        <span class="icon-check" v-if="inBookShelf"></span>
        {{inBookShelf ? $t('detail.isAddedToShelf') : $t('detail.addOrRemoveShelf')}}
      </div>
    </div>
    <toast :text="toastText" ref="toast" />
  </div>
</template>

<script>
  import DetailTitle from '@/components/detail/DetaiTitle'
  import BookInfo from '@/components/detail/BookInfo'
  import Scroll from '@/components/common/Scroll'
  import Toast from '@/components/common/Toast'
  import { detail } from '@/api/store'
  import { px2rem, realPx } from '@/utils/utils'
  import { getLocalForage } from '@/utils/localForage'
  import { removeFromBookShelf, addToShelf } from '@/utils/store'
  import { storeShelfMixin } from '@/utils/mixin/ebookMixin'
  import { getBookShelf, saveBookShelf } from '@/utils/localStorage'
  import Epub from 'epubjs'

  global.ePub = Epub

  export default {
    mixins: [storeShelfMixin],
    data () {
      return {
        bookItem: null,
        book: null,
        metadata: null,
        trialRead: null,
        cover: null,
        navigation: null,
        displayed: false,
        audio: null,
        randomLocation: null,
        description: null,
        toastText: '',
        trialText: null,
        categoryText: null,
        opf: null
      }
    },
    mounted () {
      this.init()
      if (!this.shelfList || this.shelfList.length === 0) {
        this.getShelfList()
      }
    },
    computed: {
      desc () {
        if (this.description) {
          // 书籍描述
          return this.description.substring(0, 80)
        } else {
          return ''
        }
      },
      flatNavigation () {
        if (this.navigation) {
          return Array.prototype.concat.apply([], Array.prototype.concat.apply([], this.doFlatNavigation(this.navigation.toc)))
        } else {
          return []
        }
      },
      lang () {
        return this.metadata ? this.metadata.language : '-'
      },
      isbn () {
        return this.metadata ? this.metadata.identifier : '-'
      },
      publisher () {
        return this.metadata ? this.metadata.publisher : '-'
      },
      title () {
        return this.metadata ? this.metadata.title : ''
      },
      author () {
        return this.metadata ? this.metadata.creator : ''
      },
      // 处理书籍是否已经存在书架中
      inBookShelf () {
        if (this.bookItem && this.shelfList) {
          const flatShelf = (function flatten (arr) {
            return [].concat(...arr.map(v => v.itemList ? [v, ...flatten(v.itemList)] : v))
          })(this.shelfList).filter(item => item.type === 1)
          const book = flatShelf.filter(item => item.fileName === this.bookItem.fileName)
          return book && book.length > 0
        } else {
          return false
        }
      }
    },
    methods: {
      // 添加书籍到书架/移除
      addOrRemoveShelf () {
        if (this.inBookShelf) { // 先删除，再保存
          this.setShelfList(removeFromBookShelf(this.bookItem)).then(() => {
            saveBookShelf(this.shelfList)
          })
        } else { // 直接追加
          addToShelf(this.bookItem)
          this.setShelfList(getBookShelf())
        }
      },
      showToast (text) {
        this.toastText = text
        this.$refs.toast.show()
      },
      // 跳转到阅读器
      readBook () {
        this.$router.push({
          path: `/ebook/${this.bookItem.categoryText}|${this.fileName}`
        })
      },
      // 听书功能
      trialListening () {
        // 从获取indexDB相应数据
        getLocalForage(this.bookItem.fileName, (err, blob) => {
          // 已离线缓存
          if (!err && blob && blob instanceof Blob) {
            this.$router.push({
              path: '/store/speaking',
              query: {
                fileName: this.bookItem.fileName
              }
            })
          } else { // 没有离线缓存
            this.$router.push({
              path: '/store/speaking',
              query: {
                fileName: this.bookItem.fileName,
                opf: this.opf
              }
            })
          }
        })
      },
      read (item) {
        this.$router.push({
          path: `/ebook/${this.categoryText}|${this.fileName}`
        })
      },
      itemStyle (item) {
        return {
          marginLeft: (item.deep - 1) * px2rem(20) + 'rem'
        }
      },
      doFlatNavigation (content, deep = 1) {
        const arr = []
        content.forEach(item => {
          item.deep = deep
          arr.push(item)
          if (item.subitems && item.subitems.length > 0) {
            arr.push(this.doFlatNavigation(item.subitems, deep + 1))
          }
        })
        return arr
      },
      // 下载电子书
      downloadBook () {
        const opf = `${process.env.VUE_APP_EPUB_URL}/${this.bookItem.categoryText}/${this.bookItem.fileName}/OEBPS/package.opf`
        this.parseBook(opf)
      },
      // 加载完成获取标题、书籍描述、目录等基本信息
      parseBook (url) {
        this.book = new Epub(url)
        // metadata返回的一个Promise对象
        this.book.loaded.metadata.then(metadata => {
          this.metadata = metadata
        })
        // 获取可试读的书籍数据，并将以显示
        this.book.loaded.navigation.then(nav => {
          this.navigation = nav
          if (this.navigation.toc && this.navigation.toc.length > 1) {
            const candisplay = this.display(this.navigation.toc[1].href)
            if (candisplay) {
              candisplay.then(section => {
                if (this.$refs.scroll) {
                  this.$refs.scroll.refresh()
                }
                this.displayed = true
                const reg = new RegExp('<.+?>', 'g')
                const text = section.output.replace(reg, '').replace(/\s\s/g, '')
                this.description = text
              })
            }
          }
        })
      },
      // 初始化书籍详情
      init () {
        // 获取书籍名称以及分类，拼接成路径
        this.fileName = this.$route.query.fileName
        this.categoryText = this.$route.query.category
        if (this.fileName) {
          detail({
            fileName: this.fileName
          }).then(response => {
            if (response.status === 200 && response.data.error_code === 0 && response.data.data) {
              const data = response.data.data
              this.bookItem = data
              this.cover = this.bookItem.cover
              let rootFile = data.rootFile // 获取xxx.opf路径
              // 有可能出现以/开头的.opf路径,进行字符串裁切
              if (rootFile.startsWith('/')) {
                rootFile = rootFile.substring(1, rootFile.length)
              }
              this.opf = `${process.env.VUE_APP_EPUB_OPF_URL}/${this.fileName}/${rootFile}`
              this.parseBook(this.opf)
            } else {
              this.showToast(response.data.msg)
            }
          })
        }
      },
      back () {
        this.$router.go(-1)
      },
      // 显示内容
      display (location) {
        if (this.$refs.preview) {
          if (!this.rendition) {
            this.rendition = this.book.renderTo('preview', {
              width: window.innerWidth > 640 ? 640 : window.innerWidth,
              height: window.innerHeight,
              method: 'default'
            })
          }
          if (!location) {
            return this.rendition.display()
          } else {
            return this.rendition.display(location)
          }
        }
      },
      onScroll (offsetY) {
        if (offsetY > realPx(42)) {
          this.$refs.title.showShadow()
        } else {
          this.$refs.title.hideShadow()
        }
      }
    },
    components: {
      DetailTitle,
      Scroll,
      BookInfo,
      Toast
    }
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/styles/scss/global.scss";

  .book-detail {
    width: 100%;
    background: white;
    .content-wrapper {
      width: 100%;
      .book-detail-content-wrapper {
        width: 100%;
        border-bottom: px2rem(1) solid #eee;
        box-sizing: border-box;
        .book-detail-content-title {
          font-size: px2rem(20);
          font-weight: bold;
          padding: px2rem(20) px2rem(15) px2rem(10) px2rem(15);
          box-sizing: border-box;
        }
        .book-detail-content-list-wrapper {
          padding: px2rem(10) px2rem(15);
          box-sizing: border-box;
          .loading-text-wrapper {
            width: 100%;
            .loading-text {
              font-size: px2rem(14);
              color: #666;
            }
          }
          .book-detail-content-row {
            display: flex;
            box-sizing: border-box;
            margin-bottom: px2rem(10);
            .book-detail-content-label {
              flex: 0 0 px2rem(70);
              font-size: px2rem(14);
              color: #666;
            }
            .book-detail-content-text {
              flex: 1;
              font-size: px2rem(14);
              color: #333;
            }
          }
          .book-detail-content-item-wrapper {
            .book-detail-content-item {
              padding: px2rem(15) 0;
              font-size: px2rem(14);
              line-height: px2rem(16);
              color: #666;
              border-bottom: px2rem(1) solid #eee;
              &:last-child {
                border-bottom: none;
              }
              .book-detail-content-navigation-text {
                width: 100%;
                @include ellipsis;
                &.is-sub {
                  color: #666;
                }
              }
            }
          }
        }
      }
      .audio-wrapper {
        width: 100%;
        padding: px2rem(15);
        box-sizing: border-box;
        #audio {
          width: 100%;
        }
      }
    }
    .bottom-wrapper {
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 120;
      display: flex;
      width: 100%;
      height: px2rem(52);
      box-shadow: 0 px2rem(-2) px2rem(2) rgba(0, 0, 0, .1);
      .bottom-btn {
        flex: 1;
        color: $color-blue;
        font-weight: bold;
        font-size: px2rem(14);
        @include center;
        &:active {
          color: $color-blue-transparent;
        }
        .icon-check {
          margin-right: px2rem(5);
        }
      }
      &.hide-shadow {
        box-shadow: none;
      }
    }
  }
</style>
