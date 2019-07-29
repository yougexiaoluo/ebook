/**
 * @param app 全局application对象
 * @param url 访问接口地址
 * @param data 数据
 *
 * 模拟get请求
 */
function mock (app, url, data) {
  app.get(url, (request, response) => {
    response.json(data)
  })
}

const homeData = require('./src/mock/bookHome')
const shelfData = require('./src/mock/bookShelf')
const listData = require('./src/mock/bookList')
const flatListData = require('./src/mock/bookFlatList')

module.exports = {
  publicPath: process.env.NODE.EVN === 'production'
  ? './'
  : '/',
  // 数据模拟
  devServer: {
    before (app) {
      mock(app, '/book/home', homeData)
      mock(app, '/book/shelf', shelfData)
      mock(app, '/book/list', listData)
      mock(app, '/book/flat-list', flatListData)
    }
  }
}
