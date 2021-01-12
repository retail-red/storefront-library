const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');
const path = require('path');
const sass = require('sass');

const baseDevTemplate = fs.readFileSync(path.join(__dirname, 'src/dev/base.html'));

module.exports = {
  output: {
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'swc-loader',
        },
      },
      {
        test: /\.s[ac]ss$/i,
        exclude: /(node_modules)/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: sass,
            },
          },
        ],
      },
      {
        test: /\.hbs$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'handlebars-loader',
        },
      },
    ],
  },
  resolve: {
    alias: {
      handlebars: 'handlebars/dist/handlebars.min.js',
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: 'head',
      template: './src/dev/index.html',
      templateParameters: {
        base: baseDevTemplate,
      },
    }),
    new HtmlWebpackPlugin({
      inject: 'head',
      filename: 'custom',
      template: './src/dev/custom.html',
      templateParameters: {
        base: baseDevTemplate,
      },
    }),
  ],
  devServer: {
    contentBase: './dist',
    hot: true,
  },
};
