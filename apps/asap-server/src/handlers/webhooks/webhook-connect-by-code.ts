import Joi from '@hapi/joi';
import { SquidexGraphql } from '@asap-hub/squidex';
import { framework as lambda } from '@asap-hub/services-common';

import Users from '../../controllers/users';
import { Handler } from '../../utils/types';
import validateRequest from '../../utils/validate-auth0-request';

export const handler: Handler = lambda.http(async (request) => {
  await validateRequest(request);

  const bodySchema = Joi.object({
    code: Joi.string().required(),
    userId: Joi.string().required(),
  }).required();

  const { code, userId } = lambda.validate(
    'body',
    request.payload,
    bodySchema,
  ) as {
    code: string;
    userId: string;
  };

  const squidexGraphqlClient = new SquidexGraphql();
  const users = new Users(squidexGraphqlClient);
  await users.connectByCode(code, userId);

  return {
    statusCode: 202,
  };
});
