# ebook

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


#### 问题总结
  1. 使用-webkit-overflow-scrolling: touch; 可以解决移动端滑动卡顿问题
  2. 在PC端使用该产品时，底部menu菜单，切换动画出现不流畅现象(重叠，生硬)
        解决方案： 将层级调高即可
  3. 事件适配(移动端，pc端 ⭐)
  4. 横向、竖向出现滚动条
        解决方案： 将父容器的width、height设为100%之后设置overflow为hidden
  5. mockjs 不支持.opf文件，只支持text文本
     接口模拟：
        1. 使用mockjs进行模拟
        2. 在vue.config.js中进行配置，模拟
  6. 点击input的时候又是不能获取焦点，需要点击多次
      解决方案：
        ⭐⭐：暂未解决
  7. v-for 与 v-if 不建议一起使用，因为v-for的优先级比v-if的高  ⭐
  8. 将分组中的选中的书籍移出分组，不能正确移出，其次是最后一本书不能从书架中移除的问题
      解决方案:
        ⭐⭐：暂未解决
  9. 移出书架有时会出现类似卡死状态bug
       解决方案:
        ⭐⭐：暂未解决
  10. router 的访问模式   history | hash 与Nginx配合使用问题
  11. 书籍资源没有加载完成时，点击切换上、下一页的时候会报错
#### 打包问题
  1. 打包文件时单文件大于 244 KiB
      解决方案：
        在vue.config.js中进行配置打包参数
        ```
        configureWebpack: {
          performace: {
            hints: 'warning',
            maxAssetSize: 512 * 1024,
            maxEntrypointSize: 512 * 1024
          }
        }
        ```



### 微信上使用时碰到的问题：
  * 画面闪烁，点击屏幕中央，翻页都会出现闪烁问题
      解决方案:
        设置 -webkit-tap-highlight-color: transparent;
  * 下拉添加书签，造成整个页面都下拉
      解决方案：
        再对应的方法添加 
            e.preventDefault() | method: 'default' // 兼容微信


### 书城 -- 标题 + 搜索
  向下滑动屏幕时的交互细节分析

  1. 标题和推荐图标向下渐隐
  2. 搜索框向上移动到标题位置
  3. 搜索框逐渐变窄以适应屏幕
  4. 返回按钮向下居中
  5. 搜索下方显示阴影



假设前后端同时开发(前端没有数据时)，你会怎么办？
    解决方案：
        1. 统一好每个接口，请求方式、提交字段、返回数据的结构
        2. 按规范去mock数据

假设后端已经开发完成，已经部署到线上，你本地怎么开发？
    解决方案：
        1. 本地开发环境代理 -- webpack -> devServer.proxy
        2. 本地开发环境进行hosts劫持，将xxx.com域名指向开发目录

从输入url开始，浏览器执行过程？
    涉及问题：
        三次握手与四次挥手



项目中使用到的技术：
  Mysql + nodejs + express + vue-create-api
   + vue-router + axios + Nginx + indexDB 
   + localStorage + vuex + vue-lazyload 
   + vue-i18n  + epubjs + mockjs
   + js-base64 + js-md5 + 科大讯飞线上语音合成接口 + 