module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  'outputDir': 'dist',
  'assetsDir': 'static',
  configureWebpack: {
    performance: {
      hints: 'warning',
      maxAssetSize: 524288 * 10,
      maxEntrypointSize: 524288 * 10
    }
  }
}
