import Joi from '@hapi/joi';
import { framework as lambda } from '@asap-hub/services-common';
import { http } from '../../utils/instrumented-framework';

import validateUser from '../../utils/validate-user';
import Teams from '../../controllers/teams';
import { Handler } from '../../utils/types';

const querySchema = Joi.object({
  take: Joi.number(),
  skip: Joi.number(),
  search: Joi.string(),
  filter: Joi.array().items(Joi.string()).single(),
}).required();

// /teams?page=1&pageSize=8
export const handler: Handler = http(
  async (request: lambda.Request): Promise<lambda.Response> => {
    const user = await validateUser(request);

    const query = (lambda.validate(
      'query',
      request.query,
      querySchema,
    ) as unknown) as {
      take: number;
      skip: number;
      search?: string;
      filter?: string[] | string;
    };

    const teams = new Teams(request.headers);
    const team = await teams.fetch(query, user);

    return {
      statusCode: 200,
      payload: team,
    };
  },
);
