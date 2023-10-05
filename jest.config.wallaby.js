const baseConfig = require('./jest.config.js');
baseConfig.projects.forEach((p) => {
  if (p.collectCoverageFrom) {
    p.collectCoverageFrom = ['**/src/**/*.{js,jsx,ts,tsx}'];
  }
  delete p.watchPlugins;
});

baseConfig.projects = baseConfig.projects.filter(
  (p) => !p.rootDir?.endsWith('packages/contentful-app-extensions'),
);

module.exports = {
  ...baseConfig,
  collectCoverageFrom: ['**/src/**/*.{js,jsx,ts,tsx}'],
};
