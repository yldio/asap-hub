// This is a one-off script. It validates that orcids are valid
// It was run on prod on 19/08/2021 and the results (invalid ORCIDs) were passed on to product
// TS_NODE_COMPILER_OPTIONS='{"module": "commonjs"}' yarn ts-node apps/crn-server/validate-orcids-script/validate-orcids.ts

import { applyToAllItemsInCollectionFactory } from '@asap-hub/server-common';

import { RestUser } from '@asap-hub/squidex';
import { VALID_ORCID } from '@asap-hub/validation';
import { appName, baseUrl } from '../src/config';
import { getAuthToken } from '../src/utils/auth';
export const applyToAllItemsInCollection = applyToAllItemsInCollectionFactory(
  appName,
  baseUrl,
  getAuthToken,
);

const validateOrcids = async (): Promise<void> => {
  let noInvalidOrcids = true;
  let usersProcessed = 0;

  applyToAllItemsInCollection<RestUser>('users', async (user) => {
    if (
      user.data.orcid?.iv &&
      user.data.orcid?.iv.match(VALID_ORCID) === null
    ) {
      noInvalidOrcids = false;
      // eslint-disable-next-line no-console
      console.log(`Invalid orcid on user ${user.id}: ${user.data.orcid?.iv}`);
    }
    usersProcessed++;
  });

  if (noInvalidOrcids) {
    // eslint-disable-next-line no-console
    console.log('No users with invalid orcids found.');
  }

  // eslint-disable-next-line no-console
  console.log(`Validated ${usersProcessed}, no invalid ORCIDs found`);
};

validateOrcids();
