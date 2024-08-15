import { NotFoundError } from '@asap-hub/errors';
import { ResearchOutputType, researchOutputTypes } from '@asap-hub/model';
import supertest from 'supertest';
import { publicAppFactory } from '../../../src/publicApp';
import {
  getResearchOutputResponse,
  getListResearchOutputResponse,
  getPublicListResearchOutputResponse,
  getPublicResearchOutputResponse,
} from '../../fixtures/research-output.fixtures';
import { researchOutputControllerMock } from '../../mocks/research-output.controller.mock';

describe('/research-outputs/ route', () => {
  const publicApp = publicAppFactory({
    researchOutputController: researchOutputControllerMock,
  });

  afterEach(jest.clearAllMocks);

  describe('GET /research-outputs', () => {
    test('Should return 200 when no output exists', async () => {
      researchOutputControllerMock.fetch.mockResolvedValueOnce({
        items: [],
        total: 0,
      });

      const response = await supertest(publicApp).get(
        '/public/research-outputs',
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should return the results correctly', async () => {
      const listOutputResponse = getListResearchOutputResponse();
      listOutputResponse.items[0]!.sharingStatus = 'Public';

      const listPublicOutputResponse = getPublicListResearchOutputResponse();

      researchOutputControllerMock.fetch.mockResolvedValueOnce(
        listOutputResponse,
      );

      const response = await supertest(publicApp).get(
        '/public/research-outputs',
      );

      expect(response.body).toEqual(listPublicOutputResponse);
    });

    test('Should return an output with an external user correctly', async () => {
      const listOutputResponse = getListResearchOutputResponse();
      listOutputResponse.items[0]!.authors = [
        {
          id: 'external-user-id',
          displayName: 'John Doe',
        },
      ];

      researchOutputControllerMock.fetch.mockResolvedValueOnce(
        listOutputResponse,
      );

      const response = await supertest(publicApp).get(
        '/public/research-outputs',
      );

      expect(response.body).toMatchObject({
        items: [
          {
            authors: ['John Doe'],
          },
        ],
      });
    });

    test('Should filter by the sharing-status and asapFunded attributes by default', async () => {
      await supertest(publicApp).get('/public/research-outputs');

      const expectedParams = {
        filter: {
          sharingStatus: 'Public',
          asapFunded: 'Yes',
        },
      };

      expect(researchOutputControllerMock.fetch).toHaveBeenCalledWith(
        expectedParams,
      );
    });

    describe('Parameter validation', () => {
      beforeEach(() => {
        researchOutputControllerMock.fetch.mockResolvedValueOnce({
          items: [],
          total: 0,
        });
      });

      test('Should call the controller with the right parameters', async () => {
        await supertest(publicApp).get('/public/research-outputs').query({
          take: 15,
          skip: 5,
        });

        const expectedParams = {
          take: 15,
          skip: 5,
          filter: {
            sharingStatus: 'Public',
            asapFunded: 'Yes',
          },
        };

        expect(researchOutputControllerMock.fetch).toHaveBeenCalledWith(
          expectedParams,
        );
      });
      test('Should return a validation error when additional fields exist', async () => {
        const response = await supertest(publicApp)
          .get(`/public/research-outputs`)
          .query({
            additionalField: 'some-data',
          });

        expect(response.status).toBe(400);
      });

      test('Should return a validation error when the arguments are not valid', async () => {
        const response = await supertest(publicApp)
          .get(`/public/research-outputs`)
          .query({
            take: 'invalid param',
          });

        expect(response.status).toBe(400);
      });
    });
  });

  describe('GET /research-outputs/:researchOutputId', () => {
    test('Should return 200 when the output exists', async () => {
      const researchOutputId = 'research-output-id';
      const researchOutputResponse = getResearchOutputResponse();
      researchOutputResponse.sharingStatus = 'Public';

      researchOutputControllerMock.fetchById.mockResolvedValueOnce(
        researchOutputResponse,
      );

      const response = await supertest(publicApp).get(
        `/public/research-outputs/${researchOutputId}`,
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual(getPublicResearchOutputResponse());
    });

    test.each([
      { field: 'finalPublishDate', type: 'Published' },
      { field: 'preprintPublishDate', type: 'Preprint' },
    ])(
      'Should return $field as publishDate when type is $type',
      async ({ field, type }) => {
        const publishDate = '2024-08-10';
        const researchOutputId = 'research-output-id';
        const researchOutputResponse = getResearchOutputResponse();
        researchOutputResponse.sharingStatus = 'Public';
        researchOutputResponse.publishDate = publishDate;
        researchOutputResponse.type = type as ResearchOutputType;

        researchOutputControllerMock.fetchById.mockResolvedValueOnce(
          researchOutputResponse,
        );

        const response = await supertest(publicApp).get(
          `/public/research-outputs/${researchOutputId}`,
        );

        expect(response.status).toBe(200);
        expect(response.body).toEqual(
          expect.objectContaining({
            [field]: publishDate,
          }),
        );
      },
    );

    const typesWithoutPublished = researchOutputTypes.filter(
      (type) => type !== 'Published',
    );
    test.each(typesWithoutPublished)(
      'Should not return finalPublishDate when type is %s',
      async (type) => {
        const publishDate = '2024-08-10';
        const researchOutputId = 'research-output-id';
        const researchOutputResponse = getResearchOutputResponse();
        researchOutputResponse.sharingStatus = 'Public';
        researchOutputResponse.publishDate = publishDate;
        researchOutputResponse.type = type as ResearchOutputType;

        researchOutputControllerMock.fetchById.mockResolvedValueOnce(
          researchOutputResponse,
        );

        const response = await supertest(publicApp).get(
          `/public/research-outputs/${researchOutputId}`,
        );

        expect(response.status).toBe(200);
        expect(Object.keys(response.body)).not.toContain('finalPublishDate');
      },
    );

    const typesWithoutPreprint = researchOutputTypes.filter(
      (type) => type !== 'Preprint',
    );
    test.each(typesWithoutPreprint)(
      'Should not return preprintPublishDate when type is %s',
      async (type) => {
        const publishDate = '2024-08-10';
        const researchOutputId = 'research-output-id';
        const researchOutputResponse = getResearchOutputResponse();
        researchOutputResponse.sharingStatus = 'Public';
        researchOutputResponse.publishDate = publishDate;
        researchOutputResponse.type = type as ResearchOutputType;

        researchOutputControllerMock.fetchById.mockResolvedValueOnce(
          researchOutputResponse,
        );

        const response = await supertest(publicApp).get(
          `/public/research-outputs/${researchOutputId}`,
        );

        expect(response.status).toBe(200);
        expect(Object.keys(response.body)).not.toContain('preprintPublishDate');
      },
    );

    test('Should return 404 when the output does not exist', async () => {
      researchOutputControllerMock.fetchById.mockRejectedValueOnce(
        new NotFoundError(
          undefined,
          `output with id non-existing-output-id not found`,
        ),
      );

      const response = await supertest(publicApp).get(
        `/public/research-outputs/non-existing-output-id`,
      );

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        statusCode: 404,
        error: 'Not Found',
        message: `output with id non-existing-output-id not found`,
      });
    });

    test('Should return 404 when the output sharing-status is not Public', async () => {
      const researchOutputId = 'research-output-id';
      const researchOutputResponse = getResearchOutputResponse();
      researchOutputResponse.sharingStatus = 'Network Only';

      researchOutputControllerMock.fetchById.mockResolvedValueOnce(
        researchOutputResponse,
      );

      const response = await supertest(publicApp).get(
        `/public/research-outputs/${researchOutputId}`,
      );

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        statusCode: 404,
        error: 'Not Found',
        message: `researchOutput with id research-output-id not found`,
      });
    });

    test('Should return 404 when the output asapFunded property is not true', async () => {
      const researchOutputId = 'research-output-id';
      const researchOutputResponse = getResearchOutputResponse();
      researchOutputResponse.asapFunded = false;
      researchOutputControllerMock.fetchById.mockResolvedValueOnce(
        researchOutputResponse,
      );

      const response = await supertest(publicApp).get(
        `/public/research-outputs/${researchOutputId}`,
      );

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        statusCode: 404,
        error: 'Not Found',
        message: `researchOutput with id research-output-id not found`,
      });
    });
  });
});
