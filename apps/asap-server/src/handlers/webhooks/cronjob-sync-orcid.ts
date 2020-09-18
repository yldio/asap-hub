import pLimit from 'p-limit';
import { framework as lambda } from '@asap-hub/services-common';

import { CMS } from '../../cms';
import Users from '../../controllers/users';

export default async function (): Promise<lambda.Response> {
  const limit = pLimit(5);
  const cms = new CMS();
  const users = new Users();
  const outdatedUsers = await cms.users.fetchWithOrcidSorted();
  const ONE_MONTH = 1000 * 60 * 60 * 24 * 31;
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
}
