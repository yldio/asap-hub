module.exports = {
  presets: [
    [require.resolve('@babel/preset-react'), { runtime: 'automatic' }],
    '@babel/preset-typescript',
    require.resolve('babel-preset-vite'),
  ],
};
