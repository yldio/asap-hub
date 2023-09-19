import { gp2 as gp2Model } from '@asap-hub/model';
import Boom from '@hapi/boom';
import { EventBridgeEvent } from 'aws-lambda';
import { WorkingGroupPayload } from '../../../src/handlers/event-bus';
import { indexWorkingGroupOutputsHandler } from '../../../src/handlers/output/algolia-index-working-group-handler';
import { getListOutputResponse } from '../../fixtures/output.fixtures';
import { getWorkingGroupEvent } from '../../fixtures/working-group.fixtures';
import { getAlgoliaSearchClientMock } from '../../mocks/algolia-client.mock';
import { outputControllerMock } from '../../mocks/output.controller.mock';
import { toPayload } from '../../utils/algolia';

const mapPayload = toPayload('output');

const algoliaSearchClientMock = getAlgoliaSearchClientMock();
const possibleEvents: [
  string,
  EventBridgeEvent<gp2Model.WorkingGroupEvent, WorkingGroupPayload>,
][] = [
  ['created', getWorkingGroupEvent('working-group-id', 'WorkingGroupsCreated')],
  ['updated', getWorkingGroupEvent('working-group-id', 'WorkingGroupsUpdated')],
  [
    'unpublished',
    getWorkingGroupEvent('working-group-id', 'WorkingGroupsUnpublished'),
  ],
  ['deleted', getWorkingGroupEvent('working-group-id', 'WorkingGroupsDeleted')],
];

jest.mock('../../../src/utils/logger');
describe('Index Outputs on Working Group event handler', () => {
  const indexHandler = indexWorkingGroupOutputsHandler(
    outputControllerMock,
    algoliaSearchClientMock,
  );
  beforeEach(jest.resetAllMocks);

  test('Should throw an error and do not trigger algolia when the working group request fails with another error code', async () => {
    outputControllerMock.fetch.mockRejectedValue(Boom.badData());

    await expect(
      indexHandler(
        getWorkingGroupEvent('working-group-id', 'WorkingGroupsCreated'),
      ),
    ).rejects.toThrow(Boom.badData());
    expect(algoliaSearchClientMock.saveMany).not.toHaveBeenCalled();
  });

  test('Should throw the algolia error when saving the record fails', async () => {
    const algoliaError = new Error('ERROR');

    const listOutputsResponse = getListOutputResponse();
    outputControllerMock.fetch.mockResolvedValueOnce(listOutputsResponse);
    algoliaSearchClientMock.saveMany.mockRejectedValueOnce(algoliaError);

    await expect(
      indexHandler(getWorkingGroupEvent('project-id', 'WorkingGroupsUpdated')),
    ).rejects.toThrow(algoliaError);
  });

  test.each(possibleEvents)(
    'Should index output when working group event %s occurs',
    async (_name, event) => {
      const listOutputsResponse = getListOutputResponse();
      outputControllerMock.fetch.mockResolvedValueOnce(listOutputsResponse);

      await indexHandler(event);

      expect(outputControllerMock.fetch).toHaveBeenCalledWith({
        filter: {
          workingGroupId: 'working-group-id',
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
