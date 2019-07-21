<template>
  <div class="ebook-slide-contents">
    <div class="slide-contents-search-wrapper">
      <div class="slide-contents-search-input-wrapper">
        <div class="slide-contents-search-icon">
          <span class="icon-search"></span>
        </div>
        <input type="text"
               class="slide-contents-search-input"
               :placeholder="$t('book.searchHint')"
               v-model="searchText"
               @click="showSearchPage"
               @keyup.enter.exact="search"
        />
      </div>
      <div class="slide-contents-search-cancel"
           v-if="searchVisible"
           @click="hideSearchPage"
      >
        {{ $t('book.cancel') }}
      </div>
    </div>
    <div class="slide-contents-book-wrapper"
         v-show="!searchVisible"
    >
      <div class="slide-contents-book-img-wrapper">
        <img :src="cover"
             class="slide-contents-book-img"
        />
      </div>
      <div class="slide-contents-book-infos-wrapper">
        <div class="slide-contents-book-title">{{ metadata.title }}</div>
        <div class="slide-contents-book-author">{{ metadata.creator }}</div>
      </div>
      <div class="slide-contents-book-progress-wrapper">
        <div class="slide-contents-book-progress">
          <span class="progress">
            {{ progress + "%" }}
          </span>
          <span class="progress-text">
            {{ $t("book.haveRead2") }}
          </span>
        </div>
        <div class="slide-contents-book-time">{{ getReadTimeText() }}</div>
      </div>
    </div>
    <scroll class="slide-contents-list"
            :top="156"
            :bottom="48"
            v-show="!searchVisible"
    >
      <div class="slide-contents-item"
           v-for="(item, index) in navigation"
           :key="index"
           @click="displayContent(item.href)"
      >
        <span class="slide-contents-item-label"
              :class="{ 'selected': section === index }"
              :style="currentItemStyle(item)"
        >
          {{ item.label }}
        </span>
        <span class="slide-content-item-page">
        </span>
      </div>
    </scroll>
    <scroll class="slide-search-list"
            :top="66"
            :bottom="48"
            v-show="searchVisible"
    >
      <div class="slide-search-item"
           v-for="(item, index) in searchList"
           :key="index"
           v-html="item.excerpt"
           @click="displayContent(item.cfi, true)"
      >
      </div>
    </scroll>
  </div>
</template>

<script>
import { ebookMixin } from '@/utils/mixin/ebookMixin'
import { px2rem } from '@/utils/utils/'
import Scroll from '../common/Scroll'

export default {
  mixins: [ebookMixin],
  data () {
    return {
      searchVisible: false,
      searchText: '',
      searchList: []
    }
  },
  methods: {
    showSearchPage () {
      this.searchVisible = true
    },
    hideSearchPage () {
      this.searchVisible = false
      this.searchText = ''
      this.searchList = null
    },
    currentItemStyle (item) {
      return {
        marginLeft: `${px2rem(item.level * 15)}rem`
      }
    },
    displayContent (target, highlight) {
      this.display(target, () => {
        this.hideTitleAndMenu()
        if (highlight) {
          this.currentBook.rendition.annotations.highlight(target)
        }
      })
    },
    // 全局搜索(epubjs内置方法)
    doSearch (q) {
      return Promise.all(
        this.currentBook.spine.spineItems.map(section =>
          section
            .load(this.currentBook.load.bind(this.currentBook))
            .then(section.find.bind(section, q))
            .finally(section.unload.bind(section))
        )
      ).then(results => Promise.resolve([].concat.apply([], results)))
    },
    // 搜索方法
    search () {
      if (this.searchText && this.searchText.length > 0) {
        this.doSearch(this.searchText).then(list => {
            this.searchList = list
            // 匹配选中高亮显示
            this.searchList.map(item => {
              item.excerpt = item.excerpt.replace(this.searchText, `<span class="content-search-text">${this.searchText}</span>`)
              return item
            })
        })
      }
    }
  },
  components: {
    Scroll
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/scss/global.scss';

  .ebook-slide-contents {
    width: 100%;
    font-size: 0;
    // 顶部搜索框
    .slide-contents-search-wrapper {
      display: flex;
      width: 100%;
      height: px2rem(36);
      margin: px2rem(20) 0 px2rem(10) 0;
      padding: 0 px2rem(15);
      box-sizing: border-box;
      .slide-contents-search-input-wrapper {
        flex: 1;
        @include center;
        .slide-contents-search-icon {
          flex: 0 0 px2rem(28);
          font-size: px2rem(12);
          @include center;
        }
        .slide-contents-search-input {
          flex: 1;
          width: 100%;
          height: px2rem(32);
          font-size: px2rem(14);
          background: transparent;
          border: none;
          &:focus {
            outline: none;
          }
        }
      }
      .slide-contents-search-cancel {
        flex: 0 0 px2rem(50);
        font-size: px2rem(14);
        @include right;
      }
    }
    .slide-contents-book-wrapper {
      display: flex;
      width: 100%;
      height: px2rem(90);
      padding: px2rem(10) px2rem(15) px2rem(20);
      box-sizing: border-box;
      // 左侧封面
      .slide-contents-book-img-wrapper {
        flex: 0 0 px2rem(45);
        .slide-contents-book-img {
          width: px2rem(45);
          height: px2rem(60);
        }
      }
      // 中间标题、作者信息等
      .slide-contents-book-infos-wrapper {
        flex: 1;
        // 会出现文字不能以...显示的情况，width没有做限制
        // 375*0.85=318.75-30=288.75-20=268.75-45=223.75-70=153.75  同级的其它元素实际width
        width: px2rem(153.75);
        padding: 0 px2rem(10);
        box-sizing: border-box;
        .slide-contents-book-title {
          @include ellipsis2(2);
          font-size: px2rem(14);
          line-height: px2rem(16);
        }
        .slide-contents-book-author {
          font-size: px2rem(12);
          @include ellipsis;
          margin-top: px2rem(5);
        }
      }
      // 右侧阅读进度
      .slide-contents-book-progress-wrapper {
        flex: 0 0 px2rem(70);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        .slide-contents-book-progress {
          .progress {
            font-size: px2rem(14);
          }
          .progress-text {
            font-size: px2rem(12);
          }
        }
        .slide-contents-book-time {
          font-size: px2rem(12);
          padding-top: px2rem(5);
        }
      }
    }
    .slide-contents-list {
      padding: 0 px2rem(15);
      box-sizing: border-box;
      .slide-contents-item {
        display: flex;
        padding: px2rem(20) 0;
        .slide-contents-item-label {
          flex: 1;
          font-size: px2rem(14);
          @include ellipsis;
        }
      }
    }
    .slide-search-list {
      padding: 0 px2rem(15);
      box-sizing: border-box;
      .slide-search-item {
        font-size: px2rem(14);
        line-height: px2rem(16);
        padding: px2rem(20) 0;
        box-sizing: border-box;
      }
    }
  }
</style>
