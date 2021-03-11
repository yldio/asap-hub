import debug from 'debug';
import { Logger, createLogger, transports } from 'winston';

const logger = debug('asap-server');
export default logger;

export const loggerFactory = (): Logger =>
  createLogger({
    level: 'info',
    transports: [new transports.Console()],
    exitOnError: false,
  });
