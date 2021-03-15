import pino from 'pino-lambda';
import { logLevel } from '../config';

const logger = pino({
  level: logLevel,
  formatters: {
    level: (label: string) => ({ level: label }),
  },
});

export default logger;
