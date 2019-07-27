<template>
  <div class="store-home">
    <search-bar />
    <scroll :top="scrollTop"
            @onScroll="onScroll"
            ref="scroll"
    >
      <div>aaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
      <div>aaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
      <div>aaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
      <div>aaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
      <div>aaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
      <div>aaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
      <div>aaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
      <div>aaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
      <div>aaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
      <div>aaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
      <div>aaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
      <div>aaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
      <div>aaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
      <div>aaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
      <div>aaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
      <div>aaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
      <div>aaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
      <div>aaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
      <div>aaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
      <div>aaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
      <div>aaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
    </scroll>
  </div>
</template>

<script>
import SearchBar from '@/components/home/SearchBar'
import Scroll from '@/components/common/Scroll'
import { storeHomeMixin } from '@/utils/mixin/ebookMixin'

export default {
  mixins: [storeHomeMixin],
  data () {
    return {
      scrollTop: 94
    }
  },
  methods: {
    // 只是做设置offsetY的坐标
    onScroll (offsetY) {
      this.setOffsetY(offsetY)
      if (this.offsetY > 0) {
        this.scrollTop = 52
      } else {
        this.scrollTop = 94
      }
      // 如上设置之后滚动条不会更新问题，需要重新计算滚动条高度
      this.$refs.scroll.refresh()
    }
  },
  components: {
    SearchBar,
    Scroll
  }
}
</script>

<style lang="scss" scoped>
  .store-home {
    width: 100%;
    height: 100%;
    background: #fff;
  }
</style>
