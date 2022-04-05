import Boom from '@hapi/boom';
import supertest from 'supertest';
import { appFactory } from '../../src/app';
import { getExternalAuthor } from '../fixtures/external-authors.fixtures';
import { authHandlerMock } from '../mocks/auth-handler.mock';
import { externalAuthorControllerMock } from '../mocks/external-author-controller.mock';

describe('/external-authors/ route', () => {
  const app = appFactory({
    externalAuthorsController: externalAuthorControllerMock,
    authHandler: authHandlerMock,
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('POST /external-authors/', () => {
    test('Should return a 201 when is hit', async () => {
      const createExternalAuthorRequest = getExternalAuthor();

      externalAuthorControllerMock.create.mockResolvedValueOnce({
        id: '1234',
      });

      const response = await supertest(app)
        .post('/external-authors')
        .send(getExternalAuthor())
        .set('Accept', 'application/json');

      expect(response.status).toBe(201);
      expect(externalAuthorControllerMock.create).toBeCalledWith(
        createExternalAuthorRequest,
      );

      expect(response.body).toEqual(expect.objectContaining({ id: '1234' }));
    });

    test('Should return a 400 error when creating an external author fails due to validation error', async () => {
      externalAuthorControllerMock.create.mockRejectedValueOnce(
        Boom.badRequest(),
      );

      const response = await supertest(app)
        .post('/external-authors')
        .send({ name: 123 })
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(JSON.parse(response.text).error).toBe('Bad Request');
    });
    test('Should return a 500 error when creating an external author fails due to server error', async () => {
      const createExternalAuthorRequest = getExternalAuthor();
      externalAuthorControllerMock.create.mockRejectedValueOnce(
        Boom.badImplementation(),
      );

      await supertest(app)
        .post('/external-authors')
        .send(createExternalAuthorRequest)
        .set('Accept', 'application/json')
        .expect(500);
    });
  });
});
