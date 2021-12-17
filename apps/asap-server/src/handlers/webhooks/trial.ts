import Boom from '@hapi/boom';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

export const handler = (
  event: APIGatewayProxyEventV2,
): APIGatewayProxyResultV2 => {
  const { q } = event.queryStringParameters || { q: '1' };

  if (q === '1') {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Hello, world!',
      }),
    };
  }
  if (q === '2') {
    return {
      statusCode: 501,
      body: JSON.stringify({
        message: 'Hello, not implmented world!',
      }),
    };
  }

  if (q === '3') {
    throw new Error('Hello, error world!');
  }
  if (q === '4') {
    throw Boom.conflict('Hello, conflict world!');
  }

  return {
    statusCode: 201,
    body: 'created',
  };
};
