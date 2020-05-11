const { resolve } = require('path');

module.exports = {
  extends: [
    require.resolve('../../.eslintrc.js'),
    require.resolve('eslint-config-react-app', {
      paths: [resolve(__dirname, '../..')],
    }),
    require.resolve('eslint-config-prettier', {
      paths: [resolve(__dirname, '../..')],
    }),
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',

    'no-console': 'off',

    '@typescript-eslint/explicit-function-return-type': 'off',
  },
};
