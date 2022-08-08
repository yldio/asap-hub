import { framework as lambda } from '@asap-hub/services-common';
import {
  InputUser,
  RestUser,
  SquidexGraphql,
  SquidexRest,
} from '@asap-hub/squidex';
import pLimit from 'p-limit';
import { appName, baseUrl } from '../../config';
import Users from '../../controllers/users';
import { AssetSquidexDataProvider } from '../../data-providers/assets.data-provider';
import { UserSquidexDataProvider } from '../../data-providers/users.data-provider';
import { getAuthToken } from '../../utils/auth';
import { sentryWrapper } from '../../utils/sentry-wrapper';

const rawHandler = async (): Promise<lambda.Response> => {
  const ONE_MONTH = 1000 * 60 * 60 * 24 * 31;

  const limit = pLimit(5);
  const squidexGraphqlClient = new SquidexGraphql(getAuthToken, {
    appName,
    baseUrl,
  });
  const userRestClient = new SquidexRest<RestUser, InputUser>(
    getAuthToken,
    'users',
    {
      appName,
      baseUrl,
    },
  );
  const userDataProvider = new UserSquidexDataProvider(
    squidexGraphqlClient,
    userRestClient,
  );
  const assetDataProvider = new AssetSquidexDataProvider(userRestClient);
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

export const unloggedHandler = rawHandler;

export const handler = sentryWrapper(rawHandler);
