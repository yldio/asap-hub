import Joi from '@hapi/joi';
import { framework as lambda } from '@asap-hub/services-common';
import { http } from '../../utils/instrumented-framework';
import Users from '../../controllers/users';
import validateUser from '../../utils/validate-user';
import { Handler } from '../../utils/types';

export const handler: Handler = http(
  async (request: lambda.Request): Promise<lambda.Response> => {
    const paramsSchema = Joi.object({
      id: Joi.string().required(),
    }).required();

    const params = lambda.validate('params', request.params, paramsSchema) as {
      id: string;
    };

    await validateUser(request);

    const users = new Users(request.headers);
    const res = await users.fetchById(params.id);
    return {
      payload: res,
    };
  },
);
