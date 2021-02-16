import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

export const handler: APIGatewayProxyHandlerV2 = (event, context) => {
  console.log(JSON.stringify({ event, context }, null, 2));
};
