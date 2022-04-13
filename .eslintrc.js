module.exports = {
  root: true,
  extends: require.resolve('@asap-hub/eslint-config-asap-hub'),
  rules: {
    'no-shadow': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
  },
};
