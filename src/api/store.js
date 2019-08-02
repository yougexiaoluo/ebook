import axios from 'axios'
import { setLocalForage } from '@/utils/localForage'

export function home () {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/home`
  })
}

export function detail (book) {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BOOK_URL}/book/detail`,
    params: {
      fileName: book.fileName
    }
  })
}

export function list () {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/list`
  })
}

export function shelf () {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/shelf`
  })
}

// 下载书籍方法(本地服务)
export function download (book, onSuccess, onError, onProgress) {
  // 如果传入三个参数，将第四个参数赋值给第三个
  if (!onProgress) {
    onProgress = onError
    onError = null // 清除引用
  }

  return axios.create({
    baseURL: process.env.VUE_APP_EPUB_URL,
    method: 'get',
    responseType: 'blob',
    timeout: 180 * 1000,
    onDownloadProgress: progressEvent => {
      // 监视下载进度
      onProgress && onProgress(progressEvent)
    }
  }).get(`${book.categoryText}/${book.fileName}.epub`)
    .then(res => {
      const blob = new Blob([res.data]) // epubjs能识别blob对象
      setLocalForage(book.fileName, blob, () => { // 保存到indexDB 本地数据库中
        onSuccess && onSuccess(book)
      }, err => {
        onError && onError(err)
      })
    }).catch(err => { // 异常捕获
      onError && onError(err)
    })
}
