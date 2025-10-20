const { overrides } = require('.');

module.exports = {
  extends: [
    '@asap-hub/eslint-config-asap-hub',
    'eslint-config-react-app',
    'plugin:react-hooks/recommended',
    'eslint-config-prettier',
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',

    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/no-empty-function': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',

    // testing-library's waitFor is sometimes used in beforeEach and requires an expect inside
    'jest/no-standalone-expect': 'off',

    // Warn when hooks don't include a dependency array (even if empty)
    'no-restricted-syntax': [
      'warn',
      {
        selector:
          'CallExpression[callee.name=/^use(Effect|LayoutEffect|ImperativeHandle|Callback|Memo)$/][arguments.length=1]',
        message:
          'Consider adding a dependency array to this hook. Omitting it means the effect runs after every render. Use an empty array [] if you want it to run only once on mount.',
      },
    ],
  },
  overrides,
};
