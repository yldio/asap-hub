import { GenericError } from '@asap-hub/errors';
import { RestEvent, SquidexRest } from '@asap-hub/squidex';
import nock from 'nock';
import { appName, baseUrl } from '../../src/config';
import { EventSquidexDataProvider } from '../../src/data-providers/event.data-provider';
import { getAuthToken } from '../../src/utils/auth';
import {
  getEventDataObject,
  getEventInput,
  getListEventResponse,
  getRestEvent,
  getSquidexEventGraphqlResponse,
  getSquidexEventsGraphqlResponse,
  getSquidexGraphqlEvents,
  getUserCreateDataObject,
} from '../fixtures/event.fixtures';
import { identity } from '../helpers/squidex';
import { getSquidexGraphqlClientMockServer } from '../mocks/squidex-graphql-client-with-server.mock';
import { getSquidexGraphqlClientMock } from '../mocks/squidex-graphql-client.mock';

describe('Event data provider', () => {
  const squidexGraphqlClientMock = getSquidexGraphqlClientMock();
  const squidexGraphqlClientMockServer = getSquidexGraphqlClientMockServer();

  const eventRestClient = new SquidexRest<RestEvent>(getAuthToken, 'events', {
    appName,
    baseUrl,
  });
  const eventDataProvider = new EventSquidexDataProvider(
    eventRestClient,
    squidexGraphqlClientMock,
  );
  const eventDataProviderMockGraphql = new EventSquidexDataProvider(
    eventRestClient,
    squidexGraphqlClientMockServer,
  );

  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Fetch', () => {
    test('Should fetch the events from squidex graphql', async () => {
      const result = await eventDataProviderMockGraphql.fetch({
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

      const result = await eventDataProvider.fetch({ before: 'before' });

      expect(result.total).toEqual(0);
      expect(result.items).toHaveLength(0);
    });
    test('Should return a list of events', async () => {
      const eventsGraphqlResponse = getSquidexEventsGraphqlResponse();
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        eventsGraphqlResponse,
      );

      const result = await eventDataProvider.fetch({ before: 'before' });

      expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        {
          filter: `data/hidden/iv ne true and data/endDate/iv lt before`,
          order: '',
          skip: 0,
          top: 10,
        },
      );
      expect(result).toEqual(getListEventResponse());
    });
    test('Should apply the filter to remove hidden events by default', async () => {
      const eventsGraphqlResponse = getSquidexEventsGraphqlResponse();
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        eventsGraphqlResponse,
      );

      const result = await eventDataProvider.fetch({ after: 'after-date' });

      expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        {
          filter: `data/hidden/iv ne true and data/endDate/iv gt after-date`,
          order: '',
          skip: 0,
          top: 10,
        },
      );
      expect(result).toEqual(getListEventResponse());
    });
    describe('Date filters', () => {
      test('Should apply the "after" filter to the end-date', async () => {
        const eventsGraphqlResponse = getSquidexEventsGraphqlResponse();
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          eventsGraphqlResponse,
        );
        const result = await eventDataProvider.fetch({ after: 'after-date' });

        expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
          expect.anything(),
          {
            filter: `data/hidden/iv ne true and data/endDate/iv gt after-date`,
            order: '',
            skip: 0,
            top: 10,
          },
        );
        expect(result).toEqual(getListEventResponse());
      });

      test('Should apply the "before" filter to the end-date', async () => {
        const eventsGraphqlResponse = getSquidexEventsGraphqlResponse();
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          eventsGraphqlResponse,
        );

        const result = await eventDataProvider.fetch({ before: 'before-date' });

        expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
          expect.anything(),
          {
            filter: `data/hidden/iv ne true and data/endDate/iv lt before-date`,
            order: '',
            skip: 0,
            top: 10,
          },
        );
        expect(result).toEqual(getListEventResponse());
      });

      test('Should apply both the "after" and "before" filters', async () => {
        const eventsGraphqlResponse = getSquidexEventsGraphqlResponse();
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          eventsGraphqlResponse,
        );

        const result = await eventDataProvider.fetch({
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
        expect(result).toEqual(getListEventResponse());
      });

      test('Should apply search query params', async () => {
        const eventsGraphqlResponse = getSquidexEventsGraphqlResponse();
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          eventsGraphqlResponse,
        );

        const result = await eventDataProvider.fetch({
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
        expect(result).toEqual(getListEventResponse());
      });

      test('Should sanitise single quotes by doubling them and encoding to hex', async () => {
        const eventsGraphqlResponse = getSquidexEventsGraphqlResponse();
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          eventsGraphqlResponse,
        );

        const result = await eventDataProvider.fetch({
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
        expect(result).toEqual(getListEventResponse());
      });

      test('Should sanitise double quotation mark by encoding to hex', async () => {
        const eventsGraphqlResponse = getSquidexEventsGraphqlResponse();
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          eventsGraphqlResponse,
        );
        const result = await eventDataProvider.fetch({
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
        expect(result).toEqual(getListEventResponse());
      });
    });
    describe('Sorting', () => {
      test('Should apply the "orderBy" option using the startDate field and ascending order', async () => {
        const eventsGraphqlResponse = getSquidexEventsGraphqlResponse();
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          eventsGraphqlResponse,
        );
        const result = await eventDataProvider.fetch({
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
        expect(result).toEqual(getListEventResponse());
      });
      test('Should apply the "orderBy" option using the endDate field and descending order', async () => {
        const eventsGraphqlResponse = getSquidexEventsGraphqlResponse();
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          eventsGraphqlResponse,
        );
        const result = await eventDataProvider.fetch({
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
        expect(result).toEqual(getListEventResponse());
      });
      test('Should not apply any order if the parameters are not provided', async () => {
        const eventsGraphqlResponse = getSquidexEventsGraphqlResponse();
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          eventsGraphqlResponse,
        );
        const result = await eventDataProvider.fetch({
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
        expect(result).toEqual(getListEventResponse());
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

        const result = await eventDataProvider.fetch({
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

        const result = await eventDataProvider.fetch({ before: 'before' });

        expect(result.items[0]?.meetingLink).toEqual('some-link');
      });
    });
    describe('Past event materials states', () => {
      beforeEach(() => {
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

        const result = await eventDataProvider.fetch({ before: 'before' });

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

        const result = await eventDataProvider.fetch({ before: 'before' });

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

        const result = await eventDataProvider.fetch({
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

        const result = await eventDataProvider.fetch({ before: 'before' });

        expect(result.items[0]?.notes).toBeDefined();
        expect(result.items[0]?.videoRecording).toBeDefined();
        expect(result.items[0]?.presentation).toBeDefined();
        expect(result.items[0]?.meetingMaterials).toHaveLength(1);
      });
    });
    test('can filter by googleId', async () => {
      const googleId = 'google-event-id';
      const filter = `data/googleId/iv eq '${googleId}'`;

      const eventsGraphqlResponse = getSquidexEventsGraphqlResponse();
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        eventsGraphqlResponse,
      );
      const result = await eventDataProvider.fetch({
        filter: { googleId },
      });

      expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        {
          filter: `${filter} and data/hidden/iv ne true`,
          skip: 0,
          order: '',
          top: 10,
        },
      );
      expect(result).toEqual(getListEventResponse());
    });
  });
  describe('Fetch by ID', () => {
    const eventId = 'event-1';

    test('Should fetch the event from squidex graphql', async () => {
      const result = await eventDataProviderMockGraphql.fetchById(eventId);
      expect(result).toMatchObject(getEventDataObject());
    });

    test('Should return null when event not found', async () => {
      const eventGraphqlResponse = getSquidexEventGraphqlResponse();
      eventGraphqlResponse.findEventsContent = null;

      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        eventGraphqlResponse,
      );

      const result = await eventDataProvider.fetchById(eventId);
      expect(result).toBeNull();
    });

    test('Should return the event', async () => {
      const eventGraphqlResponse = getSquidexEventGraphqlResponse();
      eventGraphqlResponse.findEventsContent!.id = eventId;

      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        eventGraphqlResponse,
      );

      const result = await eventDataProvider.fetchById(eventId);
      expect(result).toMatchObject({ ...getEventDataObject(), id: eventId });
    });

    describe('Event link', () => {
      beforeEach(() => {
        jest.useFakeTimers().setSystemTime(new Date('2021-06-06T10:00:00Z'));
      });

      afterEach(() => jest.clearAllMocks().useRealTimers());

      test('Should reveal the event link when the event starts in less than 24h from now', async () => {
        const eventGraphqlResponse = getSquidexEventGraphqlResponse();
        eventGraphqlResponse.findEventsContent!.flatData.meetingLink =
          'some-link';
        eventGraphqlResponse.findEventsContent!.flatData.startDate =
          '2021-06-06T14:00:00Z';

        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          eventGraphqlResponse,
        );

        const result = await eventDataProvider.fetchById(eventId);
        expect(result?.meetingLink).toEqual('some-link');
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

        const result = await eventDataProvider.fetchById(eventId);
        expect(result?.meetingLink).toEqual('some-link');
      });
    });
  });

  describe('Create and Update', () => {
    afterEach(() => {
      expect(nock.isDone()).toBe(true);
    });

    afterEach(() => {
      nock.cleanAll();
    });

    describe('Create', () => {
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
          .reply(200, getEventInput());

        await eventDataProvider.create(getUserCreateDataObject());
      });

      test('Should throw when squidex return an error', async () => {
        nock(baseUrl)
          .post(`/api/content/${appName}/events?publish=true`)
          .reply(404);

        await expect(
          eventDataProvider.create(getUserCreateDataObject()),
        ).rejects.toThrow(GenericError);
      });
    });

    describe('Update', () => {
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

        await eventDataProvider.update(eventId, {
          tags: ['kubernetes'],
          meetingLink: 'https://zweem.com',
        });
      });

      test('Should throw when squidex return an error', async () => {
        nock(baseUrl)
          .patch(`/api/content/${appName}/events/${eventId}`)
          .reply(404);

        await expect(
          eventDataProvider.update(eventId, { tags: ['kubernetes'] }),
        ).rejects.toThrow(GenericError);
      });
    });
  });
});
