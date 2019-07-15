const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  devtool: 'eval',
  context: path.resolve(__dirname, '..'),
  entry: ['@babel/polyfill', './src/index.js'],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    noInfo: false,
    hot: true,
    inline: true,
    proxy: {
      '/': {
        bypass: function () {
          return '/static/index.html';
        }
      },
      '/user/**': {
        target: 'http://localhost:9001',
        secure: false,
        changeOrigin: true
      },
      '/ws/**': {
        target: 'ws://localhost:9001',
        secure: false,
        changeOrigin: true
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules(?!\/react-native-responsive-grid)/, 
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: false }
          }
        ]
      },
      { 
        test: /\.(jpe?g|png|gif|svg)$/i, 
        use: ['file-loader?hash=sha512&digest=hex&name=[hash].[ext]'] 
      },
      {
        test: /\.css$/,
        use: ["css-loader"]
      }
    ]
  },
  resolve: {
    alias: {
      'react-native': 'react-native-web'
    }
  }, 
  plugins: [
    new HtmlWebPackPlugin({
      template: "./static/index.html",
      favicon: 'static/favicon.ico',
      filename: "./index.html"
    })
  ]
};