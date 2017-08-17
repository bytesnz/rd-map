let HtmlWebpackPlugin = require('html-webpack-plugin');
let package = require('./package.json');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: './dist',
    filename: 'app.js',
  },
  devtool: 'source-map',
  resolve: {
    extensions: [ '.tsx', '.ts', '.jsx', '.js', '.json', '.scss', '.sass', '.css' ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Reef Doctor Maps',
      template: 'src/index.ejs',
      chunksSortMode: 'dependency'
    }),
    new ExtractTextPlugin('app.css')
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
          fallbackLoader: 'style-loader',
          loader: ['css-loader', 'postcss-loader', 'sass-loader']
        })/*,
        options: {
          plugins: function() {
            return [autoprefixer, precss];
          }
        }*/
      },
      {
        test: /\.(png|svg)$/,
        use: { loader: 'url-loader', options: { limit: 100000 } },
      }
    ]
  },
}
