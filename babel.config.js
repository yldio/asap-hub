module.exports = {
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: {
          node: true,
        },
      },
    ],
    require.resolve('@babel/preset-typescript'),
  ],
  plugins: [
    [require.resolve('@babel/plugin-transform-runtime'), { corejs: 3 }],
  ],
  babelrcRoots: ['.', 'apps/*', 'packages/*'],
};
