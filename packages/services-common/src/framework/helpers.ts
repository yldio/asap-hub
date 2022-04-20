import Boom from '@hapi/boom';
import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { response } from './lambda';

export function errorResponse(err: unknown): APIGatewayProxyResultV2 {
  if (err instanceof Error) {
    const boom = Boom.badRequest(err.message);
    return response({
      statusCode: boom.output.statusCode,
      body: JSON.stringify(boom.output.payload),
    });
  }

  return response({
    statusCode: 500,
    body: 'Unexpected Error',
  });
}
