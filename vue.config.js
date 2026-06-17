const webpack = require('webpack');
module.exports = {
  publicPath: '',
  pluginOptions: {
    webpackBundleAnalyzer: {
      analyzerMode: process.env.ANALYZE ? 'server' : 'disabled'
    }
  },
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
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1
      })
    ],
    resolve: {
      fallback: {
        fs: false,
        path: require.resolve('path-browserify'),
        stream: require.resolve('stream-browserify'),
        crypto: require.resolve('crypto-browserify'),
        buffer: require.resolve('buffer/'),
        process: require.resolve('process/browser')
      }
    },
    module: {
      rules: [
        {
          test: /\.(png)(\?.*)?$/,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 20480 // 20KB 以下转 base64
            }
          },
          generator: {
            filename: 'img/[name].[hash:8][ext]'
          }
        }
      ]
    }
  },
  chainWebpack: config => {
    config.optimization.delete('splitChunks');
    config.optimization.delete('runtimeChunk');
  }
}
