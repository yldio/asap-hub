import Joi from '@hapi/joi';
import { framework as lambda } from '@asap-hub/services-common';
import Users from '../../controllers/users';
import validateUser from '../../utils/validate-user';
import { Handler } from '../../utils/types';

const querySchema = Joi.object({
  take: Joi.number(),
  skip: Joi.number(),
  search: Joi.string(),
  filter: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())),
}).required();

// /users?page=1&pageSize=8
export const handler: Handler = lambda.http(
  async (request: lambda.Request): Promise<lambda.Response> => {
    await validateUser(request);

    const query = lambda.validate('query', request.query, querySchema) as {
      take: number;
      skip: number;
      search?: string;
      filter?: string[] | string;
    };

    const users = new Users();
    const res = await users.fetch(query);

    return {
      payload: res,
    };
  },
);
