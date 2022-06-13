import { framework as lambda } from '@asap-hub/services-common';
import {
  RestUser,
  SquidexGraphql,
  SquidexRest,
  getAccessTokenFactory,
} from '@asap-hub/squidex';
import pLimit from 'p-limit';
import { appName, baseUrl, clientId, clientSecret } from '../../config';
import Users from '../../controllers/users';
import AssetDataProvider from '../../data-providers/assets.data-provider';
import UserDataProvider from '../../data-providers/users.data-provider';

export const handler = async (): Promise<lambda.Response> => {
  const ONE_MONTH = 1000 * 60 * 60 * 24 * 31;

  const limit = pLimit(5);
  const getAuthToken = getAccessTokenFactory({
    clientId,
    clientSecret,
    baseUrl,
  });
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

  const { items: outdatedUsers } = await users.fetch({
    take: 30,
    filter: {
      orcid: '-',
    },
  });

  await Promise.all(
    outdatedUsers
      .filter(
        (user) =>
          !user.orcidLastSyncDate ||
          Date.now() - Date.parse(user.orcidLastSyncDate) > ONE_MONTH,
      )
      .map((user) => limit(() => users.syncOrcidProfile(user.id, user))),
  );

  return {
    statusCode: 200,
  };
};
