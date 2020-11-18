import Joi from '@hapi/joi';
import Boom from '@hapi/boom';
import { framework as lambda } from '@asap-hub/services-common';
import { UserPatchRequest } from '@asap-hub/model';

import validateUser from '../../utils/validate-user';
import Users from '../../controllers/users';
import { userUpdateSchema } from '../../entities/user';
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
    ) as UserPatchRequest;

    // user trying to change someone else
    if (user.id !== params.id) {
      throw Boom.forbidden();
    }

    // user trying to change a team he doesn't belong to
    if (
      update.teams &&
      !user.teams.every(({ id }) => user.teams.find((t) => t.id === id))
    ) {
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
