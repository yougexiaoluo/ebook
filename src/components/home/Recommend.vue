<template>
  <div class="recommend">
    <title-view :label="$t('home.recommend')" :btn="$t('home.seeAll')" @onClick="showBookCategory" />
    <div class="recommend-list">
      <div class="recommend-item" v-for="(item, index) in data" :key="index" @click="showBookDetail(item)">
        <div class="img-wrapper">
          <img class="img" v-lazy="item.cover">
        </div>
        <div class="content-wrapper">
          <div class="title title-medium" ref="title">{{item.title}}</div>
          <div class="num sub-title" ref="num">{{$t('home.readers').replace('$1', item.readers)}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import TitleView from './Title'
  import { storeHomeMixin } from '@/utils/mixin/ebookMixin'
  import { categoryText, getCategoryName } from '@/utils/store'

  export default {
    mixins: [storeHomeMixin],
    components: {
      TitleView
    },
    props: {
      data: Array
    },
   methods: {
      showBookCategory () {
      this.$router.push({
        path: '/store/list',
        query: {
          category: getCategoryName(this.data.category),
          categoryText: this.categoryText(this.data.category)
        }
      })
    },
    categoryText (category) {
      return categoryText(category, this)
    }
   }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '@/assets/styles/scss/global.scss';

  .recommend {
    .recommend-list {
      width: 100%;
      @include top;
      padding: 0 px2rem(5);
      box-sizing: border-box;
      .recommend-item {
        flex: 0 0 33.33%;
        width: 33.33%;
        padding: 0 px2rem(5);
        box-sizing: border-box;
        .img-wrapper {
          @include center;
          .img {
            width: 80%;
          }
        }
        .content-wrapper {
          width: 100%;
          margin-top: px2rem(10);
          @include columnCenter;
          .title,
          .num {
            @include ellipsis2(2);
          }
          .title {
            font-size: px2rem(14);
            text-align: center;
          }
          .num {
            font-size: px2rem(12);
            color: #777;
            margin-top: px2rem(5);
          }
        }
      }
    }
  }
</style>
