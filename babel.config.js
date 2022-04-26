const { presets, plugins, ...base } = require('./babel-base.config.js');

module.exports = {
  ...base,
  presets: [
    ...presets,
    [
      require.resolve('@babel/preset-env'),
      { targets: { node: true }, modules: false },
    ],
  ],
  plugins: [...plugins],
};
