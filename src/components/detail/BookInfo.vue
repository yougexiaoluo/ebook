<template>
  <div class="cover-title-wrapper">
    <div class="cover-title-left-wrapper">
      <img class="cover-img" v-lazy="cover">
    </div>
    <div class="cover-title-right-wrapper">
      <div class="detail-cover-title-wrapper">
        <div class="cover-title-text">{{ title }}</div>
      </div>
      <div class="cover-author-wrapper">
        <div class="cover-author-text">{{ author }}</div>
      </div>
      <div class="detail-cover-description-wrapper">
        <div class="detail-cover-description-text">{{ desc }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      cover: {
        type: String
      },
      title: String,
      author: String,
      desc: String
    }
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/styles/scss/global.scss";

  .cover-title-wrapper {
    display: flex;
    width: 100%;
    padding: px2rem(10) 0;
    border-bottom: px2rem(1) solid #eee;
    box-sizing: border-box;
    .cover-title-left-wrapper {
      flex: 0 0 px2rem(103);
      padding: px2rem(10) 0 px2rem(10) px2rem(15);
      box-sizing: border-box;
      @include top;
      .cover-img {
        width: px2rem(103);
        height: px2rem(146);
      }
    }
    .cover-title-right-wrapper {
      flex: 1;
      width: 70%;
      box-sizing: border-box;
      padding: px2rem(10) px2rem(15);
      .detail-cover-title-wrapper {
        .cover-title-text {
          color: #333;
          font-size: px2rem(20);
          font-weight: bold;
          line-height: px2rem(26);
          @include ellipsis2(2);
        }
      }
      .cover-author-wrapper {
        margin-top: px2rem(10);
        .cover-author-text {
          font-size: px2rem(14);
          line-height: px2rem(16);
          color: $color-blue;
        }
      }
      .detail-cover-description-wrapper {
        margin-top: px2rem(10);
        .detail-cover-description-text {
          font-size: px2rem(14);
          line-height: px2rem(16);
          color: #666;
          word-break: keep-all;
          white-space: normal;
          overflow: hidden;
          text-overflow: ellipsis;
          overflow-wrap: break-word;
        }
      }
    }
  }
</style>
