import Debug from 'debug';
import Joi from '@hapi/joi';
import Boom from '@hapi/boom';
import Bourne from '@hapi/bourne';
import Intercept from 'apr-intercept';
import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';

export interface HTTPOptions {
  handler: Function;
  options: {
    validate: {
      headers?: Joi.AnySchema;
      payload?: Joi.AnySchema;
      params?: Joi.AnySchema;
      query?: Joi.AnySchema;
    };
  };
}

export interface HTTPEvent {
  headers?: any;
  params?: any;
  payload?: any;
  query?: any;
}

const debug = Debug('http');
const lowercaseKeys = (headers: any): any => {
  return Object.entries(headers).reduce((res, [key, value]) => {
    return {
      ...res,
      [key.toLowerCase()]: value,
    };
  }, {});
};

const createHttpResponse = (object: any): APIGatewayProxyResult => {
  return {
    statusCode: object.statusCode || 200,
    body: JSON.stringify(object.payload),
    headers: {
      'content-type': 'application/json',
      ...object.headers,
    },
  };
};

const errorHandler = async (fn: Function): Promise<APIGatewayProxyResult> => {
  const [err, result] = await Intercept(fn());
  if (err) {
    debug(`request error`, err);
    const error = Boom.isBoom(err) ? err : Boom.internal();
    if (error.data) {
      return createHttpResponse({
        ...error.output,
        payload: {
          ...error.output.payload,
          data: error.data,
        },
      });
    }

    return createHttpResponse(error.output);
  }

  if (result.output) {
    return createHttpResponse(result.output);
  }

  return createHttpResponse({
    payload: result,
  });
};

// This takes inspiration on hapijs route options (https://hapi.dev/api/?v=19.1.1#route-options)
// The requirements are:
//  - validate headers, params, payload and query
//  - parse body as JSON
//  - handle result and exceptions and return a normalised response
export const http = async (
  event: APIGatewayProxyEvent,
  options: HTTPOptions,
): Promise<APIGatewayProxyResult> =>
  errorHandler(async () => {
    const {
      handler,
      options: { validate = {} },
    } = options;

    let payload;
    try {
      payload = (payload && Bourne.parse(event.body || {})) || null;
    } catch (err) {
      throw Boom.badRequest(err.message);
    }

    const { pathParameters, queryStringParameters, multiValueHeaders } = event;
    const { error, value } = Joi.object({
      headers: validate.headers || Joi.any().optional(),
      params: validate.params || Joi.any().optional(),
      payload: validate.payload || Joi.any().optional(),
      query: validate.query || Joi.any().optional(),
    }).validate({
      headers: multiValueHeaders && lowercaseKeys(multiValueHeaders),
      params: pathParameters,
      payload,
      query: queryStringParameters,
    });

    if (error) {
      throw Boom.badRequest('', error.details);
    }

    return handler(value);
  });
