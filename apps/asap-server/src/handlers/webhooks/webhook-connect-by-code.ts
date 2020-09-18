import Joi from '@hapi/joi';
import Boom from '@hapi/boom';
import { framework as lambda, Squidex } from '@asap-hub/services-common';

import { CMSUser } from '../../entities/user';
import Users from '../../controllers/users';
import { Handler } from '../../utils/types';
import validateRequest from '../../utils/validate-auth0-request';

export const handler: Handler = lambda.http(
  async (request: lambda.Request): Promise<lambda.Response> => {
    await validateRequest(request);

    const bodySchema = Joi.object({
      code: Joi.string().required(),
      userId: Joi.string().required(),
    }).required();

    const { code, userId } = lambda.validate(
      'body',
      request.payload,
      bodySchema,
    ) as {
      code: string;
      userId: string;
    };

    const users = new Users();
    const squidex: Squidex<CMSUser> = new Squidex('users');
    const user = await squidex
      .fetchOne({
        filter: {
          path: 'data.connections.iv.code',
          op: 'eq',
          value: `ASAP|${code}`,
        },
      })
      .catch(() => {
        throw Boom.forbidden();
      });

    await users.connectByCode(user, userId);

    return {
      statusCode: 202,
    };
  },
);
