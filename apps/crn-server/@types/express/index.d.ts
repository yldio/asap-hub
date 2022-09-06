import { UserResponse } from '@asap-hub/model';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { Logger } from 'pino-http';

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
