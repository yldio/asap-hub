const {
  defaults: { testMatch },
} = require('jest-config');
const testFiles = [...testMatch, '**/*{t,T}est*.{js,jsx,ts,tsx}'];

module.exports = {
  parser: '@typescript-eslint/parser',
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: ['packages/*/tsconfig.json', 'apps/*/tsconfig.json'],
      },
    },
    jest: {
      version: require('jest-config/package.json').version,
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

    'no-useless-constructor': 'off',
    'no-multi-assign': 'off',
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
        '@typescript-eslint/no-empty-function': 'off',
        'no-var': 'off',
        'no-new-func': 'off',
      },
    },
  ],
};
