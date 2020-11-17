import Joi from '@hapi/joi';
import { framework as lambda } from '@asap-hub/services-common';
import { http } from '../../utils/instrumented-framework';

import validateUser from '../../utils/validate-user';
import NewsAndEvents from '../../controllers/news-and-events';
import { Handler } from '../../utils/types';

const querySchema = Joi.object({
  take: Joi.number(),
  skip: Joi.number(),
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
    };

    const newsAndEvents = new NewsAndEvents(request.headers);
    const payload = await newsAndEvents.fetch(query);

    return {
      statusCode: 200,
      payload,
    };
  },
);
