import Joi from '@hapi/joi';
import { framework as lambda } from '@asap-hub/services-common';

import validateUser from '../../utils/validate-user';
import ResearchOutputs from '../../controllers/research-outputs';
import { Handler } from '../../utils/types';

const querySchema = Joi.object({
  take: Joi.number(),
  skip: Joi.number(),
  search: Joi.string(),
  filter: Joi.string(),
}).required();

// /users?page=1&pageSize=8&filter=filter1,filter2
export const handler: Handler = lambda.http(
  async (request: lambda.Request): Promise<lambda.Response> => {
    await validateUser(request);

    const { filter, ...query } = lambda.validate(
      'query',
      request.query,
      querySchema,
    ) as {
      take: number;
      skip: number;
      search?: string;
      filter?: string;
    };

    const researchOutputs = new ResearchOutputs();
    const outputs = await researchOutputs.fetch({
      ...query,
      filter: filter?.split(','),
    });

    return {
      statusCode: 200,
      payload: outputs,
    };
  },
);
