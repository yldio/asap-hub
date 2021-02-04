import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { Span } from 'opentracing';
import { User } from '@asap-hub/auth';

export {};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      context: APIGatewayProxyEventV2['requestContext'];
      loggedUser?: User;
      span?: Span;
    }
  }
}
