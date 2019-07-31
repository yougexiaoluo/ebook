<template>
  <div class="store-shelf">
    <shelf-title />
    <scroll class="store-shelf-scroll-wrapper"
            :top="0"
            :bottom="scrollBottom"
            ref="scroll"
            @onScroll="onScroll">
      <shelf-search />
      <shelf-list />
    </scroll>
    <shelf-footer />
  </div>
</template>

<script>
import { storeShelfMixin } from '@/utils/mixin/ebookMixin'
import ShelfTitle from '@/components/shelf/ShelfTitle'
import Scroll from '@/components/common/Scroll'
import ShelfSearch from '@/components/shelf/ShelfSearch'
import ShelfList from '@/components/shelf/ShelfList'
import ShelfFooter from '@/components/shelf/ShelfFooter'

export default {
  mixins: [storeShelfMixin],
  data () {
    return {
      scrollBottom: 0
    }
  },
  watch: {
    // 监听是否处于编辑模式，如果是真添加底部距离，否则不添加
    isEditMode (isEditMode) {
      this.scrollBottom = isEditMode ? 48 : 0
      this.$nextTick(() => {
        this.$refs.scroll.refresh()
      })
    }
  },
  methods: {
    onScroll (offsetY) {
      this.setOffsetY(offsetY)
    }
  },
  components: {
    ShelfTitle,
    Scroll,
    ShelfSearch,
    ShelfList,
    ShelfFooter
  }
}
</script>

<style lang="scss" scoped>
  @import "@/assets/styles/scss/global.scss";

  .store-shelf {
    width: 100%;
    height: 100%;
    background: #fff;
    .store-shelf-scroll-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 100;
    }
  }
</style>
