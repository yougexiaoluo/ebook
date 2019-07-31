<template>
  <transition name="fade">
    <div class="shelf-title"
         :class="{'hide-shadow': ifHideShadow}"
         v-show="shelfTitleVisible"
    >
      <!-- 标题文本 -->
      <div class="shelf-title-text-wrapper">
        <span class="shelf-title-text">{{ $t('shelf.title') }}</span>
        <span class="shelf-title-sub-text"
              v-show="isEditMode">
          {{ selectedText }}
        </span>
      </div>
      <!-- 标题按钮 -->
      <div class="shelf-title-btn-wrapper shelf-title-left">
        <div class="shelf-title-btn-text" @click="clearCatch">{{ $t('shelf.clearCache') }}</div>
      </div>
      <div class="shelf-title-btn-wrapper shelf-title-right">
        <div class="shelf-title-btn-text" @click="onEditClick">
          {{ isEditMode ? $t('shelf.cancel') : $t('shelf.edit') }}
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { storeShelfMixin } from '@/utils/mixin/ebookMixin'

export default {
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
  methods: {
    onEditClick () {
      if (!this.isEditMode) {
        this.setShelfSelected([]) // 清空选中的书籍列表
        this.shelfList.forEach(item => (item.selected = false)) // 重置选中状态
      }
      this.setIsEditMode(!this.isEditMode)
    },
    // 清除缓存
    clearCatch () {
      console.log('clearCatch')
    }
  },
  computed: {
    selectedText () {
      // 有可能没有选择书籍
      const selectedNumber = this.shelfSelected ? this.shelfSelected.length : 0
      return selectedNumber <= 0 ? this.$t('shelf.selectBook') : (selectedNumber === 1 ? this.$t('shelf.haveSelectedBook').replace('$1', selectedNumber) : this.$t('shelf.haveSelectedBooks').replace('$1', selectedNumber))
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
    background: #fff;
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
      height: 100%;
      box-sizing: border-box;
      @include center;
      .shelf-title-btn-text {
        font-size: px2rem(14);
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
