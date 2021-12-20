import Boom from '@hapi/boom';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import * as Sentry from '@sentry/serverless';
import { sentryDsn, environment, currentRevision } from '../../config';

Sentry.AWSLambda.init({
  dsn: sentryDsn,
  tracesSampleRate: 1.0,
  environment,
  release: currentRevision,
});

const handle = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2<never>> => {
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

export const handler = Sentry.AWSLambda.wrapHandler(handle);
