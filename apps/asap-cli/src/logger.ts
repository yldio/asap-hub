/* eslint-disable no-console */
const { NODE_ENV } = process.env;

// no-op so we don't polute test report
const logger = NODE_ENV ? () => {} : console.log;

export default logger;
