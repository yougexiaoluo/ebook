<template>
  <div class="shelf-footer-wrapper"
       v-show="isEditMode"
  >
    <div class="shelf-footer-tab-wrapper"
         v-for="item in tabs"
         :key="item.index"
         @click="onTabClick(item)"
    >
      <div class="shelf-footer-tab"
           :class="{'is-selected': isSelected}"
      >
        <div class="icon-private tab-icon" v-if="item.index === 1 && !isPrivate"></div>
        <div class="icon-private-see tab-icon" v-if="item.index === 1 && isPrivate"></div>
        <div class="icon-download tab-icon" v-if="item.index === 2 && !isDownload"></div>
        <div class="icon-download tab-icon" v-if="item.index === 2 && isDownload"></div>
        <div class="icon-move tab-icon" v-if="item.index === 3" ></div>
        <!-- 移出书架按钮 -->
        <div class="icon-shelf tab-icon" v-if="item.index === 4"></div>
        <div class="tab-text" :class="{'remove-text': item.index === 4}">{{ label(item) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { storeShelfMixin } from '@/utils/mixin/ebookMixin'
  import { saveBookShelf, removeLocalStorage } from '@/utils/localStorage'
  import { download } from '@/api/store'
  import { removeLocalForage } from '@/utils/localForage'
export default {
  mixins: [storeShelfMixin],
  data () {
    return {
      popupMenu: null
    }
  },
  computed: {
    tabs () {
      return [
        {
          label: this.$t('shelf.private'),
          label2: this.$t('shelf.noPrivate'),
          index: 1
        },
        {
          label: this.$t('shelf.download'),
          label2: this.$t('shelf.delete'),
          index: 2
        },
        {
          label: this.$t('shelf.move'),
          index: 3
        },
        {
          label: this.$t('shelf.remove'),
          index: 4
        }
      ]
    },
    // 改变编辑模式tab栏的opacity
    isSelected () {
      return this.shelfSelected && this.shelfSelected.length > 0
    },
    // 隐私
    isPrivate () {
      if (!this.isSelected) {
        return false
      } else {
        return this.shelfSelected.every(item => item.private)
      }
    },
    // 下载
    isDownload () {
      if (!this.isSelected) {
        return false
      } else {
        return this.shelfSelected.every(item => item.cache)
      }
    }
  },
  methods: {
    onTabClick (item) {
      if (!this.isSelected) {
       return
      }
      switch (item.index) {
        case 1:
          this.showPrivate()
        break
        case 2:
          this.showDownload()
        break
        case 3:
          this.dialog().show()
        break
        case 4:
          this.showRemove()
        break
        default:
        break
      }
    },
    setPrivate () {
      let isPrivate
      if (this.isPrivate) {
        isPrivate = false
      } else {
        isPrivate = true
      }
      this.shelfSelected.forEach(book => {
        book.private = isPrivate
      })
      this.onComplete()
      if (isPrivate) {
        this.simpleToast(this.$t('shelf.setPrivateSuccess'))
      } else {
        this.simpleToast(this.$t('shelf.closePrivateSuccess'))
      }
    },
    // index - 1
    showPrivate () {
      this.popupMenu = this.popup({
      title: this.isPrivate ? this.$t('shelf.closePrivateTitle') : this.$t('shelf.setPrivateTitle'),
      btn: [
        {
          text: this.isPrivate ? this.$t('shelf.close') : this.$t('shelf.open'),
          click: () => {
            this.setPrivate()
          }
        },
        {
          text: this.$t('shelf.cancel'),
          click: () => {
            this.hidePopup()
          }
        }
      ]
      }).show()
    },
    // index - 2
    showDownload () {
      this.popupMenu = this.popup({
      title: this.isDownload ? this.$t('shelf.removeDownloadTitle') : this.$t('shelf.setDownloadTitle'),
      btn: [
        {
          text: this.isDownload ? this.$t('shelf.delete') : this.$t('shelf.open'),
          click: () => {
            this.setDownload()
          }
        },
        {
          text: this.$t('shelf.cancel'),
          click: () => {
            this.hidePopup()
          }
        }
      ]
      }).show()
    },
    async setDownload () {
      this.onComplete()
      if (this.isDownload) {
        // 已经下载完成
        this.removeSelectedBook()
        this.simpleToast(this.$t('shelf.removeDownloadSuccess'))
      } else {
        // 有时候不想一些程序同时执行，可以使用async...await实现
        await this.downloadSelectedBook()
        saveBookShelf(this.shelfList)
        this.simpleToast(this.$t('shelf.setDownloadSuccess'))
      }
    },
    // 下载选中书籍
    async downloadSelectedBook () {
      for (let i = 0, len = this.shelfSelected.length; i < len; i++) {
        // then 是downloadBook成功的回调
        await this.downloadBook(this.shelfSelected[i]).then(book => {
          book.cache = true
        })
      }
      // this.shelfSelected.forEach(book => {
      //   this.downloadBook(book).then(book => {
      //     book.cache = true
      //   })
      // })
    },
    downloadBook (book) {
      let text = ''
      const toast = this.toast({ text })
      toast.continueShow()
      // 下载书籍逻辑
      return new Promise((resolve, reject) => {
        download(book, (res) => {
          // 若出现文本不能正常显示，使用toast.remove()可以解决
          toast.hide() // 隐藏提示文本
          resolve(book)
        }, reject, progressEvent => {
          let progress = Math.floor((progressEvent.loaded / progressEvent.total) * 100) + '%'
          text = this.$t('shelf.progressDownload').replace('$1', `${book.fileName}.epub(${progress})`)
          toast.updateText(text) // 更新提示文本
        })
      })
    },
    // 删除indexDB数据库中的数据
    removeSelectedBook () {
      Promise.all(this.shelfSelected.map(book => this.removeBook(book)))
        .then(books => {
          books.map(book => {
            book.cache = false
          })
        saveBookShelf(this.shelfList)
      })
    },
    removeBook (book) {
      return new Promise((resolve, reject) => {
        removeLocalStorage(`${book.categoryText}/${book.fileName}-info`) // 移除本地缓存
        removeLocalForage(`${book.fileName}`) // 移除离线缓存
        resolve(book)
      })
    },
    // 显示删除按钮
    showRemove () {
      let title
      if (this.shelfSelected.length === 1) {
        title = this.$t('shelf.removeBookTitle').replace('$1', `《${this.shelfSelected[0].title}》`)
      } else {
        title = this.$t('shelf.removeBookTitle').replace('$1', this.$t('shelf.selectedBooks'))
      }
      this.popupMenu = this.popup({
      title,
      btn: [
        {
          text: this.$t('shelf.removeBook'),
          click: () => {
            this.removeSelected()
          }
        },
        {
          text: this.$t('shelf.cancel'),
          click: () => {
            this.hidePopup()
          }
        }
      ]
      }).show()
    },
    removeSelected () {
      this.shelfSelected.forEach(selected => {
        this.setShelfList(this.shelfList.filter(book => book !== selected))
      })
      this.setShelfSelected([])
      this.onComplete()
    },
    label (item) {
      switch (item.index) {
        case 1:
        return this.isPrivate ? item.label2 : item.label
        case 2:
        return this.isDownload ? item.label2 : item.label
        default:
        return item.label
      }
    },
     // 隐藏popu组件
    hidePopup () {
      this.popupMenu.hide()
    },
    onComplete () {
      this.hidePopup()
      this.setIsEditMode(true)
      saveBookShelf(this.shelfList)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/scss/global.scss';

  .shelf-footer-wrapper {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 120;
    display: flex;
    width: 100%;
    height: px2rem(48);
    background: #fff;
    box-shadow: 0 px2rem(-2) px2rem(4) 0 rgba(0, 0, 0, .1);
    .shelf-footer-tab-wrapper {
      flex: 1;
      width: 25%;
      height: 100%;
      .shelf-footer-tab {
        width: 100%;
        height: 100%;
        opacity: .5;
        @include columnCenter;
        &.is-selected {
          opacity: 1;
        }
        .tab-icon {
          font-size: px2rem(20);
          color: #666;
        }
        .icon-shelf {
          color: $color-pink;
        }
        .tab-text {
          color: #666;
          font-size: px2rem(12);
          margin-top: px2rem(5);
          &.remove-text {
            color: $color-pink;
          }
        }
      }
    }
  }
</style>
