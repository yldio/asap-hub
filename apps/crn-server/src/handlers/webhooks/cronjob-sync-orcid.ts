import { framework as lambda } from '@asap-hub/services-common';
import pThrottle from 'p-throttle';
import { DateTime } from 'luxon';
import { UserDataObject, UserResponse } from '@asap-hub/model';
import Users from '../../controllers/users.controller';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import {
  getAssetDataProvider,
  getUserDataProvider,
} from '../../dependencies/users.dependencies';

const rawHandler = async (): Promise<lambda.Response> => {
  const userDataProvider = getUserDataProvider();
  const assetDataProvider = getAssetDataProvider();
  const users = new Users(userDataProvider, assetDataProvider);
  const orcidLastSyncDate = DateTime.now()
    .set({ hour: 0, minute: 0 })
    .minus({ months: 1 })
    .toISO();

  const { items: outdatedUsers } = await userDataProvider.fetch({
    take: 50,
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
