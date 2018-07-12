const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  
    plugins: [
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: 'css/[name].css',
        chunkFilename: "[id].css"
      }),
        new HtmlWebpackPlugin({
            inject: false,
            hash: true,
            template: './src/ingeneer.html',
            filename: 'ingeneer.html'
          }),
          new CopyWebpackPlugin([
            {from:'src/styles',to:'styles'} 
          ]),
          new CopyWebpackPlugin([
            {from:'src/calculator',to:'calculator'} 
          ]),
    ],
    module: {
      rules: [
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            'sass-loader',

          ]
        }, {
          test: /\.(png|jpg)$/i,
          loader: 'file-loader?name=[path][name].[ext]!extract-loader!html-loader',
          include: path.resolve(__dirname, 'src/img')
        },
      ]
    },
};