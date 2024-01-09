import { FetchRemindersOptions } from '@asap-hub/model';
import { gp2 as gp2Contentful } from '@asap-hub/contentful';
import {
  getUserProjectIds,
  getUserWorkingGroupIds,
  ReminderContentfulDataProvider,
} from '../../src/data-providers/reminder.data-provider';
import {
  getReminderOutputCollectionItem,
  getReminderUsersContent,
} from '../fixtures/reminder.fixtures';
import { getContentfulGraphqlClientMock } from '../mocks/contentful-graphql-client.mock';
import { DateTime } from 'luxon';

describe('Reminders data provider', () => {
  const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();

  const remindersDataProvider = new ReminderContentfulDataProvider(
    contentfulGraphqlClientMock,
  );

  const setNowToLast24Hours = (date: string) => {
    jest.setSystemTime(DateTime.fromISO(date).plus({ hours: 2 }).toJSDate());
  };

  const setNowToMoreThan24hAgo = (date: string) => {
    jest.setSystemTime(
      DateTime.fromISO(date).plus({ hours: 24, minutes: 1 }).toJSDate(),
    );
  };

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const setContentfulMock = (
    outputsCollection: gp2Contentful.FetchRemindersQuery['outputsCollection'],
    users?: gp2Contentful.FetchRemindersQuery['users'],
  ) => {
    contentfulGraphqlClientMock.request.mockResolvedValueOnce({
      outputsCollection,
      users: users === undefined ? getReminderUsersContent() : users,
    });
  };

  describe('Fetch method', () => {
    const userId = 'user-id';
    const timezone = 'Europe/London';
    const fetchRemindersOptions: FetchRemindersOptions = { userId, timezone };

    const addedDate = '2023-01-01T08:00:00Z';

    type OutputItem = NonNullable<
      gp2Contentful.FetchRemindersQuery['outputsCollection']
    >['items'][number];
    let publishedResearchOutputItem: OutputItem;

    beforeEach(() => {
      publishedResearchOutputItem = getReminderOutputCollectionItem();
      publishedResearchOutputItem!.addedDate = addedDate;
      setNowToLast24Hours(addedDate);
    });

    test('Should not fetch the reminders if user data is null', async () => {
      const outputsCollection = {
        items: [publishedResearchOutputItem],
      };
      const usersResponse = null;
      setContentfulMock(outputsCollection, usersResponse);

      const result = await remindersDataProvider.fetch(fetchRemindersOptions);
      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should not fetch the reminders if user does not belong to the output project or working group', async () => {
      publishedResearchOutputItem!.relatedEntitiesCollection!.items[0] = {
        __typename: 'Projects',
        sys: {
          id: 'Project-1027',
        },
        title: 'Sample Prioritization',
      };
      const outputsCollection = {
        items: [publishedResearchOutputItem],
      };
      const usersResponse = getReminderUsersContent();

      setContentfulMock(outputsCollection, usersResponse);

      const result = await remindersDataProvider.fetch(fetchRemindersOptions);
      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should not fetch the reminders if output does not have a title', async () => {
      publishedResearchOutputItem!.title = null;
      const outputsCollection = {
        items: [publishedResearchOutputItem],
      };
      const usersResponse = getReminderUsersContent();

      setContentfulMock(outputsCollection, usersResponse);

      const result = await remindersDataProvider.fetch(fetchRemindersOptions);
      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should not fetch the reminders if output entity is not defined', async () => {
      publishedResearchOutputItem!.relatedEntitiesCollection!.items[0] = null;
      const outputsCollection = {
        items: [publishedResearchOutputItem],
      };
      const usersResponse = getReminderUsersContent();

      setContentfulMock(outputsCollection, usersResponse);

      const result = await remindersDataProvider.fetch(fetchRemindersOptions);
      expect(result).toEqual({ items: [], total: 0 });
    });

    test.each`
      entity             | typename           | id
      ${'project'}       | ${'Projects'}      | ${'Project-1'}
      ${'working group'} | ${'WorkingGroups'} | ${'WG-1'}
    `(
      'Should not fetch the reminders if user belongs to the output $entity but the output was added more than 24h ago',
      async ({ typename, id }) => {
        const addedDate = '2023-01-01T08:00:00Z';
        setNowToMoreThan24hAgo(addedDate);

        publishedResearchOutputItem!.relatedEntitiesCollection!.items[0]! = {
          __typename: typename,
          sys: { id },
          title: 'Sample Prioritization',
        };
        publishedResearchOutputItem!.addedDate! = addedDate;

        const outputsCollection = {
          items: [publishedResearchOutputItem],
        };
        const usersResponse = getReminderUsersContent();

        setContentfulMock(outputsCollection, usersResponse);

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result).toEqual({
          items: [],
          total: 0,
        });
      },
    );

    test.each`
      entity             | typename           | id
      ${'project'}       | ${'Projects'}      | ${'Project-1'}
      ${'working group'} | ${'WorkingGroups'} | ${'WG-1'}
    `(
      'Should fetch the reminders if user belongs to the output $entity and output was added in the last 24h',
      async ({ entity, typename, id }) => {
        publishedResearchOutputItem!.relatedEntitiesCollection!.items[0]! = {
          __typename: typename,
          sys: { id },
          title: 'Sample Prioritization',
        };
        publishedResearchOutputItem!.addedDate! = addedDate;

        const outputsCollection = {
          items: [publishedResearchOutputItem],
        };

        const usersResponse = getReminderUsersContent();

        setContentfulMock(outputsCollection, usersResponse);

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result).toEqual({
          items: [
            {
              id: expect.any(String),
              entity: 'Output',
              type: 'Published',
              data: expect.objectContaining({
                associationType: entity,
                associationName: 'Sample Prioritization',
                statusChangedBy: 'Tony Stark',
                title: 'Test Proposal 1234',
              }),
            },
          ],
          total: 1,
        });
      },
    );

    test('Should sort the published output reminders based on added date showing most recent first', async () => {
      const date = '2024-01-05T08:00:00Z';
      setNowToLast24Hours(date);

      const publishedResearchOutputItem1 = getReminderOutputCollectionItem();
      publishedResearchOutputItem1!.addedDate = '2024-01-05T08:02:00Z';

      const publishedResearchOutputItem2 = getReminderOutputCollectionItem();
      publishedResearchOutputItem2!.addedDate = '2024-01-05T08:54:00Z';

      const publishedResearchOutputItem3 = getReminderOutputCollectionItem();
      publishedResearchOutputItem3!.addedDate = '2024-01-04T23:16:00Z';

      const outputsCollection = {
        items: [
          publishedResearchOutputItem1,
          publishedResearchOutputItem2,
          publishedResearchOutputItem3,
        ],
      };

      const usersResponse = getReminderUsersContent();

      setContentfulMock(outputsCollection, usersResponse);

      const result = await remindersDataProvider.fetch(fetchRemindersOptions);
      expect(result).toEqual({
        items: [
          expect.objectContaining({
            data: expect.objectContaining({
              addedDate: '2024-01-05T08:54:00Z',
            }),
          }),
          expect.objectContaining({
            data: expect.objectContaining({
              addedDate: '2024-01-05T08:02:00Z',
            }),
          }),
          expect.objectContaining({
            data: expect.objectContaining({
              addedDate: '2024-01-04T23:16:00Z',
            }),
          }),
        ],
        total: 3,
      });
    });
  });

  describe('Fetch-by-id', () => {
    test('should throw an error', async () => {
      await expect(remindersDataProvider.fetchById()).rejects.toThrow(
        'Method not implemented.',
      );
    });
  });
});

describe('getUserProjectIds', () => {
  test('returns an empty array if user does not belong to any project', () => {
    expect(
      getUserProjectIds({
        linkedFrom: {
          ...getReminderUsersContent()?.linkedFrom,
          projectMembershipCollection: {
            items: [],
          },
        },
      }),
    ).toEqual([]);
  });

  test('returns the project ids the user belongs to', () => {
    expect(getUserProjectIds(getReminderUsersContent())).toEqual(['Project-1']);
  });
});

describe('getUserWorkingGroupIds', () => {
  test('returns an empty array if user does not belong to any working group', () => {
    expect(
      getUserWorkingGroupIds({
        linkedFrom: {
          ...getReminderUsersContent()?.linkedFrom,
          workingGroupMembershipCollection: {
            items: [],
          },
        },
      }),
    ).toEqual([]);
  });

  test('returns the working group ids the user belongs to', () => {
    expect(getUserWorkingGroupIds(getReminderUsersContent())).toEqual([
      'WG-1',
      'WG-2',
    ]);
  });
});
