<template>
  <div class="store-home">
    <search-bar />
    <flap-card :data="random"/>
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
import FlapCard from '@/components/home/FlapCard'
import Scroll from '@/components/common/Scroll'
import { storeHomeMixin } from '@/utils/mixin/ebookMixin'
import { home } from '@/api/store.js'

export default {
  mixins: [storeHomeMixin],
  data () {
    return {
      scrollTop: 94,
      random: null
    }
  },
  mounted () {
    home().then(response => {
      if (response && response.status === 200) {
        const data = response.data
        const randomIndex = Math.floor(Math.random() * data.random.length)
        this.random = data.random[randomIndex]
      }
    })
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
    FlapCard,
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
