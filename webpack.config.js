const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const sass = require('sass');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const bundleName = 'retailred-storefront-library-v2';

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

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
            isProduction
              ? MiniCssExtractPlugin.loader
              : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
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
        filename: 'index_v2.html',
        template: './src/dev/index_v2.html',
      }),
      new HtmlWebpackPlugin({
        inject: 'head',
        filename: 'quick_v2.html',
        template: './src/dev/quick_v2.html',
      }),
      new MiniCssExtractPlugin({
        filename: `${bundleName}.css`,
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: 'disabled',
      }),
    ],
    devServer: {
      static: {
        directory: './dist',
      },
      onBeforeSetupMiddleware: (devServer) => {
        devServer.app.get('/', (req, res) => {
          res.redirect('/index_v2.html');
        });
      },
      hot: true,
      host: '0.0.0.0',
    },
    output: {
      path: outputPath,
      filename: `${bundleName}.js`,
    },
  };

  return config;
};
