import { framework as lambda } from '@asap-hub/services-common';
import { RestUser, SquidexGraphql, SquidexRest } from '@asap-hub/squidex';
import { appName, baseUrl } from '../../config';
import Users from '../../controllers/users';
import AssetDataProvider from '../../data-providers/assets.data-provider';
import UserDataProvider from '../../data-providers/users.data-provider';
import { getAuthToken } from '../../utils/auth';
import { Handler } from '../../utils/types';
import validateRequest from '../../utils/validate-auth0-request';
import { validateBody } from '../../validation/webhook-connect-by-code.validation';

export const handler: Handler = lambda.http(async (request) => {
  await validateRequest(request);

  const { code, userId } = validateBody(request.payload as never);

  const squidexGraphqlClient = new SquidexGraphql(getAuthToken, {
    appName,
    baseUrl,
  });
  const userRestClient = new SquidexRest<RestUser>(getAuthToken, 'users', {
    appName,
    baseUrl,
  });
  const userDataProvider = new UserDataProvider(
    squidexGraphqlClient,
    userRestClient,
  );
  const assetDataProvider = new AssetDataProvider(userRestClient);
  const users = new Users(userDataProvider, assetDataProvider);
  await users.connectByCode(code, userId);

  return {
    statusCode: 202,
  };
});
