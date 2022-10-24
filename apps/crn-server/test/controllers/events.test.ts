import nock from 'nock';
import { GenericError } from '@asap-hub/errors';
import { RestEvent, SquidexRest } from '@asap-hub/squidex';
import { identity } from '../helpers/squidex';
import {
  listEventResponse,
  getEventResponse,
  getEventRestResponse,
  getRestEvent,
  getSquidexEventsGraphqlResponse,
  getSquidexEventGraphqlResponse,
  getSquidexGraphqlEvents,
} from '../fixtures/events.fixtures';
import {
  getSquidexGraphqlGroup,
  getSquidexGroupGraphqlResponse,
} from '../fixtures/groups.fixtures';
import Events from '../../src/controllers/events';

import { getSquidexGraphqlClientMockServer } from '../mocks/squidex-graphql-client-with-server.mock';
import { getSquidexGraphqlClientMock } from '../mocks/squidex-graphql-client.mock';
import Boom from '@hapi/boom';
import { getAuthToken } from '../../src/utils/auth';
import { appName, baseUrl } from '../../src/config';

describe('Event controller', () => {
  const eventRestClient = new SquidexRest<RestEvent>(getAuthToken, 'events', {
    appName,
    baseUrl,
  });
  const squidexGraphqlClientMock = getSquidexGraphqlClientMock();
  const eventsController = new Events(
    squidexGraphqlClientMock,
    eventRestClient,
  );

  const squidexGraphqlClientMockServer = getSquidexGraphqlClientMockServer();
  const eventsControllerMockGraphql = new Events(
    squidexGraphqlClientMockServer,
    eventRestClient,
  );

  beforeAll(() => identity());
  afterEach(() => {
    jest.resetAllMocks();
    jest.useRealTimers();
  });

  describe('Fetch method', () => {
    test('Should fetch the events from squidex graphql', async () => {
      const result = await eventsControllerMockGraphql.fetch({
        before: 'before',
      });

      expect(result).toMatchObject(getSquidexGraphqlEvents());
    });

    test('Should return an empty result when the client returns an empty array of data', async () => {
      const eventsGraphqlResponse = getSquidexEventsGraphqlResponse();
      eventsGraphqlResponse.queryEventsContentsWithTotal!.total = 0;
      eventsGraphqlResponse.queryEventsContentsWithTotal!.items = [];

      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        eventsGraphqlResponse,
      );

      const result = await eventsController.fetch({ before: 'before' });

      expect(result.total).toEqual(0);
      expect(result.items).toHaveLength(0);
    });
    test('Should return a list of events', async () => {
      const eventsGraphqlResponse = getSquidexEventsGraphqlResponse();
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        eventsGraphqlResponse,
      );

      const result = await eventsController.fetch({ before: 'before' });

      expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        {
          filter: `data/hidden/iv ne true and data/endDate/iv lt before`,
          order: '',
          skip: 0,
          top: 10,
        },
      );
      expect(result).toEqual(listEventResponse);
    });

    test('Should apply the filter to remove hidden events by default', async () => {
      const eventsGraphqlResponse = getSquidexEventsGraphqlResponse();
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        eventsGraphqlResponse,
      );

      const result = await eventsController.fetch({ after: 'after-date' });

      expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        {
          filter: `data/hidden/iv ne true and data/endDate/iv gt after-date`,
          order: '',
          skip: 0,
          top: 10,
        },
      );
      expect(result).toEqual(listEventResponse);
    });

    describe('Date filters', () => {
      test('Should apply the "after" filter to the end-date', async () => {
        const eventsGraphqlResponse = getSquidexEventsGraphqlResponse();
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          eventsGraphqlResponse,
        );
        const result = await eventsController.fetch({ after: 'after-date' });

        expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
          expect.anything(),
          {
            filter: `data/hidden/iv ne true and data/endDate/iv gt after-date`,
            order: '',
            skip: 0,
            top: 10,
          },
        );
        expect(result).toEqual(listEventResponse);
      });

      test('Should apply the "before" filter to the end-date', async () => {
        const eventsGraphqlResponse = getSquidexEventsGraphqlResponse();
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          eventsGraphqlResponse,
        );

        const result = await eventsController.fetch({ before: 'before-date' });

        expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
          expect.anything(),
          {
            filter: `data/hidden/iv ne true and data/endDate/iv lt before-date`,
            order: '',
            skip: 0,
            top: 10,
          },
        );
        expect(result).toEqual(listEventResponse);
      });

      test('Should apply both the "after" and "before" filters', async () => {
        const eventsGraphqlResponse = getSquidexEventsGraphqlResponse();
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          eventsGraphqlResponse,
        );

        const result = await eventsController.fetch({
          before: 'before-date',
          after: 'after-date',
        });

        expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
          expect.anything(),
          {
            filter: `data/hidden/iv ne true and data/endDate/iv gt after-date and data/endDate/iv lt before-date`,
            order: '',
            skip: 0,
            top: 10,
          },
        );
        expect(result).toEqual(listEventResponse);
      });

      test('Should apply search query params', async () => {
        const eventsGraphqlResponse = getSquidexEventsGraphqlResponse();
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          eventsGraphqlResponse,
        );

        const result = await eventsController.fetch({
          after: 'after-date',
          search: 'a',
        });

        expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
          expect.anything(),
          {
            filter:
              "(contains(data/title/iv, 'a') or contains(data/tags/iv, 'a')) and data/hidden/iv ne true and data/endDate/iv gt after-date",
            order: '',
            skip: 0,
            top: 10,
          },
        );
        expect(result).toEqual(listEventResponse);
      });

      test('Should sanitise single quotes by doubling them and encoding to hex', async () => {
        const eventsGraphqlResponse = getSquidexEventsGraphqlResponse();
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          eventsGraphqlResponse,
        );

        const result = await eventsController.fetch({
          after: 'after-date',
          search: "'",
        });

        expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
          expect.anything(),
          {
            filter:
              "(contains(data/title/iv, '%27%27') or contains(data/tags/iv, '%27%27')) and data/hidden/iv ne true and data/endDate/iv gt after-date",
            order: '',
            skip: 0,
            top: 10,
          },
        );
        expect(result).toEqual(listEventResponse);
      });

      test('Should sanitise double quotation mark by encoding to hex', async () => {
        const eventsGraphqlResponse = getSquidexEventsGraphqlResponse();
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          eventsGraphqlResponse,
        );
        const result = await eventsController.fetch({
          after: 'after-date',
          search: '"',
        });

        expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
          expect.anything(),
          {
            filter:
              "(contains(data/title/iv, '%22') or contains(data/tags/iv, '%22')) and data/hidden/iv ne true and data/endDate/iv gt after-date",
            order: '',
            skip: 0,
            top: 10,
          },
        );
        expect(result).toEqual(listEventResponse);
      });
    });

    describe('Filters', () => {
      describe('Group filter', () => {
        const groupId = 'some-group-id';
        test('Should throw a Not Found error when the event is not found', async () => {
          squidexGraphqlClientMock.request.mockRejectedValue(Boom.notFound());

          await expect(
            eventsController.fetch({
              after: 'after-date',
              filter: { groupId },
            }),
          ).rejects.toThrow('Not Found');
        });

        test('Should apply the "groupId" filter', async () => {
          const eventsGraphqlResponse = getSquidexEventsGraphqlResponse();
          const groupGraphqlResponse = getSquidexGroupGraphqlResponse();
          groupGraphqlResponse.findGroupsContent!.flatData!.calendars![0]!.id =
            'calendar-1';

          squidexGraphqlClientMock.request.mockResolvedValueOnce(
            groupGraphqlResponse,
          );

          squidexGraphqlClientMock.request.mockResolvedValueOnce(
            eventsGraphqlResponse,
          );
          const result = await eventsController.fetch({
            after: 'after-date',
            filter: { groupId },
          });

          expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
            expect.anything(),
            {
              filter: `data/hidden/iv ne true and data/endDate/iv gt after-date and data/calendar/iv in ['calendar-1']`,
              order: '',
              skip: 0,
              top: 10,
            },
          );
          expect(result).toEqual(listEventResponse);
        });

        test('Should apply the "teamId" filter', async () => {
          const eventsGraphqlResponse = getSquidexEventsGraphqlResponse();
          squidexGraphqlClientMock.request.mockResolvedValueOnce(
            eventsGraphqlResponse,
          );
          const result = await eventsController.fetch({
            after: 'after-date',
            filter: { teamId: 'team-1' },
          });

          expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
            expect.anything(),
            {
              filter: `data/hidden/iv ne true and data/endDate/iv gt after-date and data/speakers/iv/team eq 'team-1'`,
              order: '',
              skip: 0,
              top: 10,
            },
          );
          expect(result).toEqual(listEventResponse);
        });
        test('Should apply the "userId" filter', async () => {
          const eventsGraphqlResponse = getSquidexEventsGraphqlResponse();
          squidexGraphqlClientMock.request.mockResolvedValueOnce(
            eventsGraphqlResponse,
          );
          const result = await eventsController.fetch({
            after: 'after-date',
            filter: { userId: 'user-1' },
          });

          expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
            expect.anything(),
            {
              filter: `data/hidden/iv ne true and data/endDate/iv gt after-date and data/speakers/iv/user eq 'user-1'`,
              order: '',
              skip: 0,
              top: 10,
            },
          );
          expect(result).toEqual(listEventResponse);
        });
        test('Should apply the "externalUserId" filter', async () => {
          const eventsGraphqlResponse = getSquidexEventsGraphqlResponse();
          squidexGraphqlClientMock.request.mockResolvedValueOnce(
            eventsGraphqlResponse,
          );
          const result = await eventsController.fetch({
            after: 'after-date',
            filter: { externalAuthorId: 'external-user-1' },
          });

          expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
            expect.anything(),
            {
              filter: `data/hidden/iv ne true and data/endDate/iv gt after-date and data/speakers/iv/user eq 'external-user-1'`,
              order: '',
              skip: 0,
              top: 10,
            },
          );
          expect(result).toEqual(listEventResponse);
        });
      });
    });

    describe('Sorting', () => {
      test('Should apply the "orderBy" option using the startDate field and ascending order', async () => {
        const eventsGraphqlResponse = getSquidexEventsGraphqlResponse();
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          eventsGraphqlResponse,
        );
        const result = await eventsController.fetch({
          after: 'after-date',
          sortBy: 'startDate',
          sortOrder: 'asc',
        });

        expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
          expect.anything(),
          {
            filter: 'data/hidden/iv ne true and data/endDate/iv gt after-date',
            order: 'data/startDate/iv asc',
            skip: 0,
            top: 10,
          },
        );
        expect(result).toEqual(listEventResponse);
      });
      test('Should apply the "orderBy" option using the endDate field and descending order', async () => {
        const eventsGraphqlResponse = getSquidexEventsGraphqlResponse();
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          eventsGraphqlResponse,
        );
        const result = await eventsController.fetch({
          after: 'after-date',
          sortBy: 'endDate',
          sortOrder: 'desc',
        });

        expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
          expect.anything(),
          {
            filter: 'data/hidden/iv ne true and data/endDate/iv gt after-date',
            order: 'data/endDate/iv desc',
            skip: 0,
            top: 10,
          },
        );
        expect(result).toEqual(listEventResponse);
      });
      test('Should not apply any order if the parameters are not provided', async () => {
        const eventsGraphqlResponse = getSquidexEventsGraphqlResponse();
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          eventsGraphqlResponse,
        );
        const result = await eventsController.fetch({
          after: 'after-date',
        });

        expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
          expect.anything(),
          {
            filter: 'data/hidden/iv ne true and data/endDate/iv gt after-date',
            order: '',
            skip: 0,
            top: 10,
          },
        );
        expect(result).toEqual(listEventResponse);
      });
    });
    describe('Event link', () => {
      beforeEach(() => {
        jest.useFakeTimers().setSystemTime(new Date('2021-06-06T10:00:00Z'));
      });

      afterEach(() => jest.clearAllMocks());
      beforeAll(() => jest.useRealTimers());

      test('Should reveal the event link when the event starts in less than 24h from now', async () => {
        const eventsGraphqlResponse = getSquidexEventsGraphqlResponse();
        eventsGraphqlResponse.queryEventsContentsWithTotal!.items![0]!.flatData.meetingLink =
          'some-link';
        eventsGraphqlResponse.queryEventsContentsWithTotal!.items![0]!.flatData.startDate =
          '2021-06-06T14:00:00Z';

        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          eventsGraphqlResponse,
        );

        const result = await eventsController.fetch({
          before: 'before',
        });

        expect(result.items[0]?.meetingLink).toEqual('some-link');
      });
      test('Should reveal the event link when the event start date is in the past', async () => {
        const eventsGraphqlResponse = getSquidexEventsGraphqlResponse();
        eventsGraphqlResponse.queryEventsContentsWithTotal!.items![0]!.flatData.meetingLink =
          'some-link';
        eventsGraphqlResponse.queryEventsContentsWithTotal!.items![0]!.flatData.startDate =
          '2020-06-06T13:00:00.000Z';

        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          eventsGraphqlResponse,
        );

        const result = await eventsController.fetch({ before: 'before' });

        expect(result.items[0]?.meetingLink).toEqual('some-link');
      });
    });

    describe('Past event materials states', () => {
      beforeEach(() => {
        jest.useFakeTimers();
        jest.clearAllMocks();
      });

      test('Should return empty (null) if details are permanentlyUnavailable on the CMS', async () => {
        const eventsGraphqlResponse = getSquidexEventsGraphqlResponse();
        eventsGraphqlResponse.queryEventsContentsWithTotal!.items![0]!.flatData.notesPermanentlyUnavailable =
          true;
        eventsGraphqlResponse.queryEventsContentsWithTotal!.items![0]!.flatData.videoRecordingPermanentlyUnavailable =
          true;
        eventsGraphqlResponse.queryEventsContentsWithTotal!.items![0]!.flatData.presentationPermanentlyUnavailable =
          true;
        eventsGraphqlResponse.queryEventsContentsWithTotal!.items![0]!.flatData.meetingMaterialsPermanentlyUnavailable =
          true;

        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          eventsGraphqlResponse,
        );

        const result = await eventsController.fetch({ before: 'before' });

        expect(result.items[0]?.notes).toBeNull();
        expect(result.items[0]?.videoRecording).toBeNull();
        expect(result.items[0]?.meetingMaterials).toBeNull();
        expect(result.items[0]?.presentation).toBeNull();
      });

      test('Should return empty (null) details if the event is 4 days old and details are empty', async () => {
        const eventsGraphqlResponse = getSquidexEventsGraphqlResponse();

        eventsGraphqlResponse.queryEventsContentsWithTotal!.items![0]!.flatData.endDate =
          '2021-05-20T02:00:00Z';
        eventsGraphqlResponse.queryEventsContentsWithTotal!.items![0]!.flatData.notes =
          '';
        eventsGraphqlResponse.queryEventsContentsWithTotal!.items![0]!.flatData.videoRecording =
          '';
        eventsGraphqlResponse.queryEventsContentsWithTotal!.items![0]!.flatData.presentation =
          '';
        eventsGraphqlResponse.queryEventsContentsWithTotal!.items![0]!.flatData.meetingMaterials =
          [];

        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          eventsGraphqlResponse,
        );

        const result = await eventsController.fetch({ before: 'before' });

        expect(result.items[0]?.notes).toBeNull();
        expect(result.items[0]?.videoRecording).toBeNull();
        expect(result.items[0]?.meetingMaterials).toBeNull();
        expect(result.items[0]?.presentation).toBeNull();
      });

      test('Should return empty (undefined) details if the event is less than 4 days old and details are empty', async () => {
        const eventsGraphqlResponse = getSquidexEventsGraphqlResponse();
        eventsGraphqlResponse.queryEventsContentsWithTotal!.items![0]!.flatData.endDate =
          new Date().toISOString();
        eventsGraphqlResponse.queryEventsContentsWithTotal!.items![0]!.flatData.notes =
          '';
        eventsGraphqlResponse.queryEventsContentsWithTotal!.items![0]!.flatData.videoRecording =
          '';
        eventsGraphqlResponse.queryEventsContentsWithTotal!.items![0]!.flatData.presentation =
          '';
        eventsGraphqlResponse.queryEventsContentsWithTotal!.items![0]!.flatData.meetingMaterials =
          [];

        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          eventsGraphqlResponse,
        );

        const result = await eventsController.fetch({
          before: 'before',
        });

        expect(result.items[0]?.endDate).toBe(new Date().toISOString());
        expect(result.items[0]?.notes).toBeUndefined();
        expect(result.items[0]?.videoRecording).toBeUndefined();
        expect(result.items[0]?.presentation).toBeUndefined();
        expect(result.items[0]?.meetingMaterials).toHaveLength(0);
      });

      test('Should return meeting details if these are not marked as permanently unavailable', async () => {
        const eventsGraphqlResponse = getSquidexEventsGraphqlResponse();
        eventsGraphqlResponse.queryEventsContentsWithTotal!.items![0]!.flatData.notesPermanentlyUnavailable =
          false;
        eventsGraphqlResponse.queryEventsContentsWithTotal!.items![0]!.flatData.videoRecordingPermanentlyUnavailable =
          false;
        eventsGraphqlResponse.queryEventsContentsWithTotal!.items![0]!.flatData.presentationPermanentlyUnavailable =
          false;
        eventsGraphqlResponse.queryEventsContentsWithTotal!.items![0]!.flatData.meetingMaterialsPermanentlyUnavailable =
          false;

        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          eventsGraphqlResponse,
        );

        const result = await eventsController.fetch({ before: 'before' });

        expect(result.items[0]?.notes).toBeDefined();
        expect(result.items[0]?.videoRecording).toBeDefined();
        expect(result.items[0]?.presentation).toBeDefined();
        expect(result.items[0]?.meetingMaterials).toHaveLength(1);
      });
    });
  });

  describe('Fetch by id method', () => {
    const eventId = 'event-1';

    test('Should fetch the event from squidex graphql', async () => {
      const result = await eventsControllerMockGraphql.fetchById(eventId);
      expect(result).toMatchObject(getEventResponse());
    });

    test('Should throw a Not Found error when the event is not found', async () => {
      const eventGraphqlResponse = getSquidexEventGraphqlResponse();
      eventGraphqlResponse.findEventsContent = null;

      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        eventGraphqlResponse,
      );

      await expect(eventsController.fetchById(eventId)).rejects.toThrow(
        'Not Found',
      );
    });

    test('Should return the event', async () => {
      const eventGraphqlResponse = getSquidexEventGraphqlResponse();
      eventGraphqlResponse.findEventsContent!.id = eventId;

      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        eventGraphqlResponse,
      );

      const result = await eventsController.fetchById(eventId);
      expect(result).toMatchObject({ ...getEventResponse(), id: eventId });
    });

    describe('Event link', () => {
      beforeEach(() => {
        jest.useFakeTimers().setSystemTime(new Date('2021-06-06T10:00:00Z'));
      });

      afterEach(() => jest.clearAllMocks());
      beforeAll(() => jest.useRealTimers());

      test('Should reveal the event link when the event starts in less than 24h from now', async () => {
        const eventGraphqlResponse = getSquidexEventGraphqlResponse();
        eventGraphqlResponse.findEventsContent!.flatData.meetingLink =
          'some-link';
        eventGraphqlResponse.findEventsContent!.flatData.startDate =
          '2021-06-06T14:00:00Z';

        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          eventGraphqlResponse,
        );

        const result = await eventsController.fetchById(eventId);
        expect(result.meetingLink).toEqual('some-link');
      });
      test('Should reveal the event link when the event start date is in the past', async () => {
        const eventGraphqlResponse = getSquidexEventGraphqlResponse();
        eventGraphqlResponse.findEventsContent!.flatData.meetingLink =
          'some-link';
        eventGraphqlResponse.findEventsContent!.flatData.startDate =
          '2020-06-06T13:00:00.000Z';

        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          eventGraphqlResponse,
        );

        const result = await eventsController.fetchById(eventId);
        expect(result.meetingLink).toEqual('some-link');
      });
    });
    describe('Event groups', () => {
      test('Should return the first group when event calendar is referenced by multiple groups', async () => {
        const eventGraphqlResponse = getSquidexEventGraphqlResponse();
        eventGraphqlResponse.findEventsContent!.flatData.calendar![0]!.referencingGroupsContents =
          [
            getSquidexGraphqlGroup(),
            { ...getSquidexGraphqlGroup(), id: 'group-2' },
          ];

        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          eventGraphqlResponse,
        );

        const result = await eventsController.fetchById(eventId);
        expect(result).toMatchObject(getEventResponse());
      });

      test('Should return one group when event calendar is referenced by single group', async () => {
        const eventGraphqlResponse = getSquidexEventGraphqlResponse();
        eventGraphqlResponse.findEventsContent!.flatData.calendar![0]!.referencingGroupsContents =
          [getSquidexGraphqlGroup()];

        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          eventGraphqlResponse,
        );

        const result = await eventsController.fetchById(eventId);
        expect(result).toMatchObject(getEventResponse());
      });

      test('Should return not return group when event calendar is not referenced by any group', async () => {
        const eventGraphqlResponse = getSquidexEventGraphqlResponse();
        eventGraphqlResponse.findEventsContent!.flatData.calendar![0]!.referencingGroupsContents =
          [];

        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          eventGraphqlResponse,
        );

        const result = await eventsController.fetchById(eventId);
        expect(result).toMatchObject({
          ...getEventResponse(),
          group: undefined,
        });
      });
    });
  });
  describe('Create method', () => {
    afterEach(() => {
      expect(nock.isDone()).toBe(true);
    });

    afterEach(() => {
      nock.cleanAll();
    });

    test('Should create or update the event', async () => {
      nock(baseUrl)
        .post(
          `/api/content/${appName}/events?publish=true`,
          getRestEvent().data,
        )
        .reply(200, getRestEvent());

      await eventsController.create(getEventRestResponse());
    });

    test('Should throw when squidex return an error', async () => {
      nock(baseUrl)
        .post(`/api/content/${appName}/events?publish=true`)
        .reply(404);

      await expect(
        eventsController.create(getEventRestResponse()),
      ).rejects.toThrow(GenericError);
    });
  });

  describe('Update method', () => {
    afterEach(() => {
      expect(nock.isDone()).toBe(true);
    });

    afterEach(() => {
      nock.cleanAll();
    });

    const eventId = 'event-id';

    test('Should update the event', async () => {
      nock(baseUrl)
        .patch(`/api/content/${appName}/events/${eventId}`, {
          tags: { iv: ['kubernetes'] },
          meetingLink: { iv: 'https://zweem.com' },
        })
        .reply(200);

      await eventsController.update(eventId, {
        tags: ['kubernetes'],
        meetingLink: 'https://zweem.com',
      });
    });

    test('Should throw when squidex return an error', async () => {
      nock(baseUrl)
        .patch(`/api/content/${appName}/events/${eventId}`)
        .reply(404);

      await expect(
        eventsController.update(eventId, { tags: ['kubernetes'] }),
      ).rejects.toThrow(GenericError);
    });
  });

  describe('fetchByGoogleId method', () => {
    afterEach(() => {
      expect(nock.isDone()).toBe(true);
    });
    afterEach(() => {
      nock.cleanAll();
    });
    const googleId = 'google-event-id';
    const filter = `data/googleId/iv eq '${googleId}'`;
    test('Should throw when gets an error from squidex', async () => {
      nock(baseUrl)
        .get(`/api/content/${appName}/events`)
        .query({
          $top: 1,
          $filter: filter,
        })
        .reply(500);
      await expect(
        eventsController.fetchByGoogleId(googleId),
      ).rejects.toThrow();
    });
    test('Should return null when squidex returns an empty array', async () => {
      nock(baseUrl)
        .get(`/api/content/${appName}/events`)
        .query({
          $top: 1,
          $filter: filter,
        })
        .reply(200, { total: 0, items: [] });
      const result = await eventsController.fetchByGoogleId(googleId);
      expect(result).toBeNull;
    });
    test('Should return the event when finds it', async () => {
      nock(baseUrl)
        .get(`/api/content/${appName}/events`)
        .query({
          $top: 1,
          $filter: filter,
        })
        .reply(200, { total: 1, items: [getRestEvent()] });
      const result = await eventsController.fetchByGoogleId(googleId);
      expect(result).toEqual(getRestEvent());
    });
  });
});
