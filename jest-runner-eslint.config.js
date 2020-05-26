module.exports = {
  cliOptions: {
    maxWarnings: 0,
    reportUnusedDisableDirectives: true,
    resolvePluginsRelativeTo: require.resolve(
      '@asap-hub/eslint-config-asap-hub',
    ),
  },
};
