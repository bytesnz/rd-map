let HtmlWebpackPlugin = require('html-webpack-plugin');
let package = require('./package.json');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'app.js',
  },
  devtool: 'source-map',
  resolve: {
    extensions: [ '.tsx', '.ts', '.jsx', '.js', '.json', '.scss', '.sass', '.css' ],
    alias: {
      'highlight.js': path.join(__dirname, '/fakeModule.js')
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Reef Doctor Maps',
      template: 'src/index.ejs',
      chunksSortMode: 'dependency'
    }),
    new ExtractTextPlugin('app.css'),
    new BundleAnalyzerPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        loader: 'source-map-loader'
      },
      {
        test: /\.(css|scss|sass)$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader', 'sass-loader']
        })/*,
        options: {
          plugins: function() {
            return [autoprefixer, precss];
          }
        }*/
      },
      {
        test: /\.(png|svg|woff|woff2)$/,
        use: { loader: 'url-loader', options: { limit: 100000 } },
      }
    ]
  },
}
