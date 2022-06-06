const crnConfig = require('./crn-config');
const gp2Config = require('./gp2-config');

const getConfig = (app) => {
  switch (app) {
    case 'gp2':
      return gp2Config;
    case 'crn':
      return crnConfig;
    default:
      return crnConfig;
  }
};

module.exports = getConfig;
