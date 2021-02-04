import Boom from '@hapi/boom';
import supertest from 'supertest';
import { appFactory } from '../../src/app';
import { authHandlerMock } from '../mocks/auth-handler.mock';
import { pageControllerMock } from '../mocks/page-controller.mock';
import { PageResponse } from '@asap-hub/model';

describe('/pages/ route', () => {
  const app = appFactory({
    authHandler: authHandlerMock,
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
      const pageResponse: PageResponse = {
        id: 'some-id',
        path: '/privacy-policy',
        shortText: 'short text',
        text: '<h1>Privacy Policy</h1>',
        title: 'Privacy Policy',
        link: 'link',
        linkText: 'linkText',
      };
      pageControllerMock.fetchByPath.mockResolvedValueOnce(pageResponse);

      const response = await supertest(app).get('/pages/some-other-page');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(pageResponse);
    });

    test('Should call the controller with the right parameter', async () => {
      const path = 'some-path';

      await supertest(app).get(`/pages/${path}`);

      expect(pageControllerMock.fetchByPath).toBeCalledWith(path);
    });
  });
});
