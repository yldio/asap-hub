import pLimit from 'p-limit';
import { framework as lambda } from '@asap-hub/services-common';
import { Squidex, RestUser } from '@asap-hub/squidex';

import Users from '../../controllers/users';

export const handler = async (): Promise<lambda.Response> => {
  const ONE_MONTH = 1000 * 60 * 60 * 24 * 31;

  const limit = pLimit(5);
  const users = new Users();
  const squidexUsers: Squidex<RestUser> = new Squidex('users');

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
          !user.data.orcidLastSyncDate ||
          Date.now() - Date.parse(user.data.orcidLastSyncDate.iv) > ONE_MONTH,
      )
      .map((user) => limit(() => users.syncOrcidProfile(user.id, user))),
  );

  return {
    statusCode: 200,
  };
};
