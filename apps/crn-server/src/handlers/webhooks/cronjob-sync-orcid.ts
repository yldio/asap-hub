import { framework as lambda } from '@asap-hub/services-common';
import { SquidexGraphql } from '@asap-hub/squidex';
import pLimit from 'p-limit';
import Users from '../../controllers/users';
import AssetDataProvider from '../../data-providers/assets';
import UserDataProvider from '../../data-providers/users';

export const handler = async (): Promise<lambda.Response> => {
  const ONE_MONTH = 1000 * 60 * 60 * 24 * 31;

  const limit = pLimit(5);
  const squidexGraphqlClient = new SquidexGraphql();
  const userDataProvider = new UserDataProvider(squidexGraphqlClient);
  const assetDataProvider = new AssetDataProvider();
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
