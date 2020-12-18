import Joi from '@hapi/joi';
import { framework as lambda } from '@asap-hub/services-common';

import validateUser from '../../utils/validate-user';
import NewsAndEvents from '../../controllers/news-and-events';
import { Handler } from '../../utils/types';

export const handler: Handler = lambda.http(
  async (request: lambda.Request): Promise<lambda.Response> => {
    await validateUser(request);

    const paramsSchema = Joi.object({
      id: Joi.string().required(),
    }).required();

    const params = lambda.validate('params', request.params, paramsSchema) as {
      id: string;
    };

    const newsAndEvents = new NewsAndEvents();
    const result = await newsAndEvents.fetchById(params.id);

    return {
      statusCode: 200,
      payload: result,
    };
  },
);
