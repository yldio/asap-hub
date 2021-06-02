import Boom from '@hapi/boom';
import supertest from 'supertest';
import { appFactory } from '../../src/app';
import { pageControllerMock } from '../mocks/page-controller.mock';
import { pageResponse } from '../fixtures/page.fixtures';

describe('/pages/ route', () => {
  const app = appFactory({
    pageController: pageControllerMock,
  });

  afterEach(() => {
    pageControllerMock.fetchByPath.mockReset();
  });

  describe('GET /pages/{path}', () => {
    test('Should return a 404 error when the page is not found', async () => {
      pageControllerMock.fetchByPath.mockRejectedValueOnce(Boom.notFound());

      const response = await supertest(app).get('/pages/some-page');

      expect(response.status).toBe(404);
    });

    test('Should return the result correctly', async () => {
      pageControllerMock.fetchByPath.mockResolvedValueOnce(pageResponse);

      const response = await supertest(app).get('/pages/some-other-page');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(pageResponse);
    });

    test('Should call the controller with the right parameter', async () => {
      const path = 'some-path';

      await supertest(app).get(`/pages/${path}`);

      expect(pageControllerMock.fetchByPath).toBeCalledWith(`/${path}`);
    });
  });
});
