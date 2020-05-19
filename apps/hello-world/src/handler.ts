import { APIGatewayProxyHandler } from 'aws-lambda';

export const hello: APIGatewayProxyHandler = async () => ({
  statusCode: 200,
  body: JSON.stringify({
    hello: 'world',
  }),
  headers: {
    'content-type': 'application/json',
  },
});

export const error: APIGatewayProxyHandler = async () => {
  throw new Error('Not implemented');
};
