import { WorkingGroupSquidexDataProvider } from '../../src/data-providers/working-groups.data-provider';
import {
  getSquidexWorkingGroupGraphqlResponse,
  getWorkingGroupDataObject,
} from '../fixtures/working-groups.fixtures';
import { getSquidexGraphqlClientMockServer } from '../mocks/squidex-graphql-client-with-server.mock';
import { getSquidexGraphqlClientMock } from '../mocks/squidex-graphql-client.mock';

describe('Working Group Data Provider', () => {
  const squidexGraphqlClientMock = getSquidexGraphqlClientMock();
  const workingGroupDataProvider = new WorkingGroupSquidexDataProvider(
    squidexGraphqlClientMock,
  );

  const squidexGraphqlClientMockServer = getSquidexGraphqlClientMockServer();
  const workingGroupDataProviderMockGraphql =
    new WorkingGroupSquidexDataProvider(squidexGraphqlClientMockServer);

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch-by-id method', () => {
    const workingGroupId = 'some-group-id';

    test('Should fetch the groups from squidex graphql', async () => {
      const result = await workingGroupDataProviderMockGraphql.fetchById(
        'group-id-1',
      );

      expect(result).toMatchObject(getWorkingGroupDataObject());
    });

    test("Should return null when the group doesn't exist", async () => {
      const squidexGraphqlResponse = getSquidexWorkingGroupGraphqlResponse();
      squidexGraphqlResponse.findWorkingGroupsContent = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      expect(
        await workingGroupDataProvider.fetchById(workingGroupId),
      ).toBeNull();
    });

    test('Should skip externalLinkText and externalLink when they are both null', async () => {
      const squidexGraphqlResponse = getSquidexWorkingGroupGraphqlResponse();
      squidexGraphqlResponse.findWorkingGroupsContent!.flatData.externalLink =
        null;
      squidexGraphqlResponse.findWorkingGroupsContent!.flatData.externalLinkText =
        null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const response = await workingGroupDataProvider.fetchById(workingGroupId);

      expect(response).not.toHaveProperty('externalLink');
      expect(response).not.toHaveProperty('externalLinkText');
    });

    test('Should skip externalLinkText when it is null', async () => {
      const squidexGraphqlResponse = getSquidexWorkingGroupGraphqlResponse();
      squidexGraphqlResponse.findWorkingGroupsContent!.flatData.externalLink =
        'https://www.example.com';
      squidexGraphqlResponse.findWorkingGroupsContent!.flatData.externalLinkText =
        null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const response = await workingGroupDataProvider.fetchById(workingGroupId);

      expect(response?.externalLink).toBe('https://www.example.com');
      expect(response).not.toHaveProperty('externalLinkText');
    });

    test('Should skip externalLinkText when externalLink is not present', async () => {
      const squidexGraphqlResponse = getSquidexWorkingGroupGraphqlResponse();
      squidexGraphqlResponse.findWorkingGroupsContent!.flatData.externalLink =
        null;
      squidexGraphqlResponse.findWorkingGroupsContent!.flatData.externalLinkText =
        'some text';
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const response = await workingGroupDataProvider.fetchById(workingGroupId);

      expect(response).not.toHaveProperty('externalLink');
      expect(response).not.toHaveProperty('externalLinkText');
    });

    test('Should default description to an empty string', async () => {
      const squidexGraphqlResponse = getSquidexWorkingGroupGraphqlResponse();
      squidexGraphqlResponse.findWorkingGroupsContent!.flatData.description =
        null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const response = await workingGroupDataProvider.fetchById(workingGroupId);

      expect(response!.description).toBe('');
    });

    test('Should default title to an empty string', async () => {
      const squidexGraphqlResponse = getSquidexWorkingGroupGraphqlResponse();
      squidexGraphqlResponse.findWorkingGroupsContent!.flatData.title = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const response = await workingGroupDataProvider.fetchById(workingGroupId);

      expect(response!.title).toBe('');
    });

    test('Should return deliverables', async () => {
      const squidexGraphqlResponse = getSquidexWorkingGroupGraphqlResponse();
      squidexGraphqlResponse.findWorkingGroupsContent!.flatData.deliverables = [
        { description: 'Deliverable 1', status: 'Complete' },
      ];
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const response = await workingGroupDataProvider.fetchById(workingGroupId);

      expect(response?.deliverables).toEqual([
        { description: 'Deliverable 1', status: 'Complete' },
      ]);
    });

    test('Should provide default values if squidex data is missing', async () => {
      const squidexGraphqlResponse = getSquidexWorkingGroupGraphqlResponse();
      squidexGraphqlResponse.findWorkingGroupsContent!.flatData.deliverables =
        null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      expect(
        (await workingGroupDataProvider.fetchById(workingGroupId))
          ?.deliverables,
      ).toEqual([]);
    });
  });
});
