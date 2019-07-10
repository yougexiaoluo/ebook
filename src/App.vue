<template>
  <div id="app">
    <span>ABCDEFG</span>
    <router-view/>
  </div>
</template>
<script>
export default {
  created() {
    // this.$nextTick(() => {
    //   document.body.style.height = window.innerHeight + "px";
    //   this.initRecalc();
    // })
    this.recalc()
  },
  methods: {
     /*动态改变根元素字体大小*/
    recalc () {
      // 获取客户端宽度
      let clientWidth = document.documentElement.clientWidth;
      let fontSize = 100 * (clientWidth / 750)
      if (!clientWidth) return;
      // 字体大小   = 1个rem单位表示多少个像素（设备的宽度   /设计宽度）
      fontSize = fontSize > 50 ? 50 : fontSize
      document.documentElement.style.fontSize = fontSize + 'px';
    },
    initRecalc () {
      this.recalc();
      // if(浏览器支持横竖屏切换的事件){横竖屏事件}else{ resize事件 }
      //判断设备是否处于横屏状态        //横屏事件            //窗口变化事件
      let resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
      if (!document.addEventListener) return;
      window.addEventListener(resizeEvt, this.recalc, false);
      document.addEventListener('DOMContentLoaded', this.recalc, false);
    },
    recalc () {
      document.addEventListener('DOMContentLoaded', () => {
        let html = document.querySelector('html')
        let fontSize = window.innerWidth / 10
        fontSize = fontSize > 50 ? 50 : fontSize
        html.style.fontSize = fontSize + 'px'
      })
    }
  }
}

</script>

<style lang="scss" scoped>
@import '@/assets/styles/global.scss';

span {
  font-family: 'days One';
  font-size: px2rem(20);
  color: orange;
}
</style>
