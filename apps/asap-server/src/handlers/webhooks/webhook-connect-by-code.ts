import Joi from '@hapi/joi';
import { framework as lambda } from '@asap-hub/services-common';
import { http } from '../../utils/instrumented-framework';

import Users from '../../controllers/users';
import { Handler } from '../../utils/types';
import validateRequest from '../../utils/validate-auth0-request';

export const handler: Handler = http(
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

    const users = new Users(request.headers);
    await users.connectByCode(code, userId);

    return {
      statusCode: 202,
    };
  },
);
