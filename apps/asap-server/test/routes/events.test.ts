import supertest from 'supertest';
import { appFactory } from '../../src/app';

describe('/events/ routes', () => {
  const app = appFactory();

  describe('GET /events', () => {
    test('Should fetch an event list', async () => {
      const response = await supertest(app).get('/events/');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        response: 'OK',
      });
    });

    test('Should post an event', async () => {
      const response = await supertest(app).post('/events/');

      expect(response.status).toBe(201);
    });

    test('Should return 404 when the route is not found', async () => {
      const response = await supertest(app).get('/events/foo');

      expect(response.status).toBe(404);
    });
  });
});
