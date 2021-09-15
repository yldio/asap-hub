// This is a one-off script. It validates that orcids are valid
// It was run on prod on 19/08/2021 and the results (invalid ORCIDs) were passed on to product
// TS_NODE_COMPILER_OPTIONS='{"module": "commonjs"}' yarn ts-node apps/asap-server/validate-orcids-script/validate-orcids.ts

import Users from '../src/controllers/users';

import { VALID_ORCID } from '@asap-hub/validation';

const validateOrcids = async (): Promise<void> => {
  const users = new Users();

  const maxNumberOfUsers = 999999;
  const allUsers = (await users.fetch({ take: maxNumberOfUsers })).items;

  let noInvalidOrcids = true;

  for (const user of allUsers) {
    if (user.orcid && user.orcid?.match(VALID_ORCID) === null) {
      noInvalidOrcids = false;
      // eslint-disable-next-line no-console
      console.log(`Invalid orcid on user ${user.id}: ${user.orcid}`);
    }
  }

  if (noInvalidOrcids) {
    // eslint-disable-next-line no-console
    console.log('No users with invalid orcids found.');
  }
};

validateOrcids();
