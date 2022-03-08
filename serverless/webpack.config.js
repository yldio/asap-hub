const serverlessWebpack = require('serverless-webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
// const PnpWebpackPlugin = require(`pnp-webpack-plugin`);

module.exports = {
  entry: serverlessWebpack.lib.entries,
  target: 'node',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(ts)$/,
        exclude: [/node_modules/, /serverless/, /test/, /__tests__/, /yarn/],
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          cacheCompression: false,
        },
      },
    ],
  },
  optimization: {
    // We do not want to minimize our code.
    minimize: false,
  },
  performance: {
    hints: false, // Turn off size warnings for entry points
  },
  stats: 'minimal',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.cjs'],
    symlinks: false,
    cacheWithContext: false,
    // plugins: [PnpWebpackPlugin],
  },
  // resolveLoader: {
  //   plugins: [PnpWebpackPlugin.moduleLoader(module)],
  // },
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  externals: ['aws-sdk'],
  devtool: 'source-map',
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: './apps/asap-server/src/migrations', to: './migrations' },
      ],
    }),
  ],
};
