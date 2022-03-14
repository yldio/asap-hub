import Chance from 'chance';
import { SquidexGraphql, User } from '@asap-hub/squidex';

import Users from '../../src/controllers/users';
import { createUser, createRandomOrcid } from '../helpers/users';

const chance = new Chance();
const squidexGraphqlClient = new SquidexGraphql();
const users = new Users(squidexGraphqlClient);

describe('Users', () => {
  test('Should create and fetch a user', async () => {
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
