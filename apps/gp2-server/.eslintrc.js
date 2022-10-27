module.exports = {
  rules: {
    'no-use-before-define': 'off',
    'no-unused-vars': 'off',
    'no-await-in-loop': 'off',
    'lines-between-class-members': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    'no-restricted-syntax': [
      'error',
      'ForInStatement',
      'LabeledStatement',
      'WithStatement',
    ],
    'no-underscore-dangle': ['error', { allow: ['__typename'] }],
    'no-dupe-class-members': 'off',
    '@typescript-eslint/no-dupe-class-members': ['error'],
    'no-empty-function': 'off',
    'no-redeclare': 'off',
    '@typescript-eslint/no-empty-function': ['error'],
    '@typescript-eslint/no-redeclare': ['error'],
  },
};
