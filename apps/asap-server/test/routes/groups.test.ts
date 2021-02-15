import supertest from 'supertest';
import Boom from '@hapi/boom';
import { appFactory } from '../../src/app';
import { FetchOptions } from '../../src/utils/types';
import * as fixtures from '../fixtures/groups.fixtures';
import { authHandlerMock } from '../mocks/auth-handler.mock';
import { groupControllerMock } from '../mocks/group-controller.mock';
import { eventControllerMock } from '../mocks/event-controller.mock';
import { ListEventResponse } from '@asap-hub/model';
import { FetchEventsOptions } from '../../src/controllers/events';

describe('/groups/ route', () => {
  const app = appFactory({
    eventController: eventControllerMock,
    groupController: groupControllerMock,
    authHandler: authHandlerMock,
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /groups', () => {
    test('Should return 200 when no grups exist', async () => {
      groupControllerMock.fetch.mockResolvedValueOnce({
        items: [],
        total: 0,
      });

      const response = await supertest(app).get('/groups/');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should return the results correctly', async () => {
      groupControllerMock.fetch.mockResolvedValueOnce(
        fixtures.queryGroupsExpectation,
      );

      const response = await supertest(app).get('/groups/');

      expect(response.body).toEqual(fixtures.queryGroupsExpectation);
    });

    test('Should call the controller with the right parameters', async () => {
      groupControllerMock.fetch.mockResolvedValueOnce({
        items: [],
        total: 0,
      });

      await supertest(app).get('/groups/').query({
        take: 15,
        skip: 5,
        search: 'something',
      });

      const expectedParams: FetchOptions = {
        take: 15,
        skip: 5,
        search: 'something',
      };

      expect(groupControllerMock.fetch).toBeCalledWith(expectedParams);
    });

    describe('Parameter validation', () => {
      test('Should return a validation error when the arguments are not valid', async () => {
        const response = await supertest(app).get('/groups/').query({
          take: 'invalid param',
        });

        expect(response.status).toBe(400);
      });
    });
  });

  describe('GET /groups/{groupId}', () => {
    test('Should return 404 when no group exist', async () => {
      groupControllerMock.fetchById.mockRejectedValueOnce(Boom.notFound());

      const response = await supertest(app).get('/groups/123');

      expect(response.status).toBe(404);
    });

    test('Should return the results correctly', async () => {
      groupControllerMock.fetchById.mockResolvedValueOnce(
        fixtures.findGroupExpectation,
      );

      const response = await supertest(app).get('/groups/123');

      expect(response.body).toEqual(fixtures.findGroupExpectation);
    });
  });

  describe('GET /groups/{groupId}/events', () => {
    const groupId = 'some-group-id';
    const query = { after: '2021-02-08T14:13:37.138Z' };

    test('Should return 404 when no group exist', async () => {
      eventControllerMock.fetch.mockRejectedValueOnce(Boom.notFound());

      const response = await supertest(app)
        .get(`/groups/${groupId}/events`)
        .query(query);

      expect(response.status).toBe(404);
    });

    test('Should return 200 when no events exist', async () => {
      eventControllerMock.fetch.mockResolvedValueOnce({
        total: 0,
        items: [],
      });
      const response = await supertest(app)
        .get(`/groups/${groupId}/events`)
        .query(query);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should return results correctly', async () => {
      const listEventResponse: ListEventResponse = {
        total: 1,
        items: [
          {
            id: 'event-id-1',
            title: 'example event title',
            startDate: '2020-12-11T14:33:50Z',
            endDate: '2020-12-11T14:33:50Z',
            calendar: {
              id: 'calendar-id-1',
              name: 'Example calendar',
              color: '#333333',
            },
            groups: [],
            meetingLink: 'https://sample.event.link/123456',
            lastModifiedDate: '2020-12-11T14:33:50Z',
          },
        ],
      };

      eventControllerMock.fetch.mockResolvedValueOnce(listEventResponse);
      const response = await supertest(app)
        .get(`/groups/${groupId}/events`)
        .query(query);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(listEventResponse);
    });

    test('Should call the controller method with the correct parameters', async () => {
      eventControllerMock.fetch.mockResolvedValueOnce({
        items: [],
        total: 0,
      });

      await supertest(app).get(`/groups/${groupId}/events`).query({
        take: 15,
        skip: 5,
        before: '2021-02-08T14:29:59.895Z',
        after: '2021-02-08T14:13:37.138Z',
      });

      const expectedParams: FetchEventsOptions = {
        take: 15,
        skip: 5,
        before: '2021-02-08T14:29:59.895Z',
        after: '2021-02-08T14:13:37.138Z',
        groupId,
      };

      expect(eventControllerMock.fetch).toBeCalledWith(expectedParams);
    });

    describe('Parameter validation', () => {
      test('Should return a validation error when both before and after are missing', async () => {
        const response = await supertest(app)
          .get(`/groups/${groupId}/events`)
          .query({
            take: '10',
          });
        expect(response.status).toBe(400);
      });

      test('Should return a validation error when before parameter is present but empty', async () => {
        const response = await supertest(app)
          .get(`/groups/${groupId}/events`)
          .query({
            before: '',
          });
        expect(response.status).toBe(400);
      });

      test('Should return a validation error when before parameter is invalid', async () => {
        const response = await supertest(app)
          .get(`/groups/${groupId}/events`)
          .query({
            before: 'not-a-date',
          });
        expect(response.status).toBe(400);
      });

      test('Should return a validation error when after parameter is present but empty', async () => {
        const response = await supertest(app)
          .get(`/groups/${groupId}/events`)
          .query({
            after: '',
          });
        expect(response.status).toBe(400);
      });

      test('Should return a validation error when after parameter is invalid', async () => {
        const response = await supertest(app)
          .get(`/groups/${groupId}/events`)
          .query({
            after: 'not-a-date',
          });
        expect(response.status).toBe(400);
      });

      test('Should return a validation error when skip parameter is invalid', async () => {
        const response = await supertest(app)
          .get(`/groups/${groupId}/events`)
          .query({
            before: '2021-02-08T14:13:37.138Z',
            skip: 'invalid-parameter',
          });
        expect(response.status).toBe(400);
      });

      test('Should return a validation error when take parameter is invalid', async () => {
        const response = await supertest(app)
          .get(`/groups/${groupId}/events`)
          .query({
            before: '2021-02-08T14:13:37.138Z',
            take: 'invalid-parameter',
          });
        expect(response.status).toBe(400);
      });
    });
  });
});
