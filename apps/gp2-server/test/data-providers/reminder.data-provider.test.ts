import { FetchRemindersOptions } from '@asap-hub/model';
import { gp2 as gp2Contentful } from '@asap-hub/contentful';
import {
  getUserProjectIds,
  getUserWorkingGroupIds,
  ReminderContentfulDataProvider,
} from '../../src/data-providers/reminder.data-provider';
import {
  getReminderOutputCollectionItem,
  getReminderOutputVersionCollectionItem,
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

  describe('Fetch method', () => {
    const userId = 'user-id';
    const timezone = 'Europe/London';
    const fetchRemindersOptions: FetchRemindersOptions = { userId, timezone };

    type OutputItem = NonNullable<
      gp2Contentful.FetchRemindersQuery['outputsCollection']
    >['items'][number];

    type OutputVersionItem = NonNullable<
      gp2Contentful.FetchRemindersQuery['outputVersionCollection']
    >['items'][number];
    let publishedResearchOutputItem: OutputItem;
    let publishedOutputVersionItem: OutputVersionItem;

    describe('Output', () => {
      const addedDate = '2023-01-01T08:00:00Z';

      const setContentfulMock = (
        outputsCollection: gp2Contentful.FetchRemindersQuery['outputsCollection'],
        users?: gp2Contentful.FetchRemindersQuery['users'],
      ) => {
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          outputsCollection,
          users: users === undefined ? getReminderUsersContent() : users,
        });
      };

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

          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );
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

          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );
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

    describe('Output Version', () => {
      const publishedAt = '2023-01-01T08:00:00Z';

      const setContentfulMock = (
        outputVersionCollection: gp2Contentful.FetchRemindersQuery['outputVersionCollection'],
        users?: gp2Contentful.FetchRemindersQuery['users'],
        outputsCollection?: gp2Contentful.FetchRemindersQuery['outputsCollection'],
      ) => {
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          outputVersionCollection,
          users: users === undefined ? getReminderUsersContent() : users,
          outputsCollection:
            outputsCollection === undefined ? { items: [] } : outputsCollection,
        });
      };

      const getPublishedOutputVersionItem = (
        versionId?: string,
        publishedAt?: string,
        outputId?: string,
      ) => ({
        sys: {
          id: versionId || 'reminder-1',
          publishedAt: publishedAt || '2024-01-04T23:16:00Z',
        },
        linkedFrom: {
          outputsCollection: {
            items: [
              {
                ...publishedOutputVersionItem!.linkedFrom!.outputsCollection!
                  .items[0],
                sys: {
                  id: outputId || 'output-3',
                },
              },
            ],
          },
        },
      });

      beforeEach(() => {
        publishedOutputVersionItem = getReminderOutputVersionCollectionItem();
        publishedOutputVersionItem!.sys.publishedAt = publishedAt;
        setNowToLast24Hours(publishedAt);
      });

      test('Should not fetch the reminder if user data is null', async () => {
        const outputVersionCollection = {
          items: [publishedOutputVersionItem],
        };
        const usersResponse = null;
        setContentfulMock(outputVersionCollection, usersResponse);

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result).toEqual({ items: [], total: 0 });
      });

      test('Should not fetch the reminders if output entity is not defined', async () => {
        publishedOutputVersionItem!.linkedFrom!.outputsCollection!.items[0] =
          null;
        const outputVersionCollection = {
          items: [publishedOutputVersionItem],
        };
        const usersResponse = getReminderUsersContent();

        setContentfulMock(outputVersionCollection, usersResponse);

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result).toEqual({ items: [], total: 0 });
      });

      test('Should not fetch the reminder if related output does not have a title', async () => {
        publishedOutputVersionItem!.linkedFrom!.outputsCollection!.items[0]!.title =
          null;
        const outputVersionCollection = {
          items: [publishedOutputVersionItem],
        };
        const usersResponse = getReminderUsersContent();

        setContentfulMock(outputVersionCollection, usersResponse);

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result).toEqual({ items: [], total: 0 });
      });

      test("Should not fetch the reminder if the related output doesn't have a documentType", async () => {
        publishedOutputVersionItem!.linkedFrom!.outputsCollection!.items[0]!.documentType =
          null;

        const outputVersionsCollection = {
          items: [publishedOutputVersionItem],
        };
        const users = getReminderUsersContent();
        setContentfulMock(outputVersionsCollection, users);

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result).toEqual({ items: [], total: 0 });
      });

      test('Should not fetch the reminder if the related output documentType property is not a valid documentType', async () => {
        publishedOutputVersionItem!.linkedFrom!.outputsCollection!.items[0]!.documentType =
          'invalid-document-type';

        const outputVersionsCollection = {
          items: [publishedOutputVersionItem],
        };
        const users = getReminderUsersContent();
        setContentfulMock(outputVersionsCollection, users);

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result).toEqual({ items: [], total: 0 });
      });

      test('Should not fetch the reminders if user does not belong to the related output project or working group', async () => {
        publishedOutputVersionItem!.linkedFrom!.outputsCollection!.items[0]!.relatedEntitiesCollection!.items[0] =
          {
            __typename: 'Projects',
            sys: {
              id: 'Project-1027',
            },
            title: 'Sample Prioritization',
          };
        const outputVersionCollection = {
          items: [publishedOutputVersionItem],
        };
        const usersResponse = getReminderUsersContent();

        setContentfulMock(outputVersionCollection, usersResponse);

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result).toEqual({ items: [], total: 0 });
      });

      test.each`
        entity             | typename           | id
        ${'project'}       | ${'Projects'}      | ${'Project-1'}
        ${'working group'} | ${'WorkingGroups'} | ${'WG-1'}
      `(
        'Should not fetch the reminders if user belongs to the output $entity but the output version was published more than 24h ago',
        async ({ typename, id }) => {
          const publishedDate = '2023-01-01T08:00:00Z';
          setNowToMoreThan24hAgo(publishedDate);

          publishedOutputVersionItem!.linkedFrom!.outputsCollection!.items[0]!.relatedEntitiesCollection!.items[0]! =
            {
              __typename: typename,
              sys: { id },
              title: 'Sample Prioritization',
            };
          publishedOutputVersionItem!.sys.publishedAt = publishedDate;

          const outputVersionsCollection = {
            items: [publishedOutputVersionItem],
          };
          const usersResponse = getReminderUsersContent();

          setContentfulMock(outputVersionsCollection, usersResponse);

          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );
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
          publishedOutputVersionItem!.linkedFrom!.outputsCollection!.items[0]!.relatedEntitiesCollection!.items[0] =
            {
              __typename: typename,
              sys: { id },
              title: 'Sample Prioritization',
            };

          publishedOutputVersionItem!.linkedFrom!.outputsCollection!.items[0]!.title =
            'Test Proposal 1234';

          const outputVersionsCollection = {
            items: [publishedOutputVersionItem],
          };

          const usersResponse = getReminderUsersContent();

          setContentfulMock(outputVersionsCollection, usersResponse);

          const result = await remindersDataProvider.fetch(
            fetchRemindersOptions,
          );
          expect(result).toEqual({
            items: [
              {
                id: expect.any(String),
                entity: 'Output Version',
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

      test('Should sort the published output version reminders based on publishedAt showing most recent first', async () => {
        setNowToLast24Hours('2024-01-05T08:00:00Z');

        const publishedOutputVersionItem1 = getPublishedOutputVersionItem(
          'reminder-1',
          '2024-01-05T08:02:00Z',
          'output-1',
        );
        const publishedOutputVersionItem2 = getPublishedOutputVersionItem(
          'reminder-2',
          '2024-01-05T08:54:00Z',
          'output-2',
        );
        const publishedOutputVersionItem3 = getPublishedOutputVersionItem(
          'reminder-3',
          '2024-01-04T23:16:00Z',
          'output-3',
        );

        const outputVersionsCollection = {
          items: [
            publishedOutputVersionItem1,
            publishedOutputVersionItem2,
            publishedOutputVersionItem3,
          ],
        };

        const usersResponse = getReminderUsersContent();

        setContentfulMock(outputVersionsCollection, usersResponse);

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result).toEqual({
          items: [
            expect.objectContaining({
              data: expect.objectContaining({
                publishedAt: '2024-01-05T08:54:00Z',
              }),
            }),
            expect.objectContaining({
              data: expect.objectContaining({
                publishedAt: '2024-01-05T08:02:00Z',
              }),
            }),
            expect.objectContaining({
              data: expect.objectContaining({
                publishedAt: '2024-01-04T23:16:00Z',
              }),
            }),
          ],
          total: 3,
        });
      });

      test('Should only return the most recent published output version reminder for an output', async () => {
        setNowToLast24Hours('2024-01-05T08:00:00Z');

        const publishedOutputVersionItem1 = getPublishedOutputVersionItem(
          'reminder-1',
          '2024-01-05T08:02:00Z',
        );
        const publishedOutputVersionItem2 = getPublishedOutputVersionItem(
          'reminder-2',
          '2024-01-05T08:54:00Z',
        );
        const publishedOutputVersionItem3 = getPublishedOutputVersionItem(
          'reminder-3',
          '2024-01-04T23:16:00Z',
        );

        const outputVersionsCollection = {
          items: [
            publishedOutputVersionItem1,
            publishedOutputVersionItem2,
            publishedOutputVersionItem3,
          ],
        };

        const usersResponse = getReminderUsersContent();

        setContentfulMock(outputVersionsCollection, usersResponse);

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result).toEqual({
          items: [
            expect.objectContaining({
              data: expect.objectContaining({
                publishedAt: '2024-01-05T08:54:00Z',
              }),
            }),
          ],
          total: 1,
        });
      });

      test('Should not return an output published reminder if an output version reminder for that output is present', async () => {
        publishedResearchOutputItem = getReminderOutputCollectionItem();
        publishedResearchOutputItem!.addedDate = publishedAt;

        const publishedOutputVersionItem1 = getPublishedOutputVersionItem(
          'reminder-1',
          publishedAt,
          publishedResearchOutputItem!.sys.id,
        );

        const outputVersionsCollection = {
          items: [publishedOutputVersionItem1],
        };

        const outputsCollection = {
          items: [publishedResearchOutputItem],
        };

        const usersResponse = getReminderUsersContent();

        setContentfulMock(
          outputVersionsCollection,
          usersResponse,
          outputsCollection,
        );

        const result = await remindersDataProvider.fetch(fetchRemindersOptions);
        expect(result).toEqual({
          items: [
            expect.objectContaining({
              entity: 'Output Version',
            }),
          ],
          total: 1,
        });
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
