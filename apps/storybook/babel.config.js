module.exports = {
  resolve: {
    modules: ['stories'],
  },
  presets: [
    [require.resolve('babel-preset-react-app'), { runtime: 'automatic' }],
  ],
};
