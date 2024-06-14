import supertest from 'supertest';
import { gp2 as gp2Model } from '@asap-hub/model';
import { publicAppFactory } from '../../../src/publicApp';
import {
  getListOutputResponse,
  getListPublicOutputResponse,
  getOutputResponse,
  getPublicOutputResponse,
} from '../../fixtures/output.fixtures';
import { outputControllerMock } from '../../mocks/output.controller.mock';
import { NotFoundError } from '@asap-hub/errors';
import { outputDocumentTypes, outputTypes } from '@asap-hub/model/src/gp2';

describe('/outputs/ route', () => {
  const publicApp = publicAppFactory({
    outputController: outputControllerMock,
    cacheMiddleware: (_req, _res, next) => next(),
  });

  afterEach(jest.clearAllMocks);

  describe('GET /outputs', () => {
    test('Should return 200 when no output exists', async () => {
      outputControllerMock.fetch.mockResolvedValueOnce({
        items: [],
        total: 0,
      });

      const response = await supertest(publicApp).get('/public/outputs');

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

    test('Should return an output with an external user correctly', async () => {
      const listOutputResponse = getListOutputResponse();
      listOutputResponse.items[0]!.authors = [
        {
          id: 'external-user-id',
          displayName: 'John Doe',
        },
      ];

      outputControllerMock.fetch.mockResolvedValueOnce(listOutputResponse);

      const response = await supertest(publicApp).get('/public/outputs');

      expect(response.body).toMatchObject({
        items: [
          {
            authors: [
              {
                displayName: 'John Doe',
              },
            ],
          },
        ],
      });
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

  describe('GET /outputs/:outputId', () => {
    test('Should return 200 when the output exists', async () => {
      const outputId = 'output-id';
      const outputResponse = getOutputResponse();

      outputControllerMock.fetchById.mockResolvedValueOnce(outputResponse);

      const response = await supertest(publicApp).get(
        `/public/outputs/${outputId}`,
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual(getPublicOutputResponse());
    });

    describe('Final Output Publish Date field', () => {
      test('Should be the publish date for a non-versioned output', async () => {
        const outputId = 'output-id';
        const outputResponse = getOutputResponse();
        outputResponse.publishDate = '2011-11-11T11:00:00Z';
        outputResponse.versions = [];
        outputControllerMock.fetchById.mockResolvedValueOnce(outputResponse);

        const response = await supertest(publicApp).get(
          `/public/outputs/${outputId}`,
        );

        expect(response.status).toBe(200);
        expect(response.body.finalPublishDate).toBe('2011-11-11T11:00:00Z');
      });

      test('Should be the publish date if the versions are undefined', async () => {
        const outputId = 'output-id';
        const outputResponse = getOutputResponse();
        outputResponse.publishDate = '2011-11-11T11:00:00Z';
        outputResponse.versions = undefined;
        outputControllerMock.fetchById.mockResolvedValueOnce(outputResponse);

        const response = await supertest(publicApp).get(
          `/public/outputs/${outputId}`,
        );

        expect(response.status).toBe(200);
        expect(response.body.finalPublishDate).toBe('2011-11-11T11:00:00Z');
      });

      test('Should be undefined for a versioned output', async () => {
        const outputId = 'output-id';
        const outputResponse = getOutputResponse();
        outputResponse.versions = [
          {
            id: '1',
            addedDate: '',
            title: 'Version 1',
            documentType: 'Dataset',
            link: 'https://version1.com',
          },
        ];
        outputControllerMock.fetchById.mockResolvedValueOnce(outputResponse);

        const response = await supertest(publicApp).get(
          `/public/outputs/${outputId}`,
        );

        expect(response.status).toBe(200);
        expect(response.body.finalPublishDate).toBeUndefined();
      });
    });

    describe('Preprint Publish Date field', () => {
      const outputDocumentTypesWithoutArticle = outputDocumentTypes.filter(
        (documentType) => documentType !== 'Article',
      );
      test.each(outputDocumentTypesWithoutArticle)(
        'Should be undefined for when document type is %i',
        async (documentType) => {
          const outputId = 'output-id';
          const outputResponse = getOutputResponse();
          outputResponse.documentType = documentType;
          outputControllerMock.fetchById.mockResolvedValueOnce(outputResponse);

          const response = await supertest(publicApp).get(
            `/public/outputs/${outputId}`,
          );

          expect(response.status).toBe(200);
          expect(response.body.preprintPublishDate).toBeUndefined();
        },
      );
      const outputTypesWithoutResearch = outputTypes.filter(
        (subtype) => subtype !== 'Research',
      );
      test.each(outputTypesWithoutResearch)(
        'Should be undefined for when document type is Article and the type is %i',
        async (type) => {
          const outputId = 'output-id';
          const outputResponse = getOutputResponse();
          outputResponse.documentType = 'Article';
          outputResponse.type = type;
          outputControllerMock.fetchById.mockResolvedValueOnce(outputResponse);

          const response = await supertest(publicApp).get(
            `/public/outputs/${outputId}`,
          );

          expect(response.status).toBe(200);
          expect(response.body.preprintPublishDate).toBeUndefined();
        },
      );

      test('Should be the publish date when document type is Article and type is Research and subtype is Preprints', async () => {
        const outputId = 'output-id';
        const outputResponse = getOutputResponse();
        outputResponse.documentType = 'Article';
        outputResponse.type = 'Research';
        outputResponse.subtype = 'Preprints';
        outputResponse.publishDate = '2011-11-11T11:00:00Z';
        outputControllerMock.fetchById.mockResolvedValueOnce(outputResponse);

        const response = await supertest(publicApp).get(
          `/public/outputs/${outputId}`,
        );

        expect(response.status).toBe(200);
        expect(response.body.preprintPublishDate).toBe('2011-11-11T11:00:00Z');
      });

      test('Should be undefined when document type is Article and type is Research and subtype is Published', async () => {
        const outputId = 'output-id';
        const outputResponse = getOutputResponse();
        outputResponse.documentType = 'Article';
        outputResponse.type = 'Research';
        outputResponse.subtype = 'Published';
        outputResponse.publishDate = '2011-11-11T11:00:00Z';
        outputControllerMock.fetchById.mockResolvedValueOnce(outputResponse);

        const response = await supertest(publicApp).get(
          `/public/outputs/${outputId}`,
        );

        expect(response.status).toBe(200);
        expect(response.body.preprintPublishDate).toBeUndefined();
      });
    });

    test('Should return 404 when the output does not exist', async () => {
      outputControllerMock.fetchById.mockRejectedValueOnce(
        new NotFoundError(
          undefined,
          `output with id non-existing-output-id not found`,
        ),
      );

      const response = await supertest(publicApp).get(
        `/public/outputs/non-existing-output-id`,
      );

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        statusCode: 404,
        error: 'Not Found',
        message: `output with id non-existing-output-id not found`,
      });
    });

    test('Should return 404 when the output sharing-status is not Public', async () => {
      const outputId = 'output-id';
      const outputResponse = getOutputResponse();
      outputResponse.sharingStatus = 'GP2 Only';

      outputControllerMock.fetchById.mockResolvedValueOnce(outputResponse);

      const response = await supertest(publicApp).get(
        `/public/outputs/${outputId}`,
      );

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        statusCode: 404,
        error: 'Not Found',
        message: `output with id output-id not found`,
      });
    });

    test('Should return 404 when the output gp2-supported property is not equal to Yes', async () => {
      const outputId = 'output-id';
      const outputResponse = getOutputResponse();
      outputResponse.gp2Supported = `Don't Know`;
      outputControllerMock.fetchById.mockResolvedValueOnce(outputResponse);

      const response = await supertest(publicApp).get(
        `/public/outputs/${outputId}`,
      );

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        statusCode: 404,
        error: 'Not Found',
        message: `output with id output-id not found`,
      });
    });
  });
});
