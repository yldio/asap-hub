const { process } = require('react-scripts/config/jest/fileTransform.js');

module.exports = {
  process(...args) {
    const result = process(...args);
    return {
      code: result,
    };
  },
};
