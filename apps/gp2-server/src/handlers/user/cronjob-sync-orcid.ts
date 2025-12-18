import { framework as lambda } from '@asap-hub/services-common';
import pThrottle from 'p-throttle';
import { DateTime } from 'luxon';
import Users from '../../controllers/user.controller';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import {
  getAssetDataProvider,
  getUserDataProvider,
} from '../../dependencies/user.dependency';
import { getContentfulGraphQLClientFactory } from '../../dependencies/clients.dependency';

const MAX_USERS_TO_SYNC = 1000;
const ORCID_SYNC_RATE_LIMIT = 24;
const ORCID_SYNC_RATE_INTERVAL = 1000;

const rawHandler = async (): Promise<lambda.Response> => {
  const contentfulGraphQLClient = getContentfulGraphQLClientFactory();
  const userDataProvider = getUserDataProvider(contentfulGraphQLClient);
  const assetDataProvider = getAssetDataProvider();
  const users = new Users(userDataProvider, assetDataProvider);
  const orcidLastSyncDate = DateTime.now()
    .set({ hour: 0, minute: 0 })
    .minus({ months: 1 })
    .toISO();

  const { items: outdatedUsers } = await users.fetchForOrcidSync({
    take: MAX_USERS_TO_SYNC,
    filter: {
      orcid: '-',
      orcidLastSyncDate,
    },
  });

  // orcid rate limit 24 request per second
  const throttle = pThrottle({
    limit: ORCID_SYNC_RATE_LIMIT,
    interval: ORCID_SYNC_RATE_INTERVAL,
  });

  const throttledSyncOrcidProfile = throttle(
    async (user: { id: string; email: string; orcid: string }) =>
      users.syncOrcidProfile(user.id, user.email, user.orcid),
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
