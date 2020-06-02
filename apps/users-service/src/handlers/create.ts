import Boom from '@hapi/boom';
import { APIGatewayProxyHandler } from 'aws-lambda';
import connection from '../utils/connection';
import * as lambda from '../framework/lambda';
import Users from '../controllers/users';
import { Db } from '../data';
import { globalToken } from '../config';
import { createSchema } from '../entities/user';
import { CreateUser } from '../data/users';

const validateUser = async (request: lambda.Request): Promise<void> => {
  const headers = request.headers as {
    authorization: string;
  };

  if (!headers.authorization) {
    throw Boom.unauthorized();
  }

  const [type, token] = headers.authorization.split(' ');
  if (type.toLowerCase() !== 'bearer') {
    throw Boom.forbidden();
  }

  // TODO: change me
  if (token !== globalToken) {
    throw Boom.forbidden();
  }
};

export const handler: APIGatewayProxyHandler = lambda.http(
  async (request: lambda.Request): Promise<lambda.Response> => {
    // validate payload
    const payload = lambda.validate(
      'payload',
      request.payload,
      createSchema.required(),
    ) as CreateUser;

    // validate user
    await validateUser(request);

    const c = await connection();
    const users = new Users(new Db(c));
    const user = await users.create(payload);

    return {
      statusCode: 201,
      payload: user,
    };
  },
);
