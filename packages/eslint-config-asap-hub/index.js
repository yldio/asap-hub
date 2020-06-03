const {
  defaults: { testMatch },
} = require('jest-config');
const testFiles = [...testMatch, '**/*{t,T}est*.{js,jsx,ts,tsx}'];

module.exports = {
  parser: '@typescript-eslint/parser',
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      },
    },
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'eslint-config-airbnb-base',
    'plugin:jest/recommended',
    'eslint-config-prettier',
    'prettier',
  ],
  rules: {
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: testFiles },
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],

    'no-nested-ternary': 'off',
  },
  overrides: [
    {
      files: ['*.d.ts'],
      rules: {
        'spaced-comment': 'off',
      },
    },
    {
      files: testFiles,
      rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
        'no-new-func': 'off',
      },
    },
  ],
};
