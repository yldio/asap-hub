const { overrides } = require('.');

module.exports = {
  extends: [
    '@asap-hub/eslint-config-asap-hub',
    'eslint-config-react-app',
    'plugin:react-hooks/recommended',
    'eslint-config-prettier',
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',

    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/no-empty-function': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',

    // testing-library's waitFor is sometimes used in beforeEach and requires an expect inside
    'jest/no-standalone-expect': 'off',
  },
  overrides,
};
