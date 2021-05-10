const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const sass = require('sass');

module.exports = () => {
  const { STAGE } = process.env;

  const outputPath = path.join(__dirname, STAGE === 'production' ? 'dist/prod' : 'dist/dev/');
  let publicPath;

  if (STAGE === 'production') {
    publicPath = 'https://cdn.retail.red/omni/';
  } else if (STAGE === 'development') {
    publicPath = 'https://s3.eu-central-1.amazonaws.com/retail.red-dev-public/omni-enablement/latest/';
  }

  const config = {
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
          test: /(utils.js|\.(png|jpe?g|gif|svg))$/i,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            publicPath,
          },
        },
        {
          test: /\.s[ac]ss$/i,
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
    output: {
      path: outputPath,
    },
  };

  return config;
};
