import { APIGatewayProxyHandler } from 'aws-lambda';

export const hello: APIGatewayProxyHandler = async () => ({
  statusCode: 200,
  body: JSON.stringify({
    hello: 'world',
  }),
});

export const error: APIGatewayProxyHandler = async () => {
  throw new Error('Not implemented');
};
