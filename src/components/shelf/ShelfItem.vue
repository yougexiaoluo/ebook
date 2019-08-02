<template>
  <div class="shelf-item"
       :class="{'shelf-item-shadow': data.type === 1 || data.type === 2}"
       @click="onItemClick"
  >
    <component class="shelf-item-comp"
               :class="{'is-edit': isEditMode && data.type === 2}"
               :is="item"
               :data="data"
    />
    <div class="icon-selected"
         :class="{'is-selected': data.selected}"
         v-show="isEditMode && data.type === 1"
    ></div>
  </div>
</template>

<script>
import ShelfItemBook from './ShelfItemBook'
import ShelfItemAdd from './ShelfItemAdd'
import ShelfItemCategory from './ShelfItemCategory'
import { gotoStoreHome } from '@/utils/store'
import { storeShelfMixin } from '@/utils/mixin/ebookMixin'

export default {
  props: {
    data: Object
  },
  mixins: [storeShelfMixin],
  data () {
    return {
      book: ShelfItemBook,
      add: ShelfItemAdd,
      category: ShelfItemCategory
    }
  },
  computed: {
    // 动态切换组件
    item () {
      return this.data.type === 1 ? this.book : (this.data.type === 2 ? this.category : this.add)
    }
  },
  methods: {
    onItemClick () {
      // 处于编辑状态
      if (this.isEditMode) {
        this.data.selected = !this.data.selected
        // 选中书籍
        if (this.data.selected && this.data.type === 1) {
          this.shelfSelected.pushWidthoutDuplicate(this.data)
        } else {
          this.setShelfSelected(this.shelfSelected.filter(item => item.id !== this.data.id))
        }
      } else {
        // 不处于编辑状态
        if (this.data.type === 1) {
          this.showBookDetail(this.data)
        } else if (this.data.type === 2) {
          this.$router.push({
            path: '/store/category',
            params: {
              title: this.data.title
            }
          })
        } else {
          // 将实例对象作为参数进行传递
          gotoStoreHome(this)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "@/assets/styles/scss/global.scss";

  .shelf-item {
    position: relative;
    width: 100%;
    height: 100%;
    &.shelf-item-shadow {
      box-shadow: px2rem(2) px2rem(2) px2rem(6) px2rem(2) rgba(200, 200, 200, .3)
    }
    .icon-selected {
      position: absolute;
      right: px2rem(2);
      bottom: px2rem(2);
      color: rgba(0, 0, 0, .5);
      font-size: px2rem(18);
      &.is-selected {
        color: $color-blue;
      }
    }
    .shelf-item-comp {
      opacity: 1;
      &.is-edit {
        opacity: .5;
      }
    }
  }
</style>
