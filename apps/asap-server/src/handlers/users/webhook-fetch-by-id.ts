import Joi from '@hapi/joi';
import { framework as lambda } from '@asap-hub/services-common';

import Users from '../../controllers/users';
import { Handler } from '../../utils/types';
import validateRequest from '../../utils/validate-auth0-request';

export const handler: Handler = lambda.http(
  async (request: lambda.Request): Promise<lambda.Response> => {
    await validateRequest(request);

    const paramsSchema = Joi.object({
      id: Joi.string().required(),
    }).required();

    const { id } = lambda.validate('params', request.params, paramsSchema) as {
      id: string;
    };

    const users = new Users();
    const user = await users.fetchById(id);

    return {
      payload: user,
    };
  },
);
