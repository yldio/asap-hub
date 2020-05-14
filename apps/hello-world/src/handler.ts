import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

export const hello: APIGatewayProxyHandler = async () => ({
  statusCode: 200,
  body: JSON.stringify({
    hello: 'world',
  }),
});
