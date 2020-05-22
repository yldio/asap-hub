import { APIGatewayEvent } from 'aws-lambda';

export const apiGatewayEvent = (event: any): APIGatewayEvent => {
  return {
    headers: {
      'Content-Type': 'application/json',
      Accept: '*/*',
    },
    httpMethod: 'GET',
    path: '/api',
    pathParameters: null,
    queryStringParameters: null,
    resource: '/api',
    ...event,
    body: JSON.stringify(event.body || {}),
  };
};
