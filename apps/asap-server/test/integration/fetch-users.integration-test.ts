import Chance from 'chance';
import { User } from '@asap-hub/squidex';

import Users from '../../src/controllers/users';
import { createUser, createRandomOrcid } from '../helpers/users';

const chance = new Chance();
const users = new Users();

describe('Users', () => {
  it('Should create and fetch a user', async () => {
    const firstName = chance.guid();
    const orcid = createRandomOrcid();

    await createUser({ firstName, orcid } as Partial<User>);
    const result = await users.fetch({ search: firstName });

    expect(result).toEqual({
      total: 1,
      items: [expect.objectContaining({ firstName, orcid })],
    });
  });
});
