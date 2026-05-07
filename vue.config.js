const webpack = require('webpack');
module.exports = {
  transpileDependencies: ['mermaid'],
  configureWebpack: {
    optimization: {
      splitChunks: false,
      runtimeChunk: false,
    },
    output: {
      filename: '[name].js',
      chunkFilename: '[name].js',
    },
    plugins: [
      // 添加 LimitChunkCountPlugin 插件
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1  // 强制所有代码打包进一个文件
      })
    ]
  },
  chainWebpack: config => {
    // 删除默认的分块优化配置
    config.optimization.delete('splitChunks');
    config.optimization.delete('runtimeChunk');
    
    // 修改图片处理配置，只处理png图片，并转换为base64
    config.module
      .rule('images')
      .test(/\.(png)(\?.*)?$/)  // 只匹配png文件
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 20480, // 20KB以下的png图片转换为base64（确保mermaid-error.png能被转换）
        name: 'img/[name].[hash:8].[ext]',
        esModule: false  // 确保与CommonJS模块兼容
      });
      
    // 移除对svg、jpg等其他图片格式的处理，保持默认配置
    // 这样其他图片格式会使用Vue CLI的默认配置
  }
}
