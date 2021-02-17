const { presets, ...base } = require('./babel-base.config.js');

module.exports = {
  ...base,
  presets: [
    ...presets,
    [
      require.resolve('@babel/preset-env'),
      { targets: { node: true }, modules: false },
    ],
  ],
  plugins: [
    // Force this transform because otherwise Webpack 4 (used in CRA) fails to parse:
    // https://github.com/webpack/webpack/issues/10227
    // Workaround forcing higher acorn major version causes other failures
    require.resolve('@babel/plugin-proposal-optional-chaining'),
    require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'),
  ],
};
