import pino from 'pino-lambda';
import noir from 'pino-noir';
import { logLevel } from '../config';

export const redaction = noir(['req.headers.authorization'], '*');

const logger = pino({
  level: logLevel,
  formatters: {
    level: (label: string) => ({ level: label }),
  },
});

export default logger;
