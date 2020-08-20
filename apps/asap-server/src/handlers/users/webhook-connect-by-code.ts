import Boom from '@hapi/boom';
import Joi from '@hapi/joi';
import { framework as lambda } from '@asap-hub/services-common';

import Users from '../../controllers/users';
import { Handler } from '../../utils/types';
import { auth0SharedSecret } from '../../config';

export const handler: Handler = lambda.http(
  async (request: lambda.Request): Promise<lambda.Response> => {
    const bodySchema = Joi.object({
      code: Joi.string().required(),
      userId: Joi.string().required(),
      secret: Joi.string().required(),
    }).required();

    const { code, userId, secret } = lambda.validate(
      'body',
      request.payload,
      bodySchema,
    ) as {
      code: string;
      userId: string;
      secret: string;
    };

    // TODO: address variable sharing
    if (secret !== auth0SharedSecret) {
      throw Boom.forbidden();
    }

    const users = new Users();
    await users.connectByCode(code, userId);

    return {
      statusCode: 202,
    };
  },
);
