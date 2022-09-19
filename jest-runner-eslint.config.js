module.exports = {
  cliOptions: {
    maxWarnings: 0,
    reportUnusedDisableDirectives: 'warn',
    resolvePluginsRelativeTo: require.resolve(
      '@asap-hub/eslint-config-asap-hub',
    ),
  },
};
