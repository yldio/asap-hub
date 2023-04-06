import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { URLSearchParams } from 'url';

export const apiGatewayEvent = (
  event: Partial<APIGatewayProxyEventV2>,
): APIGatewayProxyEventV2 => {
  return {
    headers: {
      'Content-Type': 'application/json',
      Accept: '*/*',
      ...event.headers,
    },
    requestContext: {
      http: {
        method: 'GET',
        path: '/api',
      },
    },
    pathParameters: null,
    rawQueryString: new URLSearchParams(event.queryStringParameters).toString(),
    ...event,
    body:
      typeof event.body === 'object'
        ? JSON.stringify(event.body || {})
        : event.body,
  };
};
