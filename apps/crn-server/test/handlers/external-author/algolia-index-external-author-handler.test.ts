import { NotFoundError } from '@asap-hub/errors';
import { indexExternalAuthorHandler } from '../../../src/handlers/external-author/algolia-index-external-author-handler';
import {
  getExternalAuthorContentfulEvent,
  getExternalAuthorResponse,
  getExternalAuthorSquidexEvent,
} from '../../fixtures/external-authors.fixtures';
import { getAlgoliaSearchClientMock } from '../../mocks/algolia-client.mock';
import { externalAuthorControllerMock } from '../../mocks/external-author.controller.mock';
const algoliaSearchClientMock = getAlgoliaSearchClientMock();

jest.mock('../../../src/utils/logger');
describe('External Author index handler', () => {
  const indexHandler = indexExternalAuthorHandler(
    externalAuthorControllerMock,
    algoliaSearchClientMock,
  );

  afterEach(() => jest.clearAllMocks());

  test('Should fetch the external author and create a record in Algolia when the external author is created in Squidex', async () => {
    const event = createEventSquidex();
    const externalauthorResponse = getExternalAuthorResponse();
    externalAuthorControllerMock.fetchById.mockResolvedValueOnce(
      externalauthorResponse,
    );

    await indexHandler(event);
    expect(externalAuthorControllerMock.fetchById).toHaveBeenCalledWith(
      event.detail.resourceId,
    );
    expect(algoliaSearchClientMock.save).toHaveBeenCalledWith({
      data: externalauthorResponse,
      type: 'external-author',
    });
  });

  test('Should fetch the external author and create a record in Algolia when the external author is created in Contentful', async () => {
    const event = createEventContentful();
    const externalauthorResponse = getExternalAuthorResponse();
    externalAuthorControllerMock.fetchById.mockResolvedValueOnce(
      externalauthorResponse,
    );

    await indexHandler(event);
    expect(externalAuthorControllerMock.fetchById).toHaveBeenCalledWith(
      event.detail.resourceId,
    );
    expect(algoliaSearchClientMock.save).toHaveBeenCalledWith({
      data: externalauthorResponse,
      type: 'external-author',
    });
  });

  test('Should fetch the external author and create a record in Algolia when external author is updated', async () => {
    const externalauthorResponse = getExternalAuthorResponse();
    externalAuthorControllerMock.fetchById.mockResolvedValueOnce(
      externalauthorResponse,
    );

    await indexHandler(updateEvent());

    expect(algoliaSearchClientMock.save).toHaveBeenCalledWith({
      data: externalauthorResponse,
      type: 'external-author',
    });
  });

  test('Should fetch the external author and remove the record in Algolia when external author is unpublished', async () => {
    const event = unpublishedEvent();

    externalAuthorControllerMock.fetchById.mockRejectedValue(
      new NotFoundError(),
    );

    await indexHandler(event);

    expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
      event.detail.resourceId,
    );
  });

  test('Should fetch the external author and remove the record in Algolia when external author is deleted', async () => {
    const event = deleteEvent();

    externalAuthorControllerMock.fetchById.mockRejectedValue(
      new NotFoundError(),
    );

    await indexHandler(event);

    expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
      event.detail.resourceId,
    );
  });

  test('Should throw the algolia error when saving the record fails', async () => {
    const algoliaError = new Error('ERROR');

    externalAuthorControllerMock.fetchById.mockResolvedValueOnce(
      getExternalAuthorResponse(),
    );
    algoliaSearchClientMock.save.mockRejectedValueOnce(algoliaError);

    await expect(indexHandler(updateEvent())).rejects.toThrow(algoliaError);
  });

  test('Should throw the algolia error when deleting the record fails', async () => {
    const algoliaError = new Error('ERROR');

    externalAuthorControllerMock.fetchById.mockRejectedValue(
      new NotFoundError(),
    );

    algoliaSearchClientMock.remove.mockRejectedValueOnce(algoliaError);

    await expect(indexHandler(deleteEvent())).rejects.toThrow(algoliaError);
  });

  describe('Should process the events, handle race conditions and not rely on the order of the events', () => {
    test('receives the events created and updated in correct order', async () => {
      const externalauthorId = 'external-author-1234';
      const externalauthorResponse = {
        data: { ...getExternalAuthorResponse(), id: externalauthorId },
        type: 'external-author',
      };

      externalAuthorControllerMock.fetchById.mockResolvedValue({
        ...externalauthorResponse.data,
      });

      await indexHandler(createEventSquidex(externalauthorId));
      await indexHandler(updateEvent(externalauthorId));

      expect(algoliaSearchClientMock.remove).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.save).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.save).toHaveBeenCalledWith(
        externalauthorResponse,
      );
    });

    test('receives the events created and updated in reverse order', async () => {
      const externalauthorId = 'external-author-1234';
      const externalauthorResponse = {
        data: { ...getExternalAuthorResponse(), id: 'external-author-1234' },
        type: 'external-author',
      };

      externalAuthorControllerMock.fetchById.mockResolvedValue(
        externalauthorResponse.data,
      );

      await indexHandler(updateEvent(externalauthorId));
      await indexHandler(createEventSquidex(externalauthorId));

      expect(algoliaSearchClientMock.remove).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.save).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.save).toHaveBeenCalledWith(
        externalauthorResponse,
      );
    });

    test('receives the events created and unpublished in correct order', async () => {
      const externalauthorId = 'external-author-1234';
      const createEv = createEventSquidex(externalauthorId);
      const unpublishedEv = unpublishedEvent(externalauthorId);
      const algoliaError = new Error('ERROR');

      externalAuthorControllerMock.fetchById.mockRejectedValue(
        new NotFoundError(),
      );
      algoliaSearchClientMock.remove.mockResolvedValueOnce(undefined);
      algoliaSearchClientMock.remove.mockRejectedValue(algoliaError);

      await indexHandler(createEv);
      await expect(indexHandler(unpublishedEv)).rejects.toEqual(algoliaError);

      expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
        unpublishedEv.detail.payload.id,
      );
    });

    test('receives the events created and unpublished in reverse order', async () => {
      const externalauthorId = 'external-author-1234';
      const createEv = createEventSquidex(externalauthorId);
      const unpublishedEv = unpublishedEvent(externalauthorId);
      const algoliaError = new Error('ERROR');

      externalAuthorControllerMock.fetchById.mockRejectedValue(
        new NotFoundError(),
      );
      algoliaSearchClientMock.remove.mockResolvedValueOnce(undefined);
      algoliaSearchClientMock.remove.mockRejectedValue(algoliaError);

      await indexHandler(unpublishedEv);
      await expect(indexHandler(createEv)).rejects.toEqual(algoliaError);

      expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
        unpublishedEv.detail.payload.id,
      );
    });

    test('receives the events created and deleted in correct order', async () => {
      const externalauthorId = 'external-author-1234';
      const createEv = createEventSquidex(externalauthorId);
      const deleteEv = deleteEvent(externalauthorId);
      const algoliaError = new Error('ERROR');

      externalAuthorControllerMock.fetchById.mockRejectedValue(
        new NotFoundError(),
      );
      algoliaSearchClientMock.remove.mockResolvedValueOnce(undefined);
      algoliaSearchClientMock.remove.mockRejectedValue(algoliaError);

      await indexHandler(createEv);
      await expect(indexHandler(deleteEv)).rejects.toEqual(algoliaError);

      expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
        deleteEv.detail.payload.id,
      );
    });

    test('receives the events created and deleted in reverse order', async () => {
      const externalauthorId = 'external-author-1234';
      const createEv = createEventSquidex(externalauthorId);
      const deleteEv = deleteEvent(externalauthorId);
      const algoliaError = new Error('ERROR');

      externalAuthorControllerMock.fetchById.mockRejectedValue(
        new NotFoundError(),
      );
      algoliaSearchClientMock.remove.mockResolvedValueOnce(undefined);
      algoliaSearchClientMock.remove.mockRejectedValue(algoliaError);

      await indexHandler(deleteEv);
      await expect(indexHandler(createEv)).rejects.toEqual(algoliaError);

      expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
        deleteEv.detail.payload.id,
      );
    });

    test('receives the events updated and deleted in correct order', async () => {
      const externalauthorId = 'external-author-1234';
      const updateEv = updateEvent(externalauthorId);
      const deleteEv = deleteEvent(externalauthorId);
      const algoliaError = new Error('ERROR');

      externalAuthorControllerMock.fetchById.mockRejectedValue(
        new NotFoundError(),
      );
      algoliaSearchClientMock.remove.mockResolvedValueOnce(undefined);
      algoliaSearchClientMock.remove.mockRejectedValue(algoliaError);

      await indexHandler(updateEv);
      await expect(indexHandler(deleteEv)).rejects.toEqual(algoliaError);

      expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
        deleteEv.detail.payload.id,
      );
    });

    test('receives the events updated and deleted in reverse order', async () => {
      const externalauthorId = 'external-author-1234';
      const updateEv = updateEvent(externalauthorId);
      const deleteEv = deleteEvent(externalauthorId);
      const algoliaError = new Error('ERROR');

      externalAuthorControllerMock.fetchById.mockRejectedValue(
        new NotFoundError(),
      );
      algoliaSearchClientMock.remove.mockResolvedValueOnce(undefined);
      algoliaSearchClientMock.remove.mockRejectedValue(algoliaError);

      await indexHandler(deleteEv);
      await expect(indexHandler(updateEv)).rejects.toEqual(algoliaError);

      expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
        deleteEv.detail.payload.id,
      );
    });
    test('receives the events updated and unpublished in correct order', async () => {
      const externalauthorId = 'external-author-1234';
      const updateEv = updateEvent(externalauthorId);
      const unpublishedEv = unpublishedEvent(externalauthorId);
      const algoliaError = new Error('ERROR');

      externalAuthorControllerMock.fetchById.mockRejectedValue(
        new NotFoundError(),
      );
      algoliaSearchClientMock.remove.mockResolvedValueOnce(undefined);
      algoliaSearchClientMock.remove.mockRejectedValue(algoliaError);

      await indexHandler(updateEv);
      await expect(indexHandler(unpublishedEv)).rejects.toEqual(algoliaError);

      expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
        unpublishedEv.detail.payload.id,
      );
    });

    test('receives the events updated and unpublished in reverse order', async () => {
      const externalauthorId = 'external-author-1234';
      const updateEv = updateEvent(externalauthorId);
      const unpublishedEv = unpublishedEvent(externalauthorId);
      const algoliaError = new Error('ERROR');

      externalAuthorControllerMock.fetchById.mockRejectedValue(
        new NotFoundError(),
      );
      algoliaSearchClientMock.remove.mockResolvedValueOnce(undefined);
      algoliaSearchClientMock.remove.mockRejectedValue(algoliaError);

      await indexHandler(unpublishedEv);
      await expect(indexHandler(updateEv)).rejects.toEqual(algoliaError);

      expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
        unpublishedEv.detail.payload.id,
      );
    });
  });
});

const unpublishedEvent = (id: string = 'external-author-1234') =>
  getExternalAuthorSquidexEvent(id, 'ExternalAuthorsUnpublished');

const deleteEvent = (id: string = 'external-author-1234') =>
  getExternalAuthorSquidexEvent(id, 'ExternalAuthorsDeleted');

const createEventSquidex = (id: string = 'external-author-1234') =>
  getExternalAuthorSquidexEvent(id, 'ExternalAuthorsPublished');

const createEventContentful = (id: string = 'external-author-1234') =>
  getExternalAuthorContentfulEvent(id, 'ExternalAuthorsPublished');

const updateEvent = (id: string = 'external-author-1234') =>
  getExternalAuthorSquidexEvent(id, 'ExternalAuthorsUpdated');
