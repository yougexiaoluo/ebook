<template>
  <transition name="popup-slide-up">
    <div class="ebook-popup-list"
        v-show="fontFamilyVisible"
    >
      <div class="ebook-popup-title">
        <div class="ebook-popup-icon"
            @click="hide"
        >
          <span class="icon-down2"></span>
        </div>
        <span class="ebook-popup-text">选择字体</span>
      </div>
      <div class="ebook-popup-list-wrapper">
        <div class="ebook-popup-item"
             v-for="(item, index) in fontFamilyList"
             :key="index"
             @click="setFontFamily(item.font)"
        >
          <div class="ebook-popup-item-text"
               :class="{selected: isSelected(item)}"
          >
            {{item.font}}
          </div>
          <div class="ebook-popup-item-check"
               :class="{selected: isSelected(item)}"
               v-if="isSelected(item)"
          >
            <span class="icon-check"></span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { FONT_FAMILY_LIST } from '@/utils/book'
import { ebookMixin } from '@/utils/mixin/ebookMixin'
import { saveFontFamily } from '@/utils/localStorage'

export default {
  data () {
    return {
      fontFamilyList: FONT_FAMILY_LIST
    }
  },
  mixins: [ebookMixin],
  methods: {
    hide () {
      this.setFontFamilyVisible(false)
    },
    isSelected (item) { // 设置默认font-family
      return this.defaultFontFamily === item.font
    },
    setFontFamily (font) {
      if (font === 'Default') {
        this.currentBook.rendition.themes.font('Times New Roma')
      } else {
        this.currentBook.rendition.themes.font(font)
      }
      this.setDefaultFontFamily(font)
      saveFontFamily(this.fileName, font)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/scss/global.scss';

  .ebook-popup-list {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 300;
    width: 100%;
    background: white;
    box-shadow: 0 px2rem(-4) px2rem(6) rgba(0,0,0,.1);
    .ebook-popup-title {
      position: relative;
      padding: px2rem(15);
      box-sizing: border-box;
      border-bottom: px2rem(1) solid #b8b9bb;
      text-align: center;
      @include center;
      .ebook-popup-icon {
        position: absolute;
        top: 0;
        left: px2rem(15);
        height: 100%;
        font-size: px2rem(16);
        font-weight: bold;
        @include center;
      }
      .ebook-popup-text {
        font-size: px2rem(14);
        font-weight: bold;
      }
    }
    .ebook-popup-list-wrapper {
      .ebook-popup-item {
        display: flex;
        padding: px2rem(15);
        .ebook-popup-item-text {
          flex: 1;
          font-size: px2rem(14);
          text-align: left;
          &.selected {
            font-weight: bold;
            color: yellowgreen;
          }
        }
        .ebook-popup-item-check {
          flex: 1;
          text-align: right;
          color: yellowgreen;
          font-size: px2rem(14);
          font-weight: bold;
        }
      }
    }
  }
</style>
