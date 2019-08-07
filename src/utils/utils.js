// 转换成相对大小
export function px2rem (px) {
  const ratio = 375 / 10
  return px / ratio
}

// 转换成绝对大小 px
export function realPx (px) {
  const maxWidth = window.innerWidth > 500 ? 500 : window.innerWidth
  return px * (maxWidth / 375)
}
