const { presets, ...base } = require('./babel-base.config.js');

module.exports = {
  ...base,
  presets: [
    ...presets,
    [require.resolve('@babel/preset-env'), { targets: { node: true } }],
  ],
};
