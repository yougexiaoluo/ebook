<template>
  <ebook-dialog :title="title" ref="dialog">
    <div class="dialog-list-wrapper" v-if="!ifNewGroup">
      <div class="dialog-list-item"
           :class="{'is-add': item.edit  ? item.edit === 1 : false}"
           v-for="(item, index) in categoryList"
           :key="index"
           @click="onGroupClick(item)"
      >
        <div v-if="(item.edit === 2 && isInGroup) || item.edit !== 2 || !item.edit">
          <div class="dialog-list-item-text">{{ item.title }}</div>
          <div class="dialog-list-icon-wrapper" v-if="isInGroup && shelfCategory.id === item.id">
            <span class="icon-check"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="dialog-new-group-wrapper" v-else>
      <div class="dialog-input-title-wrapper">
        <span class="dialog-input-title">{{ $t('shelf.groupName') }}</span>
      </div>
      <div class="dialog-input-wrapper">
        <div class="dialog-input-inner-wrapper">
         <input type="text" class="dialog-input" v-model="newGroupName" ref="dialogInput" />
          <div class="dialog-input-clear-wrapper"
               @click="clear"
               v-if="newGroupName && newGroupName.length > 0"
          >
            <span class="icon-close-circle-fill"></span>
          </div>
        </div>
      </div>
    </div>
    <div slot="btn" class="group-dialog-btn-wrapper">
      <div class="dialog-btn" @click="hide">{{ $t('shelf.cancel') }}</div>
      <div class="dialog-btn"
           :class="{'is-empty': newGroupName && newGroupName.length === 0}"
           @click="createNewGroup"
           v-if="ifNewGroup">{{ $t('shelf.confirm') }}
      </div>
    </div>
  </ebook-dialog>
</template>

<script>
  import EbookDialog from '../common/Dialog'
  import { storeShelfMixin } from '@/utils/mixin/ebookMixin'
  import { removeAddFromShelf, appendAddToShelf } from '@/utils/store'
  import { saveBookShelf } from '@/utils/localStorage'

  export default {
    name: 'group-dialog',
    // 接收数据
    props: {
      showNewGroup: {
        type: Boolean,
        default: false
      },
      groupName: String
    },
    mixins: [storeShelfMixin],
    data () {
      return {
        ifNewGroup: false,
        newGroupName: ''
      }
    },
    computed: {
      isInGroup () {
        return this.currentType === 2
      },
      // 使用国际化文本
      defaultCategory () {
        return [
          {
            title: this.$t('shelf.newGroup'),
            edit: 1
          },
          {
            title: this.$t('shelf.groupOut'),
            edit: 2
          }
        ]
      },
      category () {
        return this.shelfList.filter(item => item.type === 2)
      },
      categoryList () {
        return [...this.defaultCategory, ...this.category]
      },
      title () {
        return !this.ifNewGroup ? this.$t('shelf.moveBook') : this.$t('shelf.newGroup')
      }
    },
    methods: {
      show () {
        // 重新修改跟分组名
        this.ifNewGroup = this.showNewGroup
        this.newGroupName = this.groupName
        this.$refs.dialog.show()
      },
      hide () {
        this.$refs.dialog.hide()
        // 解决同时执行的逻辑，需要等待上一个执行完成后再执行
        setTimeout(() => {
          this.ifNewGroup = false
        }, 200)
      },
      onGroupClick (item) {
        if (item.edit && item.edit === 1) {
          this.ifNewGroup = true
        } else if (item.edit && item.edit === 2) {
          this.moveOutFromGroup(item)
        } else {
          this.moveToGroup(item)
        }
      },
      clear () {
        this.newGroupName = ''
      },
      // 移动至指定分组
      moveToGroup (group) {
        // shelfList 书架列表数据
        this.setShelfList(this.shelfList.filter(book => {
            // 从分组中移除
            if (book.itemList) {
              // console.log('存在')
              book.itemList = book.itemList.filter(subBook => this.shelfSelected.indexOf(subBook) < 0)
            }
            return this.shelfSelected.indexOf(book) < 0
          }))
          .then(() => {
            if (group && group.itemList) {
              group.itemList = [...group.itemList, ...this.shelfSelected]
            }
            // 重置id的操作，否则会出现 "Duplicate keys detected: '16'. This may cause an update error"，组件key重复
            group.itemList.forEach((item, index) => {
              item.id = index + 1
            })
            this.simpleToast(this.$t('shelf.moveBookInSuccess').replace('$1', group.title))
            this.onComplete()
          })
      },
      // 从分组中移出
      moveOutFromGroup () {
        this.moveOutOfGroup(this.onComplete)
      },
      // 创建分组
      createNewGroup () {
        if (!this.newGroupName || this.newGroupName.length === 0) {
          return
        }
        if (this.showNewGroup) {
          this.shelfCategory.title = this.newGroupName
          this.onComplete()
        } else {
          // 创建一个group对象，添加到分组中
          const group = {
            id: this.shelfList[this.shelfList.length - 2].id + 1,
            itemList: [],
            selected: false,
            title: this.newGroupName,
            type: 2
          }
          let list = removeAddFromShelf(this.shelfList)
          list.push(group)
          list = appendAddToShelf(list)
          this.setShelfList(list).then(() => {
            this.moveToGroup(group)
          })
        }
      },
      onComplete () {
        this.hide()
        this.setIsEditMode(false)
        saveBookShelf(this.shelfList)
      }
    },
    components: {
      EbookDialog
    }
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/styles/scss/global.scss";

  .dialog-list-wrapper {
    width: 100%;
    padding: 0 px2rem(20);
    box-sizing: border-box;
    font-size: px2rem(14);
    @include scroll;
    .dialog-list-item {
      display: flex;
      box-sizing: border-box;
      color: #666;
      &.is-add {
        color: $color-blue;
        &:active {
          color: $color-blue-transparent;
        }
      }
      &:active {
        color: rgba(102, 102, 102, .5)
      }
      & > div {
        width: 100%;
        padding: px2rem(15) 0;
        @include center;
      }
      .dialog-list-item-text {
        flex: 1;
      }
      .dialog-list-icon-wrapper {
        flex: 0 0 px2rem(30);
        color: $color-blue;
        @include right;
      }
    }
  }

  .dialog-new-group-wrapper {
    width: 100%;
    padding: 0 px2rem(20);
    box-sizing: border-box;
    .dialog-input-title-wrapper {
      font-size: px2rem(10);
      margin-top: px2rem(20);
    }
    .dialog-input-wrapper {
      width: 100%;
      padding: 0 0 px2rem(30) 0;
      box-sizing: border-box;
      .dialog-input-inner-wrapper {
        display: flex;
        width: 100%;
        padding: px2rem(10) 0;
        box-sizing: border-box;
        border-bottom: px2rem(1) solid #eee;
        font-size: px2rem(14);
        color: #666;
        .dialog-input {
          flex: 1;
          border: none;
          line-height: 14px;
          &:focus {
            outline: none;
          }
        }
        .dialog-input-clear-wrapper {
          flex: 0 0 px2rem(30);
          color: #ccc;
          @include center;
          &:active {
            color: #999;
          }
        }
      }
    }
  }

  .group-dialog-btn-wrapper {
    width: 100%;
    @include center;
  }

  .dialog-btn {
    flex: 1;
    &.is-empty {
      color: rgba(255, 255, 255, .5);
    }
    &:active {
      color: rgba(255, 255, 255, .5)
    }
  }
</style>
