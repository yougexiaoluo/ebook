<template>
  <div>
    <div class="search-bar"
      :class="{'hidd-title': !titleVisible, 'hide-shadow': !shadowVisible}"
    >
      <transition name="title-move">
        <div class="search-bar-title-wrapper"
             v-show="titleVisible"
        >
          <div class="title-text-wrapper">
            <span class="title-text title">{{ $t('home.title') }}</span>
          </div>
          <div class="title-icon-shake-wrapper" @click="showFlapCard">
            <span class="icon-shake icon"></span>
          </div>
        </div>
      </transition>
      <div class="title-icon-back-wrapper"
           :class="{'hide-title': !titleVisible}"
           @click="back"
      >
        <span class="icon-back icon"></span>
      </div>
      <div class="search-bar-input-wrapper"
           :class="{'hide-title': !titleVisible}"
      >
        <div class="serarch-bar-input-blank"
             :class="{'hide-title': !titleVisible}"
        ></div>
        <div class="search-input-bar">
          <span class="icon-search icon"></span>
          <input type="text"
                 :placeholder="$t('home.hint')"
                 v-model="searchText"
                 @click="showHotSearch"
          >
        </div>
      </div>
    </div>
    <hot-search-list v-show="hideHotSearchVisible"  ref="hotSearch"/>
  </div>
</template>

<script>
import { storeHomeMixin } from '@/utils/mixin/ebookMixin'
import HotSearchList from './HotSearchList'

export default {
  mixins: [storeHomeMixin],
  data () {
    return {
      searchText: '',
      titleVisible: true,
      shadowVisible: false,
      hideHotSearchVisible: false
    }
  },
  watch: {
    // 监听offsetY的变化
    offsetY () {
      if (this.offsetY > 0) {
        this.hideTitle()
        this.showShadow()
      } else {
        this.showTitle()
        this.hideShadow()
      }
    },
    hotSearchOffsetY (offsetY) {
      if (offsetY > 0) {
        this.showShadow()
      } else {
        this.hideShadow()
      }
    }
  },
  methods: {
    // 标题
    hideTitle () {
      this.titleVisible = false
    },
    showTitle () {
      this.titleVisible = true
    },
    // 阴影
    hideShadow () {
      this.shadowVisible = false
    },
    showShadow () {
      this.shadowVisible = true
    },
    // 热搜索
    hideHotSearch () {
      this.hideHotSearchVisible = false
      if (this.offsetY > 0) {
        this.hideTitle()
        this.showShadow()
      } else {
        this.showTitle()
        this.hideShadow()
      }
    },
    showHotSearch () {
      if (this.titleVisible) {
        this.hideShadow()
      }
      this.hideTitle()
      this.hideHotSearchVisible = true
      // dom更新完之后执行
      this.$nextTick(() => {
        this.$refs.hotSearch.reset()
      })
    },
    // 返回按钮
    back () {
      if (this.offsetY > 0) {
        this.showShadow()
      } else {
        this.hideShadow()
      }
      this.hideHotSearch()
      this.showTitle()
    },
    // 随机推荐
    showFlapCard () {
      this.setFlapCardVisible(true)
    }
  },
  components: {
    HotSearchList
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/scss/global.scss';

  .search-bar {
    position: relative;
    width: 100%;
    height: px2rem(94);
    box-sizing: border-box;
    box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);
    z-index: 200;
    &.hidd-title {
      height: px2rem(52);
    }
    &.hide-shadow {
      box-shadow: none;
    }
    .search-bar-title-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: px2rem(42);
      .title-text-wrapper {
        width: 100%;
        height: px2rem(42);
        @include center;
      }
      .title-icon-shake-wrapper {
        position: absolute;
        right: px2rem(15);
        top: 0;
        height: px2rem(42);
        @include center;
      }
    }
    .title-icon-back-wrapper {
      position: absolute;
      left: px2rem(15);
      top: 0;
      z-index: 160;
      height: px2rem(42);
      @include center;
      transition: height $animationTime $animationType;
      &.hide-title {
        height: px2rem(52);
      }
    }
    .search-bar-input-wrapper {
      display: flex;
      position: absolute;
      top: px2rem(42);
      left: 0;
      width: 100%;
      height: px2rem(52);
      box-sizing: border-box;
      padding: px2rem(10);
      z-index: 150;
      transition: all $animationTime $animationType;
      &.hide-title {
        top: 0;
      }
      .serarch-bar-input-blank {
        flex: 0 0 0;
        width: 0;
        transition: all $animationTime $animationType;
        &.hide-title {
          flex: 0 0 px2rem(31);
          width: px2rem(31);
        }
      }
      .search-input-bar {
        flex: 1;
        width: 100%;
        background: #f4f4f4;
        box-sizing: border-box;
        border-radius: px2rem(20);
        border: px2rem(1) solid #eee;
        padding: px2rem(5) px2rem(15);
        @include left;
        .icon-search {
          color: #999;
        }
        input {
          width: 100%;
          height: px2rem(22);
          background: transparent;
          border: 0 none;
          color: #666;
          font-size: px2rem(12);
          margin-left: px2rem(10);
          &:focus {
            outline: none;
          }
          &::-webkit-input-placeholder {
            color: #bbb;
          }
        }
      }
    }
  }
</style>
