import { Chance } from 'chance';
import { RestTeam, SquidexGraphql, SquidexRest } from '@asap-hub/squidex';
import { appName, baseUrl } from '../../src/config';
import { TeamSquidexDataProvider } from '../../src/data-providers/teams.data-provider';
import { getAuthToken } from '../../src/utils/auth';
import {
  getTeamCreateDataObject,
  getTeamDataObject,
} from '../fixtures/teams.fixtures';
import { teardownHelper } from '../helpers/teardown';
import { retryable } from '../helpers/retryable';

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
  const teardown = teardownHelper([teamRestClient]);

  afterEach(async () => {
    await teardown();
  });

  test('Should create and fetch a team', async () => {
    const teamCreateDataObject = getTeamCreateDataObject();
    teamCreateDataObject.applicationNumber = chance.name();

    const id = await teamDataProvider.create(teamCreateDataObject);
    const { displayName, projectTitle } = getTeamDataObject();

    await retryable(async () => {
      const result = await teamDataProvider.fetchById(id);
      expect(result).toEqual(
        expect.objectContaining({ id, displayName, projectTitle }),
      );
    });
  });
});
