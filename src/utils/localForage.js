// 对indexDB操作的插件
import localForage from 'localforage'

export function setLocalForage (key, data, cb, cb2) {
  localForage.setItem(key, data).then((value) => {
    cb && cb(value)
  }).catch(function (err) {
    cb2 && cb2(err)
  })
}
// 获取本地数据库数据
export function getLocalForage (key, cb) {
  localForage.getItem(key, (err, value) => {
    cb(err, value)
  })
}
// 删除数据
export function removeLocalForage (key, cb, cb2) {
  localForage.removeItem(key).then(function () {
    cb && cb()
  }).catch(function (err) {
    cb2 && cb2(err)
  })
}
// 清空本地数据库数据
export function clearLocalForage (cb, cb2) {
  localForage.clear().then(function () {
    cb && cb()
  }).catch(function (err) {
    cb2 && cb2(err)
  })
}
// 获取键值对的个数
export function lengthLocalForage (cb) {
  localForage.length().then(
    numberOfKeys => {
    cb && cb(numberOfKeys)
    }).catch(function (err) {
      if (err) throw err
  })
}

export function iteratorLocalForage () {
  localForage.iterate(function (value, key, iterationNumber) {
  }).then(function () {
  }).catch(function (err) {
    if (err) throw err
  })
}

// 判断浏览器是否支持indexDB本地数据库
export function support () {
  const indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || null
  if (indexedDB) {
    return true
  } else {
    return false
  }
}
