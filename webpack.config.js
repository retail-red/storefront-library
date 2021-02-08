const HtmlWebpackPlugin = require('html-webpack-plugin');
const sass = require('sass');

module.exports = {
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
        use: [
          {
            loader: 'handlebars-loader',
            options: {
              runtime: 'handlebars/dist/handlebars.min.js',
              ignorePartials: true,
            },
          },
        ],
      },
      {
        test: /\.md$/,
        use: [
          {
            loader: 'html-loader',
          },
          {
            loader: 'markdown-loader',
          },
        ],
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
    }),
    new HtmlWebpackPlugin({
      inject: 'head',
      filename: 'quick.html',
      template: './src/dev/quick.html',
    }),
  ],
  devServer: {
    contentBase: './dist',
    hot: true,
    host: '0.0.0.0',
  },
};
