import { framework as lambda } from '@asap-hub/services-common';
import { RestUser, SquidexGraphql, SquidexRest } from '@asap-hub/squidex';
import { appName, baseUrl } from '../../config';
import Users from '../../controllers/users';
import { UserSquidexDataProvider } from '../../data-providers/users.data-provider';
import { AssetSquidexDataProvider } from '../../data-providers/assets.data-provider';
import { getAuthToken } from '../../utils/auth';
import validateRequest from '../../utils/validate-auth0-request';
import { validateBody } from '../../validation/webhook-connect-by-code.validation';

export const handler: lambda.Handler = lambda.http(async (request) => {
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
  const userDataProvider = new UserSquidexDataProvider(
    squidexGraphqlClient,
    userRestClient,
  );
  const assetDataProvider = new AssetSquidexDataProvider(userRestClient);
  const users = new Users(userDataProvider, assetDataProvider);
  await users.connectByCode(code, userId);

  return {
    statusCode: 202,
  };
});
