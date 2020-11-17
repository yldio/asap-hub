import Joi from '@hapi/joi';
import { framework as lambda } from '@asap-hub/services-common';
import { http } from '../../utils/instrumented-framework';

import validateUser from '../../utils/validate-user';
import Teams from '../../controllers/teams';
import { Handler } from '../../utils/types';

export const handler: Handler = http(
  async (request: lambda.Request): Promise<lambda.Response> => {
    const user = await validateUser(request);

    const paramsSchema = Joi.object({
      id: Joi.string().required(),
    }).required();

    const params = lambda.validate('params', request.params, paramsSchema) as {
      id: string;
    };

    const teams = new Teams(request.headers);
    const team = await teams.fetchById(params.id, user);

    return {
      statusCode: 200,
      payload: team,
    };
  },
);
