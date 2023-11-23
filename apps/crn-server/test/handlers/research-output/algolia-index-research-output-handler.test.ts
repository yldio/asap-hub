import { ResearchOutputEvent } from '@asap-hub/model';
import { NotFoundError } from '@asap-hub/errors';
import Boom from '@hapi/boom';
import { EventBridgeEvent } from 'aws-lambda';
import { ResearchOutputPayload } from '../../../src/handlers/event-bus';
import { indexResearchOutputHandler } from '../../../src/handlers/research-output/algolia-index-research-output-handler';
import {
  getResearchOutputEvent,
  getAlgoliaResearchOutputResponse,
  getResearchOutputResponse,
} from '../../fixtures/research-output.fixtures';
import { getAlgoliaSearchClientMock } from '../../mocks/algolia-client.mock';
import { researchOutputControllerMock } from '../../mocks/research-output.controller.mock';
const algoliaSearchClientMock = getAlgoliaSearchClientMock();
jest.mock('../../../src/utils/logger');

describe('Research Output index handler', () => {
  const indexHandler = indexResearchOutputHandler(
    researchOutputControllerMock,
    algoliaSearchClientMock,
  );
  afterEach(() => jest.clearAllMocks());

  test('Should fetch the research-output and create a record in Algolia when research-output is published', async () => {
    const researchOutputResponse = getResearchOutputResponse();
    const expectedPayload = getAlgoliaResearchOutputResponse();

    researchOutputResponse.relatedResearch = [];
    researchOutputControllerMock.fetchById.mockResolvedValueOnce(
      researchOutputResponse,
    );

    await indexHandler(publishedEvent(researchOutputResponse.id));

    expect(algoliaSearchClientMock.save).toHaveBeenCalledWith({
      data: expect.objectContaining(expectedPayload),
      type: 'research-output',
    });
  });

  test('Should populate _tags field before saving the research-output to Algolia', async () => {
    const researchOutputResponse = getResearchOutputResponse();
    researchOutputResponse.methods = ['methods-tag'];
    researchOutputResponse.organisms = ['organisms-tag'];
    researchOutputResponse.environments = ['environments-tag'];
    researchOutputResponse.subtype = 'subtype-tag';
    researchOutputResponse.keywords = ['keywords-tag'];
    researchOutputResponse.relatedResearch = [];
    researchOutputControllerMock.fetchById.mockResolvedValueOnce(
      researchOutputResponse,
    );

    await indexHandler(publishedEvent(researchOutputResponse.id));

    expect(algoliaSearchClientMock.save).toHaveBeenCalledWith({
      data: {
        ...getAlgoliaResearchOutputResponse(),
        _tags: [
          'methods-tag',
          'organisms-tag',
          'environments-tag',
          'subtype-tag',
          'keywords-tag',
        ],
      },
      type: 'research-output',
    });
  });

  test('Should fetch the research-output and create two records in Algolia when research-output is published and own related RO is published', async () => {
    const researchOutputResponse = getResearchOutputResponse();
    const expectedPayload = getAlgoliaResearchOutputResponse();

    const relatedResearchOutputResponse = getResearchOutputResponse();
    relatedResearchOutputResponse.id = 'ro-1235';
    relatedResearchOutputResponse.title = 'Related research output';

    const expectedRelatedResearchPayload = {
      ...getAlgoliaResearchOutputResponse(),
      id: relatedResearchOutputResponse.id,
      title: relatedResearchOutputResponse.title,
    };

    researchOutputResponse.relatedResearch = [
      {
        id: relatedResearchOutputResponse.id,
        title: relatedResearchOutputResponse.title,
        type: 'Published',
        isOwnRelatedResearchLink: true,
        teams: [
          {
            id: 'team-1234',
            displayName: 'Team 1',
          },
        ],
        workingGroups: [],
        documentType: 'Grant Document',
      },
    ];

    researchOutputControllerMock.fetchById
      .mockResolvedValueOnce(researchOutputResponse)
      .mockResolvedValueOnce(relatedResearchOutputResponse);

    await indexHandler(publishedEvent(researchOutputResponse.id));

    expect(algoliaSearchClientMock.save).toHaveBeenCalledTimes(2);
    expect(algoliaSearchClientMock.save).toHaveBeenNthCalledWith(1, {
      data: expect.objectContaining(expectedPayload),
      type: 'research-output',
    });
    expect(algoliaSearchClientMock.save).toHaveBeenNthCalledWith(2, {
      data: expect.objectContaining(expectedRelatedResearchPayload),
      type: 'research-output',
    });
  });

  test('Should fetch the research-output and create three records in Algolia when research-output is published and own and foreign related ROs are published', async () => {
    const researchOutputResponse = getResearchOutputResponse();
    const expectedPayload = getAlgoliaResearchOutputResponse();

    const ownRelatedResearchOutputResponse = getResearchOutputResponse();
    ownRelatedResearchOutputResponse.id = 'ro-1235';
    ownRelatedResearchOutputResponse.title = 'Own related research output';

    const expectedOwnRelatedPayload = {
      ...getAlgoliaResearchOutputResponse(),
      id: ownRelatedResearchOutputResponse.id,
      title: ownRelatedResearchOutputResponse.title,
    };

    const foreignRelatedResearchOutputResponse = getResearchOutputResponse();
    foreignRelatedResearchOutputResponse.id = 'ro-1236';
    foreignRelatedResearchOutputResponse.title =
      'Foreign related research output';

    const expectedforeignRelatedPayload = {
      ...getAlgoliaResearchOutputResponse(),
      id: foreignRelatedResearchOutputResponse.id,
      title: foreignRelatedResearchOutputResponse.title,
    };

    researchOutputResponse.relatedResearch = [
      {
        id: ownRelatedResearchOutputResponse.id,
        title: ownRelatedResearchOutputResponse.title,
        type: 'Published',
        isOwnRelatedResearchLink: true,
        teams: [],
        workingGroups: [],
        documentType: 'Grant Document',
      },
      {
        id: foreignRelatedResearchOutputResponse.id,
        title: foreignRelatedResearchOutputResponse.title,
        type: 'Published',
        isOwnRelatedResearchLink: false,
        teams: [],
        workingGroups: [],
        documentType: 'Grant Document',
      },
    ];

    researchOutputControllerMock.fetchById
      .mockResolvedValueOnce(researchOutputResponse)
      .mockResolvedValueOnce(ownRelatedResearchOutputResponse)
      .mockResolvedValueOnce(foreignRelatedResearchOutputResponse);

    await indexHandler(publishedEvent(researchOutputResponse.id));

    expect(algoliaSearchClientMock.save).toHaveBeenCalledTimes(3);
    expect(algoliaSearchClientMock.save).toHaveBeenNthCalledWith(1, {
      data: expect.objectContaining(expectedPayload),
      type: 'research-output',
    });
    expect(algoliaSearchClientMock.save).toHaveBeenNthCalledWith(2, {
      data: expect.objectContaining(expectedOwnRelatedPayload),
      type: 'research-output',
    });
    expect(algoliaSearchClientMock.save).toHaveBeenNthCalledWith(3, {
      data: expect.objectContaining(expectedforeignRelatedPayload),
      type: 'research-output',
    });
  });

  test('Should fetch the research-output and remove the record in Algolia when research-output is deleted', async () => {
    const event = unpublishedEvent('ro-1234');

    researchOutputControllerMock.fetchById.mockRejectedValue(Boom.notFound());

    await indexHandler(event);

    expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
    expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(1);
    expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
      event.detail.resourceId,
    );
  });

  test('Should fetch the research-output and remove the record in Algolia when research-output is unpublished', async () => {
    const event = unpublishedEvent('ro-1234');
    const researchOutputResponse = getResearchOutputResponse();

    researchOutputControllerMock.fetchById.mockResolvedValueOnce({
      ...researchOutputResponse,
      relatedResearch: [],
      published: false,
    });

    await indexHandler(event);

    expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
    expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(1);
    expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
      event.detail.resourceId,
    );
  });

  test('Should reindex the related research when research-output is unpublished', async () => {
    const event = unpublishedEvent('ro-1234');
    const researchOutputResponse = getResearchOutputResponse();
    const relatedResearchOutputResponse = getResearchOutputResponse();
    relatedResearchOutputResponse.id = 'ro-1235';
    relatedResearchOutputResponse.title = 'Related research output';

    researchOutputControllerMock.fetchById.mockResolvedValueOnce({
      ...researchOutputResponse,
      relatedResearch: [
        {
          id: relatedResearchOutputResponse.id,
          title: relatedResearchOutputResponse.title,
          type: 'Published',
          isOwnRelatedResearchLink: true,
          teams: [
            {
              id: 'team-1234',
              displayName: 'Team 1',
            },
          ],
          workingGroups: [],
          documentType: 'Grant Document',
        },
      ],
      published: false,
    });
    researchOutputControllerMock.fetchById.mockResolvedValueOnce(
      relatedResearchOutputResponse,
    );

    await indexHandler(event);

    expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(1);
    expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
      event.detail.resourceId,
    );
    expect(algoliaSearchClientMock.save).toHaveBeenCalledTimes(1);
    expect(algoliaSearchClientMock.save).toHaveBeenCalledWith({
      data: expect.objectContaining({ id: 'ro-1235' }),
      type: 'research-output',
    });
  });

  test('Should fetch the research-output and remove the record in Algolia when controller throws NotFoundError', async () => {
    const event = unpublishedEvent('ro-1234');

    researchOutputControllerMock.fetchById.mockRejectedValue(
      new NotFoundError(undefined, 'not found'),
    );

    await indexHandler(event);

    expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
    expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(1);
    expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
      event.detail.resourceId,
    );
  });

  test('Should throw an error and do not trigger algolia when the research-output request fails with another error code', async () => {
    researchOutputControllerMock.fetchById.mockRejectedValue(Boom.badData());

    await expect(indexHandler(publishedEvent('ro-1234'))).rejects.toThrow(
      Boom.badData(),
    );
    expect(algoliaSearchClientMock.remove).not.toHaveBeenCalled();
  });

  test('Should throw the algolia error when saving the record fails', async () => {
    const algoliaError = new Error('ERROR');

    researchOutputControllerMock.fetchById.mockResolvedValueOnce(
      getResearchOutputResponse(),
    );
    algoliaSearchClientMock.save.mockRejectedValueOnce(algoliaError);

    await expect(indexHandler(publishedEvent('ro-1234'))).rejects.toThrow(
      algoliaError,
    );
  });

  test('Should throw the algolia error when deleting the record fails', async () => {
    const algoliaError = new Error('ERROR');

    researchOutputControllerMock.fetchById.mockRejectedValue(Boom.notFound());

    algoliaSearchClientMock.remove.mockRejectedValueOnce(algoliaError);

    await expect(indexHandler(unpublishedEvent('ro-1234'))).rejects.toThrow(
      algoliaError,
    );
  });

  describe('Should process the events, handle race conditions and not rely on the order of the events', () => {
    test('receives the events published and unpublished in correct order', async () => {
      const roID = 'ro-1234';
      const createEv = publishedEvent(roID);
      const unpublishedEv = unpublishedEvent(roID);
      const algoliaError = new Error('ERROR');

      researchOutputControllerMock.fetchById.mockRejectedValue(Boom.notFound());
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
      const roID = 'ro-1234';
      const createEv = publishedEvent(roID);
      const unpublishedEv = unpublishedEvent(roID);
      const algoliaError = new Error('ERROR');

      researchOutputControllerMock.fetchById.mockRejectedValue(Boom.notFound());
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

const unpublishedEvent = (id: string) =>
  getResearchOutputEvent(id, 'ResearchOutputsUnpublished') as EventBridgeEvent<
    ResearchOutputEvent,
    ResearchOutputPayload
  >;

const publishedEvent = (id: string) =>
  getResearchOutputEvent(id, 'ResearchOutputsPublished') as EventBridgeEvent<
    ResearchOutputEvent,
    ResearchOutputPayload
  >;
