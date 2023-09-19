import { gp2 as gp2Model } from '@asap-hub/model';
import Boom from '@hapi/boom';
import { EventBridgeEvent } from 'aws-lambda';
import { ExternalUserPayload } from '../../../src/handlers/event-bus';
import { indexExternalUserOutputsHandler } from '../../../src/handlers/output/algolia-index-external-user-handler';
import { getExternalUserEvent } from '../../fixtures/external-users.fixtures';
import { getListOutputResponse } from '../../fixtures/output.fixtures';
import { getAlgoliaSearchClientMock } from '../../mocks/algolia-client.mock';
import { outputControllerMock } from '../../mocks/output.controller.mock';
import { toPayload } from '../../utils/algolia';

const mapPayload = toPayload('output');

const algoliaSearchClientMock = getAlgoliaSearchClientMock();
const possibleEvents: [
  string,
  EventBridgeEvent<gp2Model.ExternalUserEvent, ExternalUserPayload>,
][] = [
  ['created', getExternalUserEvent('external-user-id', 'ExternalUsersCreated')],
  ['updated', getExternalUserEvent('external-user-id', 'ExternalUsersUpdated')],
  [
    'unpublished',
    getExternalUserEvent('external-user-id', 'ExternalUsersUnpublished'),
  ],
  ['deleted', getExternalUserEvent('external-user-id', 'ExternalUsersDeleted')],
];

jest.mock('../../../src/utils/logger');
describe('Index Outputs on External User event handler', () => {
  const indexHandler = indexExternalUserOutputsHandler(
    outputControllerMock,
    algoliaSearchClientMock,
  );
  beforeEach(jest.resetAllMocks);

  test('Should throw an error and do not trigger algolia when the external user request fails with another error code', async () => {
    outputControllerMock.fetch.mockRejectedValue(Boom.badData());

    await expect(
      indexHandler(
        getExternalUserEvent('external-user-id', 'ExternalUsersCreated'),
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
      indexHandler(
        getExternalUserEvent('external-user-id', 'ExternalUsersUpdated'),
      ),
    ).rejects.toThrow(algoliaError);
  });

  test.each(possibleEvents)(
    'Should index output when external user event %s occurs',
    async (_name, event) => {
      const listOutputsResponse = getListOutputResponse();
      outputControllerMock.fetch.mockResolvedValueOnce(listOutputsResponse);

      await indexHandler(event);

      expect(outputControllerMock.fetch).toHaveBeenCalledWith({
        filter: {
          externalAuthorId: 'external-user-id',
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
