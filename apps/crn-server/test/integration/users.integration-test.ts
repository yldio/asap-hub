import {
  InputUser,
  RestUser,
  SquidexGraphql,
  SquidexRest,
} from '@asap-hub/squidex';
import Chance from 'chance';
import { appName, baseUrl } from '../../src/config';
import Users from '../../src/controllers/users';
import { AssetSquidexDataProvider } from '../../src/data-providers/assets.data-provider';
import { UserSquidexDataProvider } from '../../src/data-providers/users.data-provider';
import { getAuthToken } from '../../src/utils/auth';
import { getUserCreateDataObject } from '../fixtures/users.fixtures';
import { createRandomOrcid } from '../helpers/users';

const chance = new Chance();
const squidexGraphqlClient = new SquidexGraphql(getAuthToken, {
  appName,
  baseUrl,
});
const userRestClient = new SquidexRest<RestUser, InputUser>(
  getAuthToken,
  'users',
  {
    appName,
    baseUrl,
  },
);
const userDataProvider = new UserSquidexDataProvider(
  squidexGraphqlClient,
  userRestClient,
);
const assetDataProvider = new AssetSquidexDataProvider(userRestClient);
const users = new Users(userDataProvider, assetDataProvider);

describe('Users', () => {
  test('Should create and fetch a user', async () => {
    const firstName = chance.guid();
    const orcid = createRandomOrcid();

    const userCreateDataObject = getUserCreateDataObject();
    userCreateDataObject.teams = [];
    userCreateDataObject.labIds = [];
    userCreateDataObject.email = chance.email();
    delete userCreateDataObject.avatar;
    userCreateDataObject.firstName = firstName;
    userCreateDataObject.orcid = orcid;
    const userId = await userDataProvider.create(userCreateDataObject);
    const result = await users.fetchById(userId);

    expect(result).toEqual(expect.objectContaining({ firstName, orcid }));
  });
});
