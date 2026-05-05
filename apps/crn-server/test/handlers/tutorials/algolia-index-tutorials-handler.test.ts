import { TutorialPayload } from '@asap-hub/server-common';
import { indexTutorialHandler } from '../../../src/handlers/tutorials/algolia-index-tutorials-handler';
import { getTutorialResponse } from '../../fixtures/tutorials.fixtures';
import { createEventBridgeEventMock } from '../../helpers/events';
import { getAlgoliaSearchClientMock } from '../../mocks/algolia-client.mock';
import { tutorialControllerMock } from '../../mocks/tutorial.controller.mock';

const algoliaSearchClientMock = getAlgoliaSearchClientMock();

jest.mock('../../../src/utils/logger');

describe('Tutorial index handler', () => {
  const indexHandler = indexTutorialHandler(
    tutorialControllerMock,
    algoliaSearchClientMock,
  );

  afterEach(() => jest.clearAllMocks());

  test('Should not sync tutorial text when saving to Algolia', async () => {
    const tutorialResponse = getTutorialResponse();
    tutorialControllerMock.fetchById.mockResolvedValueOnce(tutorialResponse);

    await indexHandler(publishedEvent());

    const { text: _text, ...tutorialWithoutText } = tutorialResponse;
    expect(algoliaSearchClientMock.save).toHaveBeenCalledWith({
      data: {
        ...tutorialWithoutText,
        _tags: tutorialResponse.tags,
      },
      type: 'tutorial',
    });
  });
});

const publishedEvent = (id: string = 'tutorial-1') =>
  createEventBridgeEventMock(
    { resourceId: id } as TutorialPayload,
    'TutorialsPublished',
    id,
  );
