import { framework as lambda } from '@asap-hub/services-common';
import {
  InputUser,
  RestUser,
  SquidexGraphql,
  SquidexRest,
} from '@asap-hub/squidex';
import pThrottle from 'p-throttle';
import { DateTime } from 'luxon';
import { UserDataObject, UserResponse } from '@asap-hub/model';
import { appName, baseUrl } from '../../config';
import Users from '../../controllers/users';
import { AssetSquidexDataProvider } from '../../data-providers/assets.data-provider';
import { UserSquidexDataProvider } from '../../data-providers/users.data-provider';
import { getAuthToken } from '../../utils/auth';
import { sentryWrapper } from '../../utils/sentry-wrapper';

const rawHandler = async (): Promise<lambda.Response> => {
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
  const orcidLastSyncDate = DateTime.now()
    .set({ hour: 0, minute: 0 })
    .minus({ months: 1 })
    .toISO();

  const { items: outdatedUsers } = await userDataProvider.fetch({
    take: 100,
    filter: {
      orcid: '-',
      orcidLastSyncDate,
    },
  });

  // orcid rate limit 24 request per second
  const throttle = pThrottle({
    limit: 24,
    interval: 1000,
  });

  const throttledSyncOrcidProfile = throttle(async (user: UserDataObject) =>
    users.syncOrcidProfile(user.id, user as UserResponse),
  );

  await Promise.all(
    outdatedUsers.map((user) => throttledSyncOrcidProfile(user)),
  );

  return {
    statusCode: 200,
  };
};

export const unloggedHandler = rawHandler;

export const handler = sentryWrapper(rawHandler);
