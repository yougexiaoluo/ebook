<template>
  <div class="store-home">
    <search-bar />
    <flap-card :data="random"/>
    <scroll :top="scrollTop"
            @onScroll="onScroll"
            ref="scroll"
    >
     <div class="banner-img-wrapper">
       <swiper ref="swiperOption"
               :options="swiperOption"
               v-if="banner.length > 0">
        <swiper-slide class="banner-img"
                      v-for="item in banner"
                      :key="item._id"
                      :style="{'backgroundImage': `url(${item.pic_url})`}">
        </swiper-slide>
      </swiper>
      <div class="swiper-pagination"></div>
     </div>
     <guess-you-like :data="guessYouLike" class="guess-you-like" />
     <recommend :data="recommend" class="recommend" />
     <featured :data="featured"
               :titleText="$t('home.featured')"
               :btnText="$t('home.seeAll')"
               class="featured"
      />
     <div class="category-list-wrapper"
          v-for="(item, index) in categoryList"
          :Key="index"
     >
      <category-book :data="item" class="category-book" />
     </div>
      <category :data="categories" />
    </scroll>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { storeHomeMixin } from '@/utils/mixin/ebookMixin'
import { home } from '@/api/store'
import SearchBar from '@/components/home/SearchBar'
import FlapCard from '@/components/home/FlapCard'
import Scroll from '@/components/common/Scroll'
import GuessYouLike from '@/components/home/GuessYouLike'
import Recommend from '@/components/home/Recommend'
import Featured from '@/components/home/Featured'
import CategoryBook from '@/components/home/CategoryBook'
import Category from '@/components/home/Category'

import 'swiper/dist/css/swiper.css'

export default {
  mixins: [storeHomeMixin],
  data () {
    return {
      scrollTop: 94,
      random: null,
      banner: '',
      guessYouLike: null,
      recommend: null,
      featured: null,
      categoryList: null,
      categories: null,
      swiperOption: {
        loop: true, // 需要在swiper-container上添加一个判断 v-if
        autoplay: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      }
    }
  },
  created () {
    home().then(response => {
      if (response && response.status === 200) {
        const data = response.data
        const randomIndex = Math.floor(Math.random() * data.random.length)
        this.random = data.random[randomIndex]
        this.banner = data.banner
        this.guessYouLike = data.guessYouLike
        this.recommend = data.recommend
        this.featured = data.featured
        this.categoryList = data.categoryList
        this.categories = data.categories
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
    },
    callback () {}
  },
  components: {
    SearchBar,
    FlapCard,
    Scroll,
    GuessYouLike,
    Recommend,
    Featured,
    CategoryBook,
    Category,
    swiper,
    swiperSlide
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/scss/global.scss';

  .store-home {
    width: 100%;
    height: 100%;
    background: #fff;
    .banner-img-wrapper {
      width: 100%;
      box-sizing: border-box;
      padding: px2rem(10);
      position: relative;
      .banner-img {
        width: 100%;
        height: px2rem(150);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        &:last-child {
          border-top-right-radius: px2rem(5);
          border-bottom-right-radius: px2rem(5);
        }
        &:first-child {
          border-top-left-radius: px2rem(5);
          border-bottom-left-radius: px2rem(5);
        }
      }
      .swiper-container {
        border-radius: px2rem(5);
      }
      .swiper-pagination {
        position: absolute;
        bottom: px2rem(10);
        left: 50%;
        transform: translateX(-50%);
        &.swiper-pagination-bullet-active {
          background: orange !important;
        }
      }
    }
    .guess-you-like,
    .recommend,
    .featured,
    .category-book {
      margin-bottom: px2rem(20);
    }
  }
</style>
