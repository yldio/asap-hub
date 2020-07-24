import Boom from '@hapi/boom';
import got from 'got';
import Intercept from 'apr-intercept';
import Joi from '@hapi/joi';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { config as authConfig } from '@asap-hub/auth';
import { framework as lambda } from '@asap-hub/services-common';

import * as auth0 from '../../entities/auth0';
import Users from '../../controllers/users';

const validateUser = async (token: string): Promise<auth0.UserInfo> => {
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
    const bodySchema = Joi.object({
      code: Joi.string().required(),
      token: Joi.string().required(),
    }).required();

    const { code, token } = lambda.validate(
      'body',
      request.payload,
      bodySchema,
    ) as {
      code: string;
      token: string;
    };

    const profile = await validateUser(token);

    const users = new Users();
    await users.connectByCode(code, profile);

    return {
      statusCode: 202,
    };
  },
);
