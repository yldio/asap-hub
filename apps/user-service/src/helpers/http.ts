import debug from 'debug';
import Boom from '@hapi/boom';
import Intercept from 'apr-intercept';
import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';

const trace = debug('http');
export const wrapper = (fn: Function) => async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const [err, result] = await Intercept(fn(event));

  if (err) {
    debug(err);
    const error = Boom.isBoom(err) ? err : Boom.internal();
    const payload = error.output.payload as any;
    if (error.data) {
      payload.data = error.data;
    }

    return {
      statusCode: error.output.statusCode,
      body: JSON.stringify(payload),
      headers: {
        ...error.output.headers,
        'content-type': 'application/json',
      },
    };
  }

  if (result.output) {
    return {
      statusCode: result.output.statusCode || 200,
      body: JSON.stringify(result.output.payload || ''),
      headers: {
        ...result.output.headers,
        'content-type': 'application/json',
      },
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result),
    headers: {
      'content-type': 'application/json',
    },
  };
};

export const normalize = (event: any): any => {
  return {
    ...event,
    headers: Object.entries(event.headers).reduce((headers, [key, value]) => {
      return {
        ...headers,
        [key.toLowerCase()]: value,
      };
    }, {}),
  };
};
