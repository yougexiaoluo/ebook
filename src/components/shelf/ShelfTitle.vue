<template>
  <transition name="fade">
    <div class="shelf-title"
         :class="{'hide-shadow': ifHideShadow}"
         v-show="shelfTitleVisible"
    >
      <!-- 标题文本 -->
      <div class="shelf-title-text-wrapper">
        <span class="shelf-title-text">{{ title }}</span>
        <span class="shelf-title-sub-text"
              v-show="isEditMode">
          {{ selectedText }}
        </span>
      </div>
      <!-- 标题按钮 -->
      <div class="shelf-title-btn-wrapper shelf-title-left"
           v-if="showClear"
      >
        <div class="shelf-title-btn-text"
             @click="clearCatch"
        >
             {{ $t('shelf.clearCache') }}
        </div>
      </div>
      <div class="shelf-title-btn-wrapper shelf-title-right" v-if="showEdit">
        <span class="shelf-title-btn-text" @click="onEditClick">
          {{ isEditMode ? $t('shelf.cancel') : $t('shelf.edit') }}
        </span>
      </div>
      <div class="shelf-title-btn-wrapper shelf-title-left"
           v-if="showBack"
      >
        <span class="icon-back" @click="back"></span>
      </div>
      <!-- 修改分组按钮 -->
      <div class="shelf-title-btn-wrapper"
           :class="{ 'shelf-title-left': changeGroupLeft, 'shelf-title-right': changeGroupRight }"
           @click="changeGroup"
           v-if="showChangeGroup"
      >
        <span class="shelf-title-btn-text">{{ $t('shelf.editGroup') }}</span>
      </div>
    </div>
  </transition>
</template>

<script>
import { storeShelfMixin } from '@/utils/mixin/ebookMixin'
import { clearLocalStorage, saveBookShelf } from '@/utils/localStorage'
import { clearLocalForage } from '@/utils/localForage'

export default {
  props: {
    title: String
  },
  mixins: [storeShelfMixin],
  data () {
    return {
      ifHideShadow: true
    }
  },
  watch: {
    offsetY (offsetY) {
      // 显示
      if (offsetY > 0) {
        this.ifHideShadow = false
      } else {
        // 不显示
        this.ifHideShadow = true
      }
    }
  },
  computed: {
    selectedText () {
      // 有可能没有选择书籍
      const selectedNumber = this.shelfSelected ? this.shelfSelected.length : 0
      return selectedNumber <= 0 ? this.$t('shelf.selectBook') : (selectedNumber === 1 ? this.$t('shelf.haveSelectedBook').replace('$1', selectedNumber) : this.$t('shelf.haveSelectedBooks').replace('$1', selectedNumber))
    },
    popupCancelBtn () {
      return this.createPopupBtn(this.$t('shelf.cancel'), () => {
        this.hidePopup()
      })
    },
    showClear () {
      return this.currentType === 1
    },
    showBack () {
      return this.currentType === 2 && !this.isEditMode
    },
    showChangeGroup () {
      return this.currentType === 2 && (this.isEditMode || this.emptyCategory)
    },
    changeGroupLeft () {
      return !this.emptyCategory
    },
    changeGroupRight () {
      return this.emptyCategory
    },
    emptyCategory () {
      return !this.shelfCategory || !this.shelfCategory.itemList || this.shelfCategory.itemList.length === 0
    },
    // 控制编辑按钮
    showEdit () {
      return this.currentType === 1 || !this.emptyCategory
    }
  },
  methods: {
    onEditClick () {
      if (!this.isEditMode) {
        this.setShelfSelected([]) // 清空选中的书籍列表
        this.shelfList.forEach(item => {
          item.selected = false
          if (item.itemList) {
            // itemList category中的数据
            item.itemList.forEach(subItem => {
              subItem.selected = false
            })
          }
        }) // 重置选中状态
      }
      this.setIsEditMode(!this.isEditMode)
    },
    // 修改分组
    changeGroup () {
      this.popupMenu = this.popup({
        btn: [
          this.createPopupBtn(this.$t('shelf.editGroupName'), () => {
            this.changeGroupName()
          }),
          this.createPopupBtn(this.$t('shelf.deleteGroup'), () => {
            this.showDeleteGroup()
          }, 'danger'),
          this.popupCancelBtn
        ]
      }).show()
    },
    changeGroupName () {
      this.hidePopup()
      this.dialog({
        showNewGroup: true,
        groupName: this.shelfCategory.title
      }).show()
    },
    showDeleteGroup () {
      this.hidePopup()
      setTimeout(() => {
        this.popupMenu = this.popup({
          title: this.$t('shelf.deleteGroupTitle'),
          btn: [
            this.createPopupBtn(this.$t('shelf.confirm'), () => {
              this.deleteGroup()
            }, 'danger'),
            this.popupCancelBtn
          ]
        }).show()
      }, 200)
    },
    deleteGroup () {
      if (!this.emptyCategory) {
        this.setShelfSelected(this.shelfCategory.itemList)
        this.moveOutOfGroup(this.onComplete)
      } else {
        this.onComplete()
      }
    },
    onComplete () {
      this.hidePopup()
      this.setShelfList(this.shelfList.filter(book => book.id !== this.shelfCategory.id)).then(() => {
        saveBookShelf(this.shelfList)
        this.$router.go(-1)
        this.setIsEditMode(false)
      })
    },
    createPopupBtn (text, onClick, type = 'normal') {
      return {
        text,
        type,
        click: onClick
      }
    },
    hidePopup () {
      this.popupMenu.hide()
    },
    // 清除缓存
    clearCatch () {
      clearLocalStorage()
      clearLocalForage()
      this.setShelfSelected([])
      this.setShelfList([])
      this.getShelfList()
      this.simpleToast(this.$t('shelf.clearCacheSuccess'))
    },
    // 回退上一个路由
    back () {
      this.$router.go(-1)
      this.setIsEditMode(false)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "@/assets/styles/scss/global.scss";

  .shelf-title {
    position: relative;
    z-index: 130;
    width: 100%;
    height: px2rem(42);
    background: white;
    box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);
    &.hide-shadow {
      box-shadow: none;
    }
    .shelf-title-text-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: px2rem(42);
      @include columnCenter;
      .shelf-title-text {
        font-size: px2rem(16);
        line-height: px2rem(20);
        font-weight: bold;
        color: #333;
      }
      .shelf-title-sub-text {
        font-size: px2rem(10);
        color: #333;
      }
    }
    .shelf-title-btn-wrapper {
      position: absolute;
      top: 0;
      box-sizing: border-box;
      height: 100%;
      @include center;
      .shelf-title-btn-text {
        font-size: px2rem(14);
        color: #666;
      }
      .icon-back {
        font-size: px2rem(20);
        color: #666;
      }
      &.shelf-title-left {
        left: 0;
        padding-left: px2rem(15);
      }
      &.shelf-title-right {
        right: 0;
        padding-right: px2rem(15);
      }
    }
  }
</style>
