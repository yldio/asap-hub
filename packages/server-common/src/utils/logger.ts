import pinoHttp, { HttpLogger } from 'pino-http';
import pino, { PinoLambdaLogger } from 'pino-lambda';
import noir from 'pino-noir';

export const redaction = noir(['req.headers.authorization'], '*');

export type Logger = PinoLambdaLogger;
// we are not testing stdout
/* istanbul ignore next */
export const getLogger = ({
  logEnabled,
  logLevel,
}: {
  logEnabled: boolean;
  logLevel: string;
}): Logger =>
  pino({
    enabled: logEnabled,
    level: logLevel,
    formatters: {
      level: (label: string) => ({ level: label }),
    },
  });

export const getHttpLogger = ({ logger }: { logger: Logger }): HttpLogger =>
  pinoHttp({
    logger,
    serializers: redaction,
  });
