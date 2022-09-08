import { ListCalendarResponse } from '@asap-hub/model';
import supertest from 'supertest';
import { appFactory } from '../../src/app';
import { authHandlerMock } from '../mocks/auth-handler.mock';
import { calendarControllerMock } from '../mocks/calendar-controller.mock';
import { httpLoggerMock, loggerMock } from '../mocks/logger.mock';

describe('/calendars/ route', () => {
  const app = appFactory({
    calendarController: calendarControllerMock,
    authHandler: authHandlerMock,
    logger: loggerMock,
    httpLogger: httpLoggerMock,
  });

  describe('GET /calendars', () => {
    test('Should return 200 when no calendars are found', async () => {
      calendarControllerMock.fetch.mockResolvedValueOnce({
        total: 0,
        items: [],
      });

      const response = await supertest(app).get('/calendars');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ total: 0, items: [] });
    });

    test('Should return the results correctly', async () => {
      calendarControllerMock.fetch.mockResolvedValueOnce(listCalendarResponse);

      const response = await supertest(app).get('/calendars');

      expect(response.body).toEqual(listCalendarResponse);
    });

    test('Should call the controller with the right parameters', async () => {
      calendarControllerMock.fetch.mockResolvedValueOnce({
        items: [],
        total: 0,
      });

      await supertest(app).get('/calendars/').query({
        take: 15,
        skip: 5,
      });

      const expectedParams = {
        take: 15,
        skip: 5,
      };
      expect(calendarControllerMock.fetch).toBeCalledWith(expectedParams);
    });

    describe('Parameter validation', () => {
      test('needs take and skip', async () => {
        const response = await supertest(app).get('/calendars/').query({
          take: 0,
          skip: 0,
        });

        expect(response.status).toBe(200);
      });
      test('should not include additional parameters', async () => {
        const response = await supertest(app).get('/calendars/').query({
          take: 0,
          skip: 0,
          additionalParameter: 'some-data',
        });

        expect(response.status).toBe(400);
      });
      test('Should return a validation error when the arguments are not valid', async () => {
        const response = await supertest(app).get('/calendars/').query({
          take: 'invalid param',
        });

        expect(response.status).toBe(400);
      });
    });
  });
});

const listCalendarResponse: ListCalendarResponse = {
  total: 2,
  items: [
    {
      id: 'calendar-id-1',
      color: '#5C1158',
      name: 'Kubernetes Meetups',
    },
    {
      id: 'calendar-id-2',
      color: '#B1365F',
      name: 'Service Mesh Conferences',
    },
  ],
};
