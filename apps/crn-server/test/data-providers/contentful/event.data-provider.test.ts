/* eslint-disable no-unused-expressions, no-sequences */
import {
  Entry,
  Environment,
  getContentfulGraphqlClientMockServer,
  patchAndPublish,
} from '@asap-hub/contentful';
import { EventSpeakerTeam } from '@asap-hub/model';

import {
  EventContentfulDataProvider,
  parseGraphQLEvent,
} from '../../../src/data-providers/contentful/event.data-provider';
import { getEntry } from '../../fixtures/contentful.fixtures';
import {
  getContentfulEventDataObject,
  getContentfulGraphqlEvent,
  getContentfulGraphqlEventsResponse,
  getContentfulListEventDataObject,
  getContentfulRelatedResearch,
  getContentfulUserSpeakerTeams,
  getEventCreateDataObject,
  getEventsByExternalAuthorIdGraphqlResponse,
  getEventsByTeamIdGraphqlResponse,
  getEventsByUserIdGraphqlResponse,
  getInterestGroupCalendarResponse,
  getWorkingGroupCalendarResponse,
} from '../../fixtures/events.fixtures';
import {
  getContentfulGraphqlInterestGroup,
  getInterestGroupDataObject,
} from '../../fixtures/interest-groups.fixtures';
import {
  getContentfulGraphqlWorkingGroup,
  getWorkingGroupDataObject,
} from '../../fixtures/working-groups.fixtures';
import { getContentfulGraphqlClientMock } from '../../mocks/contentful-graphql-client.mock';
import { getContentfulEnvironmentMock } from '../../mocks/contentful-rest-client.mock';

jest.mock('@asap-hub/contentful', () => ({
  ...jest.requireActual('@asap-hub/contentful'),
  patchAndPublish: jest.fn().mockResolvedValue(undefined),
}));

describe('Events Contentful Data Provider', () => {
  const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();
  const environmentMock = getContentfulEnvironmentMock();
  const contentfulRestClientMock: () => Promise<Environment> = () =>
    Promise.resolve(environmentMock);

  const eventDataProvider = new EventContentfulDataProvider(
    contentfulGraphqlClientMock,
    contentfulRestClientMock,
  );

  const contentfulGraphqlClientMockServer =
    getContentfulGraphqlClientMockServer({
      TeamMembership: () => getContentfulUserSpeakerTeams(),
      Events: () => getContentfulGraphqlEvent(),
      WorkingGroups: () => getContentfulGraphqlWorkingGroup({}),
      InterestGroups: () => getContentfulGraphqlInterestGroup(),
      ResearchOutputs: () => getContentfulRelatedResearch(),
    });

  const eventDataProviderMockGraphql = new EventContentfulDataProvider(
    contentfulGraphqlClientMockServer,
    contentfulRestClientMock,
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  const workingGroup = getWorkingGroupDataObject();
  const eventWorkingGroup = {
    id: workingGroup.id,
    title: workingGroup.title,
  };

  const interestGroup = getInterestGroupDataObject();
  const eventInterestGroup = {
    id: interestGroup.id,
    name: interestGroup.name,
    active: interestGroup.active,
    tools: {
      slack: interestGroup.tools.slack,
      googleDrive: interestGroup.tools.googleDrive,
    },
  };
  describe('Fetch', () => {
    test('Should fetch the events from Contentful graphql', async () => {
      const result = await eventDataProviderMockGraphql.fetch({});

      const expectedResult = getContentfulListEventDataObject();
      expectedResult.items[0]!.workingGroup! = eventWorkingGroup;
      expectedResult.items[0]!.interestGroup! = eventInterestGroup;
      expect(result).toMatchObject(expectedResult);
    });

    test('Should return an empty result when the client returns an empty array of data', async () => {
      const contentfulGraphQLResponse = getContentfulGraphqlEventsResponse();
      contentfulGraphQLResponse.eventsCollection!.total = 0;
      contentfulGraphQLResponse.eventsCollection!.items = [];

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await eventDataProvider.fetch({});

      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });

    test('Should return a list of events', async () => {
      const contentfulGraphQLResponse = getContentfulGraphqlEventsResponse();

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await eventDataProvider.fetch({});

      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        {
          limit: 10,
          skip: 0,
          order: undefined,
          where: {
            hidden_not: true,
          },
        },
      );
      expect(result).toEqual(getContentfulListEventDataObject());
    });

    test('Should apply the filter to remove hidden events by default', async () => {
      const contentfulGraphQLResponse = getContentfulGraphqlEventsResponse();
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await eventDataProvider.fetch({ after: 'after-date' });

      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        {
          limit: 10,
          skip: 0,
          order: undefined,
          where: {
            endDate_gt: 'after-date',
            hidden_not: true,
          },
        },
      );
      expect(result).toEqual(getContentfulListEventDataObject());
    });

    describe('Sorting', () => {
      test.each`
        sortBy         | sortOrder | order
        ${'startDate'} | ${'asc'}  | ${'startDate_ASC'}
        ${'startDate'} | ${'desc'} | ${'startDate_DESC'}
        ${'endDate'}   | ${'asc'}  | ${'endDate_ASC'}
        ${'endDate'}   | ${'desc'} | ${'endDate_DESC'}
      `(
        'Should apply the "orderBy" option using the $sortBy field and $sortOrder order',
        async ({ sortBy, sortOrder, order }) => {
          const eventsGraphqlResponse = getContentfulGraphqlEventsResponse();
          contentfulGraphqlClientMock.request.mockResolvedValueOnce(
            eventsGraphqlResponse,
          );
          const result = await eventDataProvider.fetch({
            sortBy,
            sortOrder,
          });

          expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
            expect.anything(),
            {
              limit: 10,
              skip: 0,
              where: {
                hidden_not: true,
              },
              order,
            },
          );
          expect(result).toEqual(getContentfulListEventDataObject());
        },
      );

      test('Should not apply any order if the parameters are not provided', async () => {
        const eventsGraphqlResponse = getContentfulGraphqlEventsResponse();
        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          eventsGraphqlResponse,
        );
        const result = await eventDataProvider.fetch({});

        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          expect.anything(),
          {
            limit: 10,
            skip: 0,
            where: {
              hidden_not: true,
            },
            order: undefined,
          },
        );
        expect(result).toEqual(getContentfulListEventDataObject());
      });
    });

    describe('Filters', () => {
      describe.each`
        filterBy              | filterValue           | getGraphqlResponse                            | collection
        ${'userId'}           | ${'user-1'}           | ${getEventsByUserIdGraphqlResponse}           | ${'users'}
        ${'externalAuthorId'} | ${'externalAuthor-1'} | ${getEventsByExternalAuthorIdGraphqlResponse} | ${'externalAuthors'}
        ${'teamId'}           | ${'team-1'}           | ${getEventsByTeamIdGraphqlResponse}           | ${'teams'}
      `(
        '$filterBy',
        ({ filterBy, filterValue, getGraphqlResponse, collection }) => {
          test('Should apply the filter and return the events', async () => {
            const eventsGraphqlResponse = getGraphqlResponse();
            contentfulGraphqlClientMock.request.mockResolvedValueOnce(
              eventsGraphqlResponse,
            );
            const result = await eventDataProvider.fetch({
              filter: { [filterBy]: filterValue },
            });

            expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
              expect.anything(),
              {
                id: filterValue,
                limit: 10,
                skip: 0,
              },
            );
            expect(result).toEqual(getContentfulListEventDataObject());
          });

          test('Should apply the filter and return empty result when eventSpeakersCollection is empty', async () => {
            const eventsGraphqlResponse = getGraphqlResponse();
            eventsGraphqlResponse[
              collection
            ]!.linkedFrom!.eventSpeakersCollection!.items! = [];
            contentfulGraphqlClientMock.request.mockResolvedValueOnce(
              eventsGraphqlResponse,
            );
            const result = await eventDataProvider.fetch({
              filter: { [filterBy]: filterValue },
            });

            expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
              expect.anything(),
              {
                id: filterValue,
                limit: 10,
                skip: 0,
              },
            );
            expect(result).toEqual({
              items: [],
              total: 0,
            });
          });
        },
      );

      test('can filter by googleId', async () => {
        const googleId = 'google-event-id';

        const eventsGraphqlResponse = getContentfulGraphqlEventsResponse();
        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          eventsGraphqlResponse,
        );
        const result = await eventDataProvider.fetch({
          filter: { googleId },
        });

        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          expect.anything(),
          {
            limit: 10,
            skip: 0,
            where: {
              googleId_contains: 'google-event-id',
              hidden_not: true,
            },
            order: undefined,
          },
        );
        expect(result).toEqual(getContentfulListEventDataObject());
      });

      test('Should apply search query params', async () => {
        const eventsGraphqlResponse = getContentfulGraphqlEventsResponse();
        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          eventsGraphqlResponse,
        );

        const result = await eventDataProvider.fetch({
          search: 'parkinson disease',
        });

        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          expect.anything(),
          {
            limit: 10,
            skip: 0,
            where: {
              OR: [
                {
                  title_contains: 'parkinson',
                },
                {
                  tags_contains_all: ['parkinson'],
                },
                {
                  title_contains: 'disease',
                },
                {
                  tags_contains_all: ['disease'],
                },
              ],
              hidden_not: true,
            },
            order: undefined,
          },
        );
        expect(result).toEqual(getContentfulListEventDataObject());
      });

      test('can filter by workingGroupId', async () => {
        const workingGroupId = 'wg-1';

        const workingGroupCalendar = getWorkingGroupCalendarResponse();
        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          workingGroupCalendar,
        );

        const eventsGraphqlResponse = getContentfulGraphqlEventsResponse();
        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          eventsGraphqlResponse,
        );

        const result = await eventDataProvider.fetch({
          filter: { workingGroupId },
        });

        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          expect.anything(),
          {
            limit: 10,
            skip: 0,
            where: {
              hidden_not: true,
              calendar: {
                sys: {
                  id: 'calendar-from-wg-id',
                },
              },
            },
            order: undefined,
          },
        );
        expect(result).toEqual(getContentfulListEventDataObject());
      });

      test('can filter by groupId', async () => {
        const interestGroupId = 'wg-1';

        const interestGroupCalendar = getInterestGroupCalendarResponse();
        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          interestGroupCalendar,
        );

        const eventsGraphqlResponse = getContentfulGraphqlEventsResponse();
        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          eventsGraphqlResponse,
        );

        const result = await eventDataProvider.fetch({
          filter: { interestGroupId: interestGroupId },
        });

        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          expect.anything(),
          {
            limit: 10,
            skip: 0,
            where: {
              hidden_not: true,
              calendar: {
                sys: {
                  id: 'calendar-from-ig-id',
                },
              },
            },
          },
        );
        expect(result).toEqual(getContentfulListEventDataObject());
      });
    });
  });

  describe('Fetch-by-id method', () => {
    const eventId = 'event-id';

    test('Should fetch the event from Contentful Graphql', async () => {
      const result = await eventDataProviderMockGraphql.fetchById(eventId);

      const expectedResult = getContentfulEventDataObject();
      expectedResult.workingGroup = eventWorkingGroup;
      expectedResult.interestGroup = eventInterestGroup;
      expect(result).toMatchObject(expectedResult);
    });

    test('Should return null when event is not found', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        event: null,
      });

      const result = await eventDataProvider.fetchById('not-found');
      expect(result).toEqual(null);
    });

    test('Should return the event when it finds it', async () => {
      const contentfulGraphQLResponse = getContentfulGraphqlEvent();
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        events: contentfulGraphQLResponse,
      });

      const result = await eventDataProvider.fetchById(eventId);
      expect(result).toEqual(getContentfulEventDataObject());
    });

    test('Should return the publishedAt as lastModifiedDate lastUpdated is not available', async () => {
      const contentfulGraphQLResponse = getContentfulGraphqlEvent();
      contentfulGraphQLResponse.lastUpdated = null;
      contentfulGraphQLResponse.sys.publishedAt = '2023-08-31T14:00:00.000Z';
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        events: contentfulGraphQLResponse,
      });

      const result = await eventDataProvider.fetchById(eventId);
      expect(result).toEqual({
        ...getContentfulEventDataObject(),
        lastModifiedDate: '2023-08-31T14:00:00.000Z',
      });
    });

    describe('Event speakers', () => {
      test('Should remove null speakers from the list', async () => {
        const contentfulGraphQLResponse = getContentfulGraphqlEvent();
        contentfulGraphQLResponse.speakersCollection!.items = [
          null,
          ...contentfulGraphQLResponse.speakersCollection!.items,
        ];

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          events: contentfulGraphQLResponse,
        });

        const result = await eventDataProvider.fetchById(eventId);
        expect(result!.speakers.length).toEqual(1);
        const speakerResult = result!.speakers[0]! as EventSpeakerTeam;
        expect(speakerResult.team.displayName).toEqual('The team three');
      });
      test('Should default speakers to an empty array', async () => {
        const contentfulGraphQLResponse = getContentfulGraphqlEvent();
        contentfulGraphQLResponse.speakersCollection = null;

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          events: contentfulGraphQLResponse,
        });

        const result = await eventDataProvider.fetchById(eventId);
        expect(result!.speakers).toEqual([]);
      });
      test('Should return team inactiveSince as undefined when it comes as null from graphql response', async () => {
        const contentfulGraphQLResponse = getContentfulGraphqlEvent();
        contentfulGraphQLResponse.speakersCollection!.items![0]!.team!.inactiveSince! =
          null;

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          events: contentfulGraphQLResponse,
        });

        const result = await eventDataProvider.fetchById(eventId);
        const speakerResult = result!.speakers[0]! as EventSpeakerTeam;
        expect(speakerResult.team.inactiveSince).toBeUndefined();
      });

      test('Should return external author speaker', async () => {
        const contentfulGraphQLResponse = getContentfulGraphqlEvent();
        contentfulGraphQLResponse.speakersCollection!.items![0]!.user! = {
          __typename: 'ExternalAuthors',
          name: 'Jane Doe',
          orcid: '0000-0000-1111-1111',
        };

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          events: contentfulGraphQLResponse,
        });

        const result = await eventDataProvider.fetchById(eventId);
        const speakerResult = result!.speakers;
        expect(speakerResult).toEqual([
          {
            externalUser: {
              name: 'Jane Doe',
              orcid: '0000-0000-1111-1111',
            },
          },
        ]);
      });

      test('Should return user speaker', async () => {
        const contentfulGraphQLResponse = getContentfulGraphqlEvent();
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          events: contentfulGraphQLResponse,
        });

        const result = await eventDataProvider.fetchById(eventId);
        const speakerResult = result!.speakers;
        expect(speakerResult).toEqual([
          {
            role: 'Lead PI (Core Leadership)',
            team: {
              displayName: 'The team three',
              id: 'team-id-3',
              inactiveSince: '2022-10-24T11:00:00Z',
            },
            user: {
              alumniSinceDate: undefined,
              avatarUrl: undefined,
              displayName: 'Adam Brown',
              firstName: 'Adam',
              id: 'user-id-3',
              lastName: 'Brown',
            },
          },
        ]);
      });

      test('Should return only the team when speaker of type user does not belong to this team', async () => {
        const contentfulGraphQLResponse = getContentfulGraphqlEvent();
        const team = getContentfulUserSpeakerTeams();
        team.team.sys.id = 'team-id-1';

        (contentfulGraphQLResponse.speakersCollection!.items = [
          {
            team: {
              sys: {
                id: 'team-id-3',
              },
              displayName: 'The team three',
              inactiveSince: null,
            },
            user: {
              __typename: 'Users',
              sys: {
                id: 'user-id-3',
              },
              alumniSinceDate: null,
              alumniLocation: 'some alumni location',
              firstName: 'Adam',
              lastName: 'Brown',
              onboarded: true,
              teamsCollection: {
                items: [team],
              },
              avatar: null,
            },
          },
        ]),
          contentfulGraphqlClientMock.request.mockResolvedValueOnce({
            events: contentfulGraphQLResponse,
          });

        const result = await eventDataProvider.fetchById(eventId);
        const speakerResult = result!.speakers;
        expect(speakerResult).toEqual([
          {
            team: {
              displayName: 'The team three',
              id: 'team-id-3',
              inactiveSince: undefined,
            },
          },
        ]);
      });

      test('Should return only the team when speaker of type user belongs to the team but is not onboarded', async () => {
        const contentfulGraphQLResponse = getContentfulGraphqlEvent();
        const team = getContentfulUserSpeakerTeams();
        team.team.sys.id = 'team-id-1';

        (contentfulGraphQLResponse.speakersCollection!.items = [
          {
            team: {
              sys: {
                id: 'team-id-3',
              },
              displayName: 'The team three',
              inactiveSince: '2022-10-24T11:00:00Z',
            },
            user: {
              __typename: 'Users',
              sys: {
                id: 'user-id-3',
              },
              alumniSinceDate: null,
              alumniLocation: 'some alumni location',
              firstName: 'Adam',
              lastName: 'Brown',
              onboarded: false,
              teamsCollection: {
                items: [getContentfulUserSpeakerTeams()],
              },
              avatar: null,
            },
          },
        ]),
          contentfulGraphqlClientMock.request.mockResolvedValueOnce({
            events: contentfulGraphQLResponse,
          });

        const result = await eventDataProvider.fetchById(eventId);
        const speakerResult = result!.speakers;
        expect(speakerResult).toEqual([
          {
            team: {
              displayName: 'The team three',
              id: 'team-id-3',
              inactiveSince: '2022-10-24T11:00:00Z',
            },
          },
        ]);
      });

      test("Should return only the team when there's a team assigned but no user", async () => {
        const contentfulGraphQLResponse = getContentfulGraphqlEvent();

        (contentfulGraphQLResponse.speakersCollection!.items = [
          {
            team: {
              sys: {
                id: 'team-id-3',
              },
              displayName: 'The team three',
              inactiveSince: '2022-10-24T11:00:00Z',
            },
            user: undefined,
          },
        ]),
          contentfulGraphqlClientMock.request.mockResolvedValueOnce({
            events: contentfulGraphQLResponse,
          });

        const result = await eventDataProvider.fetchById(eventId);
        const speakerResult = result!.speakers;
        expect(speakerResult).toEqual([
          {
            team: {
              displayName: 'The team three',
              id: 'team-id-3',
              inactiveSince: '2022-10-24T11:00:00Z',
            },
          },
        ]);
      });

      test('Removes the speaker from speakers list when it does not have the team assigned', async () => {
        const contentfulGraphQLResponse = getContentfulGraphqlEvent();
        (contentfulGraphQLResponse.speakersCollection!.items = [
          {
            team: undefined,
            user: {
              __typename: 'ExternalAuthors',
              name: 'Jane Doe',
              orcid: '0000-0000-1111-1111',
            },
          },
          {
            team: undefined,
            user: {
              __typename: 'Users',
              sys: {
                id: 'user-id-3',
              },
              alumniSinceDate: null,
              alumniLocation: 'some alumni location',
              firstName: 'Adam',
              lastName: 'Brown',
              onboarded: true,
              teamsCollection: {
                items: [getContentfulUserSpeakerTeams()],
              },
              avatar: null,
            },
          },
        ]),
          contentfulGraphqlClientMock.request.mockResolvedValueOnce({
            events: contentfulGraphQLResponse,
          });

        const result = await eventDataProvider.fetchById(eventId);
        const speakerResult = result!.speakers;
        expect(speakerResult).toEqual([
          {
            externalUser: {
              name: 'Jane Doe',
              orcid: '0000-0000-1111-1111',
            },
          },
        ]);
      });
    });

    describe('working group', () => {
      it('should return working group as undefined when linked from calendar is null', async () => {
        const contentfulGraphQLResponse = getContentfulGraphqlEvent();
        contentfulGraphQLResponse!.calendar!.linkedFrom = null;
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          events: contentfulGraphQLResponse,
        });

        const result = await eventDataProvider.fetchById(eventId);

        expect(result!.workingGroup).toBeUndefined();
      });

      it('should return working group as undefined when workingGroupsCollection is null', async () => {
        const contentfulGraphQLResponse = getContentfulGraphqlEvent();
        contentfulGraphQLResponse!.calendar!.linkedFrom = {
          workingGroupsCollection: null,
        };
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          events: contentfulGraphQLResponse,
        });

        const result = await eventDataProvider.fetchById(eventId);

        expect(result!.workingGroup).toBeUndefined();
      });

      it('should return working group as undefined when workingGroupsCollection items are empty', async () => {
        const contentfulGraphQLResponse = getContentfulGraphqlEvent();
        contentfulGraphQLResponse!.calendar!.linkedFrom = {
          workingGroupsCollection: {
            items: [],
          },
        };
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          events: contentfulGraphQLResponse,
        });

        const result = await eventDataProvider.fetchById(eventId);

        expect(result!.workingGroup).toBeUndefined();
      });

      it('should return working group as undefined when workingGroupsCollection items are null', async () => {
        const contentfulGraphQLResponse = getContentfulGraphqlEvent();
        contentfulGraphQLResponse!.calendar!.linkedFrom = {
          workingGroupsCollection: {
            items: [null, null],
          },
        };
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          events: contentfulGraphQLResponse,
        });

        const result = await eventDataProvider.fetchById(eventId);

        expect(result!.workingGroup).toBeUndefined();
      });

      it('should return working group when it is linked from calendar', async () => {
        const contentfulGraphQLResponse = getContentfulGraphqlEvent();
        contentfulGraphQLResponse!.calendar!.linkedFrom = {
          workingGroupsCollection: {
            items: [
              {
                sys: {
                  id: 'wg-linked-from-calendar',
                },
                title: 'WG-1',
              },
            ],
          },
        };

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          events: contentfulGraphQLResponse,
        });

        const result = await eventDataProvider.fetchById(eventId);

        expect(result!.workingGroup).toEqual({
          id: 'wg-linked-from-calendar',
          title: 'WG-1',
        });
      });
    });

    describe('interest group', () => {
      it('should return interest group as undefined when linked from calendar is null', async () => {
        const contentfulGraphQLResponse = getContentfulGraphqlEvent();
        contentfulGraphQLResponse!.calendar!.linkedFrom = null;
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          events: contentfulGraphQLResponse,
        });

        const result = await eventDataProvider.fetchById(eventId);

        expect(result!.interestGroup).toBeUndefined();
      });

      it('should return interest group as undefined when workingGroupsCollection is null', async () => {
        const contentfulGraphQLResponse = getContentfulGraphqlEvent();
        contentfulGraphQLResponse!.calendar!.linkedFrom = {
          interestGroupsCollection: null,
        };
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          events: contentfulGraphQLResponse,
        });

        const result = await eventDataProvider.fetchById(eventId);

        expect(result!.interestGroup).toBeUndefined();
      });

      it('should return interest group as undefined when workingGroupsCollection items are empty', async () => {
        const contentfulGraphQLResponse = getContentfulGraphqlEvent();
        contentfulGraphQLResponse!.calendar!.linkedFrom = {
          interestGroupsCollection: {
            items: [],
          },
        };
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          events: contentfulGraphQLResponse,
        });

        const result = await eventDataProvider.fetchById(eventId);

        expect(result!.interestGroup).toBeUndefined();
      });

      it('should return interest group as undefined when workingGroupsCollection items are null', async () => {
        const contentfulGraphQLResponse = getContentfulGraphqlEvent();
        contentfulGraphQLResponse!.calendar!.linkedFrom = {
          interestGroupsCollection: {
            items: [null, null],
          },
        };
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          events: contentfulGraphQLResponse,
        });

        const result = await eventDataProvider.fetchById(eventId);

        expect(result!.interestGroup).toBeUndefined();
      });

      it('should return interest group when it is linked from calendar', async () => {
        const contentfulGraphQLResponse = getContentfulGraphqlEvent();
        contentfulGraphQLResponse!.calendar!.linkedFrom = {
          interestGroupsCollection: {
            items: [
              {
                sys: {
                  id: 'ig-linked-from-calendar',
                },
                name: 'IG-1',
                active: true,
                slack: 'http://www.slack.com/ig1',
              },
            ],
          },
        };

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          events: contentfulGraphQLResponse,
        });

        const result = await eventDataProvider.fetchById(eventId);

        expect(result!.interestGroup).toEqual({
          id: 'ig-linked-from-calendar',
          name: 'IG-1',
          active: true,
          tools: {
            slack: 'http://www.slack.com/ig1',
          },
        });
      });
    });
  });

  describe('Update', () => {
    const entry = getEntry({
      hidden: true,
    });
    entry.patch = jest.fn().mockResolvedValueOnce(
      getEntry({
        hidden: false,
      }),
    );

    beforeEach(() => {
      environmentMock.getEntry.mockResolvedValueOnce(entry);
    });

    test('fetches entry from contentful and passes to `patchAndPublish`', async () => {
      const mockPatchAndPublish = patchAndPublish as jest.MockedFunction<
        typeof patchAndPublish
      >;
      mockPatchAndPublish.mockResolvedValue({
        sys: {
          publishedVersion: 2,
        },
      } as Entry);
      contentfulGraphqlClientMock.request.mockResolvedValue({
        events: {
          sys: {
            publishedVersion: 2,
          },
        },
      });

      await eventDataProvider.update('123', {
        hidden: false,
      });
      expect(environmentMock.getEntry).toHaveBeenCalledWith('123');
      expect(patchAndPublish).toHaveBeenCalledWith(entry, {
        hidden: false,
      });
    });

    test('updates the calendar`', async () => {
      const mockPatchAndPublish = patchAndPublish as jest.MockedFunction<
        typeof patchAndPublish
      >;
      mockPatchAndPublish.mockResolvedValue({
        sys: {
          publishedVersion: 2,
        },
      } as Entry);
      contentfulGraphqlClientMock.request.mockResolvedValue({
        events: {
          sys: {
            publishedVersion: 2,
          },
        },
      });

      await eventDataProvider.update('123', {
        calendar: 'google-calendar-1',
      });
      expect(environmentMock.getEntry).toHaveBeenCalledWith('123');
      expect(patchAndPublish).toHaveBeenCalledWith(entry, {
        calendar: {
          sys: {
            id: 'google-calendar-1',
            linkType: 'Entry',
            type: 'Link',
          },
        },
      });
    });
  });

  describe('Create method', () => {
    test('Should create an event', async () => {
      const eventEntryMock = getEntry({
        sys: {
          id: 'event-1',
        },
      });
      environmentMock.createEntry.mockResolvedValue(eventEntryMock);
      eventEntryMock.publish = jest.fn().mockResolvedValueOnce(eventEntryMock);

      const teamDataObject = getEventCreateDataObject();
      await eventDataProvider.create(teamDataObject);

      const createEntryFn = environmentMock.createEntry;
      expect(createEntryFn).toHaveBeenCalledWith('events', {
        fields: {
          calendar: {
            'en-US': {
              sys: {
                id: 'squidex-calendar-id',
                linkType: 'Entry',
                type: 'Link',
              },
            },
          },
          description: {
            'en-US': 'This event will be good',
          },
          endDate: {
            'en-US': '2021-02-23T19:32:00Z',
          },
          endDateTimeZone: {
            'en-US': 'Europe/Lisbon',
          },
          googleId: {
            'en-US': 'google-event-id',
          },
          hidden: {
            'en-US': false,
          },
          hideMeetingLink: {
            'en-US': false,
          },
          startDate: {
            'en-US': '2021-02-23T19:32:00Z',
          },
          startDateTimeZone: {
            'en-US': 'Europe/Lisbon',
          },
          status: {
            'en-US': 'Confirmed',
          },
          tags: {
            'en-US': [],
          },
          title: {
            'en-US': 'Event Tittle',
          },
        },
      });
    });
  });

  describe('parseGraphQLEvent', () => {
    test(`throws when provided event doesn't have a calendar`, () => {
      const graphqlEvent = getContentfulGraphqlEvent();
      graphqlEvent.sys.id = 'example';
      graphqlEvent.calendar = null;

      expect(() => parseGraphQLEvent(graphqlEvent)).toThrowError(
        `Event (example) doesn't have a calendar`,
      );
    });

    test('throws when provided an invalid event status', () => {
      const graphqlEvent = getContentfulGraphqlEvent();
      graphqlEvent.sys.id = 'example';
      graphqlEvent.status = 'invalid';

      expect(() =>
        parseGraphQLEvent(graphqlEvent),
      ).toThrowErrorMatchingInlineSnapshot(
        `"Invalid event (example) status "invalid""`,
      );
    });

    test('handles null working group by returning an empty array', () => {
      const graphqlEvent = getContentfulGraphqlEvent();
      graphqlEvent.linkedFrom!.researchOutputsCollection!.items[0]!.workingGroup =
        null;

      expect(parseGraphQLEvent(graphqlEvent).relatedResearch[0]).toEqual(
        expect.objectContaining({ workingGroups: [] }),
      );
    });
  });
});
