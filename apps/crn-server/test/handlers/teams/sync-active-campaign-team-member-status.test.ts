import Boom from '@hapi/boom';

import {
  getTeamPublishedEvent,
  getTeamResponse,
} from '../../fixtures/teams.fixtures';
import { userControllerMock } from '../../mocks/user.controller.mock';
import { teamControllerMock } from '../../mocks/team.controller.mock';
import { loggerMock } from '../../mocks/logger.mock';
import { TeamRole } from '@asap-hub/model';

const syncTeamMemberDataMock = jest.fn();

describe('syncActiveCampaignTeamMemberStatusHandler', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();

    process.env = { ...OLD_ENV, ACTIVE_CAMPAIGN_TOKEN: 'TOKEN' };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test('Should log if active token campaign is not available', async () => {
    delete process.env.ACTIVE_CAMPAIGN_TOKEN;

    const {
      syncActiveCampaignTeamMemberStatusHandler,
    } = require('../../../src/handlers/teams/sync-active-campaign-team-member-status');

    const handler = syncActiveCampaignTeamMemberStatusHandler(
      teamControllerMock,
      userControllerMock,
      loggerMock,
      syncTeamMemberDataMock,
    );

    await handler(getTeamPublishedEvent('team-1234'));

    expect(loggerMock.info).toHaveBeenLastCalledWith(
      'Active Campaign Token not defined, skipping...',
    );
    expect(teamControllerMock.fetchById).not.toHaveBeenCalled();
    expect(syncTeamMemberDataMock).not.toHaveBeenCalled();
  });

  test('Should throw an error when the team request fails with an error code different from 404', async () => {
    teamControllerMock.fetchById.mockRejectedValue(Boom.badData());

    const {
      syncActiveCampaignTeamMemberStatusHandler,
    } = require('../../../src/handlers/teams/sync-active-campaign-team-member-status');

    const handler = syncActiveCampaignTeamMemberStatusHandler(
      teamControllerMock,
      userControllerMock,
      loggerMock,
      syncTeamMemberDataMock,
    );

    await expect(handler(getTeamPublishedEvent('team-1234'))).rejects.toThrow(
      Boom.badData(),
    );

    expect(syncTeamMemberDataMock).not.toHaveBeenCalled();
  });

  test('Should throw an error when syncing team member data fails', async () => {
    teamControllerMock.fetchById.mockResolvedValue(getTeamResponse());
    syncTeamMemberDataMock.mockRejectedValue(new Error('ops'));

    const {
      syncActiveCampaignTeamMemberStatusHandler,
    } = require('../../../src/handlers/teams/sync-active-campaign-team-member-status');

    const handler = syncActiveCampaignTeamMemberStatusHandler(
      teamControllerMock,
      userControllerMock,
      loggerMock,
      syncTeamMemberDataMock,
    );

    await expect(handler(getTeamPublishedEvent('team-1234'))).rejects.toThrow(
      'ops',
    );
  });

  test('Should handle not found error', async () => {
    teamControllerMock.fetchById.mockRejectedValue(Boom.notFound());

    const {
      syncActiveCampaignTeamMemberStatusHandler,
    } = require('../../../src/handlers/teams/sync-active-campaign-team-member-status');

    const handler = syncActiveCampaignTeamMemberStatusHandler(
      teamControllerMock,
      userControllerMock,
      loggerMock,
      syncTeamMemberDataMock,
    );

    await handler(getTeamPublishedEvent('team-1234'));

    expect(loggerMock.info).toHaveBeenLastCalledWith(
      expect.anything(),
      'Team not found',
    );
    expect(syncTeamMemberDataMock).not.toHaveBeenCalled();
  });

  test('Should call syncTeamMemberData for each member when handling a team event', async () => {
    teamControllerMock.fetchById.mockResolvedValue({
      ...getTeamResponse(),
      members: Array.from({ length: 9 }, (_, i) => ({
        id: `user-${i}`,
        email: 'H@rdy.io',
        firstName: 'Tom',
        lastName: 'Hardy',
        displayName: 'Tom Hardy',
        role: 'Lead PI (Core Leadership)' as TeamRole,
        labs: [],
      })),
    });

    const {
      syncActiveCampaignTeamMemberStatusHandler,
    } = require('../../../src/handlers/teams/sync-active-campaign-team-member-status');

    const handler = syncActiveCampaignTeamMemberStatusHandler(
      teamControllerMock,
      userControllerMock,
      loggerMock,
      syncTeamMemberDataMock,
    );

    await handler(getTeamPublishedEvent('team-1234'));

    expect(syncTeamMemberDataMock).toHaveBeenCalledTimes(9);
  });
});
