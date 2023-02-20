module.exports = {
  extends: ['@asap-hub/eslint-config-asap-hub/react'],
  rules: {
    'no-shadow': 'off',
    'no-underscore-dangle': ['error', { allow: ['__typename'] }],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
  },
};
