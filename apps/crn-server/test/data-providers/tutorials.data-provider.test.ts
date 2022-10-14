import { TutorialsSquidexDataProvider } from '../../src/data-providers/tutorials.data-provider';
import {
  getTutorialsDataObject,
  getSquidexTeamGraphqlResponse,
} from '../fixtures/tutorials.fixtures';
import { getSquidexGraphqlClientMockServer } from '../mocks/squidex-graphql-client-with-server.mock';
import { getSquidexGraphqlClientMock } from '../mocks/squidex-graphql-client.mock';

describe('Team Data Provider', () => {
  const squidexGraphqlClientMock = getSquidexGraphqlClientMock();
  const tutorialDataProvider = new TutorialsSquidexDataProvider(
    squidexGraphqlClientMock,
  );

  const squidexGraphqlClientMockServer = getSquidexGraphqlClientMockServer();
  const tutorialDataProviderMockGraphql = new TutorialsSquidexDataProvider(
    squidexGraphqlClientMockServer,
  );

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch-by-id method', () => {
    test('Should fetch the tutorial from squidex graphql', async () => {
      const tutorialId = 'tutorial-1';
      const result = await tutorialDataProviderMockGraphql.fetchById(
        tutorialId,
      );

      expect(result).toMatchObject(getTutorialsDataObject());
    });

    test('Should return nul when the tutorial is not found', async () => {
      const tutorialId = 'not-found';
      const squidexGraphqlResponse = getSquidexTeamGraphqlResponse();
      squidexGraphqlResponse.findTutorialsContent = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      expect(await tutorialDataProvider.fetchById(tutorialId)).toBeNull();
    });
  });
});
