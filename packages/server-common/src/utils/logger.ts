import { IncomingMessage } from 'http';
import pino, { type Logger as PinoLogger } from 'pino';
import pinoHttp, { Options as PinoHttpOptions } from 'pino-http';

import { UserResponse } from '@asap-hub/model';
import { lambdaRequestTracker, pinoLambdaDestination } from 'pino-lambda';
import noir from 'pino-noir';

export type Logger = PinoLogger;

export const redaction = noir(['req.headers.authorization'], '*');

type IncomingMessageWithUser = IncomingMessage & {
  loggedInUser?: UserResponse;
};

type Options = {
  logEnabled: boolean;
  logLevel: string;
};

const destination = pinoLambdaDestination();

// we are not testing stdout
/* istanbul ignore next */
export const getCloudWatchLogger = ({ logEnabled, logLevel }: Options) =>
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
export const getPrettyLogger = ({ logEnabled, logLevel }: Options) =>
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

export const getHttpLogger = ({
  logger,
  serializers,
  customProps,
}: {
  logger: Logger;
  serializers?: PinoHttpOptions['serializers'];
  customProps?: PinoHttpOptions['customProps'];
}) =>
  pinoHttp({
    logger,
    serializers,
    customProps,
  });

export const addUserIdProp: PinoHttpOptions['customProps'] = (req) => ({
  userId: (req as IncomingMessageWithUser).loggedInUser?.id,
});
