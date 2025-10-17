import Boom from '@hapi/boom';
import { indexTeamUsersHandler } from '../../../src/handlers/teams/algolia-index-team-users-handler';
import {
  getListUserResponse,
  getUserListItemResponse,
} from '../../fixtures/users.fixtures';

import {
  getTeamPublishedEvent,
  TeamEventGenerator,
  getTeamUnpublishedEvent,
  getTeamMembershipPublishedEvent,
  getTeamMembershipUnpublishedEvent,
  TeamMembershipEventGenerator,
} from '../../fixtures/teams.fixtures';

import { getAlgoliaSearchClientMock } from '../../mocks/algolia-client.mock';
import { userControllerMock } from '../../mocks/user.controller.mock';

jest.mock('../../../src/utils/logger');

const algoliaSearchClientMock = getAlgoliaSearchClientMock();

const possibleEvents: [string, TeamEventGenerator][] = [
  ['published', getTeamPublishedEvent],
  ['unpublished', getTeamUnpublishedEvent],
];

const possibleTeamMembershipEvents: [string, TeamMembershipEventGenerator][] = [
  ['published', getTeamMembershipPublishedEvent],
  ['unpublished', getTeamMembershipUnpublishedEvent],
];

const possibleRacingConditionEvents: [
  string,
  TeamEventGenerator,
  TeamEventGenerator,
][] = [
  ['published and unpublished', getTeamPublishedEvent, getTeamUnpublishedEvent],
  ['unpublished and published', getTeamUnpublishedEvent, getTeamPublishedEvent],
];

describe('Index Users on Team event handler', () => {
  const indexHandler = indexTeamUsersHandler(
    userControllerMock,
    algoliaSearchClientMock,
  );
  afterEach(() => jest.clearAllMocks());

  test('Should throw an error and do not trigger algolia when the team request fails with another error code', async () => {
    userControllerMock.fetch.mockRejectedValue(Boom.badData());

    await expect(
      indexHandler(getTeamPublishedEvent('team-1234')),
    ).rejects.toThrow(Boom.badData());
    expect(algoliaSearchClientMock.saveMany).not.toHaveBeenCalled();
  });

  test('Should throw an error and do not trigger algolia when the team membership request fails with another error code', async () => {
    userControllerMock.fetch.mockRejectedValue(Boom.badData());

    await expect(
      indexHandler(
        getTeamMembershipPublishedEvent('membership-123', 'team-456'),
      ),
    ).rejects.toThrow(Boom.badData());
    expect(algoliaSearchClientMock.saveMany).not.toHaveBeenCalled();
  });

  test('Should throw the algolia error when saving the record fails', async () => {
    const algoliaError = new Error('ERROR');

    userControllerMock.fetch.mockResolvedValueOnce(getListUserResponse());
    algoliaSearchClientMock.saveMany.mockRejectedValueOnce(algoliaError);

    await expect(
      indexHandler(getTeamPublishedEvent('team-1234')),
    ).rejects.toThrow(algoliaError);
  });

  test('Should omit non-onboarded and Hidden users', async () => {
    const userResponse = getUserListItemResponse();
    userControllerMock.fetch.mockResolvedValueOnce({
      total: 3,
      items: [
        userResponse,
        { ...userResponse, role: 'Hidden' },
        { ...userResponse, onboarded: false },
      ],
    });

    await indexHandler(getTeamPublishedEvent('lab-1234'));

    expect(algoliaSearchClientMock.saveMany).toHaveBeenCalledWith([
      {
        data: userResponse,
        type: 'user',
      },
    ]);
  });

  test.each(possibleEvents)(
    'Should index users when team event %s occurs',
    async (name, eventA) => {
      const usersResponse = getListUserResponse();

      const event = eventA('team-1234');
      userControllerMock.fetch.mockResolvedValueOnce(usersResponse);

      await indexHandler(event);

      expect(userControllerMock.fetch).toHaveBeenCalledWith({
        filter: { teamId: 'team-1234' },
        skip: expect.any(Number),
        take: expect.any(Number),
      });
      expect(algoliaSearchClientMock.saveMany).toHaveBeenCalledWith(
        usersResponse.items.map((item) => ({
          data: item,
          type: 'user',
        })),
      );
    },
  );

  test.each(possibleTeamMembershipEvents)(
    'Should index users when team membership event %s occurs',
    async (name, eventA) => {
      const usersResponse = getListUserResponse();
      const membershipId = 'membership-123';
      const teamId = 'team-456';

      const event = eventA(membershipId, teamId);
      userControllerMock.fetch.mockResolvedValueOnce(usersResponse);

      await indexHandler(event);

      // Verify that the handler extracts team ID from the membership data
      expect(userControllerMock.fetch).toHaveBeenCalledWith({
        filter: { teamId }, // Should use the team ID from the membership, not the membership ID
        skip: expect.any(Number),
        take: expect.any(Number),
      });
      expect(algoliaSearchClientMock.saveMany).toHaveBeenCalledWith(
        usersResponse.items.map((item) => ({
          data: item,
          type: 'user',
        })),
      );
    },
  );

  test('Should extract team ID correctly from TeamMembershipPublished event', async () => {
    const usersResponse = getListUserResponse();
    const membershipId = 'membership-abc123';
    const teamId = 'team-xyz789';

    const event = getTeamMembershipPublishedEvent(membershipId, teamId);
    userControllerMock.fetch.mockResolvedValueOnce(usersResponse);

    await indexHandler(event);

    // Verify the handler correctly extracts team ID from the nested structure
    expect(userControllerMock.fetch).toHaveBeenCalledWith({
      filter: { teamId },
      skip: expect.any(Number),
      take: expect.any(Number),
    });
    expect(algoliaSearchClientMock.saveMany).toHaveBeenCalledWith(
      usersResponse.items.map((item) => ({
        data: item,
        type: 'user',
      })),
    );
  });

  test('Should extract team ID correctly from TeamMembershipUnpublished event', async () => {
    const usersResponse = getListUserResponse();
    const membershipId = 'membership-def456';
    const teamId = 'team-uvw012';

    const event = getTeamMembershipUnpublishedEvent(membershipId, teamId);
    userControllerMock.fetch.mockResolvedValueOnce(usersResponse);

    await indexHandler(event);

    // Verify the handler correctly extracts team ID from the nested structure
    expect(userControllerMock.fetch).toHaveBeenCalledWith({
      filter: { teamId },
      skip: expect.any(Number),
      take: expect.any(Number),
    });
    expect(algoliaSearchClientMock.saveMany).toHaveBeenCalledWith(
      usersResponse.items.map((item) => ({
        data: item,
        type: 'user',
      })),
    );
  });

  test('Should use resourceId directly for Team events (not TeamMembership)', async () => {
    const usersResponse = getListUserResponse();
    const teamId = 'team-direct123';

    const event = getTeamPublishedEvent(teamId);
    userControllerMock.fetch.mockResolvedValueOnce(usersResponse);

    await indexHandler(event);

    // Verify the handler uses resourceId directly for Team events
    expect(userControllerMock.fetch).toHaveBeenCalledWith({
      filter: { teamId },
      skip: expect.any(Number),
      take: expect.any(Number),
    });
    expect(algoliaSearchClientMock.saveMany).toHaveBeenCalledWith(
      usersResponse.items.map((item) => ({
        data: item,
        type: 'user',
      })),
    );
  });

  describe('Should process the events, handle race conditions and not rely on the order of the events', () => {
    test.each(possibleRacingConditionEvents)(
      'receives the events %s when team exists',
      async (name, eventA, eventB) => {
        const userID = 'user-1234';
        const usersResponse = {
          ...getListUserResponse(),
          id: userID,
        };
        userControllerMock.fetch.mockResolvedValue(usersResponse);

        await indexHandler(eventA(userID));
        await indexHandler(eventB(userID));

        expect(algoliaSearchClientMock.saveMany).toHaveBeenCalledTimes(2);
        expect(algoliaSearchClientMock.saveMany).toHaveBeenNthCalledWith(
          1,
          usersResponse.items.map((item) => ({
            data: item,
            type: 'user',
          })),
        );
        expect(algoliaSearchClientMock.saveMany).toHaveBeenNthCalledWith(
          2,
          usersResponse.items.map((item) => ({
            data: item,
            type: 'user',
          })),
        );
      },
    );
  });
});
