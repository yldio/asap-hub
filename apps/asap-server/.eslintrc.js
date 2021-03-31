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
  },
};
