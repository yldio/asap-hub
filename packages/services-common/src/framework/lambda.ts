import { GenericError, NotFoundError, ValidationError } from '@asap-hub/errors';
import Boom from '@hapi/boom';
import Bourne from '@hapi/bourne';
import Intercept from 'apr-intercept';
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
  APIGatewayProxyResultV2,
  APIGatewayProxyStructuredResultV2,
  Context,
} from 'aws-lambda';
import Debug from 'debug';
import { origin } from '../config';
import { errorResponse } from './helpers';

const debug = Debug('http');

interface Query {
  [key: string]: string[] | string | undefined;
}
export interface Request<T = unknown> {
  method: 'get' | 'post';
  headers: Record<string, string>;
  params?: { [key: string]: string };
  payload: T;
  query?: Query;
}

export interface Response<T = unknown> {
  statusCode?: number | undefined;
  payload?: T;
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

export type Handler = APIGatewayProxyHandlerV2 &
  ((
    event: Parameters<APIGatewayProxyHandlerV2>[0],
    context?: Context,
  ) => ReturnType<APIGatewayProxyHandlerV2>);

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

const handlerError = (error: Error): APIGatewayProxyResultV2 => {
  debug('Error caught on request', error);

  // Squidex GOT errors
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

  if (err instanceof GenericError) {
    if (err instanceof NotFoundError) {
      return response({
        statusCode: 404,
        body: JSON.stringify({
          error: 'Not Found',
          statusCode: 404,
        }),
        headers: {
          'content-type': 'application/json',
        },
      });
    }

    if (err instanceof ValidationError) {
      return response({
        statusCode: 400,
        body: JSON.stringify({
          error: 'Bad Request',
          statusCode: 400,
        }),
        headers: {
          'content-type': 'application/json',
        },
      });
    }
  }

  const isObject = (obj: unknown): obj is Record<string, unknown> =>
    obj !== null && typeof obj === 'object';

  // Boom errors created on controllers handlers and fail-safe
  const internalError = Boom.isBoom(error) ? error : Boom.internal();
  return response({
    statusCode: internalError.output.statusCode,
    body: JSON.stringify({
      ...internalError.output.payload,
      ...(isObject(internalError.data) ? internalError.data : {}),
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
export const http =
  <T = unknown>(fn: (request: Request<T>) => Promise<Response>) =>
  async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    // we assume the body is json
    let body;
    try {
      body = event.body && Bourne.parse(event.body);
    } catch (err) {
      return errorResponse(err);
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
    } as Request<T>;

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
