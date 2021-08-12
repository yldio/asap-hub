// This is a one-off script. It was run on prod on <date> and the results (invalid ORCIDs) were passed on to product
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
