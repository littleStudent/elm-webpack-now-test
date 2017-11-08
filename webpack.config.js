var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

const prod = 'production';
const dev = 'development';

// determine build env
const TARGET_ENV = process.env.npm_lifecycle_event === 'build' ? prod : dev;
const isDev = TARGET_ENV == dev;
const isProd = TARGET_ENV == prod;

// entry and output path/filename variables
const entryPath = path.join(__dirname, 'src/index.js');
const outputPath = path.join(process.cwd(), 'dist');
const outputFilename = isProd ? '[name]-[hash].js' : '[name].js';

console.log('WEBPACK GO! Building for ' + TARGET_ENV);

// common webpack config (valid for dev and prod)
var commonConfig = {
  entry: './src/index.js',
  stats: {
    // Configure the console output
    errorDetails: true, //this does show errors
    colors: true,
    modules: true,
    reasons: true,
  },
  output: {
    path: outputPath,
    filename: `${outputFilename}`,
  },
  resolve: {
    extensions: ['.js', '.elm'],
    modules: ['node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.(eot|ttf|woff|woff2|svg)$/,
        use: 'file-loader?publicPath=../../&name=static/css/[hash].[ext]',
      },
    ],
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [autoprefixer()],
      },
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: './index.html',
      hash: false,
      inject: true,
      compile: true,
      favicon: false,
      minify: {
        caseSensitive: false,
        collapseWhitespace: true,
        keepClosingSlash: true,
      },
      cache: false,
      showErrors: true,
      chunks: 'all',
      excludeChunks: [],
      title: 'Webpack App',
      xhtml: true,
      chunksSortMode: function sort(left, right) {
        let leftIndex = entryPoints.indexOf(left.names[0]);
        let rightindex = entryPoints.indexOf(right.names[0]);
        if (leftIndex > rightindex) {
          return 1;
        } else if (leftIndex < rightindex) {
          return -1;
        } else {
          return 0;
        }
      },
    }),
  ],
};

// additional webpack settings for prod env (when invoked via 'npm run build')
if (isProd === true) {
  module.exports = merge(commonConfig, {
    entry: entryPath,
    module: {
      rules: [
        {
          test: /\.elm$/,
          exclude: [/elm-stuff/, /node_modules/],
          use: [
            {
              loader: 'elm-webpack-loader',
              options: {
                verbose: true,
                warn: true,
                debug: true,
                files: [path.resolve(__dirname, './src/elm/Main.elm')],
              },
            },
          ],
        },
        {
          test: /\.sc?ss$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader', 'postcss-loader', 'sass-loader'],
          }),
        },
      ],
    },
    plugins: [
      new webpack.NoEmitOnErrorsPlugin(),
      new ExtractTextPlugin({
        filename: 'static/css/[name]-[hash].css',
        allChunks: true,
      }),
      new CopyWebpackPlugin([
        {
          from: 'src/static/img/',
          to: 'static/img/',
        },
        {
          from: 'src/favicon.ico',
        },
      ]),
      new webpack.LoaderOptionsPlugin({
        debug: true,
      }),

      // extract CSS into a separate file
      // minify & mangle JS/CSS
      new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        compressor: {
          warnings: false,
        },
        // mangle:  true
      }),
    ],
  });
}
