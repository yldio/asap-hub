module.exports = {
  cliOptions: {
    maxWarnings: 0,
    reportUnusedDisableDirectives: 'error',
    resolvePluginsRelativeTo: require.resolve(
      '@asap-hub/eslint-config-asap-hub',
    ),
  },
};
