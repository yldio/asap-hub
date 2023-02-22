import { gp2 } from '@asap-hub/model';
import { AuthHandler } from '@asap-hub/server-common';
import Boom from '@hapi/boom';
import supertest from 'supertest';
import { appFactory } from '../../src/app';
import {
  getListOutputResponse,
  getOutputPostRequest,
  getOutputPutRequest,
  getOutputResponse,
} from '../fixtures/output.fixtures';
import { getUserResponse } from '../fixtures/user.fixtures';
import { authHandlerMock } from '../mocks/auth-handler.mock';
import { loggerMock } from '../mocks/logger.mock';
import { outputControllerMock } from '../mocks/output-controller.mock';

describe('/outputs/ route', () => {
  const app = appFactory({
    outputController: outputControllerMock,
    authHandler: authHandlerMock,
    logger: loggerMock,
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /outputs', () => {
    test('Should return 200 when no output exists', async () => {
      outputControllerMock.fetch.mockResolvedValueOnce({
        items: [],
        total: 0,
      });

      const response = await supertest(app).get('/outputs');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should return the results correctly', async () => {
      const listOutputResponse = getListOutputResponse();

      outputControllerMock.fetch.mockResolvedValueOnce(listOutputResponse);

      const response = await supertest(app).get('/outputs');

      expect(response.body).toEqual(listOutputResponse);
    });

    test('Should call the controller with the right parameters', async () => {
      await supertest(app)
        .get('/outputs')
        .query({
          take: 15,
          skip: 5,
          search: 'something',
          filter: ['one', 'two'],
        });

      const expectedParams = {
        take: 15,
        skip: 5,
        search: 'something',
        filter: ['one', 'two'],
      };

      expect(outputControllerMock.fetch).toBeCalledWith(expectedParams);
    });

    describe('Parameter validation', () => {
      test('Should return a validation error when additional fields exist', async () => {
        const response = await supertest(app).get(`/outputs`).query({
          additionalField: 'some-data',
        });
        expect(response.status).toBe(400);
      });

      test('Should return a validation error when the arguments are not valid', async () => {
        const response = await supertest(app).get(`/outputs`).query({
          take: 'invalid param',
        });

        expect(response.status).toBe(400);
      });
    });
  });

  describe('GET /outputs/{output_id}', () => {
    test('Should return the result correctly', async () => {
      const outputResponse = getOutputResponse();

      outputControllerMock.fetchById.mockResolvedValueOnce(outputResponse);

      const response = await supertest(app).get('/outputs/123');

      expect(response.body).toEqual(outputResponse);
    });

    test('Should call the controller with the right parameter', async () => {
      const outputId = 'abc123';

      await supertest(app).get(`/outputs/${outputId}`);

      expect(outputControllerMock.fetchById).toBeCalledWith(outputId);
    });
  });

  describe('POST /outputs/', () => {
    const outputResponse = getOutputResponse();

    test('Should return a 201 when is hit', async () => {
      const createOutputRequest = getOutputPostRequest();

      outputControllerMock.create.mockResolvedValueOnce(outputResponse);

      const { app } = getApp({ role: 'Administrator' });
      const response = await supertest(app)
        .post('/outputs')
        .send(createOutputRequest)
        .set('Accept', 'application/json');

      expect(response.status).toBe(201);
      expect(outputControllerMock.create).toBeCalledWith({
        ...createOutputRequest,
        createdBy: 'user-id-0',
      });

      expect(response.body).toEqual(outputResponse);
    });

    test('Should return 403 when user is not permitted to create output', async () => {
      const output = getOutputPostRequest();

      const response = await supertest(app).post('/outputs/').send(output);
      expect(response.status).toBe(403);
    });

    test('Should return a 500 error when creating a output fails due to server error', async () => {
      const output = getOutputPostRequest();

      const { app } = getApp({ role: 'Administrator' });
      outputControllerMock.create.mockRejectedValueOnce(
        Boom.badImplementation(),
      );

      await supertest(app)
        .post('/outputs')
        .send(output)
        .set('Accept', 'application/json')
        .expect(500);
    });

    describe('Parameter validation', () => {
      const output = getOutputPostRequest();

      test('Should return a validation error when the arguments are not valid', async () => {
        const response = await supertest(app).post('/outputs/').send({
          unknown_field: 2,
        });

        expect(response.status).toBe(400);
      });

      test.each(['documentType', 'title'])(
        'Should return a validation error when %s is missing',
        async (field) => {
          const response = await supertest(app)
            .post('/outputs/')
            .send({
              ...output,
              [field]: undefined,
            });

          expect(response.status).toBe(400);
          expect(response.body).toEqual({
            data: [
              {
                instancePath: '',
                keyword: 'required',
                message: `must have required property '${field}'`,
                params: {
                  missingProperty: field,
                },
                schemaPath: '#/required',
              },
            ],
            error: 'Bad Request',
            message: 'Validation error',
            statusCode: 400,
          });
        },
      );

      describe('Authors validation', () => {
        const { ...outputPostRequest } = getOutputPostRequest();

        test('Should return a validation error when required field is missing', async () => {
          const response = await supertest(app)
            .post('/outputs')
            .send({
              ...outputPostRequest,
              authors: [{ name: 'random-value' }],
            })
            .set('Accept', 'application/json');

          expect(response.status).toBe(400);
          expect(response.body).toEqual({
            error: 'Bad Request',
            message: 'Validation error',
            statusCode: 400,
            data: [
              ...['userId', 'externalAuthorId', 'externalAuthorName'].map(
                (field, idx) => ({
                  instancePath: '/authors/0',
                  schemaPath: `#/properties/authors/items/oneOf/${idx}/required`,
                  keyword: 'required',
                  params: {
                    missingProperty: field,
                  },
                  message: `must have required property '${field}'`,
                }),
              ),
              {
                instancePath: '/authors/0',
                keyword: 'oneOf',
                message: 'must match exactly one schema in oneOf',
                params: {
                  passingSchemas: null,
                },
                schemaPath: '#/properties/authors/items/oneOf',
              },
            ],
          });
        });
        test('Should return a validation error when passing invalid schema (userId, externalAuthorId, externalAuthorName)', async () => {
          const response = await supertest(app)
            .post('/outputs')
            .send({
              ...outputPostRequest,
              authors: [
                {
                  userId: 'userId-1',
                  externalAuthorId: 'external-id-1',
                  externalAuthorName: 'author-name-1',
                },
              ],
            })
            .set('Accept', 'application/json');

          expect(response.status).toBe(400);
          expect(response.body.message).toEqual('Validation error');
          expect(response.body.data).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                message: 'must match exactly one schema in oneOf',
              }),
            ]),
          );
        });
        test('Should return a validation error when passing invalid schema (userId, externalAuthorId)', async () => {
          const response = await supertest(app)
            .post('/outputs')
            .send({
              ...outputPostRequest,
              authors: [
                {
                  userId: 'userId-1',
                  externalAuthorId: 'external-id-1',
                },
              ],
            })
            .set('Accept', 'application/json');

          expect(response.status).toBe(400);
          expect(response.body.message).toEqual('Validation error');
          expect(response.body.data).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                message: 'must match exactly one schema in oneOf',
              }),
            ]),
          );
        });
        test('Should return a validation error when passing invalid schema (userId, externalAuthorName)', async () => {
          const response = await supertest(app)
            .post('/outputs')
            .send({
              ...outputPostRequest,
              authors: [
                {
                  userId: 'userId-1',
                  externalAuthorName: 'author-name-1',
                },
              ],
            })
            .set('Accept', 'application/json');

          expect(response.status).toBe(400);
          expect(response.body.message).toEqual('Validation error');
          expect(response.body.data).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                message: 'must match exactly one schema in oneOf',
              }),
            ]),
          );
        });
      });
    });
  });

  describe('PUT /outputs/', () => {
    const outputResponse = getOutputResponse();
    const outputPutRequest = getOutputPutRequest();

    test('Should send the data to the controller and return status 200 along with all the output data', async () => {
      outputControllerMock.update.mockResolvedValueOnce(outputResponse);

      const { app } = getApp({ role: 'Administrator' });
      const response = await supertest(app)
        .put('/outputs/abc123')
        .send(outputPutRequest)
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(outputControllerMock.update).toBeCalledWith('abc123', {
        ...outputPutRequest,
        updatedBy: 'user-id-0',
      });
      expect(response.body).toEqual(outputResponse);
    });

    test('Should return 403 when user is not permitted to update output', async () => {
      const response = await supertest(app)
        .put('/outputs/abc123')
        .send(outputPutRequest);
      expect(response.status).toBe(403);
    });

    describe('Parameter validation', () => {
      test('Should return a validation error when the arguments are not valid', async () => {
        const response = await supertest(app)
          .put('/outputs/abc123')
          .send({
            ...outputPutRequest,
            unknown_field: 2,
          });

        expect(response.status).toBe(400);
      });

      test.each(['documentType', 'title'])(
        'Should return a validation error when %s is missing',
        async (field) => {
          const response = await supertest(app)
            .put('/outputs/abc123')
            .send({
              ...outputPutRequest,
              [field]: undefined,
            });

          expect(response.status).toBe(400);
          expect(response.body).toEqual({
            data: [
              {
                instancePath: '',
                keyword: 'required',
                message: `must have required property '${field}'`,
                params: {
                  missingProperty: field,
                },
                schemaPath: '#/required',
              },
            ],
            error: 'Bad Request',
            message: 'Validation error',
            statusCode: 400,
          });
        },
      );

      describe('Authors validation', () => {
        test('Should return a validation error when required field is missing', async () => {
          const response = await supertest(app)
            .put('/outputs/abc123')
            .send({
              ...outputPutRequest,
              authors: [{ name: 'random-value' }],
            })
            .set('Accept', 'application/json');

          expect(response.status).toBe(400);
          expect(response.body).toEqual({
            error: 'Bad Request',
            message: 'Validation error',
            statusCode: 400,
            data: [
              ...['userId', 'externalAuthorId', 'externalAuthorName'].map(
                (field, idx) => ({
                  instancePath: '/authors/0',
                  schemaPath: `#/properties/authors/items/oneOf/${idx}/required`,
                  keyword: 'required',
                  params: {
                    missingProperty: field,
                  },
                  message: `must have required property '${field}'`,
                }),
              ),
              {
                instancePath: '/authors/0',
                keyword: 'oneOf',
                message: 'must match exactly one schema in oneOf',
                params: {
                  passingSchemas: null,
                },
                schemaPath: '#/properties/authors/items/oneOf',
              },
            ],
          });
        });

        test('Should return a validation error when passing invalid schema (userId, externalAuthorId, externalAuthorName)', async () => {
          const response = await supertest(app)
            .put('/outputs/abc123')
            .send({
              ...outputPutRequest,
              authors: [
                {
                  userId: 'userId-1',
                  externalAuthorId: 'external-id-1',
                  externalAuthorName: 'author-name-1',
                },
              ],
            })
            .set('Accept', 'application/json');

          expect(response.status).toBe(400);
          expect(response.body.message).toEqual('Validation error');
          expect(response.body.data).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                message: 'must match exactly one schema in oneOf',
              }),
            ]),
          );
        });

        test('Should return a validation error when passing invalid schema (userId, externalAuthorId)', async () => {
          const response = await supertest(app)
            .put('/outputs/abc123')
            .send({
              ...outputPutRequest,
              authors: [
                {
                  userId: 'userId-1',
                  externalAuthorId: 'external-id-1',
                },
              ],
            })
            .set('Accept', 'application/json');

          expect(response.status).toBe(400);
          expect(response.body.message).toEqual('Validation error');
          expect(response.body.data).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                message: 'must match exactly one schema in oneOf',
              }),
            ]),
          );
        });

        test('Should return a validation error when passing invalid schema (userId, externalAuthorName)', async () => {
          const response = await supertest(app)
            .put('/outputs/abc123')
            .send({
              ...outputPutRequest,
              authors: [
                {
                  userId: 'userId-1',
                  externalAuthorName: 'author-name-1',
                },
              ],
            })
            .set('Accept', 'application/json');

          expect(response.status).toBe(400);
          expect(response.body.message).toEqual('Validation error');
          expect(response.body.data).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                message: 'must match exactly one schema in oneOf',
              }),
            ]),
          );
        });
      });
    });
  });
});

const getApp = ({ role }: { role?: gp2.UserResponse['role'] } = {}) => {
  const loggedInUserId = 'user-id-0';
  const loggedUser: gp2.UserResponse = {
    ...getUserResponse(),
    id: loggedInUserId,
    ...(role && { role }),
  };
  const getLoggedUser = jest.fn().mockReturnValue(loggedUser);
  const authHandlerMock: AuthHandler = (req, _res, next) => {
    req.loggedInUser = getLoggedUser();
    next();
  };
  const app = appFactory({
    outputController: outputControllerMock,
    authHandler: authHandlerMock,
    logger: loggerMock,
  });
  return { app, loggedInUserId };
};
