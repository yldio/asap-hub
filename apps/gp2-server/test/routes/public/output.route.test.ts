import supertest from 'supertest';
import { gp2 as gp2Model } from '@asap-hub/model';
import { publicAppFactory } from '../../../src/publicApp';
import {
  getListOutputResponse,
  getListPublicOutputResponse,
} from '../../fixtures/output.fixtures';
import { outputControllerMock } from '../../mocks/output.controller.mock';

describe('/outputs/ route', () => {
  const publicApp = publicAppFactory({
    outputController: outputControllerMock,
  });

  afterEach(jest.clearAllMocks);

  describe('GET /outputs', () => {
    test('Should return 200 when no output exists', async () => {
      outputControllerMock.fetch.mockResolvedValueOnce({
        items: [],
        total: 0,
      });

      const response = await supertest(publicApp).get('/public/outputs');

      console.log(response.body);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should return the results correctly', async () => {
      const listOutputResponse = getListOutputResponse();
      const listPublicOutputResponse = getListPublicOutputResponse();

      outputControllerMock.fetch.mockResolvedValueOnce(listOutputResponse);

      const response = await supertest(publicApp).get('/public/outputs');

      expect(response.body).toEqual(listPublicOutputResponse);
    });

    test('Should filter by the sharing-status and gp2-supported attributes by default', async () => {
      await supertest(publicApp).get('/public/outputs');

      const expectedParams: gp2Model.FetchOutputOptions = {
        filter: {
          sharingStatus: 'Public',
          gp2Supported: 'Yes',
        },
      };

      expect(outputControllerMock.fetch).toHaveBeenCalledWith(expectedParams);
    });

    describe('Parameter validation', () => {
      beforeEach(() => {
        outputControllerMock.fetch.mockResolvedValueOnce({
          items: [],
          total: 0,
        });
      });

      test('Should call the controller with the right parameters', async () => {
        await supertest(publicApp).get('/public/outputs').query({
          take: 15,
          skip: 5,
        });

        const expectedParams: gp2Model.FetchOutputOptions = {
          take: 15,
          skip: 5,
          filter: {
            sharingStatus: 'Public',
            gp2Supported: 'Yes',
          },
        };

        expect(outputControllerMock.fetch).toHaveBeenCalledWith(expectedParams);
      });
      test('Should return a validation error when additional fields exist', async () => {
        const response = await supertest(publicApp)
          .get(`/public/outputs`)
          .query({
            additionalField: 'some-data',
          });

        expect(response.status).toBe(400);
      });

      test('Should return a validation error when the arguments are not valid', async () => {
        const response = await supertest(publicApp)
          .get(`/public/outputs`)
          .query({
            take: 'invalid param',
          });

        expect(response.status).toBe(400);
      });
    });
  });
});
