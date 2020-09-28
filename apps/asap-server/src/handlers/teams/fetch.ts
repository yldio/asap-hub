import Joi from '@hapi/joi';
import { framework as lambda } from '@asap-hub/services-common';

import validateUser from '../../utils/validate-user';
import Teams from '../../controllers/teams';
import { Handler } from '../../utils/types';

const querySchema = Joi.object({
  page: Joi.number(),
  pageSize: Joi.number(),
}).required();

// /teams?page=1&pageSize=8
export const handler: Handler = lambda.http(
  async (request: lambda.Request): Promise<lambda.Response> => {
    await validateUser(request);

    const query = lambda.validate('query', request.query, querySchema) as {
      page: number;
      pageSize: number;
    };

    const teams = new Teams();
    const team = await teams.fetch(query);

    return {
      statusCode: 200,
      payload: team,
    };
  },
);
