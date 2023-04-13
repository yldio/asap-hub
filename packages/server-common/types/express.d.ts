import { gp2, UserResponse } from '@asap-hub/model';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { Logger } from 'pino-http';
export {};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      context: APIGatewayProxyEventV2['requestContext'];
      span?: Span;
      loggedInUser?: UserResponse | gp2.UserResponse;
    }

    interface Response {
      log?: Logger;
    }
  }
}
