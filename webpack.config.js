const resolve = require('path').resolve
const webpack = require('webpack')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin')
const url = require('url')
const publicPath = ''

const entries = {
  vendor: './src/vendor'
}

glob.sync('./src/pages/**/**.js').forEach(path => {
  const chunk = path.split('./src/pages/')[1].split('.js')[0].split('/')[0]
  entries[chunk] = path
})

const plugins = []
plugins.push(new webpack.optimize.CommonsChunkPlugin({
  names: ['vendor', 'manifest']
// }),
// new HtmlWebpackPlugin({
//   template: 'src/index.html'
}))

glob.sync('./src/pages/**/**.html').forEach(path => {
  const chunk = path.split('./src/pages/')[1].split('.html')[0].split('/')[0]
  
  var conf = {
    filename: chunk + '.html',
    template: 'src/pages/' + chunk + '/' + chunk + '.html', // 模板路径
    chunks: [chunk, 'vendor', 'manifest'], // 每个html引用的js模块
    inject: true              // js插入位置
  }
  plugins.push(new HtmlWebpackPlugin(conf))
})

module.exports = (options = {}) => ({
  // entry: {
  //   vendor: './src/vendor',
  //   index: './src/main.js'
  // },
  entry: entries,
  output: {
    path: resolve(__dirname, 'dist'),
    filename: options.dev ? '[name].js' : '[name].js?[chunkhash]',
    chunkFilename: '[id].js?[chunkhash]',
    publicPath: '/'
  },
  module: {
    rules: [{
        test: /\.vue$/,
        use: ['vue-loader']
      },
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000
          }
        }]
      }
    ]
  },
  plugins: plugins,
  // plugins: [
  //   new webpack.optimize.CommonsChunkPlugin({
  //     names: ['vendor', 'manifest']
  //   // }),
  //   // new HtmlWebpackPlugin({
  //   //   template: 'src/index.html'
  //   })
  // ],
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src')
    }
  },
  devServer: {
    host: '127.0.0.1',
    port: 8010,
    proxy: {
      '/api/': {
        target: 'http://47.100.84.71:80',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },

    historyApiFallback: {
      index: url.parse(options.dev ? '/assets/' : publicPath).pathname
    }
  },
  devtool: options.dev ? '#eval-source-map' : '#source-map'
})


