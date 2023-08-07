module.exports = {
  extends: ['@asap-hub/eslint-config-asap-hub'],
  rules: {
    'no-await-in-loop': 'off',
    'no-restricted-syntax': [
      'error',
      'ForInStatement',
      'LabeledStatement',
      'WithStatement',
    ],
  },
};
