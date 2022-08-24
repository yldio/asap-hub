const serverlessWebpack = require('serverless-webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: serverlessWebpack.lib.entries,
  target: 'node',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(ts)$/,
        exclude: /node_modules/,
        use: {
          loader: require.resolve('babel-loader'),
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
    fallback: {
      util: false,
    },
  },
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  devtool: 'source-map',
  externals: ['aws-sdk'],
  plugins: [
    new CopyPlugin({
      patterns: [{ from: './src/migrations', to: './migrations' }],
    }),
  ],
};
