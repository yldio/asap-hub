import Joi from '@hapi/joi';
import Boom from '@hapi/boom';
import { framework as lambda } from '@asap-hub/services-common';

import validateUser from '../../utils/validate-user';
import Users from '../../controllers/users';
import { userUpdateSchema, UserUpdate } from '../../entities/user';
import { Handler } from '../../utils/types';

export const handler: Handler = lambda.http(
  async (request: lambda.Request): Promise<lambda.Response> => {
    const user = await validateUser(request);

    const paramsSchema = Joi.object({
      id: Joi.string().required(),
    }).required();

    const params = lambda.validate('params', request.params, paramsSchema) as {
      id: string;
    };

    const update = lambda.validate(
      'payload',
      request.payload,
      userUpdateSchema,
    ) as UserUpdate;

    if (user.id !== params.id) {
      throw Boom.forbidden();
    }

    const users = new Users();
    const updated = await users.update(params.id, update);

    return {
      statusCode: 200,
      payload: updated,
    };
  },
);
