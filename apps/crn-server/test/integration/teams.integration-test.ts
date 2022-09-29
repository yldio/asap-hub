import { Chance } from 'chance';
import { RestTeam, SquidexGraphql, SquidexRest } from '@asap-hub/squidex';
import { appName, baseUrl } from '../../src/config';
import { TeamSquidexDataProvider } from '../../src/data-providers/teams.data-provider';
import { getAuthToken } from '../../src/utils/auth';
import {
  getTeamCreateDataObject,
  getTeamDataObject,
} from '../fixtures/teams.fixtures';
import { DateTime } from 'luxon';

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
  test('Should create and fetch a team', async () => {
    const teamCreateDataObject = getTeamCreateDataObject();
    teamCreateDataObject.applicationNumber = chance.name();

    const id = await teamDataProvider.create(teamCreateDataObject);
    const result = await teamDataProvider.fetchById(id);

    const { displayName, projectTitle } = getTeamDataObject();
    expect(result).toEqual(
      expect.objectContaining({ id, displayName, projectTitle }),
    );
  });

  test('Should update inactiveSince if team becomes inactive and set it to null if it becomes active again', async () => {
    const teamCreateDataObject = getTeamCreateDataObject();
    teamCreateDataObject.applicationNumber = chance.name();

    const id = await teamDataProvider.create(teamCreateDataObject);
    const beforeSwitchToInactive = await teamDataProvider.fetchById(id);

    expect(beforeSwitchToInactive?.active).toEqual(true);

    await teamDataProvider.update(id, {
      active: false,
    });

    const afterSwitchToInactive = await teamDataProvider.fetchById(id);
    expect(afterSwitchToInactive?.active).toEqual(false);

    expect(
      DateTime.now().diff(
        DateTime.fromISO(afterSwitchToInactive?.inactiveSince!),
      ).milliseconds,
    ).toBeLessThan(1000);

    await teamDataProvider.update(id, {
      active: true,
    });

    const afterSwitchToActiveAgain = await teamDataProvider.fetchById(id);
    expect(afterSwitchToActiveAgain?.active).toEqual(true);
    expect(afterSwitchToActiveAgain?.inactiveSince).toEqual(null);
  });
});
