import Boom from '@hapi/boom';
import { APIGatewayProxyHandler } from 'aws-lambda';

import { Invitee } from '@asap-hub/model';
import { framework as lambda } from '@asap-hub/services-common';

import Users from '../controllers/users';
import { globalToken } from '../config';
import { createSchema } from '../entities/user';

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
    ) as Invitee;

    // validate user
    await validateUser(request);

    const users = new Users();
    const user = await users.create(payload);

    return {
      statusCode: 201,
      payload: user,
    };
  },
);
