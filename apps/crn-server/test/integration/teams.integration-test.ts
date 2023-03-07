import { Chance } from 'chance';
import { RestTeam, SquidexGraphql, SquidexRest } from '@asap-hub/squidex';
import { appName, baseUrl } from '../../src/config';
import { TeamSquidexDataProvider } from '../../src/data-providers/teams.data-provider';
import { getAuthToken } from '../../src/utils/auth';
import {
  getTeamCreateDataObject,
  getTeamDataObject,
} from '../fixtures/teams.fixtures';

const chance = new Chance();
const squidexGraphqlClient = new SquidexGraphql(getAuthToken, {
  appName,
  baseUrl,
});
const teamRestClient = new SquidexRest<RestTeam>(getAuthToken, 'teams', {
  appName,
  baseUrl,
});
const teamDataProvider = new TeamSquidexDataProvider(
  squidexGraphqlClient,
  teamRestClient,
);

describe('Teams', () => {

  let teamId: string;
  afterEach(async () => {
    await teamRestClient.delete(teamId);
  });

  test('Should create and fetch a team', async () => {
    const teamCreateDataObject = getTeamCreateDataObject();
    teamCreateDataObject.applicationNumber = chance.name();

    teamId = await teamDataProvider.create(teamCreateDataObject);
    const result = await teamDataProvider.fetchById(teamId);

    const { displayName, projectTitle } = getTeamDataObject();
    expect(result).toEqual(
      expect.objectContaining({ id: teamId, displayName, projectTitle }),
    );
  });
});
