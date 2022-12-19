import pino, { type Logger as PinoLogger } from 'pino';
import pinoHttp, { HttpLogger } from 'pino-http';
import { IncomingMessage } from 'http';

import { lambdaRequestTracker, pinoLambdaDestination } from 'pino-lambda';
import noir from 'pino-noir';
import { UserResponse } from '@asap-hub/model';

export type Logger = PinoLogger;

export const redaction = noir(['req.headers.authorization'], '*');

type IncomingMessageWithUser = IncomingMessage & {
  loggedInUser?: UserResponse;
};

const destination = pinoLambdaDestination();

// we are not testing stdout
/* istanbul ignore next */
export const getCloudWatchLogger = ({
  logEnabled,
  logLevel,
}: {
  logEnabled: boolean;
  logLevel: string;
}) =>
  pino(
    {
      enabled: logEnabled,
      level: logLevel,
      formatters: {
        level: (label: string) => ({ level: label }),
      },
    },
    destination,
  );

// we are not testing stdout
/* istanbul ignore next */
export const getPrettyLogger = ({
  logEnabled,
  logLevel,
}: {
  logEnabled: boolean;
  logLevel: string;
}) =>
  pino({
    enabled: logEnabled,
    level: logLevel,
    formatters: {
      level: (label: string) => ({ level: label }),
    },
    transport: {
      target: 'pino-pretty',
    },
  });

export const withRequest = lambdaRequestTracker();

export const getHttpLogger = ({ logger }: { logger: Logger }): HttpLogger =>
  pinoHttp({
    logger,
    serializers: redaction,
    customProps: (req) => ({
      userId: (req as IncomingMessageWithUser).loggedInUser?.id,
    }),
  });
