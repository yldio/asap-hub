import supertest from 'supertest';
import { appFactory } from '../../src/app';

jest.mock('../../src/utils/validate-token');

describe('/events/ routes', () => {
  const app = appFactory();

  describe('GET /events', () => {
    test('Should fetch an event list', async () => {
      const response = await supertest(app).get('/events/').set("Authorization", "bearer token");;

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        response: 'OK',
      });
    });

    test('Should post an event', async () => {
      const response = await supertest(app).post('/events/').set("Authorization", "bearer token");;

      expect(response.status).toBe(201);
    });

    test('Should return 404 when the route is not found', async () => {
      const response = await supertest(app).get('/events/foo').set("Authorization", "bearer token");;

      expect(response.status).toBe(404);
    });
  });
});
