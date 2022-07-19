import supertest from 'supertest';
import { appFactory } from '../../src/app';
import { getListResearchTagResponse } from '../fixtures/research-tag.fixtures';
import { authHandlerMock } from '../mocks/auth-handler.mock';
import { researchTagControllerMock } from '../mocks/research-tags-controller.mock';

describe('/research-tags/ route', () => {
  const app = appFactory({
    authHandler: authHandlerMock,
    researchTagController: researchTagControllerMock,
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /research-tags', () => {
    test('Should return 200 when no research tags exist', async () => {
      researchTagControllerMock.fetch.mockResolvedValueOnce({
        items: [],
        total: 0,
      });

      const response = await supertest(app).get('/research-tags');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should return the results correctly', async () => {
      const listResearchTagResponse = getListResearchTagResponse();

      researchTagControllerMock.fetch.mockResolvedValueOnce(
        listResearchTagResponse,
      );

      const response = await supertest(app).get('/research-tags');

      expect(response.body).toEqual(listResearchTagResponse);
    });

    test('Should call the controller with the right parameters', async () => {
      await supertest(app)
        .get('/research-tags')
        .query({
          take: 15,
          skip: 5,
          filter: {
            entity: 'Research Output',
            type: 'Software',
          },
        });

      const expectedParams = {
        take: 15,
        skip: 5,
        filter: {
          entity: 'Research Output',
          type: 'Software',
        },
      };

      expect(researchTagControllerMock.fetch).toBeCalledWith(expectedParams);
    });

    describe('Parameter validation', () => {
      test('Should return a validation error when additional fields exist', async () => {
        const response = await supertest(app)
          .get('/research-tags')
          .query({
            filter: {
              something: 'Research Output',
            },
          });

        expect(response.status).toBe(400);
      });

      test('Should return a validation error when an invalid entity is given', async () => {
        const response = await supertest(app)
          .get('/research-tags')
          .query({
            filter: {
              entity: 'some-invalid-entity',
            },
          });

        expect(response.status).toBe(400);
      });

      test('Should return a validation error when the arguments are not valid', async () => {
        const response = await supertest(app).get('/research-tags').query({
          take: 'invalid param',
        });

        expect(response.status).toBe(400);
      });
    });
  });
});
