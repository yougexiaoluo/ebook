<template>
  <div class="store-shelf">
    <shelf-title :title="shelfCategory.title" />
    <scroll class="store-shelf-scroll-wrapper"
            :top="0"
            :bottom="scrollBottom"
            ref="scroll"
            @onScroll="onScroll"
            v-if="isShowList"
    >
      <shelf-list :top="42" :data="shelfCategory.itemList" />
    </scroll>
    <div class="store-shelf-empty-view" v-else>
      {{ $t('shelf.groupNone') }}
    </div>
    <shelf-footer />
  </div>
</template>

<script>
import { storeShelfMixin } from '@/utils/mixin/ebookMixin'
import ShelfTitle from '@/components/shelf/ShelfTitle'
import Scroll from '@/components/common/Scroll'
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
  mounted () {
    // 挂在完成之后获取分组列表数据
    this.getCategoryList(this.$route.query.title)
    // 设置书架类型
    this.setCurrentType(2)
  },
  computed: {
    isShowList () {
      return this.shelfCategory.itemList && this.shelfCategory.itemList.length > 0
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
    .store-shelf-empty-view {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #fff;
      font-size: px2rem(14);
      color: #333;
      @include center;
    }
  }
</style>
