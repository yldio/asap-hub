const serverlessWebpack = require('serverless-webpack');
const babelOptions = require('../babel.config');
const path = require('path');

module.exports = {
  entry: serverlessWebpack.lib.entries,
  target: 'node',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: require.resolve('babel-loader'),
          options: babelOptions,
        },
      },
    ],
  },
  optimization: {
    // We do not want to minimize our code.
    minimize: false,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  devtool: 'source-map',
};
