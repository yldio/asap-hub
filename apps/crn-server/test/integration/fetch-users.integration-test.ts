import { RestUser, SquidexGraphql, SquidexRest, User } from '@asap-hub/squidex';
import Chance from 'chance';
import { appName, baseUrl } from '../../src/config';
import Users from '../../src/controllers/users';
import AssetDataProvider from '../../src/data-providers/assets.data-provider';
import UserDataProvider from '../../src/data-providers/users.data-provider';
import { getAuthToken } from '../../src/utils/auth';
import { createRandomOrcid, createUser } from '../helpers/users';

const chance = new Chance();
const squidexGraphqlClient = new SquidexGraphql(getAuthToken, {
  appName,
  baseUrl,
});
const userRestClient = new SquidexRest<RestUser>(getAuthToken, 'users', {
  appName,
  baseUrl,
});
const userDataProvider = new UserDataProvider(
  squidexGraphqlClient,
  userRestClient,
);
const assetDataProvider = new AssetDataProvider(userRestClient);
const users = new Users(userDataProvider, assetDataProvider);

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
