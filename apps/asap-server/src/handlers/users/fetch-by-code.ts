import Joi from '@hapi/joi';
import { framework as lambda } from '@asap-hub/services-common';
import Users from '../../controllers/users';
import { Handler } from '../../utils/types';

export const handler: Handler = lambda.http(
  async (request: lambda.Request): Promise<lambda.Response> => {
    const paramsSchema = Joi.object({
      code: Joi.string().required(),
    }).required();

    const params = lambda.validate('params', request.params, paramsSchema) as {
      code: string;
    };

    const users = new Users();
    const res = await users.fetchByCode(params.code);
    return {
      payload: res,
    };
  },
);
