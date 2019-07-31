/* eslint-disable no-extend-native */
Array.prototype.pushWidthoutDuplicate = function () {
  for (let i = 0; i < arguments.length; i++) {
    const arg = arguments[i]
    // 不存在的情况下添加 -- this指的是当前的数组
    if (this.indexOf(arg) === -1) {
      this.push(arg)
    }
  }
}