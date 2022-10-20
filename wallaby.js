// This is a config file for Wallaby.js
// Wallaby.js is a dev tool for JavaScript and TypeScript
// find out more here: https://wallabyjs.com/

process.env.LANG = 'en_US';
process.env.TZ = 'UTC';

module.exports = () => {
  return {
    testFramework: {
      // the jest configuration file path
      // (relative to project root)
      configFile: './jest.config.wallaby.js',
    },
  };
};
