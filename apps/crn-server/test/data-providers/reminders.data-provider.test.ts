import { ReminderSquidexDataProvider } from '../../src/data-providers/reminders.data-provider';
import {
  getReminderDataObject,
  getSquidexRemindersGraphqlResponse,
  getSquidexReminderReseachOutputsContents,
} from '../fixtures/reminders.fixtures';
import { getSquidexGraphqlClientMockServer } from '../mocks/squidex-graphql-client-with-server.mock';
import { getSquidexGraphqlClientMock } from '../mocks/squidex-graphql-client.mock';

describe('Reminder Data Provider', () => {
  const squidexGraphqlClientMock = getSquidexGraphqlClientMock();
  const reminderDataProvider = new ReminderSquidexDataProvider(
    squidexGraphqlClientMock,
  );

  const squidexGraphqlClientMockServer = getSquidexGraphqlClientMockServer();
  const reminderDataProviderMockGraphql = new ReminderSquidexDataProvider(
    squidexGraphqlClientMockServer,
  );

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch method', () => {
    const userId = 'user-id';

    test('Should fetch the reminders from squidex graphql', async () => {
      const result = await reminderDataProviderMockGraphql.fetch({
        userId,
      });

      expect(result).toEqual({
        total: 1,
        items: [getReminderDataObject()],
      });
    });

    test('Should return an empty result when no research outputs are found', async () => {
      const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
      squidexGraphqlResponse.queryResearchOutputsContents = [];
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await reminderDataProvider.fetch({ userId });

      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should return an empty result when no teams are found', async () => {
      const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
      squidexGraphqlResponse.findUsersContent!.flatData.teams = [];
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await reminderDataProvider.fetch({ userId });

      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should return an empty result when findUsersContent property is null', async () => {
      const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
      squidexGraphqlResponse.findUsersContent = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await reminderDataProvider.fetch({ userId });

      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should return an empty result when user teams property is null', async () => {
      const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
      squidexGraphqlResponse.findUsersContent!.flatData.teams = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await reminderDataProvider.fetch({ userId });

      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should return an empty result when user team id property is null', async () => {
      const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
      squidexGraphqlResponse.findUsersContent!.flatData.teams![0]!.id = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await reminderDataProvider.fetch({ userId });

      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should return an empty result when user team id property is an empty array', async () => {
      const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
      squidexGraphqlResponse.findUsersContent!.flatData.teams![0]!.id = [];
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await reminderDataProvider.fetch({ userId });

      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should return an empty result when queryResearchOutputsContents property is null', async () => {
      const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
      squidexGraphqlResponse.queryResearchOutputsContents = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await reminderDataProvider.fetch({ userId });

      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should return an empty result when research-output referencingTeamsContents property is null', async () => {
      const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
      squidexGraphqlResponse.queryResearchOutputsContents![0]!.referencingTeamsContents =
        null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await reminderDataProvider.fetch({ userId });

      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should return an empty result when research-output documentType property is null', async () => {
      const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
      squidexGraphqlResponse.queryResearchOutputsContents![0]!.flatData.documentType =
        null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await reminderDataProvider.fetch({ userId });

      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should return an empty result when research-output title property is null', async () => {
      const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
      squidexGraphqlResponse.queryResearchOutputsContents![0]!.flatData.title =
        null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await reminderDataProvider.fetch({ userId });

      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should return an empty result when research-output documentType property is not a valid document-type', async () => {
      const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();
      squidexGraphqlResponse.queryResearchOutputsContents![0]!.flatData.documentType =
        'invalid-document-type';
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await reminderDataProvider.fetch({ userId });

      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should sort the reminders by the publish date', async () => {
      const squidexGraphqlResponse = getSquidexRemindersGraphqlResponse();

      const researchOutput1 = getSquidexReminderReseachOutputsContents();
      researchOutput1.id = 'research-output-1';
      researchOutput1.flatData.publishDate = '2022-01-01T10:00:00Z';
      const researchOutput2 = getSquidexReminderReseachOutputsContents();
      researchOutput2.id = 'research-output-2';
      researchOutput2.flatData.publishDate = '2022-01-01T14:00:00Z';
      const researchOutput3 = getSquidexReminderReseachOutputsContents();
      researchOutput3.id = 'research-output-3';
      researchOutput3.flatData.publishDate = '2022-01-01T12:00:00Z';

      squidexGraphqlResponse.queryResearchOutputsContents = [
        researchOutput1,
        researchOutput2,
        researchOutput3,
      ];
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await reminderDataProvider.fetch({ userId });

      const reminderIds = result.items.map((reminder) => reminder.id);
      expect(reminderIds).toEqual([
        `research-output-published-${researchOutput2.id}`,
        `research-output-published-${researchOutput3.id}`,
        `research-output-published-${researchOutput1.id}`,
      ]);
    });
  });
});
