import {
  validateAuth0Request,
  validateWebhookConnectByCodeBody,
} from '@asap-hub/server-common';
import { framework as lambda } from '@asap-hub/services-common';
import { RestUser, SquidexGraphql, SquidexRest } from '@asap-hub/squidex';
import { appName, auth0SharedSecret, baseUrl } from '../../config';
import Users from '../../controllers/users';
import { AssetSquidexDataProvider } from '../../data-providers/assets.data-provider';
import { UserSquidexDataProvider } from '../../data-providers/users.data-provider';
import { getAuthToken } from '../../utils/auth';

export const handler: lambda.Handler = lambda.http(async (request) => {
  validateAuth0Request(request, auth0SharedSecret);

  const { code, userId } = validateWebhookConnectByCodeBody(
    request.payload as never,
  );

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
