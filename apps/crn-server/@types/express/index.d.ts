import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { Span } from 'opentracing';
import { User } from '@asap-hub/auth';
import { Logger } from 'pino-http';

export {};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      context: APIGatewayProxyEventV2['requestContext'];
      loggedInUser?: User;
      span?: Span;
    }

    interface Response {
      log?: Logger;
    }
  }
}
