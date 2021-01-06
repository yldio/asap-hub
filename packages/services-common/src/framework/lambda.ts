import Intercept from 'apr-intercept';
import Boom from '@hapi/boom';
import Bourne from '@hapi/bourne';
import Debug from 'debug';
import Joi from '@hapi/joi';
import {
  APIGatewayProxyResultV2,
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from 'aws-lambda';
import { origin } from '../config';

const debug = Debug('http');

interface Query {
  [key: string]: string[] | string | undefined;
}
export interface Request {
  method: 'get' | 'post';
  headers: Record<string, string>;
  params?: { [key: string]: string };
  payload?: unknown;
  query?: Query;
}

export interface Response {
  statusCode?: number | undefined;
  payload?: unknown;
  headers?:
    | {
        [header: string]: string | number | boolean;
      }
    | undefined;
}

interface HTTPError extends Error {
  data: unknown;
  response?: {
    statusCode: number;
    body: string;
  };
}

export const response = (
  res: APIGatewayProxyStructuredResultV2,
): APIGatewayProxyResultV2 => ({
  ...res,
  headers: {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': true,
    ...res.headers,
  },
});

export const validate = <T>(
  prop: string,
  value: T,
  schema: Joi.AnySchema,
  options?: Joi.ValidationOptions,
): T => {
  const { error, value: res } = schema.validate(value, options);
  if (error) {
    throw Boom.badRequest(`Error "${prop}": ${error.message}`, {
      details: error.details,
    });
  }
  return res;
};

const handlerError = (error: Error): APIGatewayProxyResultV2 => {
  debug('Error caught on request', error);

  // Squidex errors
  const err = error as HTTPError;
  if (err.response && err.response.body) {
    try {
      const { message, details } = JSON.parse(err.response.body) as {
        message: string;
        details?: string[];
      };
      return response({
        statusCode: err.response.statusCode,
        body: JSON.stringify({
          message: `Squidex Error: ${message}`,
          details,
        }),
        headers: { 'content-type': 'application/json' },
      });
    } catch (e) {
      // safe parse, in case squidex responds with non-json body
      return response({
        statusCode: err.response.statusCode,
        body: JSON.stringify({ message: 'Unable to parse error message' }),
        headers: { 'content-type': 'application/json' },
      });
    }
  }

  // Boom errors created on controllers handlers and fail-safe
  const internalError = Boom.isBoom(error) ? error : Boom.internal();
  return response({
    statusCode: internalError.output.statusCode,
    body: JSON.stringify({
      ...internalError.output.payload,
      ...(internalError.data ? internalError.data : {}),
    }),
    headers: {
      'content-type': 'application/json',
      ...(internalError.output.headers as
        | { [header: string]: string | number | boolean }
        | undefined),
    },
  });
};

// ensure any thrown exception is handled and returned correctly
// complaining about `request` here is a lint rule bug
// eslint-disable-next-line no-unused-vars
export const http = (fn: (request: Request) => Promise<Response>) => async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => {
  // we assume the body is json
  let body;
  try {
    body = event.body && Bourne.parse(event.body);
  } catch (err) {
    const boom = Boom.badRequest(err.message);
    return response({
      statusCode: boom.output.statusCode,
      body: JSON.stringify(boom.output.payload),
    });
  }

  // lowercase headers
  const headers =
    event.headers &&
    Object.entries(event.headers).reduce(
      (res, [key, value]) => ({
        ...res,
        [key.toLowerCase()]: value,
      }),
      {},
    );

  const query: Query = Object.fromEntries(
    Object.entries(event.queryStringParameters || {}).map(([key, value]) => [
      key,
      value?.includes(',') ? value.split(',') : value,
    ]),
  );

  const request = {
    method: event.requestContext.http.method.toLocaleLowerCase(),
    headers,
    params: event.pathParameters,
    payload: body,
    query,
  } as Request;

  const [err, res] = await Intercept(fn(request));

  if (err) {
    return handlerError(err);
  }

  return response({
    statusCode: res.statusCode || 200,
    body: JSON.stringify(res.payload || null),
    headers: {
      'content-type': 'application/json',
      ...res.headers,
    },
  });
};
