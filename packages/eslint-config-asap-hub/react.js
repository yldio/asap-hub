module.exports = {
  extends: [
    '@asap-hub/eslint-config-asap-hub',
    'eslint-config-react-app',
    'eslint-config-prettier',
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',

    '@typescript-eslint/explicit-function-return-type': 'off',
  },
};
