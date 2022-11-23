module.exports = {
  presets: [
    [require.resolve('@babel/preset-env'), { targets: { node: '16' } }],
    require.resolve('@babel/preset-typescript'),
  ],
};
