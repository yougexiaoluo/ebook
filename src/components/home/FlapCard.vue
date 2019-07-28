<template>
  <div class="flap-card-warpper" v-show="flapCardVisible">
    <!-- 推荐书籍加载动画 -->
    <div class="flap-card-bg"
         :class="{'animation': runFlapCardAnimation}"
         v-show="runFlapCardAnimation"
    >
      <div class="flap-card"
           v-for="(item, index) in flapCardList"
           :key="index"
      >
        <div class="flap-card-circle">
          <div class="flap-card-semi-circle flap-card-semi-circle-left"
              :style="semiCircleStyle(item, 'left')"
              ref="left"
          ></div>
          <div class="flap-card-semi-circle flap-card-semi-circle-right"
              :style="semiCircleStyle(item, 'right')"
              ref="right"
          ></div>
        </div>
      </div>
      <div class="point-wrapper">
        <div class="point"
             v-for="item in pointList"
             :key="item"
             :class="{'animation': runPointAnimation}"
        ></div>
      </div>
    </div>
    <!-- 推荐书籍容器 -->
    <div class="book-card"
         :class="{'animation': runBookCardAnimation}"
         v-if="runBookCardAnimation"
    >
      <div class="book-card-wrapper">
        <div class="img-wrapper">
          <img class="img" v-lazy="data.cover">
        </div>
        <div class="content-wrapper">
          <div class="title">{{ data.title }}</div>
          <div class="author sub-title-medium">{{ data.author }}</div>
          <div class="category">{{ categoryText() }}</div>
        </div>
        <div class="read-btn"
             @click.stop="showBookDetail"
        >
          {{ $t('home.readNow') }}
        </div>
      </div>
    </div>
    <!-- 关闭按钮 -->
    <div class="close-btn-wrapper" @click="close">
      <span class="icon-close"></span>
    </div>
  </div>
</template>

<script>
import { storeHomeMixin } from '@/utils/mixin/ebookMixin'
import { flapCardList, categoryText } from '@/utils/store'

export default {
  props: {
    data: Object
  },
  mixins: [storeHomeMixin],
  data () {
    return {
      flapCardList,
      front: 0,
      back: 1,
      intervalTime: 25,
      pointList: null,
      runFlapCardAnimation: false,
      runPointAnimation: false,
      ifShowBookCard: false,
      runBookCardAnimation: false
    }
  },
  created () {
    this.pointList = []
    for (let i = 0; i < 18; i++) {
      this.pointList.push(`point${i}`)
    }
  },
  watch: {
    flapCardVisible (v) {
      if (v) {
        this.runAnimation()
      }
    }
  },
  methods: {
    // 关闭随机推荐模态框
    close () {
      this.stopAnimation()
      this.setFlapCardVisible(false)
    },
    // 随机推荐动画 -- 初始界面样式
    semiCircleStyle (item, dir) {
      return {
        backgroundColor: `rgb(${item.r}, ${item.g}, ${item.b})`,
        backgroundSize: item.backgroundSize,
        backgroundImage: dir === 'left' ? item.imgLeft : item.imgRight,
        zIndex: item.zIndex
      }
    },
    // 使用定时器重复指定动画帧
    startFlapCardAnimation () {
      this.prepare()
      this.tack = setInterval(() => {
        this.flapCardRotate()
      }, this.intervalTime)
    },
    // 卡片旋转
    flapCardRotate () {
      const frontFlapCard = this.flapCardList[this.front]
      const backFlapCard = this.flapCardList[this.back]
      frontFlapCard.rotateDegree += 10
      backFlapCard.rotateDegree -= 10
      frontFlapCard._g -= 5
      // 当角度小于90deg的时候，做颜色值的操作
      if (backFlapCard.rotateDegree < 90) {
        backFlapCard._g += 5
      }
      if (frontFlapCard.rotateDegree === 90 && backFlapCard.rotateDegree === 90) {
        backFlapCard.zIndex += 2
      }
      this.rotate(this.front, 'front')
      this.rotate(this.back, 'back')
      // 如果一张卡片执行完成，开始执行下一张
      if (frontFlapCard.rotateDegree === 180 && backFlapCard.rotateDegree === 0) {
        this.next()
      }
    },
    // 转动动画
    rotate (index, type) {
      const item = this.flapCardList[index]
      let dom
      // 判断当前处于left还是right
      if (type === 'front') {
        dom = this.$refs.right[index]
      } else {
        dom = this.$refs.left[index]
      }
      dom.style.transform = `rotateY(${item.rotateDegree}deg)`
      dom.style.backgroundColor = `rgb(${item.r}, ${item._g}, ${item.b})`
    },
    // 背面卡片 -- 左边与右边重叠
    prepare () {
      const backFlapCard = this.flapCardList[this.back]
      backFlapCard.rotateDegree = 180
      // 转动之前需要做颜色值扣减操作 -- 角度为 90deg
      backFlapCard._g = backFlapCard.g - 5 * 9
      this.rotate(this.back, 'back')
    },
    // 执行下一张
    next () {
      const frontFlapCard = this.flapCardList[this.front]
      const backFlapCard = this.flapCardList[this.back]

      frontFlapCard.rotateDegree = 0
      backFlapCard.rotateDegree = 0
      frontFlapCard._g = frontFlapCard.g
      backFlapCard._g = backFlapCard.g
      this.rotate(this.front, 'front')
      this.rotate(this.back, 'back')
      this.front++
      this.back++
      let len = this.flapCardList.length
      if (this.front >= len) {
        this.front = 0
      }
      if (this.back >= len) {
        this.back = 0
      }
      // 动态设置层级 z-index
      // 100 -> 96
      // 99 -> 100
      // 98 -> 99
      // 97 -> 98
      // 96 -> 97
      this.flapCardList.forEach((item, index) => {
        item.zIndex = 100 - ((index - this.front + len) % len)
      })
      this.prepare()
    },
    // 重置动画所有状态
    reset () {
      this.front = 0
      this.back = 1
      this.flapCardList.forEach((item, index) => {
        item.zIndex = 100 - index
        item._g = item.g
        item.rotateDegree = 0
        this.rotate(index, 'front')
        this.rotate(index, 'back')
      })
      this.runFlapCardAnimation = false
      this.runBookCardAnimation = false
      this.runPointAnimation = false
    },
    // 清除定时器
    stopAnimation () {
      if (this.tack) {
        clearInterval(this.tack)
      }
      if (this.timer) {
        clearTimeout(this.timer)
      }
      if (this.timer2) {
        clearTimeout(this.timer2)
      }
      this.reset()
    },
    // 小圆点
    startPointAnimation () {
      this.runPointAnimation = true
      // 解决动画执行完成之后出现小圆点还显示的状态
      setTimeout(() => {
        this.runPointAnimation = false
      }, 750)
    },
    // 开启动画
    runAnimation () {
      this.runFlapCardAnimation = true
      this.timer = setTimeout(() => {
        this.startFlapCardAnimation()
        this.startPointAnimation()
      }, 300)
       // 模拟网络请求成功之后隐藏，随机推荐动画
      this.timer2 = setTimeout(() => {
        this.stopAnimation()
        this.runBookCardAnimation = true
      }, 2500)
    },
    categoryText () {
      if (this.data) {
        return categoryText(this.data.category, this)
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/scss/global.scss';
  @import '@/assets/styles/scss/flapCard.scss';
  @import '@/assets/styles/scss/home.scss';

  .flap-card-warpper {
    z-index: 300;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .6);
    @include center;
    @include absCenter;
    .close-btn-wrapper {
      position: absolute;
      left: 0;
      bottom: px2rem(30);
      width: 100%;
      @include center;
      .icon-close {
        width: px2rem(45);
        height: px2rem(45);
        border-radius: 50%;
        background: #333;
        color: #fff;
        font-size: px2rem(25);
        @include center;
      }
    }
    .flap-card-bg {
      position: relative;
      width: px2rem(64);
      height: px2rem(64);
      background: #fff;
      border-radius: px2rem(5);
      transform: scale(0);
      opacity: 0;
      &.animation {
        animation: flap-card-move .3s ease-in both;
      }
      @keyframes flap-card-move {
        0% {
          transform: scale(0);
          opacity: 0;
        }
        50% {
          transform: scale(1.2);
          opacity: 1;
        }
        75% {
          transform: scale(.9);
          opacity: 1;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
      @include absCenter;
      @include center;
      .flap-card {
        width: px2rem(48);
        height: px2rem(48);
        @include absCenter;
        .flap-card-circle {
          display: flex;
          width: 100%;
          height: 100%;
         .flap-card-semi-circle {
            flex: 0 0 50%;
            width: 50%;
            height: 100%;
            background-repeat: no-repeat;
            // 翻牌效果
            backface-visibility: hidden;
          }
          .flap-card-semi-circle-left {
            border-radius: px2rem(24) 0 0 px2rem(24);
            background-position: center right;
            transform-origin: right;
          }
          .flap-card-semi-circle-right {
            border-radius: 0 px2rem(24) px2rem(24) 0;
            background-position: center left;
            transform-origin: left;
          }
        }
      }
      .point-wrapper {
        @include absCenter;
        z-index: 320;
        .point {
          border-radius: 50%;
          @include absCenter;
          // 动画效果 ⭐
          &.animation {
            @for $i from 1 to length($moves) {
              &:nth-child(#{$i}) {
                @include move($i);
              }
            }
          }
        }
      }
    }
    .book-card {
      position: relative;
      width: 65%;
      // height: 70%;
      box-sizing: border-box;
      border-radius: px2rem(15);
      background: white;
      &.animation {
        animation: scale $bookShowTime ease-in both;
        @keyframes scale {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      }
      .book-card-wrapper {
        width: 100%;
        height: 100%;
        margin-bottom: px2rem(30);
        @include columnTop;
        .img-wrapper {
          width: 100%;
          margin-top: px2rem(20);
          @include center;
          .img {
            width: px2rem(90);
            height: px2rem(130);
          }
        }
        .content-wrapper {
          padding: 0 px2rem(20);
          margin-top: px2rem(20);
          .title {
            color: #333;
            font-weight: bold;
            font-size: px2rem(18);
            line-height: px2rem(20);
            max-height: px2rem(40);
            text-align: center;
            @include ellipsis2(2)
          }
          .author {
            margin-top: px2rem(10);
            text-align: center;
          }
          .category {
            color: #999;
            font-size: px2rem(14);
            margin-top: px2rem(10);
            text-align: center;
          }
        }
        .read-btn {
          position: absolute;
          bottom: 0;
          left: 0;
          z-index: 1100;
          width: 100%;
          border-radius: 0 0 px2rem(15) px2rem(15);
          padding: px2rem(15) 0;
          text-align: center;
          color: white;
          font-size: px2rem(14);
          background: $color-blue;
        }
      }
    }
  }
</style>
