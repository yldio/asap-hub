import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { Span } from 'opentracing';
import { Logger } from 'pino-http';
import { UserResponse } from '@asap-hub/model';

export {};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      context: APIGatewayProxyEventV2['requestContext'];
      loggedInUser?: UserResponse;
      span?: Span;
    }

    interface Response {
      log?: Logger;
    }
  }
}
