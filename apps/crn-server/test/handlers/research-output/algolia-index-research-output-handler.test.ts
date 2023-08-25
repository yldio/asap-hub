import { ResearchOutputEvent } from '@asap-hub/model';
import Boom from '@hapi/boom';
import { EventBridgeEvent } from 'aws-lambda';
import { ResearchOutputPayload } from '../../../src/handlers/event-bus';
import { indexResearchOutputHandler } from '../../../src/handlers/research-output/algolia-index-research-output-handler';
import {
  getResearchOutputEvent,
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

  test('Should fetch the research-output and create a record in Algolia when research-output is created', async () => {
    const researchOutputResponse = getResearchOutputResponse();
    researchOutputResponse.relatedResearch = [];
    researchOutputControllerMock.fetchById.mockResolvedValueOnce(
      researchOutputResponse,
    );

    await indexHandler(createEvent('ro-1234'));

    expect(algoliaSearchClientMock.save).toHaveBeenCalledWith({
      data: researchOutputResponse,
      type: 'research-output',
    });
  });

  test('Should fetch the research-output and create two records in Algolia when research-output is created and own related RO is created', async () => {
    const researchOutputResponse = getResearchOutputResponse();

    const relatedResearchOutputResponse = getResearchOutputResponse();
    relatedResearchOutputResponse.id = 'ro-1235';
    relatedResearchOutputResponse.title = 'Related research output';

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

    await indexHandler(createEvent('ro-1234'));

    expect(algoliaSearchClientMock.save).toHaveBeenCalledTimes(2);
    expect(algoliaSearchClientMock.save).toHaveBeenNthCalledWith(1, {
      data: researchOutputResponse,
      type: 'research-output',
    });
    expect(algoliaSearchClientMock.save).toHaveBeenNthCalledWith(2, {
      data: relatedResearchOutputResponse,
      type: 'research-output',
    });
  });

  test('Should fetch the research-output and create three records in Algolia when research-output is created and own and foreign related ROs are created', async () => {
    const researchOutputResponse = getResearchOutputResponse();

    const ownRelatedResearchOutputResponse = getResearchOutputResponse();
    ownRelatedResearchOutputResponse.id = 'ro-1235';
    ownRelatedResearchOutputResponse.title = 'Own related research output';

    const foreignRelatedResearchOutputResponse = getResearchOutputResponse();
    foreignRelatedResearchOutputResponse.id = 'ro-1236';
    foreignRelatedResearchOutputResponse.title =
      'Foreign related research output';

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

    await indexHandler(createEvent('ro-1234'));

    expect(algoliaSearchClientMock.save).toHaveBeenCalledTimes(3);
    expect(algoliaSearchClientMock.save).toHaveBeenNthCalledWith(1, {
      data: researchOutputResponse,
      type: 'research-output',
    });
    expect(algoliaSearchClientMock.save).toHaveBeenNthCalledWith(2, {
      data: ownRelatedResearchOutputResponse,
      type: 'research-output',
    });
    expect(algoliaSearchClientMock.save).toHaveBeenNthCalledWith(3, {
      data: foreignRelatedResearchOutputResponse,
      type: 'research-output',
    });
  });

  test('Should fetch the research-output and create a record in Algolia when research-output is updated', async () => {
    const researchOutputResponse = getResearchOutputResponse();
    researchOutputResponse.relatedResearch = [];
    researchOutputControllerMock.fetchById.mockResolvedValueOnce(
      researchOutputResponse,
    );

    await indexHandler(updateEvent('ro-1234'));

    expect(algoliaSearchClientMock.save).toHaveBeenCalledWith({
      data: researchOutputResponse,
      type: 'research-output',
    });
  });

  test('Should fetch the research-output and remove the record in Algolia when research-output is unpublished', async () => {
    const event = unpublishedEvent('ro-1234');

    researchOutputControllerMock.fetchById.mockRejectedValue(Boom.notFound());

    await indexHandler(event);

    expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
    expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(1);
    expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
      event.detail.resourceId,
    );
  });

  test('Should fetch the research-output and remove the record in Algolia when research-output is deleted', async () => {
    const event = deleteEvent('ro-1234');

    researchOutputControllerMock.fetchById.mockRejectedValue(Boom.notFound());

    await indexHandler(event);

    expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
    expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(1);
    expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
      event.detail.resourceId,
    );
  });

  test('Should throw an error and do not trigger algolia when the research-output request fails with another error code', async () => {
    researchOutputControllerMock.fetchById.mockRejectedValue(Boom.badData());

    await expect(indexHandler(createEvent('ro-1234'))).rejects.toThrow(
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

    await expect(indexHandler(updateEvent('ro-1234'))).rejects.toThrow(
      algoliaError,
    );
  });

  test('Should throw the algolia error when deleting the record fails', async () => {
    const algoliaError = new Error('ERROR');

    researchOutputControllerMock.fetchById.mockRejectedValue(Boom.notFound());

    algoliaSearchClientMock.remove.mockRejectedValueOnce(algoliaError);

    await expect(indexHandler(deleteEvent('ro-1234'))).rejects.toThrow(
      algoliaError,
    );
  });

  describe('Should process the events, handle race conditions and not rely on the order of the events', () => {
    test('receives the events created and updated in correct order', async () => {
      const roID = 'ro-1234';
      const researchOutputResponse = {
        ...getResearchOutputResponse(),
        id: roID,
      };

      researchOutputControllerMock.fetchById.mockResolvedValue({
        ...researchOutputResponse,
      });

      await indexHandler(createEvent(roID));
      await indexHandler(updateEvent(roID));

      expect(algoliaSearchClientMock.remove).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.save).toHaveBeenCalledTimes(6);
      expect(algoliaSearchClientMock.save).toHaveBeenCalledWith({
        data: researchOutputResponse,
        type: 'research-output',
      });
    });

    test('receives the events created and updated in reverse order', async () => {
      const roID = 'ro-1234';
      const researchOutputResponse = {
        ...getResearchOutputResponse(),
        id: roID,
      };

      researchOutputControllerMock.fetchById.mockResolvedValue(
        researchOutputResponse,
      );

      await indexHandler(updateEvent(roID));
      await indexHandler(createEvent(roID));

      expect(algoliaSearchClientMock.remove).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.save).toHaveBeenCalledTimes(6);
      expect(algoliaSearchClientMock.save).toHaveBeenCalledWith({
        data: researchOutputResponse,
        type: 'research-output',
      });
    });

    test('receives the events created and unpublished in correct order', async () => {
      const roID = 'ro-1234';
      const createEv = createEvent(roID);
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

    test('receives the events created and unpublished in reverse order', async () => {
      const roID = 'ro-1234';
      const createEv = createEvent(roID);
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

    test('receives the events created and deleted in correct order', async () => {
      const roID = 'ro-1234';
      const createEv = createEvent(roID);
      const deleteEv = deleteEvent(roID);
      const algoliaError = new Error('ERROR');

      researchOutputControllerMock.fetchById.mockRejectedValue(Boom.notFound());
      algoliaSearchClientMock.remove.mockResolvedValueOnce(undefined);
      algoliaSearchClientMock.remove.mockRejectedValue(algoliaError);

      await indexHandler(createEv);
      await expect(indexHandler(deleteEv)).rejects.toEqual(algoliaError);

      expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
        deleteEv.detail.resourceId,
      );
    });

    test('receives the events created and deleted in reverse order', async () => {
      const roID = 'ro-1234';
      const createEv = createEvent(roID);
      const deleteEv = deleteEvent(roID);
      const algoliaError = new Error('ERROR');

      researchOutputControllerMock.fetchById.mockRejectedValue(Boom.notFound());
      algoliaSearchClientMock.remove.mockResolvedValueOnce(undefined);
      algoliaSearchClientMock.remove.mockRejectedValue(algoliaError);

      await indexHandler(deleteEv);
      await expect(indexHandler(createEv)).rejects.toEqual(algoliaError);

      expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
        deleteEv.detail.resourceId,
      );
    });

    test('receives the events updated and deleted in correct order', async () => {
      const roID = 'ro-1234';
      const updateEv = updateEvent(roID);
      const deleteEv = deleteEvent(roID);
      const algoliaError = new Error('ERROR');

      researchOutputControllerMock.fetchById.mockRejectedValue(Boom.notFound());
      algoliaSearchClientMock.remove.mockResolvedValueOnce(undefined);
      algoliaSearchClientMock.remove.mockRejectedValue(algoliaError);

      await indexHandler(updateEv);
      await expect(indexHandler(deleteEv)).rejects.toEqual(algoliaError);

      expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
        deleteEv.detail.resourceId,
      );
    });

    test('receives the events updated and deleted in reverse order', async () => {
      const roID = 'ro-1234';
      const updateEv = updateEvent(roID);
      const deleteEv = deleteEvent(roID);
      const algoliaError = new Error('ERROR');

      researchOutputControllerMock.fetchById.mockRejectedValue(Boom.notFound());
      algoliaSearchClientMock.remove.mockResolvedValueOnce(undefined);
      algoliaSearchClientMock.remove.mockRejectedValue(algoliaError);

      await indexHandler(deleteEv);
      await expect(indexHandler(updateEv)).rejects.toEqual(algoliaError);

      expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
        deleteEv.detail.resourceId,
      );
    });
    test('receives the events updated and unpublished in correct order', async () => {
      const roID = 'ro-1234';
      const updateEv = updateEvent(roID);
      const unpublishedEv = unpublishedEvent(roID);
      const algoliaError = new Error('ERROR');

      researchOutputControllerMock.fetchById.mockRejectedValue(Boom.notFound());
      algoliaSearchClientMock.remove.mockResolvedValueOnce(undefined);
      algoliaSearchClientMock.remove.mockRejectedValue(algoliaError);

      await indexHandler(updateEv);
      await expect(indexHandler(unpublishedEv)).rejects.toEqual(algoliaError);

      expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
        unpublishedEv.detail.resourceId,
      );
    });

    test('receives the events updated and unpublished in reverse order', async () => {
      const roID = 'ro-1234';
      const updateEv = updateEvent(roID);
      const unpublishedEv = unpublishedEvent(roID);
      const algoliaError = new Error('ERROR');

      researchOutputControllerMock.fetchById.mockRejectedValue(Boom.notFound());
      algoliaSearchClientMock.remove.mockResolvedValueOnce(undefined);
      algoliaSearchClientMock.remove.mockRejectedValue(algoliaError);

      await indexHandler(unpublishedEv);
      await expect(indexHandler(updateEv)).rejects.toEqual(algoliaError);

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

const deleteEvent = (id: string) =>
  getResearchOutputEvent(id, 'ResearchOutputsDeleted') as EventBridgeEvent<
    ResearchOutputEvent,
    ResearchOutputPayload
  >;

const createEvent = (id: string) =>
  getResearchOutputEvent(id, 'ResearchOutputsPublished') as EventBridgeEvent<
    ResearchOutputEvent,
    ResearchOutputPayload
  >;

const updateEvent = (id: string) =>
  getResearchOutputEvent(id, 'ResearchOutputsUpdated') as EventBridgeEvent<
    ResearchOutputEvent,
    ResearchOutputPayload
  >;
