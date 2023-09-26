import { gp2 as gp2Model } from '@asap-hub/model';
import Boom from '@hapi/boom';
import { EventBridgeEvent } from 'aws-lambda';
import { ProjectPayload } from '../../../src/handlers/event-bus';
import { indexOutputProjectHandler } from '../../../src/handlers/output/algolia-index-project-handler';
import { getListOutputResponse } from '../../fixtures/output.fixtures';
import { getProjectEvent } from '../../fixtures/project.fixtures';
import { getAlgoliaSearchClientMock } from '../../mocks/algolia-client.mock';
import { outputControllerMock } from '../../mocks/output.controller.mock';
import { toPayload } from '../../utils/algolia';

const mapPayload = toPayload('output');

const algoliaSearchClientMock = getAlgoliaSearchClientMock();
const possibleEvents: [
  string,
  EventBridgeEvent<gp2Model.ProjectEvent, ProjectPayload>,
][] = [
  ['created', getProjectEvent('project-id', 'ProjectsCreated')],
  ['updated', getProjectEvent('project-id', 'ProjectsUpdated')],
  ['unpublished', getProjectEvent('project-id', 'ProjectsUnpublished')],
  ['deleted', getProjectEvent('project-id', 'ProjectsDeleted')],
];

jest.mock('../../../src/utils/logger');
describe('Index Outputs on Project event handler', () => {
  const indexHandler = indexOutputProjectHandler(
    outputControllerMock,
    algoliaSearchClientMock,
  );
  beforeEach(jest.resetAllMocks);

  test('Should throw an error and do not trigger algolia when the project request fails with another error code', async () => {
    outputControllerMock.fetch.mockRejectedValue(Boom.badData());

    await expect(
      indexHandler(getProjectEvent('project-id', 'ProjectsCreated')),
    ).rejects.toThrow(Boom.badData());
    expect(algoliaSearchClientMock.saveMany).not.toHaveBeenCalled();
  });

  test('Should throw the algolia error when saving the record fails', async () => {
    const algoliaError = new Error('ERROR');

    const listOutputsResponse = getListOutputResponse();
    outputControllerMock.fetch.mockResolvedValueOnce(listOutputsResponse);
    algoliaSearchClientMock.saveMany.mockRejectedValueOnce(algoliaError);

    await expect(
      indexHandler(getProjectEvent('project-id', 'ProjectsUpdated')),
    ).rejects.toThrow(algoliaError);
  });

  test.each(possibleEvents)(
    'Should index output when project event %s occurs',
    async (_name, event) => {
      const listOutputsResponse = getListOutputResponse();
      outputControllerMock.fetch.mockResolvedValueOnce(listOutputsResponse);

      await indexHandler(event);

      expect(outputControllerMock.fetch).toHaveBeenCalledWith({
        filter: {
          projectId: 'project-id',
        },
        skip: 0,
        take: 8,
      });
      expect(algoliaSearchClientMock.saveMany).toHaveBeenCalledWith(
        listOutputsResponse.items.map(mapPayload),
      );
    },
  );
});
