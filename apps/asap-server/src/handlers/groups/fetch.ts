import Joi from '@hapi/joi';
import { framework as lambda } from '@asap-hub/services-common';
import { http } from '../../utils/instrumented-framework';
import Groups from '../../controllers/groups';
import validateUser from '../../utils/validate-user';
import { Handler } from '../../utils/types';

const querySchema = Joi.object({
  take: Joi.number(),
  skip: Joi.number(),
  search: Joi.string(),
}).required();

export const handler: Handler = http(
  async (request: lambda.Request): Promise<lambda.Response> => {
    await validateUser(request);

    const query = (lambda.validate(
      'query',
      request.query,
      querySchema,
    ) as unknown) as {
      take: number;
      skip: number;
      search?: string;
    };

    const groups = new Groups(request.headers);
    const res = await groups.fetch(query);

    return {
      payload: res,
    };
  },
);
