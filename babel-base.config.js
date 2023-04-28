module.exports = {
  presets: [require.resolve('@babel/preset-typescript')],
  plugins: [
    [require.resolve('@babel/plugin-transform-runtime'), { corejs: 3 }],

    process.env.NODE_ENV === 'test'
      ? {}
      : require.resolve('babel-plugin-transform-inline-environment-variables'),
    require.resolve('babel-plugin-lodash'),
    require.resolve('@jeysal/babel-plugin-ramda'),
  ],
  babelrcRoots: ['.', 'apps/*', 'packages/**'],
};
