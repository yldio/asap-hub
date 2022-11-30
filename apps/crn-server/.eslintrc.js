module.exports = {
  ignorePatterns: ['working-groups.data-provider.ts'],
  rules: {
    'no-use-before-define': 'off',
    'no-unused-vars': 'off',
    'no-await-in-loop': 'off',
    'lines-between-class-members': 'off',
    'no-restricted-syntax': [
      'error',
      'ForInStatement',
      'LabeledStatement',
      'WithStatement',
    ],
    'no-underscore-dangle': ['error', { allow: ['__typename'] }],
    'no-dupe-class-members': 'off',
    '@typescript-eslint/no-unused-vars': 2,
    '@typescript-eslint/no-dupe-class-members': ['error'],
    'no-empty-function': 'off',
    '@typescript-eslint/no-empty-function': ['error'],
    'class-methods-use-this': ['error', { exceptMethods: ['up', 'down'] }],
  },
};
