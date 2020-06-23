import Boom from '@hapi/boom';
import got from 'got';
import Intercept from 'apr-intercept';
import Joi from '@hapi/joi';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { config as authConfig } from '@asap-hub/auth';
import * as lambda from '../framework/lambda';
import * as auth0 from '../entities/auth0';
import Users from '../controllers/users';

const validateUser = async (headers: object): Promise<auth0.UserInfo> => {
  const headersSchema = Joi.object({
    authorization: Joi.string()
      .pattern(/^Bearer /i)
      .required(),
  })
    .required()
    .options({
      allowUnknown: true,
    });

  const value = lambda.validate('headers', headers, headersSchema) as {
    authorization: string;
  };

  const [, token] = value.authorization.split(' ');
  const [err, res] = await Intercept(
    got(`https://${authConfig.domain}/userinfo`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }).json<auth0.UserInfo>(),
  );

  if (err) {
    throw Boom.forbidden('Forbidden', {
      error: err,
    });
  }

  return res;
};

const connectByCode = async (
  request: lambda.Request,
): Promise<lambda.Response> => {
  const paramsSchema = Joi.object({
    code: Joi.string().required(),
  }).required();

  const params = lambda.validate('params', request.params, paramsSchema) as {
    code: string;
  };

  const profile = await validateUser(request.headers);
  const users = new Users();
  await users.connectByCode(params.code, profile);

  return {
    statusCode: 202,
  };
};

const fetchByCode = async (
  request: lambda.Request,
): Promise<lambda.Response> => {
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
};

export const handler: APIGatewayProxyHandler = lambda.http(
  async (request: lambda.Request): Promise<lambda.Response> => {
    const { method } = request;
    if (method === 'get') {
      return fetchByCode(request);
    }

    // istanbul ignore else
    if (method === 'post') {
      return connectByCode(request);
    }

    // API Gateway ensures the right HTTP methods are invoked.
    // In theory the following lines are dead code.
    // istanbul ignore next
    throw Boom.methodNotAllowed();
  },
);
