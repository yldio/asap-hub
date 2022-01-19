import supertest from 'supertest';
import Boom from '@hapi/boom';
import { appFactory } from '../../src/app';
import { authHandlerMock } from '../mocks/auth-handler.mock';
import { researchOutputControllerMock } from '../mocks/research-outputs-controller.mock';
import {
  getListResearchOutputResponse,
  getResearchOutputResponse,
} from '../fixtures/research-output.fixtures';

describe('/research-outputs/ route', () => {
  const app = appFactory({
    researchOutputController: researchOutputControllerMock,
    authHandler: authHandlerMock,
  });

  afterEach(() => {
    researchOutputControllerMock.fetch.mockReset();
    researchOutputControllerMock.fetchById.mockReset();
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
    test('Should return a 200 when is hit', async () => {
      const researchOutput = getResearchOutputResponse();

      researchOutputControllerMock.create.mockResolvedValueOnce('abc123');
      researchOutputControllerMock.fetchById.mockResolvedValueOnce(
        researchOutput,
      );
      const response = await supertest(app)
        .post('/research-outputs')
        .send({ ...researchOutput, teamId: researchOutput.teams[0]?.id })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201);

      expect(researchOutputControllerMock.create).toBeCalledWith({
        type: researchOutput.type,
        link: researchOutput.link,
        asapFunded: researchOutput.asapFunded,
        sharingStatus: researchOutput.sharingStatus,
        title: researchOutput.title,
        usedInPublication: researchOutput.usedInPublication,
        addedDate: researchOutput.addedDate,
        teams: [{ id: researchOutput.teams[0]?.id }],
      });

      expect(researchOutputControllerMock.fetchById).toBeCalledWith('abc123');

      expect(response.body).toEqual(researchOutput);
    });

    test('Should return a 404 error when creating a research output fails', async () => {
      const researchOutput = getResearchOutputResponse();
      researchOutputControllerMock.create.mockRejectedValueOnce(
        Boom.notFound(),
      );

      await supertest(app)
        .post('/research-outputs')
        .send(researchOutput)
        .set('Accept', 'application/json')
        .expect(404);
    });

    test('Should return a 404 error when fails to fetch newly created research output', async () => {
      const researchOutput = getResearchOutputResponse();

      researchOutputControllerMock.create.mockResolvedValueOnce('abc123');
      researchOutputControllerMock.fetchById.mockRejectedValueOnce(
        Boom.notFound(),
      );

      await supertest(app)
        .post('/research-outputs')
        .send(researchOutput)
        .set('Accept', 'application/json')
        .expect(404);
    });
  });
});
