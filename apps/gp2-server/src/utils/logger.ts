import pino from 'pino-lambda';
import noir from 'pino-noir';
import { logLevel, logEnabled } from '../config';

export const redaction = noir(['req.headers.authorization'], '*');

const logger = pino({
  enabled: logEnabled,
  level: logLevel,
  formatters: {
    level: (label: string) => ({ level: label }),
  },
});

export default logger;
