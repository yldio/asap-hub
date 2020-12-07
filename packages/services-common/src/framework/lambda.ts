import Intercept from 'apr-intercept';
import Boom from '@hapi/boom';
import Bourne from '@hapi/bourne';
import Joi from '@hapi/joi';
import {
  APIGatewayProxyResultV2,
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from 'aws-lambda';
import { origin } from '../config';

export interface Request {
  method: 'get' | 'post';
  headers: object;
  params?: { [key: string]: string };
  payload?: object;
  query?: object;
}

export interface Response {
  statusCode?: number | undefined;
  payload?: object;
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
): APIGatewayProxyResultV2 => {
  return {
    ...res,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Credentials': true,
      ...res.headers,
    },
  };
};

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
  // Squidex errors
  const err = error as HTTPError;
  if (err.response && err.response.body) {
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
      headers: {
        'content-type': 'application/json',
      },
    });
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
export const http = <T>(fn: (request: Request) => Promise<Response>) => async (
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
    Object.entries(event.headers).reduce((res, [key, value]) => {
      return {
        ...res,
        [key.toLowerCase()]: value,
      };
    }, {});

  const query: {
    [key: string]: string[] | string | undefined;
  } = Object.fromEntries(
    Object.entries(event.queryStringParameters || {}).map(([key, value]) => {
      return [key, value?.includes(',') ? value.split(',') : value];
    }),
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
