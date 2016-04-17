const webpack = require('webpack');
const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const isomorphicPath = path.resolve(__dirname, 'src/common/isomorphic.js');

const NODE_MODULES = path.resolve(__dirname, 'node_modules');
const reactPath = path.resolve(NODE_MODULES, 'react/dist/react.min.js');
const reactLibPath = path.resolve(NODE_MODULES, 'react/lib');
const reactRouterPath = path.resolve(NODE_MODULES, 'react-router/umd/ReactRouter.min.js');

const config = {
  // entry: [
  //   'babel-polyfill',
  //   './src/index.js',
  // ],
  entry: {
    vendors: ['react', 'babel-polyfill'],
    app: path.resolve(__dirname, 'src/index.js'),
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$|\.js?$/,
        exclude: /node_modules/,

        // loader: 'react-hot!babel'
        loader: 'react-hot!babel',
      },
      {
        test: /\.css/,
        loader: 'style!css'
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style',
          'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]' +
          '!autoprefixer-loader!sass-loader'
        ),
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=100000000',
      },
      {
        test: /\.svg$/,
        loader: 'babel!react-svg'
      },
    ],
    noParse: [reactPath],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      'react/lib': reactLibPath,
      react: reactPath,
      'react-router': reactRouterPath,
      'isomorphic': isomorphicPath,
    },

  },
  output: {
    path: './dist/',
    filename: '[name].[chunkhash].js',
    chunkFilename: '[chunkhash].js',
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js',Infinity),
    new ExtractTextPlugin('stylesheets/[name].css', {
      allChunks: true,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      },
      compress: {
        warnings: false,
      },
      sourceMap: false,
    }),
  ],
};

module.exports = config;

