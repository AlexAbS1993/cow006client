const path = require('path');
const env = require('dotenv')
const HtmlWebpackPlugin = require('html-webpack-plugin')

env.config({path: `.${process.env.NODE_ENV}.env`})

let entryConst = process.env.mode === "development" ? "./src/dev.consts.ts" : "./src/prod.consts.ts"
let dist = process.env.mode === "development" ? 'dev' : 'pub'

  module.exports = {
    mode: "development",
    watch: true,
    entry: {
      bundle: './src/index.ts',
      // consts: entryConst
    },
    output: {
      path: path.resolve(__dirname, dist, 'dist'),
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./templates/index.template.html",
        filename: "index.html",
        dev: process.env.mode === "development" ? true : false,
        prod: process.env.mode === "production" ? true : false
      }),
    ],
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
  };
