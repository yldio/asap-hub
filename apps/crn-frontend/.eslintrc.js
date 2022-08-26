module.exports = {
  extends: ['@asap-hub/eslint-config-asap-hub/react'],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'no-console': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/*test.ts', '**/*test.tsx', '**/*__mocks__/*.ts', 'src/typings/*.d.ts'],
      },
    ],
  },
};
