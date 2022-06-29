const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
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
            {
              loader: 'style-loader',
              options: {
                /* eslint-disable no-var */
                insert: function insertAtTop(element) {
                  var parent = document.querySelector('head');
                  var lastInsertedElement = window._lastElementInsertedByStyleLoader;

                  if (!lastInsertedElement) {
                    parent.insertBefore(element, parent.firstChild);
                  } else if (lastInsertedElement.nextSibling) {
                    parent.insertBefore(element, lastInsertedElement.nextSibling);
                  } else {
                    parent.appendChild(element);
                  }

                  window._lastElementInsertedByStyleLoader = element;
                },
                /* eslint-enable no-var */
              },
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: !isProduction,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: !isProduction,
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
      new BundleAnalyzerPlugin({
        analyzerMode: 'disabled',
      }),
    ],
    devServer: {
      static: {
        directory: './dist',
      },
      setupMiddlewares: (middlewares, devServer) => {
        devServer.app.get('/', (req, res) => {
          res.redirect('/index_v2.html');
        });

        return middlewares;
      },
      hot: true,
      host: '0.0.0.0',
    },
    entry: ['./src/styles/base.scss', './src/index.js'],
    output: {
      path: outputPath,
      filename: `${bundleName}.js`,
    },
  };

  return config;
};
