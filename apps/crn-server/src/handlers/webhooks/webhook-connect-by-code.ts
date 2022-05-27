import { framework as lambda } from '@asap-hub/services-common';
import { SquidexGraphql } from '@asap-hub/squidex';
import Users from '../../controllers/users';
import createUserDataProvider from '../../data-providers/users';
import { Handler } from '../../utils/types';
import validateRequest from '../../utils/validate-auth0-request';
import { validateBody } from '../../validation/webhook-connect-by-code.validation';

export const handler: Handler = lambda.http(async (request) => {
  await validateRequest(request);

  const { code, userId } = validateBody(request.payload as never);

  const squidexGraphqlClient = new SquidexGraphql();
  const userDataProvider = createUserDataProvider(squidexGraphqlClient);
  const users = new Users(userDataProvider);
  await users.connectByCode(code, userId);

  return {
    statusCode: 202,
  };
});
