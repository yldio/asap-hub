import Joi from '@hapi/joi';
import { framework as lambda } from '@asap-hub/services-common';
import { WebhookPayload, User, SquidexGraphql } from '@asap-hub/squidex';

import { Handler } from '../../utils/types';
import Users from '../../controllers/users';
import validateRequest from '../../utils/validate-squidex-request';

export const handler: Handler = lambda.http(async (request) => {
  await validateRequest(request);

  const bodySchema = Joi.object({
    type: Joi.string().required(),
    payload: Joi.object({
      id: Joi.string().required(),
      data: Joi.object().required(),
      dataOld: Joi.object(),
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
  ) as WebhookPayload<User>;

  const squidexGraphqlClient = new SquidexGraphql();
  const users = new Users(squidexGraphqlClient);
  const { id } = payload;
  const newOrcid = payload.data.orcid?.iv;

  if (event === 'UsersCreated') {
    if (newOrcid) {
      return {
        statusCode: 200,
        payload: await users.syncOrcidProfile(id),
      };
    }
  }

  if (event === 'UsersUpdated') {
    if (newOrcid && newOrcid !== payload.dataOld?.orcid?.iv) {
      return {
        statusCode: 200,
        payload: await users.syncOrcidProfile(id),
      };
    }
  }

  return { statusCode: 204 };
});
