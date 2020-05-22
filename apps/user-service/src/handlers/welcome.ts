import Boom from '@hapi/boom';
import Joi from '@hapi/joi';
import { APIGatewayProxyHandler } from 'aws-lambda';
import connection from './connection';
import { HTTPEvent, http } from '../utils/events';
import Users from '../controllers/users';
import { Db } from '../db';

const fetchUserByCode = async (event: HTTPEvent) => {
  const {
    params: { code },
  } = event;

  const client = await connection();
  const users = new Users(new Db(client));

  return users.fetchByCode(code);
};

const connectUserByCode = async (event: HTTPEvent) => {
  const {
    params: { code },
    headers: { authorization },
  } = event;

  const [type, accessToken] = authorization.split(' ');
  if ((type || '').toLocaleLowerCase() !== 'bearer') {
    throw Boom.forbidden();
  }
  const client = await connection();
  const users = new Users(new Db(client));
  await users.connectByCode(code, accessToken);

  return {
    output: {
      statusCode: 201,
    },
  };
};

export const handler: APIGatewayProxyHandler = async (event) => {
  const { httpMethod } = event;
  const method = httpMethod.toLocaleLowerCase();
  if (method === 'get') {
    return http(event, {
      handler: fetchUserByCode,
      options: {
        validate: {
          params: Joi.object({
            code: Joi.string().required(),
          }).required(),
        },
      },
    });
  }

  // istanbul ignore else
  if (method === 'post') {
    return http(event, {
      handler: connectUserByCode,
      options: {
        validate: {
          headers: Joi.object({
            authorization: Joi.string().required(),
          }),
          params: Joi.object({
            code: Joi.string().required(),
          }).required(),
        },
      },
    });
  }

  // API Gateway ensures the right HTTP methods are invoked.
  // In theory the following lines are dead code.
  // istanbul ignore next
  throw Boom.methodNotAllowed();
};
