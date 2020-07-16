import { APIGatewayEvent } from 'aws-lambda';

export const apiGatewayEvent = (event: any): APIGatewayEvent => {
  return {
    headers: {
      'Content-Type': 'application/json',
      Accept: '*/*',
      ...event.headers,
    },
    httpMethod: 'GET',
    path: '/api',
    pathParameters: null,
    queryStringParameters: null,
    resource: '/api',
    ...event,
    body:
      typeof event.body === 'object'
        ? JSON.stringify(event.body || {})
        : event.body,
  };
};
