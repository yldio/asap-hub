import { APIGatewayProxyEvent } from 'aws-lambda';
import { URLSearchParams } from 'url';

export const apiGatewayEvent = (
  event: RecursivePartial<APIGatewayProxyEvent>,
): APIGatewayProxyEvent => ({
  headers: {
    'Content-Type': 'application/json',
    Accept: '*/*',
    ...event.headers,
  },
  requestContext: {
    httpMethod: 'GET',
    path: '/api',
    ...event.requestContext,
  },
  pathParameters: null,
  ...(event as APIGatewayProxyEvent),
  body:
    typeof event.body === 'object'
      ? JSON.stringify(event.body || {})
      : event.body,
});

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};
