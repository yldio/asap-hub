import { ResearchOutputPostRequest } from '@asap-hub/model';
import Boom from '@hapi/boom';
import supertest from 'supertest';
import { appFactory } from '../../src/app';
import {
  getListResearchOutputResponse,
  getResearchOutputResponse,
} from '../fixtures/research-output.fixtures';
import { authHandlerMock } from '../mocks/auth-handler.mock';
import { researchOutputControllerMock } from '../mocks/research-outputs-controller.mock';

describe('/research-outputs/ route', () => {
  const app = appFactory({
    researchOutputController: researchOutputControllerMock,
    authHandler: authHandlerMock,
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
    const getCreateResearchOutput = (): ResearchOutputPostRequest => {
      const {
        type,
        title,
        asapFunded,
        sharingStatus,
        usedInPublication,
        addedDate,
        description,
        tags,
        subTypes,
        labs,
        authors,
        teams,
      } = getResearchOutputResponse();
      return {
        type,
        link: 'http://a.link',
        title,
        asapFunded,
        sharingStatus,
        usedInPublication,
        addedDate,
        description,
        tags,
        subTypes,
        labs: labs.map(({ id }) => id),
        authors: authors.map(({ id }) => id),
        teams: teams.map(({ id }) => id),
      };
    };
    test('Should return a 201 when is hit', async () => {
      const createResearchOutputRequest = {
        ...getCreateResearchOutput(),
      };

      researchOutputControllerMock.create.mockResolvedValueOnce({
        id: 'abc123',
      });

      const response = await supertest(app)
        .post('/research-outputs')
        .send(createResearchOutputRequest)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201);

      expect(researchOutputControllerMock.create).toBeCalledWith(
        createResearchOutputRequest,
      );

      expect(response.body).toEqual(expect.objectContaining({ id: 'abc123' }));
    });

    test('Should return a 500 error when creating a research output fails', async () => {
      const researchOutput = getCreateResearchOutput();
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
      test('Should return a validation error when the arguments are not valid', async () => {
        const response = await supertest(app).post('/research-outputs/').send({
          unknown_field: 2,
        });

        expect(response.status).toBe(400);
      });

      test.each([
        'type',
        'description',
        'tags',
        'title',
        'sharingStatus',
        'addedDate',
        'teams',
        'labs',
      ])(
        'Should return a validation error when %s is missing',
        async (field) => {
          const researchOutput = getCreateResearchOutput();
          const response = await supertest(app)
            .post('/research-outputs/')
            .send({
              ...researchOutput,
              [field]: undefined,
            });

          expect(response.status).toBe(400);
        },
      );
    });
  });
});
