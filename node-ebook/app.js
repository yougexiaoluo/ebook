const mysql = require('mysql')
const express = require('express')
const constant = require('./base.config')
const voice = require('./voice')
const cors = require('cors') // 解决跨域请求资源
const app = express()

app.use(cors())

app.get('/', (req, res) => {
  res.send(new Date().toDateString())
})

// 连接数据库的方法
function connect () {
  return mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'book'
  })
}

// 生成随机数
/**
 * @param n 最小值
 * @param l 最大值
 */
function randomArray (n, l) {
  const rnd = []
  for (let i = 0; i < n; i++) {
    rnd.push(Math.floor(Math.random() * l))
  }
  return rnd
}

// 获取通用的电子书格式
function createData (results, key) {
  return handleData(results[key])
}

// 创建分类列表id
function createCategoryIds (n) {
  const arr = []
  constant.category.forEach((item, index) => {
    arr.push(index + 1)
  })
  const result = []
  for (let i = 0; i < n; i++) {
    // 获取的随机数不能重复
    const ran = Math.floor(Math.random() * (arr.length - i))
    // 获取分类对应的序号
    result.push(arr[ran])
    // 将已经获取的随机数取代，用最后一位数
    arr[ran] = arr[arr.length - i - 1]
  }
  return result
}

// 创建分类列表数据
function createCategoryData (data) {
  const categoryIds = createCategoryIds(6)
  const result = []
  categoryIds.forEach(categoryId => {
    const subList = data.filter(item => item.category === categoryId).slice(0, 4)
    subList.map(item => {
      return handleData(item)
    })
    result.push({
      category: categoryId,
      list: subList
    })
  })
  return result.filter(item => item.list.length === 4) // 解决返回书本少于4本时的情况
}

function handleData (data) {
  if (!data.cover.startsWith('http://')) {
    data['cover'] = `${constant.baseUrl}/img${data.cover}`
  }

  data['selected'] = false
  data['private'] = false
  data['cach'] = false
  data['haveRead'] = 0
  return data
}

// 创建猜你喜欢数据
function createGuessYouLike (data) {
  const n = parseInt(randomArray(1, 3)) + 1
  data['type'] = n
  switch (n) {
    case 1:
    data['result'] = data.id % 2 === 0 ? '《Executing Magic》' : '《Elements Of Robotics》'
      break
    case 2:
    data['result'] = data.id % 2 === 0 ? '《Improving Psychiatric Care》' : '《Programming Languages》'
      break
    case 3:
      data['result'] = '《Living with Disfigurement》'
      data['percent'] = data.id % 2 === 0 ? '92%' : '97%'
      break
    default:
      break
  }
  return data
}

// 创建推荐电子书数据
function createRecommendData (data) {
  data['readers'] = Math.floor(data.id / 2 * randomArray(1, 100))
  return data
}

// 首页数据
app.get('/book/home', (req, res) => {
  const conn = connect()
  conn.query('select * from book where cover != \'\'', (err, results) => {
    if (err) {
      res.json({
        error_code: 1,
        msg: '数据库查询失败'
      })
    }

    const length = results.length
    const guessYouLike = [] // 猜你喜欢
    const banner = constant.baseUrl + '/img/banner/home_banner2.jpg' // 首页广告图
    const recommend = [] // 热门推荐
    const featured = [] // 精选
    const random = [] // 随机推荐
    const categoryList = createCategoryData(results) // 分类列表
    const categories = [
      {
        category: 1,
        num: 56,
        img1: constant.baseUrl + '/cover/cs/A978-3-319-62533-1_CoverFigure.jpg',
        img2: constant.baseUrl + '/cover/cs/A978-3-319-89366-2_CoverFigure.jpg'
      },
      {
        category: 2,
        num: 51,
        img1: constant.baseUrl + '/cover/ss/A978-3-319-61291-1_CoverFigure.jpg',
        img2: constant.baseUrl + '/cover/ss/A978-3-319-69299-9_CoverFigure.jpg'
      },
      {
        category: 3,
        num: 32,
        img1: constant.baseUrl + '/cover/eco/A978-3-319-69772-7_CoverFigure.jpg',
        img2: constant.baseUrl + '/cover/eco/A978-3-319-76222-7_CoverFigure.jpg'
      },
      {
        category: 4,
        num: 60,
        img1: constant.baseUrl + '/cover/edu/A978-981-13-0194-0_CoverFigure.jpg',
        img2: constant.baseUrl + '/cover/edu/978-3-319-72170-5_CoverFigure.jpg'
      },
      {
        category: 5,
        num: 23,
        img1: constant.baseUrl + '/cover/eng/A978-3-319-39889-1_CoverFigure.jpg',
        img2: constant.baseUrl + '/cover/eng/A978-3-319-00026-8_CoverFigure.jpg'
      },
      {
        category: 6,
        num: 42,
        img1: constant.baseUrl + '/cover/env/A978-3-319-12039-3_CoverFigure.jpg',
        img2: constant.baseUrl + '/cover/env/A978-4-431-54340-4_CoverFigure.jpg'
      },
      {
        category: 7,
        num: 7,
        img1: constant.baseUrl + '/cover/geo/A978-3-319-56091-5_CoverFigure.jpg',
        img2: constant.baseUrl + '/cover/geo/978-3-319-75593-9_CoverFigure.jpg'
      },
      {
        category: 8,
        num: 18,
        img1: constant.baseUrl + '/cover/his/978-3-319-65244-3_CoverFigure.jpg',
        img2: constant.baseUrl + '/cover/his/978-3-319-92964-4_CoverFigure.jpg'
      },
      {
        category: 9,
        num: 13,
        img1: constant.baseUrl + '/cover/law/2015_Book_ProtectingTheRightsOfPeopleWit.jpeg',
        img2: constant.baseUrl + '/cover/law/2016_Book_ReconsideringConstitutionalFor.jpeg'
      },
      {
        category: 10,
        num: 24,
        img1: constant.baseUrl + '/cover/ls/A978-3-319-27288-7_CoverFigure.jpg',
        img2: constant.baseUrl + '/cover/ls/A978-1-4939-3743-1_CoverFigure.jpg'
      },
      {
        category: 11,
        num: 6,
        img1: constant.baseUrl + '/cover/lit/2015_humanities.jpg',
        img2: constant.baseUrl + '/cover/lit/A978-3-319-44388-1_CoverFigure_HTML.jpg'
      },
      {
        category: 12,
        num: 14,
        img1: constant.baseUrl + '/cover/bio/2016_Book_ATimeForMetabolismAndHormones.jpeg',
        img2: constant.baseUrl + '/cover/bio/2017_Book_SnowSportsTraumaAndSafety.jpeg'
      },
      {
        category: 13,
        num: 16,
        img1: constant.baseUrl + '/cover/bm/2017_Book_FashionFigures.jpeg',
        img2: constant.baseUrl + '/cover/bm/2018_Book_HeterogeneityHighPerformanceCo.jpeg'
      },
      {
        category: 14,
        num: 16,
        img1: constant.baseUrl + '/cover/es/2017_Book_AdvancingCultureOfLivingWithLa.jpeg',
        img2: constant.baseUrl + '/cover/es/2017_Book_ChinaSGasDevelopmentStrategies.jpeg'
      },
      {
        category: 15,
        num: 2,
        img1: constant.baseUrl + '/cover/ms/2018_Book_ProceedingsOfTheScientific-Pra.jpeg',
        img2: constant.baseUrl + '/cover/ms/2018_Book_ProceedingsOfTheScientific-Pra.jpeg'
      },
      {
        category: 16,
        num: 9,
        img1: constant.baseUrl + '/cover/mat/2016_Book_AdvancesInDiscreteDifferential.jpeg',
        img2: constant.baseUrl + '/cover/mat/2016_Book_ComputingCharacterizationsOfDr.jpeg'
      },
      {
        category: 17,
        num: 20,
        img1: constant.baseUrl + '/cover/map/2013_Book_TheSouthTexasHealthStatusRevie.jpeg',
        img2: constant.baseUrl + '/cover/map/2016_Book_SecondaryAnalysisOfElectronicH.jpeg'
      },
      {
        category: 18,
        num: 16,
        img1: constant.baseUrl + '/cover/phi/2015_Book_TheOnlifeManifesto.jpeg',
        img2: constant.baseUrl + '/cover/phi/2017_Book_Anti-VivisectionAndTheProfessi.jpeg'
      },
      {
        category: 19,
        num: 10,
        img1: constant.baseUrl + '/cover/phy/2016_Book_OpticsInOurTime.jpeg',
        img2: constant.baseUrl + '/cover/phy/2017_Book_InterferometryAndSynthesisInRa.jpeg'
      },
      {
        category: 20,
        num: 26,
        img1: constant.baseUrl + '/cover/psa/2016_Book_EnvironmentalGovernanceInLatin.jpeg',
        img2: constant.baseUrl + '/cover/psa/2017_Book_RisingPowersAndPeacebuilding.jpeg'
      },
      {
        category: 21,
        num: 3,
        img1: constant.baseUrl + '/cover/psy/2015_Book_PromotingSocialDialogueInEurop.jpeg',
        img2: constant.baseUrl + '/cover/psy/2015_Book_RethinkingInterdisciplinarityA.jpeg'
      },
      {
        category: 22,
        num: 1,
        img1: constant.baseUrl + '/cover/sta/2013_Book_ShipAndOffshoreStructureDesign.jpeg',
        img2: constant.baseUrl + '/cover/sta/2013_Book_ShipAndOffshoreStructureDesign.jpeg'
      }
    ] // 类别

    // 猜你喜欢
    randomArray(9, length).forEach(key => {
      guessYouLike.push(createGuessYouLike(createData(results, key)))
    })
    // 推荐
    randomArray(3, length).forEach(key => {
      recommend.push(createRecommendData(createData(results, key)))
    })
    // 精选
    randomArray(6, length).forEach(key => {
      featured.push(createData(results, key))
    })
    // 随机推荐
    randomArray(1, length).forEach(key => {
      random.push(createData(results, key))
    })
    res.json({
      guessYouLike,
      banner,
      recommend,
      featured,
      random,
      categoryList,
      categories,
      length
    })
    conn.end()
  })
})

// 电子书列表 -- 树状结构
app.get('/book/list', (req, res) => {
  const conn = connect()
  conn.query('select * from book where cover!=\'\'',
    (err, results) => {
      if (err) {
        res.json({
          error_code: 1,
          msg: '获取失败'
        })
      } else {
        results.map(item => handleData(item))
        const data = {}
        constant.category.forEach(categoryText => {
          data[categoryText] = results.filter(item => item.categoryText === categoryText)
        })
        res.json({
          error_code: 0,
          msg: '获取成功',
          data: data,
          total: results.length
        })
      }
      conn.end()
    })
})
// 详情页数据
app.get('/book/detail', (req, res, next) => {
  const conn = connect()
  const fileName = req.query.fileName
  const sql = `select * from book where fileName='${fileName}'`
  conn.query(sql, (err, results) => {
    if (err) {
      res.json({
        error_code: 1,
        msg: '电子书详情获取失败'
      })
    } else {
      if (results && results.length === 0) {
        res.json({
          error_code: 1,
          msg: '电子书详情获取失败'
        })
      } else {
        const book = handleData(results[0])
        res.json({
          error_code: 0,
          msg: '获取成功',
          data: book
        })
      }
    }
    conn.end()
  })
})

// 获取电子书列表 -- 普通结构
app.get('/book/flat-list', (req, res) => {
  const conn = connect()
  conn.query('select * from book where cover!=\'\'',
    (err, results) => {
      if (err) {
        res.json({
          error_code: 1,
          msg: '获取失败'
        })
      } else {
        results.map(item => handleData(item))
        res.json({
          error_code: 0,
          msg: '获取成功',
          data: results,
          total: results.length
        })
      }
      conn.end()
    })
})

// 获取书架列表
app.get('/book/shelf', (req, res) => {
  res.json({
    bookList: []
  })
})
// 科大讯飞接口
app.get('/voice', (req, res) => {
  voice(req, res)
})

const server = app.listen(3000, (req, res) => {
  const port = server.address().port
  const host = server.address().address
})
