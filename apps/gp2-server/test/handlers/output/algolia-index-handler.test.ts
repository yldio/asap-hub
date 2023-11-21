import { gp2 as gp2Model } from '@asap-hub/model';
import Boom from '@hapi/boom';
import { EventBridgeEvent } from 'aws-lambda';
import { OutputPayload } from '../../../src/handlers/event-bus';
import { indexOutputHandler } from '../../../src/handlers/output/algolia-index-handler';
import {
  getOutputEvent,
  getOutputResponse,
} from '../../fixtures/output.fixtures';
import { getAlgoliaSearchClientMock } from '../../mocks/algolia-client.mock';
import { loggerMock } from '../../mocks/logger.mock';
import { outputControllerMock } from '../../mocks/output.controller.mock';

const algoliaSearchClientMock = getAlgoliaSearchClientMock();
describe('Output index handler', () => {
  const indexHandler = indexOutputHandler(
    outputControllerMock,
    algoliaSearchClientMock,
    loggerMock,
  );
  beforeEach(jest.resetAllMocks);

  test('Should fetch the output and create a record in Algolia when output is published', async () => {
    const outputResponse = getOutputResponse();
    outputResponse.relatedOutputs = [];
    outputControllerMock.fetchById.mockResolvedValueOnce(outputResponse);

    await indexHandler(publishedEvent('42'));

    expect(algoliaSearchClientMock.save).toHaveBeenCalledWith({
      data: expect.objectContaining(outputResponse),
      type: 'output',
    });
  });
  test('Should fetch the output and create two records in Algolia when output is created and own and foreign related ROs are created', async () => {
    const outputResponse = getOutputResponse();

    const relatedOutputResponse = getOutputResponse();
    relatedOutputResponse.id = 'ro-1236';
    relatedOutputResponse.title = 'Foreign related output';
    relatedOutputResponse.documentType = 'Code/Software';

    outputResponse.relatedOutputs = [
      {
        id: relatedOutputResponse.id,
        title: relatedOutputResponse.title,
        documentType: relatedOutputResponse.documentType,
      },
    ];

    outputControllerMock.fetchById
      .mockResolvedValueOnce(outputResponse)
      .mockResolvedValueOnce(relatedOutputResponse);

    await indexHandler(publishedEvent('ro-1234'));

    expect(algoliaSearchClientMock.save).toHaveBeenCalledTimes(2);
    expect(algoliaSearchClientMock.save).toHaveBeenCalledWith({
      data: expect.objectContaining(outputResponse),
      type: 'output',
    });
    expect(algoliaSearchClientMock.save).toHaveBeenCalledWith({
      data: expect.objectContaining(relatedOutputResponse),
      type: 'output',
    });
  });

  test('Should populate the _tags field before saving the output to Algolia', async () => {
    const outputResponse = getOutputResponse();
    outputResponse.tags = [{ id: '1', name: 'output tag' }];
    outputResponse.relatedOutputs = [];
    outputControllerMock.fetchById.mockResolvedValueOnce(outputResponse);

    await indexHandler(publishedEvent('42'));
    expect(algoliaSearchClientMock.save).toHaveBeenCalledWith({
      data: { ...outputResponse, _tags: ['output tag'] },
      type: 'output',
    });
  });

  test('Should fetch the output and remove the record in Algolia when output is unpublished', async () => {
    const event = unpublishedEvent('42');

    outputControllerMock.fetchById.mockRejectedValue(Boom.notFound());

    await indexHandler(event);

    expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
    expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(1);
    expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
      event.detail.resourceId,
    );
  });

  test('Should throw an error and do not trigger algolia when the output request fails with another error code', async () => {
    outputControllerMock.fetchById.mockRejectedValue(Boom.badData());

    await expect(indexHandler(publishedEvent('42'))).rejects.toThrow(
      Boom.badData(),
    );
    expect(algoliaSearchClientMock.remove).not.toHaveBeenCalled();
  });

  test('Should throw the algolia error when publishing the record fails', async () => {
    const algoliaError = new Error('ERROR');

    outputControllerMock.fetchById.mockResolvedValueOnce(getOutputResponse());
    algoliaSearchClientMock.save.mockRejectedValueOnce(algoliaError);

    await expect(indexHandler(publishedEvent('42'))).rejects.toThrow(
      algoliaError,
    );
  });

  test('Should throw the algolia error when unpublishing the record fails', async () => {
    const algoliaError = new Error('ERROR');

    outputControllerMock.fetchById.mockRejectedValue(Boom.notFound());

    algoliaSearchClientMock.remove.mockRejectedValueOnce(algoliaError);

    await expect(indexHandler(unpublishedEvent('42'))).rejects.toThrow(
      algoliaError,
    );
  });

  describe('Should process the events, handle race conditions and not rely on the order of the events', () => {
    test('receives the events published and unpublished in correct order', async () => {
      const id = '42';
      const publishedEv = publishedEvent(id);
      const unpublishedEv = unpublishedEvent(id);
      const algoliaError = new Error('ERROR');

      outputControllerMock.fetchById.mockRejectedValue(Boom.notFound());
      algoliaSearchClientMock.remove.mockResolvedValueOnce(undefined);
      algoliaSearchClientMock.remove.mockRejectedValue(algoliaError);

      await indexHandler(publishedEv);
      await expect(indexHandler(unpublishedEv)).rejects.toEqual(algoliaError);

      expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
        unpublishedEv.detail.resourceId,
      );
    });

    test('receives the events published and unpublished in reverse order', async () => {
      const id = '42';
      const publishedEv = publishedEvent(id);
      const unpublishedEv = unpublishedEvent(id);
      const algoliaError = new Error('ERROR');

      outputControllerMock.fetchById.mockRejectedValue(Boom.notFound());
      algoliaSearchClientMock.remove.mockResolvedValueOnce(undefined);
      algoliaSearchClientMock.remove.mockRejectedValue(algoliaError);

      await indexHandler(unpublishedEv);
      await expect(indexHandler(publishedEv)).rejects.toEqual(algoliaError);

      expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
        unpublishedEv.detail.resourceId,
      );
    });
  });
});

const unpublishedEvent = (id: string) =>
  getOutputEvent(id, 'OutputsUnpublished') as EventBridgeEvent<
    gp2Model.OutputEvent,
    OutputPayload
  >;

const publishedEvent = (id: string) =>
  getOutputEvent(id, 'OutputsPublished') as EventBridgeEvent<
    gp2Model.OutputEvent,
    OutputPayload
  >;
