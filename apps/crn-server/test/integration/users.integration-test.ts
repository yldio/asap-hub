import {
  InputUser,
  RestTeam,
  RestUser,
  SquidexGraphql,
  SquidexRest,
} from '@asap-hub/squidex';
import Chance from 'chance';
import { appName, baseUrl } from '../../src/config';
import { TeamSquidexDataProvider } from '../../src/data-providers/teams.data-provider';
import { UserSquidexDataProvider } from '../../src/data-providers/users.data-provider';
import { getAuthToken } from '../../src/utils/auth';
import { getTeamCreateDataObject } from '../fixtures/teams.fixtures';
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
const teamRestClient = new SquidexRest<RestTeam>(getAuthToken, 'teams', {
  appName,
  baseUrl,
});
const userDataProvider = new UserSquidexDataProvider(
  squidexGraphqlClient,
  userRestClient,
);
const teamDataProvider = new TeamSquidexDataProvider(
  squidexGraphqlClient,
  teamRestClient,
);

describe('Users', () => {
  let teamId: string;

  beforeAll(async () => {
    const teamCreateDataObject = getTeamCreateDataObject();
    teamCreateDataObject.applicationNumber = chance.name();

    teamId = await teamDataProvider.create(teamCreateDataObject);
  });

  test('Should create and fetch a user', async () => {
    const firstName = chance.guid();
    const orcid = createRandomOrcid();

    const userCreateDataObject = getUserCreateDataObject();
    userCreateDataObject.teams = [{ id: teamId, role: 'Key Personnel' }];
    userCreateDataObject.labIds = [];
    userCreateDataObject.email = chance.email();
    delete userCreateDataObject.avatar;
    userCreateDataObject.firstName = firstName;
    userCreateDataObject.orcid = orcid;
    const userId = await userDataProvider.create(userCreateDataObject);
    const result = await userDataProvider.fetchById(userId);

    expect(result).toEqual(
      expect.objectContaining({
        firstName,
        orcid,
        teams: [expect.objectContaining({ id: teamId, role: 'Key Personnel' })],
      }),
    );
  });
});
