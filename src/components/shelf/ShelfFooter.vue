<template>
  <div class="shelf-footer-wrapper"
       v-show="isEditMode"
  >
    <div class="shelf-footer-tab-wrapper"
         v-for="item in tabs"
         :key="item.index"
         @click="onTabClick(item)"
    >
      <div class="shelf-footer-tab"
           :class="{'is-selected': isSelected}"
      >
        <div class="icon-private tab-icon" v-if="item.index === 1"></div>
        <div class="icon-download tab-icon" v-if="item.index === 2"></div>
        <div class="icon-move tab-icon" v-if="item.index === 3" ></div>
        <div class="icon-shelf tab-icon" v-if="item.index === 4"></div>
        <div class="tab-text">{{ item.label }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { storeShelfMixin } from '@/utils/mixin/ebookMixin'

export default {
  mixins: [storeShelfMixin],
  computed: {
    tabs () {
      return [
        {
          label: this.$t('shelf.private'),
          label2: this.$t('shelf.noPrivate'),
          index: 1
        },
        {
          label: this.$t('shelf.download'),
          label2: this.$t('shelf.delete'),
          index: 2
        },
        {
          label: this.$t('shelf.move'),
          index: 3
        },
        {
          label: this.$t('shelf.remove'),
          index: 4
        }
      ]
    },
    // 改变编辑模式tab栏的opacity
    isSelected () {
      return this.shelfSelected && this.shelfSelected.length > 0
    }
  },
  methods: {
    onTabClick (item) {
      console.log(item)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/scss/global.scss';

  .shelf-footer-wrapper {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 120;
    display: flex;
    width: 100%;
    height: px2rem(48);
    background: #fff;
    box-shadow: 0 px2rem(-2) px2rem(4) 0 rgba(0, 0, 0, .1);
    .shelf-footer-tab-wrapper {
      flex: 1;
      width: 25%;
      height: 100%;
      .shelf-footer-tab {
        width: 100%;
        height: 100%;
        opacity: .5;
        @include columnCenter;
        &.is-selected {
          opacity: 1;
        }
        .tab-icon {
          font-size: px2rem(20);
          color: #666;
        }
        .tab-text {
          color: #666;
          font-size: px2rem(12);
          margin-top: px2rem(5);
        }
      }
    }
  }
</style>
