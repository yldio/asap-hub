import Boom from '@hapi/boom';
import got from 'got';
import Intercept from 'apr-intercept';
import { config as authConfig } from '@asap-hub/auth';
import { framework as lambda } from '@asap-hub/services-common';
import { APIGatewayProxyHandler } from 'aws-lambda';

import Users from '../controllers/users';
import * as auth0 from '../entities/auth0';

const validateUser = async (
  request: lambda.Request,
): Promise<auth0.UserInfo> => {
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

export const handler: APIGatewayProxyHandler = lambda.http(
  async (request: lambda.Request): Promise<lambda.Response> => {
    const { sub } = await validateUser(request);

    const users = new Users();
    const user = await users.fetchByCode(sub);

    return {
      payload: user,
    };
  },
);
