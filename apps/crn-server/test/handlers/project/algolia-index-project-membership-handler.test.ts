import Boom from '@hapi/boom';
import { ProjectMembershipEvent } from '@asap-hub/model';
import { indexProjectMembershipHandler } from '../../../src/handlers/project/algolia-index-project-membership-handler';
import {
  getExpectedDiscoveryProject,
  getExpectedResourceTeamProject,
} from '../../fixtures/projects.fixtures';
import { toPayload } from '../../helpers/algolia';
import { getAlgoliaSearchClientMock } from '../../mocks/algolia-client.mock';
import { projectControllerMock } from '../../mocks/project.controller.mock';

const mapPayload = toPayload('project');

const algoliaSearchClientMock = getAlgoliaSearchClientMock();
const possibleEvents: [string, ProjectMembershipEvent][] = [
  ['published', 'ProjectMembershipPublished'],
  ['unpublished', 'ProjectMembershipUnpublished'],
];

const getProjectMembershipEvent = (
  membershipId: string,
  eventType: ProjectMembershipEvent,
) => ({
  'detail-type': eventType,
  detail: {
    resourceId: membershipId,
  },
});

jest.mock('../../../src/utils/logger');

describe('Index Projects on ProjectMembership event handler', () => {
  const indexHandler = indexProjectMembershipHandler(
    projectControllerMock,
    algoliaSearchClientMock,
  );

  afterEach(() => jest.clearAllMocks());

  test('Should throw an error and not trigger algolia when the project request fails with another error code', async () => {
    projectControllerMock.fetch.mockRejectedValue(Boom.badData());

    await expect(
      indexHandler(
        getProjectMembershipEvent(
          'membership-id',
          'ProjectMembershipPublished',
        ) as any,
      ),
    ).rejects.toThrow(Boom.badData());
    expect(algoliaSearchClientMock.saveMany).not.toHaveBeenCalled();
  });

  test('Should throw the algolia error when saving the record fails', async () => {
    const algoliaError = new Error('ERROR');

    const listProjectResponse = {
      total: 1,
      items: [getExpectedDiscoveryProject()],
    };
    projectControllerMock.fetch.mockResolvedValueOnce(listProjectResponse);
    algoliaSearchClientMock.saveMany.mockRejectedValueOnce(algoliaError);

    await expect(
      indexHandler(
        getProjectMembershipEvent(
          'membership-id',
          'ProjectMembershipPublished',
        ) as any,
      ),
    ).rejects.toThrow(algoliaError);
  });

  test('Should call saveMany with empty array when no projects are found for the membership', async () => {
    projectControllerMock.fetch.mockResolvedValueOnce({
      total: 0,
      items: [],
    });

    await indexHandler(
      getProjectMembershipEvent(
        'membership-id',
        'ProjectMembershipPublished',
      ) as any,
    );

    expect(projectControllerMock.fetch).toHaveBeenCalledWith({
      filter: { projectMembershipId: 'membership-id' },
      skip: 0,
      take: 8,
    });
    expect(algoliaSearchClientMock.saveMany).toHaveBeenCalledWith([]);
  });

  test('Should save project with _tags', async () => {
    projectControllerMock.fetch.mockResolvedValueOnce({
      total: 1,
      items: [
        {
          ...getExpectedDiscoveryProject(),
          tags: ['Tag A', 'Tag B'],
        },
      ],
    });

    await indexHandler(
      getProjectMembershipEvent(
        'membership-id',
        'ProjectMembershipPublished',
      ) as any,
    );

    expect(algoliaSearchClientMock.saveMany).toHaveBeenCalledWith([
      {
        type: 'project',
        data: expect.objectContaining({
          _tags: ['Tag A', 'Tag B'],
        }),
      },
    ]);
  });

  test.each(possibleEvents)(
    'Should index projects when membership event %s occurs',
    async (_name, eventType) => {
      const listProjectResponse = {
        total: 2,
        items: [
          getExpectedDiscoveryProject(),
          getExpectedResourceTeamProject(),
        ],
      };
      projectControllerMock.fetch.mockResolvedValueOnce(listProjectResponse);

      await indexHandler(
        getProjectMembershipEvent('membership-id', eventType) as any,
      );

      expect(projectControllerMock.fetch).toHaveBeenCalledWith({
        filter: { projectMembershipId: 'membership-id' },
        skip: 0,
        take: 8,
      });
      expect(algoliaSearchClientMock.saveMany).toHaveBeenCalledWith(
        listProjectResponse.items.map(mapPayload).map((item) => ({
          ...item,
          data: {
            ...item.data,
            _tags: (item.data as { tags?: string[] }).tags || [],
          },
        })),
      );
    },
  );

  test('Should handle pagination when there are more projects than the batch size', async () => {
    const firstBatch = {
      total: 10,
      items: Array(8).fill(getExpectedDiscoveryProject()),
    };
    const secondBatch = {
      total: 10,
      items: Array(2).fill(getExpectedResourceTeamProject()),
    };

    projectControllerMock.fetch
      .mockResolvedValueOnce(firstBatch)
      .mockResolvedValueOnce(secondBatch);

    await indexHandler(
      getProjectMembershipEvent(
        'membership-id',
        'ProjectMembershipPublished',
      ) as any,
    );

    expect(projectControllerMock.fetch).toHaveBeenCalledTimes(2);
    expect(projectControllerMock.fetch).toHaveBeenNthCalledWith(1, {
      filter: { projectMembershipId: 'membership-id' },
      skip: 0,
      take: 8,
    });
    expect(projectControllerMock.fetch).toHaveBeenNthCalledWith(2, {
      filter: { projectMembershipId: 'membership-id' },
      skip: 8,
      take: 8,
    });
    expect(algoliaSearchClientMock.saveMany).toHaveBeenCalledTimes(2);
  });

  test('Should log warning when membership not found (404 error)', async () => {
    const notFoundError = Boom.notFound('Membership not found');
    projectControllerMock.fetch.mockRejectedValueOnce(notFoundError);

    // Should not throw
    await indexHandler(
      getProjectMembershipEvent(
        'membership-id',
        'ProjectMembershipPublished',
      ) as any,
    );

    expect(algoliaSearchClientMock.saveMany).not.toHaveBeenCalled();
  });
});
