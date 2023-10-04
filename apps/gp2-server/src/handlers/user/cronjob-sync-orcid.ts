import { framework as lambda } from '@asap-hub/services-common';
import pThrottle from 'p-throttle';
import { DateTime } from 'luxon';
import { gp2 } from '@asap-hub/model';
import Users from '../../controllers/user.controller';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import {
  getAssetDataProvider,
  getUserDataProvider,
} from '../../dependencies/user.dependency';
import { getContentfulGraphQLClientFactory } from '../../dependencies/clients.dependency';

const rawHandler = async (): Promise<lambda.Response> => {
  const contentfulGraphQLClient = getContentfulGraphQLClientFactory();
  const userDataProvider = getUserDataProvider(contentfulGraphQLClient);
  const assetDataProvider = getAssetDataProvider();
  const users = new Users(userDataProvider, assetDataProvider);
  const orcidLastSyncDate = DateTime.now()
    .set({ hour: 0, minute: 0 })
    .minus({ months: 1 })
    .toISO();

  const { items: outdatedUsers } = await users.fetch({
    take: 40,
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

  const throttledSyncOrcidProfile = throttle(async (user: gp2.UserResponse) =>
    users.syncOrcidProfile(user.id, user),
  );

  for (const outdatedUser of outdatedUsers) {
    await throttledSyncOrcidProfile(outdatedUser);
  }

  return {
    statusCode: 200,
  };
};

export const unloggedHandler = rawHandler;

export const handler = sentryWrapper(rawHandler);
