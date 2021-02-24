import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import debug from 'debug';

const logger = debug('asap-server');

export const handler: APIGatewayProxyHandlerV2<void> = async (
  event,
  context,
) => {
  logger('Request received', JSON.stringify({ event, context }, null, 2));
};
