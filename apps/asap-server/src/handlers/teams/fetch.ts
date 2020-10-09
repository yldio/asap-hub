import Joi from '@hapi/joi';
import { framework as lambda } from '@asap-hub/services-common';

import validateUser from '../../utils/validate-user';
import Teams from '../../controllers/teams';
import { Handler } from '../../utils/types';

const querySchema = Joi.object({
  take: Joi.number(),
  skip: Joi.number(),
  search: Joi.string(),
  filter: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())),
}).required();

// /teams?page=1&pageSize=8
export const handler: Handler = lambda.http(
  async (request: lambda.Request): Promise<lambda.Response> => {
    await validateUser(request);

    const query = lambda.validate('query', request.query, querySchema) as {
      take: number;
      skip: number;
      search?: string;
      filter?: string[] | string;
    };

    const teams = new Teams();
    const team = await teams.fetch(query);

    return {
      statusCode: 200,
      payload: team,
    };
  },
);
