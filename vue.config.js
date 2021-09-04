module.exports = {
  chainWebpack: config => {
    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use('vue-loader')
      .options({
        compilerOptions: {
          isCustomElement: tag => tag.startsWith('trix')
        }
      })
  }
}
