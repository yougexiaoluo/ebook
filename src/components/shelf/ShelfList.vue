<template>
  <div class="shelf-list" :style="{ 'top': shelfListTop }">
    <transition-group name="list" tag="div" id="shelf-list">
      <div class="shelf-list-item-wrapper"
           v-for="item in data"
           :key="item.id"
           :data-key="item.id"
      >
        <shelf-item :data="item" :style="{height: itemHeight}" />
        <div class="shelf-list-title-wrapper">
          <span class="shelf-list-title title-small">{{ item.title }}</span>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import ShelfItem from './ShelfItem'
import { storeShelfMixin } from '@/utils/mixin/ebookMixin'
import { realPx, px2rem } from '@/utils/utils'

export default {
  mixins: [storeShelfMixin],
  props: {
    top: {
      type: Number,
      default: 94
    },
    data: Array
  },
  computed: {
    // 自适应高度
    itemHeight () {
      // w / 250 = h / 350
      // h = w / 250 * 350
      return ((window.innerWidth - realPx(120)) / 3) / 250 * 350 + 'px'
    },
    shelfListTop () {
      return px2rem(this.top) + 'rem'
    }
  },
  components: {
    ShelfItem
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/scss/global.scss';
  @import '@/assets/styles/scss/home.scss';

  .shelf-list {
    position: absolute;
    left: 0;
    z-index: 100;
    width: 100%;
    #shelf-list {
      display: flex;
      flex-flow: row wrap;
      width: 100%;
      box-sizing: border-box;
      padding: 0 px2rem(15);
      .shelf-list-item-wrapper {
        &.list-leave-active {
          display: none;
        }
        &.list-move {
          transition: transform .2s;
        }
        flex: 0 0 33.33%;
        width: 33.33%;
        box-sizing: border-box;
        padding: px2rem(15);
        .shelf-list-title-wrapper {
          margin-top: px2rem(10);
        }
      }
    }
  }
</style>
