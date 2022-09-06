import Boom from '@hapi/boom';
import supertest from 'supertest';
import { appFactory } from '../../src/app';
import {
  getListResearchOutputResponse,
  getResearchOutputPostRequest,
  getResearchOutputPutRequest,
  getResearchOutputResponse,
} from '../fixtures/research-output.fixtures';
import { authHandlerMock } from '../mocks/auth-handler.mock';
import { loggerMock } from '../mocks/logger.mock';
import { researchOutputControllerMock } from '../mocks/research-outputs-controller.mock';

describe('/research-outputs/ route', () => {
  const app = appFactory({
    researchOutputController: researchOutputControllerMock,
    authHandler: authHandlerMock,
    logger: loggerMock,
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /research-outputs', () => {
    test('Should return 200 when no research output exists', async () => {
      researchOutputControllerMock.fetch.mockResolvedValueOnce({
        items: [],
        total: 0,
      });

      const response = await supertest(app).get('/research-outputs');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should return the results correctly', async () => {
      const listResearchOutputResponse = getListResearchOutputResponse();

      researchOutputControllerMock.fetch.mockResolvedValueOnce(
        listResearchOutputResponse,
      );

      const response = await supertest(app).get('/research-outputs');

      expect(response.body).toEqual(listResearchOutputResponse);
    });

    test('Should call the controller with the right parameters', async () => {
      await supertest(app)
        .get('/research-outputs')
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

      expect(researchOutputControllerMock.fetch).toBeCalledWith(expectedParams);
    });

    describe('Parameter validation', () => {
      test('Should return a validation error when additional fields exist', async () => {
        const response = await supertest(app).get(`/research-outputs`).query({
          additionalField: 'some-data',
        });
        expect(response.status).toBe(400);
      });

      test('Should return a validation error when the arguments are not valid', async () => {
        const response = await supertest(app).get(`/research-outputs`).query({
          take: 'invalid param',
        });

        expect(response.status).toBe(400);
      });
    });
  });

  describe('GET /research-outputs/{research_output_id}', () => {
    test('Should return a 404 error when the team or members are not found', async () => {
      researchOutputControllerMock.fetchById.mockRejectedValueOnce(
        Boom.notFound(),
      );

      const response = await supertest(app).get('/research-outputs/123');

      expect(response.status).toBe(404);
    });

    test('Should return the result correctly', async () => {
      const researchOutputResponse = getResearchOutputResponse();

      researchOutputControllerMock.fetchById.mockResolvedValueOnce(
        researchOutputResponse,
      );

      const response = await supertest(app).get('/research-outputs/123');

      expect(response.body).toEqual(researchOutputResponse);
    });

    test('Should call the controller with the right parameter', async () => {
      const researchOutputId = 'abc123';

      await supertest(app).get(`/research-outputs/${researchOutputId}`);

      expect(researchOutputControllerMock.fetchById).toBeCalledWith(
        researchOutputId,
      );
    });
  });

  describe('POST /research-outputs/', () => {
    const researchOutputResponse = getResearchOutputResponse();

    test('Should return a 201 when is hit', async () => {
      const createResearchOutputRequest = {
        ...getResearchOutputPostRequest(),
      };

      researchOutputControllerMock.create.mockResolvedValueOnce(
        researchOutputResponse,
      );

      const response = await supertest(app)
        .post('/research-outputs')
        .send(createResearchOutputRequest)
        .set('Accept', 'application/json');

      expect(response.status).toBe(201);
      expect(researchOutputControllerMock.create).toBeCalledWith({
        ...createResearchOutputRequest,
        createdBy: 'user-id-0',
      });

      expect(response.body).toEqual(researchOutputResponse);
    });

    test('Should return 403 when user is not permitted to create research output', async () => {
      const researchOutput = getResearchOutputPostRequest();
      const response = await supertest(app)
        .post('/research-outputs/')
        .send({
          ...researchOutput,
          teams: ['team-id-that-does-not-belong-to-user'],
        });
      expect(response.status).toBe(403);
    });

    test('Should return a 500 error when creating a research output fails due to server error', async () => {
      const researchOutput = getResearchOutputPostRequest();
      researchOutputControllerMock.create.mockRejectedValueOnce(
        Boom.badImplementation(),
      );

      await supertest(app)
        .post('/research-outputs')
        .send({ ...researchOutput })
        .set('Accept', 'application/json')
        .expect(500);
    });

    describe('Parameter validation', () => {
      const {
        rrid: _rrid,
        doi: _doi,
        accession: _accession,
        ...researchOutput
      } = getResearchOutputPostRequest();

      test('Should return a validation error when the arguments are not valid', async () => {
        const response = await supertest(app).post('/research-outputs/').send({
          unknown_field: 2,
        });

        expect(response.status).toBe(400);
      });

      const validDOI = { doi: 'doi:12.1234' };
      const validRRID = { rrid: 'RRID:Hi' };
      const validAccession = { accession: 'NP_1234' };
      const noIdentifier = {};
      test.each`
        documentType        | identifier        | status
        ${'Article'}        | ${validDOI}       | ${201}
        ${'Article'}        | ${validRRID}      | ${400}
        ${'Article'}        | ${validAccession} | ${400}
        ${'Article'}        | ${noIdentifier}   | ${201}
        ${'Bioinformatics'} | ${validDOI}       | ${201}
        ${'Bioinformatics'} | ${validRRID}      | ${201}
        ${'Bioinformatics'} | ${validAccession} | ${400}
        ${'Bioinformatics'} | ${noIdentifier}   | ${201}
        ${'Lab Resource'}   | ${validDOI}       | ${201}
        ${'Lab Resource'}   | ${validRRID}      | ${201}
        ${'Lab Resource'}   | ${validAccession} | ${400}
        ${'Lab Resource'}   | ${noIdentifier}   | ${201}
        ${'Dataset'}        | ${validDOI}       | ${201}
        ${'Dataset'}        | ${validRRID}      | ${400}
        ${'Dataset'}        | ${validAccession} | ${201}
        ${'Dataset'}        | ${noIdentifier}   | ${201}
        ${'Protocol'}       | ${validDOI}       | ${201}
        ${'Protocol'}       | ${validRRID}      | ${400}
        ${'Protocol'}       | ${validAccession} | ${400}
        ${'Protocol'}       | ${noIdentifier}   | ${201}
        ${'Grant Document'} | ${validDOI}       | ${400}
        ${'Grant Document'} | ${validRRID}      | ${400}
        ${'Grant Document'} | ${validAccession} | ${400}
        ${'Grant Document'} | ${noIdentifier}   | ${201}
        ${'Presentation'}   | ${validDOI}       | ${400}
        ${'Presentation'}   | ${validRRID}      | ${400}
        ${'Presentation'}   | ${validAccession} | ${400}
        ${'Presentation'}   | ${noIdentifier}   | ${201}
      `(
        'on type $type returns status $status for $identifier',
        async ({ documentType, identifier, status }) => {
          const response = await supertest(app)
            .post('/research-outputs/')
            .send({
              ...researchOutput,
              documentType,
              ...identifier,
            });
          expect(response.status).toBe(status);
        },
      );

      test('Do not require an identifier if funded and used in publication', async () => {
        const response = await supertest(app)
          .post('/research-outputs/')
          .send({
            ...researchOutput,
            asapFunded: true,
            usedInPublication: true,
          });

        expect(response.status).toBe(201);
      });

      test('Accepts doi based on the regex', async () => {
        const response = await supertest(app)
          .post('/research-outputs/')
          .send({
            ...researchOutput,
            documentType: 'Article',
            ...validDOI,
          });
        expect(response.status).toBe(201);
      });

      test('Rejects doi based on the regex', async () => {
        const response = await supertest(app)
          .post('/research-outputs/')
          .send({
            ...researchOutput,
            documentType: 'Article',
            doi: 'doi:1.222',
          });
        expect(response.status).toBe(400);
      });

      test('Accepts accession based on the regex', async () => {
        const response = await supertest(app)
          .post('/research-outputs/')
          .send({
            ...researchOutput,
            documentType: 'Dataset',
            ...validAccession,
          });
        expect(response.status).toBe(201);
      });

      test('Rejects accession based on the regex', async () => {
        const response = await supertest(app)
          .post('/research-outputs/')
          .send({
            ...researchOutput,
            documentType: 'Dataset',
            accession: 'NP_HELLO_WORLD',
          });
        expect(response.status).toBe(400);
      });

      test('Accepts rrid based on the regex', async () => {
        const response = await supertest(app)
          .post('/research-outputs/')
          .send({
            ...researchOutput,
            documentType: 'Bioinformatics',
            ...validRRID,
          });
        expect(response.status).toBe(201);
      });

      test('Rejects rrid based on the regex', async () => {
        const response = await supertest(app)
          .post('/research-outputs/')
          .send({
            ...researchOutput,
            documentType: 'Bioinformatics',
            rrid: 'HelloWorld',
          });
        expect(response.status).toBe(400);
      });

      test.each([
        'documentType',
        'description',
        'tags',
        'title',
        'sharingStatus',
        'teams',
      ])(
        'Should return a validation error when %s is missing',
        async (field) => {
          const response = await supertest(app)
            .post('/research-outputs/')
            .send({
              ...researchOutput,
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
            .post('/research-outputs')
            .send({
              ...getResearchOutputPostRequest(),
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
            .post('/research-outputs')
            .send({
              ...getResearchOutputPostRequest(),
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
            .post('/research-outputs')
            .send({
              ...getResearchOutputPostRequest(),
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
            .post('/research-outputs')
            .send({
              ...getResearchOutputPostRequest(),
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

  describe('PUT /research-outputs/', () => {
    const researchOutputResponse = getResearchOutputResponse();
    const {
      rrid: _rrid,
      doi: _doi,
      accession: _accession,
      ...researchOutputPutRequest
    } = getResearchOutputPutRequest();

    test('Should send the data to the controller and return status 200 along with all the research output data', async () => {
      researchOutputControllerMock.update.mockResolvedValueOnce(
        researchOutputResponse,
      );

      const response = await supertest(app)
        .put('/research-outputs/abc123')
        .send(researchOutputPutRequest)
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(researchOutputControllerMock.update).toBeCalledWith('abc123', {
        ...researchOutputPutRequest,
        updatedBy: 'user-id-0',
      });
      expect(response.body).toEqual(researchOutputResponse);
    });

    test('Should return 403 when user is not permitted to update research output', async () => {
      const response = await supertest(app)
        .put('/research-outputs/abc123')
        .send({
          ...researchOutputPutRequest,
          teams: ['team-id-that-does-not-belong-to-user'],
        });
      expect(response.status).toBe(403);
    });

    describe('Parameter validation', () => {
      test('Should return a validation error when the arguments are not valid', async () => {
        const response = await supertest(app)
          .put('/research-outputs/abc123')
          .send({
            ...researchOutputPutRequest,
            unknown_field: 2,
          });

        expect(response.status).toBe(400);
      });

      const validDOI = { doi: 'doi:12.1234' };
      const validRRID = { rrid: 'RRID:Hi' };
      const validAccession = { accession: 'NP_1234' };
      const noIdentifier = {};
      test.each`
        documentType        | identifier        | status
        ${'Article'}        | ${validDOI}       | ${200}
        ${'Article'}        | ${validRRID}      | ${400}
        ${'Article'}        | ${validAccession} | ${400}
        ${'Article'}        | ${noIdentifier}   | ${200}
        ${'Bioinformatics'} | ${validDOI}       | ${200}
        ${'Bioinformatics'} | ${validRRID}      | ${200}
        ${'Bioinformatics'} | ${validAccession} | ${400}
        ${'Bioinformatics'} | ${noIdentifier}   | ${200}
        ${'Lab Resource'}   | ${validDOI}       | ${200}
        ${'Lab Resource'}   | ${validRRID}      | ${200}
        ${'Lab Resource'}   | ${validAccession} | ${400}
        ${'Lab Resource'}   | ${noIdentifier}   | ${200}
        ${'Dataset'}        | ${validDOI}       | ${200}
        ${'Dataset'}        | ${validRRID}      | ${400}
        ${'Dataset'}        | ${validAccession} | ${200}
        ${'Dataset'}        | ${noIdentifier}   | ${200}
        ${'Protocol'}       | ${validDOI}       | ${200}
        ${'Protocol'}       | ${validRRID}      | ${400}
        ${'Protocol'}       | ${validAccession} | ${400}
        ${'Protocol'}       | ${noIdentifier}   | ${200}
        ${'Grant Document'} | ${validDOI}       | ${400}
        ${'Grant Document'} | ${validRRID}      | ${400}
        ${'Grant Document'} | ${validAccession} | ${400}
        ${'Grant Document'} | ${noIdentifier}   | ${200}
        ${'Presentation'}   | ${validDOI}       | ${400}
        ${'Presentation'}   | ${validRRID}      | ${400}
        ${'Presentation'}   | ${validAccession} | ${400}
        ${'Presentation'}   | ${noIdentifier}   | ${200}
      `(
        'on type $type returns status $status for $identifier',
        async ({ documentType, identifier, status }) => {
          const response = await supertest(app)
            .put('/research-outputs/abc123')
            .send({
              ...researchOutputPutRequest,
              documentType,
              ...identifier,
            });
          expect(response.status).toBe(status);
        },
      );

      test('Do not require an identifier if funded and used in publication', async () => {
        const response = await supertest(app)
          .put('/research-outputs/abc123')
          .send({
            ...researchOutputPutRequest,
            asapFunded: true,
            usedInPublication: true,
          });
        expect(response.status).toBe(200);
      });

      test('Accepts doi based on the regex', async () => {
        const response = await supertest(app)
          .put('/research-outputs/abc123')
          .send({
            ...researchOutputPutRequest,
            documentType: 'Article',
            ...validDOI,
          });
        expect(response.status).toBe(200);
      });

      test('Rejects doi based on the regex', async () => {
        const response = await supertest(app)
          .put('/research-outputs/abc123')
          .send({
            ...researchOutputPutRequest,
            documentType: 'Article',
            doi: 'doi:1.222',
          });
        expect(response.status).toBe(400);
      });

      test('Accepts accession based on the regex', async () => {
        const response = await supertest(app)
          .put('/research-outputs/abc123')
          .send({
            ...researchOutputPutRequest,
            documentType: 'Dataset',
            ...validAccession,
          });
        expect(response.status).toBe(200);
      });

      test('Rejects accession based on the regex', async () => {
        const response = await supertest(app)
          .put('/research-outputs/abc123')
          .send({
            ...researchOutputPutRequest,
            documentType: 'Dataset',
            accession: 'NP_HELLO_WORLD',
          });
        expect(response.status).toBe(400);
      });

      test('Accepts rrid based on the regex', async () => {
        const response = await supertest(app)
          .put('/research-outputs/abc123')
          .send({
            ...researchOutputPutRequest,
            documentType: 'Bioinformatics',
            ...validRRID,
          });
        expect(response.status).toBe(200);
      });

      test('Rejects rrid based on the regex', async () => {
        const response = await supertest(app)
          .put('/research-outputs/abc123')
          .send({
            ...researchOutputPutRequest,
            documentType: 'Bioinformatics',
            rrid: 'HelloWorld',
          });
        expect(response.status).toBe(400);
      });

      test.each([
        'documentType',
        'description',
        'tags',
        'title',
        'sharingStatus',
        'teams',
        'methods',
        'organisms',
        'environments',
      ])(
        'Should return a validation error when %s is missing',
        async (field) => {
          const response = await supertest(app)
            .put('/research-outputs/abc123')
            .send({
              ...researchOutputPutRequest,
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
            .put('/research-outputs/abc123')
            .send({
              ...researchOutputPutRequest,
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
            .put('/research-outputs/abc123')
            .send({
              ...researchOutputPutRequest,
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
            .put('/research-outputs/abc123')
            .send({
              ...researchOutputPutRequest,
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
            .put('/research-outputs/abc123')
            .send({
              ...researchOutputPutRequest,
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
