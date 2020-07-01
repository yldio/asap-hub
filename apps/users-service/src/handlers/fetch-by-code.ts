import Boom from '@hapi/boom';
import got from 'got';
import Intercept from 'apr-intercept';
import Joi from '@hapi/joi';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { config as authConfig } from '@asap-hub/auth';
import * as lambda from '../framework/lambda';
import * as auth0 from '../entities/auth0';
import Users from '../controllers/users';

export const handler: APIGatewayProxyHandler = lambda.http(
  async (request: lambda.Request): Promise<lambda.Response> => {
    const paramsSchema = Joi.object({
      code: Joi.string().required(),
    }).required();

    const params = lambda.validate('params', request.params, paramsSchema) as {
      code: string;
    };

    const users = new Users();
    const res = await users.fetchByCode(params.code);
    return {
      payload: res,
    };
  },
);
