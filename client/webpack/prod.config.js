const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  context: path.resolve(__dirname, '..'),
  entry: ['@babel/polyfill', './src/index.js'],
  output: {
    filename: '[hash].js'
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
            options: { minimize: true }
          }
        ]
      },
      { 
        test: /\.(jpe?g|png|gif|svg)$/i, 
        use: [{ 
          loader: 'url-loader',
          options: {
            limit: 10000,
            publicPath: "/"
          }
        }]
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
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
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ]
};