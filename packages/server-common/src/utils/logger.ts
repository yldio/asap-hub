import pino, { PinoLambdaLogger } from 'pino-lambda';
import noir from 'pino-noir';
import pinoHttp, { HttpLogger } from 'pino-http';

export const redaction = noir(['req.headers.authorization'], '*');

export const getLogger = ({
  logEnabled,
  logLevel,
}: {
  logEnabled: boolean;
  logLevel: string;
}): PinoLambdaLogger =>
  pino({
    enabled: logEnabled,
    level: logLevel,
    formatters: {
      level: (label: string) => ({ level: label }),
    },
  });

export const getHttpLogger = ({
  logger,
}: {
  logger: PinoLambdaLogger;
}): HttpLogger =>
  pinoHttp({
    logger,
    serializers: redaction,
  });

export type Logger = PinoLambdaLogger;
