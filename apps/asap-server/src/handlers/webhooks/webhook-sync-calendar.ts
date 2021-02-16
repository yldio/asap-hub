import Joi from '@hapi/joi';
import { framework as lambda } from '@asap-hub/services-common';
import { WebhookPayload, Calendar } from '@asap-hub/squidex';
import { http } from '../../utils/instrumented-framework';

import { Handler } from '../../utils/types';
import validateRequest from '../../utils/validate-squidex-request';

export const handler: Handler = http(
  async (request: lambda.Request): Promise<lambda.Response> => {
    await validateRequest(request);

    const bodySchema = Joi.object({
      type: Joi.string().required(),
      payload: Joi.object({
        data: Joi.object().required(),
      })
        .unknown()
        .required(),
    })
      .unknown()
      .required();

    const { payload, type: event } = lambda.validate(
      'body',
      request.payload,
      bodySchema,
    ) as WebhookPayload<Calendar>;

    // eslint-disable-next-line no-console
    console.log('Received:', JSON.stringify(request.payload));

    if (['CalendarsCreated'].includes(event)) {
      return {
        statusCode: 200,
        payload: payload.data.id,
      };
    }

    return { statusCode: 204 };
  },
);
