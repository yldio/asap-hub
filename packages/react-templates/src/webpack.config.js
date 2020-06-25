const path = require('path');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const TemplatePlugin = require('./template-plugin');

const { ORIGIN = 'https://hub.asap.science' } = process.env;

const outputDir = path.resolve(__dirname, '..', 'build');
module.exports = {
  target: 'node',
  mode: 'production',
  output: {
    libraryTarget: 'commonjs',
    path: outputDir,
  },
  module: {
    rules: [
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        use: {
          loader: require.resolve('url-loader'),
          options: {
            esModule: false,
            limit: false,
            name: 'static/[name].[hash:8].[ext]',
          },
        },
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: require.resolve('babel-loader'),
          options: {
            presets: [require.resolve('babel-preset-react-app')],
            babelrc: false,
            configFile: false,
          },
        },
      },
    ],
  },
  plugins: [new TemplatePlugin({ origin: ORIGIN })],
  resolve: { plugins: [PnpWebpackPlugin] },
  resolveLoader: {
    plugins: [PnpWebpackPlugin.moduleLoader(module)],
  },
};
