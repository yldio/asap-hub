import go from 'apr-intercept';
import Boom from '@hapi/boom';
import Bourne from '@hapi/bourne';
import Debug from 'debug';
import Joi from '@hapi/joi';
import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import { MongoClient } from 'mongodb';

export interface Request {
  method: 'get' | 'post';
  headers: object;
  params?: object;
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

export interface RequestContext {
  connection: MongoClient;
}

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

// ensure any thrown exception is handled and returned correctly
const debug = Debug('http');
export const http = <T>(
  fn: (request: Request) => Promise<Response> | Response,
) => async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  let body;
  try {
    body = event.body && Bourne.parse(event.body);
  } catch (err) {
    const boom = Boom.badRequest(err.message);
    return {
      statusCode: boom.output.statusCode,
      body: JSON.stringify(boom.output.payload),
    };
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

  const request = {
    method: event.httpMethod.toLocaleLowerCase(),
    headers,
    params: event.pathParameters,
    payload: body,
    query: event.queryStringParameters,
  } as Request;

  const [err, res] = await go(fn(request));

  if (err) {
    debug('Error caught on request', err);
    const error = !Boom.isBoom(err)
      ? Boom.boomify(err, {
          statusCode: 500,
          data: {
            error: err,
          },
        })
      : err;

    const data = error.data as { details: unknown };
    const payload =
      data && data.details
        ? {
            ...error.output.payload,
            details: data.details,
          }
        : error.output.payload;

    return {
      statusCode: error.output.statusCode,
      body: JSON.stringify(payload),
      headers: {
        'content-type': 'application/json',
        ...(error.output.headers as
          | { [header: string]: string | number | boolean }
          | undefined),
      },
    };
  }

  return {
    statusCode: res.statusCode || 200,
    body: res.payload && JSON.stringify(res.payload),
    headers: {
      'content-type': 'application/json',
      ...res.headers,
    },
  };
};
