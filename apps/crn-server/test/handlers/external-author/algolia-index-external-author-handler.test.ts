import { NotFoundError } from '@asap-hub/errors';
import { indexExternalAuthorHandler } from '../../../src/handlers/external-author/algolia-index-external-author-handler';
import {
  getExternalAuthorContentfulEvent,
  getExternalAuthorResponse,
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

  test('Should fetch the external author and create a record in Algolia when the external author is published in Contentful', async () => {
    const event = publishedEventContentful();
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

  test('Should throw the algolia error when saving the record fails', async () => {
    const algoliaError = new Error('ERROR');

    externalAuthorControllerMock.fetchById.mockResolvedValueOnce(
      getExternalAuthorResponse(),
    );
    algoliaSearchClientMock.save.mockRejectedValueOnce(algoliaError);

    await expect(indexHandler(publishedEventContentful())).rejects.toThrow(
      algoliaError,
    );
  });

  test('Should throw the algolia error when deleting the record fails', async () => {
    const algoliaError = new Error('ERROR');

    externalAuthorControllerMock.fetchById.mockRejectedValue(
      new NotFoundError(),
    );

    algoliaSearchClientMock.remove.mockRejectedValueOnce(algoliaError);

    await expect(indexHandler(unpublishedEvent())).rejects.toThrow(
      algoliaError,
    );
  });

  describe('Should process the events, handle race conditions and not rely on the order of the events', () => {
    test('receives the events published and unpublished in correct order', async () => {
      const externalauthorId = 'external-author-1234';
      const createEv = publishedEventContentful(externalauthorId);
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
        unpublishedEv.detail.resourceId,
      );
    });

    test('receives the events published and unpublished in reverse order', async () => {
      const externalauthorId = 'external-author-1234';
      const createEv = publishedEventContentful(externalauthorId);
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
        unpublishedEv.detail.resourceId,
      );
    });
  });
});

const unpublishedEvent = (id: string = 'external-author-1234') =>
  getExternalAuthorContentfulEvent(id, 'ExternalAuthorsUnpublished');

const publishedEventContentful = (id: string = 'external-author-1234') =>
  getExternalAuthorContentfulEvent(id, 'ExternalAuthorsPublished');
