module.exports = {
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
    '@typescript-eslint/no-non-null-assertion': 'error',
    'no-empty-function': 'off',
    '@typescript-eslint/no-empty-function': ['error'],
    'class-methods-use-this': 'off',
  },
};
