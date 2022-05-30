import { SquidexGraphql, User } from '@asap-hub/squidex';
import Chance from 'chance';
import Users from '../../src/controllers/users';
import UserDataProvider from '../../src/data-providers/users';
import { createRandomOrcid, createUser } from '../helpers/users';

const chance = new Chance();
const squidexGraphqlClient = new SquidexGraphql();
const userDataProvider = new UserDataProvider(squidexGraphqlClient);
const users = new Users(userDataProvider);

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
