<template>
  <div class="store-shelf">
    <shelf-title :title="$t('shelf.title')" />
    <scroll class="store-shelf-scroll-wrapper"
            :top="0"
            :bottom="scrollBottom"
            ref="scroll"
            @onScroll="onScroll">
      <shelf-search />
      <shelf-list :data="shelfList" />
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
  mounted () {
    // 挂在完成之后获取书架列表
    this.getShelfList()
    this.setShelfCategory([])
    this.setCurrentType(1)
  },
  watch: {
    // 监听是否处于编辑模式，如果是真添加底部距离，否则不添加
    isEditMode (isEditMode) {
      this.scrollBottom = isEditMode ? 48 : 0
      // 页面加载完成，再次更新scroll组件的高度
      this.$nextTick(() => {
        this.$refs.scroll.refresh()
      })
    }
  },
  methods: {
    // 监听页面滚动出去的距离
    onScroll (offsetY) {
      this.setOffsetY(offsetY)
    }
  },
  components: {
    Scroll,
    ShelfTitle,
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
