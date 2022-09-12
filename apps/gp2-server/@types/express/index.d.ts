import { gp2 } from '@asap-hub/model';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { Span } from 'opentracing';
import { Logger } from 'pino-http';
export {};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      context: APIGatewayProxyEventV2['requestContext'];
      loggedInUser?: gp2.UserResponse;
      span?: Span;
    }

    interface Response {
      log?: Logger;
    }
  }
}
