import debug from 'debug';
import createLogger, { Logger } from 'pino';
import { logLevel } from '../config';

const logger = debug('asap-server');
export default logger;

export const loggerFactory = (): Logger =>
  createLogger({
    level: logLevel,
    useLevelLabels: true,
  });
