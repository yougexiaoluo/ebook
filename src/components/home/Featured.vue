<template>
  <div class="featured">
    <title-view :label="titleText" :btn="btnText" v-if="titleVisible && data && data.length > 0" @onClick="showBookCategory" />
    <div class="featured-list">
      <div class="featured-item-wrapper">
        <div class="featured-item" v-for="(item, index) in data"
             :key="index"
             @click="showBookDetail(item)"
        >
          <div class="img-wrapper">
            <img class="img" :src="item.cover">
          </div>
          <div class="content-wrapper">
            <div class="title title-small" ref="title">{{item.title}}</div>
            <div class="author sub-title-tiny" ref="author">{{item.author}}</div>
            <div class="category third-title-tiny" ref="category">{{categoryText(item.category)}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import TitleView from './Title'
  import { realPx } from '@/utils/utils'
  import { storeHomeMixin } from '@/utils/mixin/ebookMixin'
  import { categoryText, getCategoryName } from '@/utils/store'

  export default {
    mixins: [storeHomeMixin],
    components: {
      TitleView
    },
    props: {
      data: Array,
      titleVisible: {
        type: Boolean,
        default: true
      },
      titleText: {
        type: String
      },
      btnText: {
        type: String
      }
    },
    computed: {
      width () {
        return window.innerWidth - realPx(20) - realPx(60) + 'px'
      }
    },
    methods: {
      resize () {
        this.$nextTick(() => {
          this.$refs.title.forEach(item => {
            item.style.width = this.width
          })
          this.$refs.author.forEach(item => {
            item.style.width = this.width
          })
          this.$refs.category.forEach(item => {
            item.style.width = this.width
          })
        })
      },
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

<style lang="scss" scoped>
  @import '@/assets/styles/scss/global.scss';

  .featured {
    .featured-list {
      width: 100%;
      padding: 0 px2rem(10);
      box-sizing: border-box;
      .featured-item-wrapper {
        width: 100%;
        display: flex;
        flex-flow: row wrap;
        justify-content: flex-start;
        align-items: flex-start;
        .featured-item {
          flex: 0 0 50%;
          width: 50%;
          padding: px2rem(5) 0;
          @include top;
          .img-wrapper {
            flex: 0 0 30%;
            width: 30%;
            .img {
              width: 100%;
            }
          }
          .content-wrapper {
            flex: 1;
            width: px2rem(117.5);
            padding: 0 px2rem(5);
            box-sizing: border-box;
             .title {
              font-size: px2rem(16);
              @include ellipsis;
            }
            .author,
            .category {
              color: #777;
              font-size: px2rem(13);
              @include ellipsis;
            }
            .author {
              margin-top: px2rem(15);
            }
            .category {
              margin-top: px2rem(5);
            }
          }
        }
      }
    }
  }
</style>
