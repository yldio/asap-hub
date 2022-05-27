import { framework as lambda } from '@asap-hub/services-common';
import {
  RestUser,
  SquidexGraphql,
  SquidexRest,
  SquidexRestClient,
} from '@asap-hub/squidex';
import pLimit from 'p-limit';
import Users from '../../controllers/users';
import createUserDataProvider from '../../data-providers/users';

export const handler = async (): Promise<lambda.Response> => {
  const ONE_MONTH = 1000 * 60 * 60 * 24 * 31;

  const limit = pLimit(5);
  const squidexGraphqlClient = new SquidexGraphql();
  const userDataProvider = createUserDataProvider(squidexGraphqlClient);
  const users = new Users(userDataProvider);
  const squidexUsers: SquidexRestClient<RestUser> = new SquidexRest('users');

  const { items: outdatedUsers } = await squidexUsers.fetch({
    take: 30,
    filter: {
      path: 'data.orcid.iv',
      op: 'contains',
      value: '-',
    },
    sort: [
      {
        path: 'data.orcidLastSyncDate.iv',
        order: 'ascending',
      },
    ],
  });

  await Promise.all(
    outdatedUsers
      .filter(
        (user) =>
          !user.data.orcidLastSyncDate?.iv ||
          Date.now() - Date.parse(user.data.orcidLastSyncDate.iv) > ONE_MONTH,
      )
      .map((user) => limit(() => users.syncOrcidProfile(user.id, user))),
  );

  return {
    statusCode: 200,
  };
};
