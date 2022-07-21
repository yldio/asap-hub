import { ResearchTagSquidexDataProvider } from '../../src/data-providers/research-tags.data-provider';
import {
  getListResearchTagDataObject,
  getSquidexResearchTagsGraphqlResponse,
} from '../fixtures/research-tag.fixtures';
import { identity } from '../helpers/squidex';
import { getSquidexGraphqlClientMockServer } from '../mocks/squidex-graphql-client-with-server.mock';
import { getSquidexGraphqlClientMock } from '../mocks/squidex-graphql-client.mock';

describe('Research Tags data provider', () => {
  const squidexGraphqlClientMock = getSquidexGraphqlClientMock();
  const researchTagDataProvider = new ResearchTagSquidexDataProvider(
    squidexGraphqlClientMock,
  );
  const squidexGraphqlClientMockServer = getSquidexGraphqlClientMockServer();
  const researchTagDataProviderMockGraphqlServer =
    new ResearchTagSquidexDataProvider(squidexGraphqlClientMockServer);

  beforeAll(() => {
    identity();
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Fetch method', () => {
    test('Should fetch the research tags from squidex graphql', async () => {
      const result = await researchTagDataProviderMockGraphqlServer.fetch({
        take: 8,
        skip: 0,
      });

      expect(result).toMatchObject(getListResearchTagDataObject());
    });

    test('Should return an empty result when the client returns an empty array of data', async () => {
      const squidexGraphqlResponse = getSquidexResearchTagsGraphqlResponse();
      squidexGraphqlResponse.queryResearchTagsContentsWithTotal!.total = 0;
      squidexGraphqlResponse.queryResearchTagsContentsWithTotal!.items = [];
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await researchTagDataProvider.fetch({ take: 10, skip: 5 });

      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should return an empty result when the client returns a response with query property set to null', async () => {
      const squidexGraphqlResponse = getSquidexResearchTagsGraphqlResponse();
      squidexGraphqlResponse.queryResearchTagsContentsWithTotal = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await researchTagDataProvider.fetch({ take: 10, skip: 5 });

      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should return an empty result when the client returns a response with items property set to null', async () => {
      const squidexGraphqlResponse = getSquidexResearchTagsGraphqlResponse();
      squidexGraphqlResponse.queryResearchTagsContentsWithTotal!.items = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await researchTagDataProvider.fetch({ take: 10, skip: 5 });

      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should throw an error when squidex returns an invalid category', async () => {
      const squidexGraphqlResponse = getSquidexResearchTagsGraphqlResponse();
      squidexGraphqlResponse.queryResearchTagsContentsWithTotal!.items![0]!.flatData.category =
        'invalid category';
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      await expect(
        researchTagDataProvider.fetch({ take: 10, skip: 5 }),
      ).rejects.toThrowError(
        TypeError('Invalid category received from Squidex'),
      );
    });

    test('Should throw an error when squidex returns an invalid entity', async () => {
      const squidexGraphqlResponse = getSquidexResearchTagsGraphqlResponse();
      squidexGraphqlResponse.queryResearchTagsContentsWithTotal!.items![0]!.flatData.entities =
        ['Research Output', 'invalid entity'];
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      await expect(
        researchTagDataProvider.fetch({ take: 10, skip: 5 }),
      ).rejects.toThrowError(TypeError('Invalid entity received from Squidex'));
    });

    describe('Parameters', () => {
      beforeEach(() => {
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          getSquidexResearchTagsGraphqlResponse(),
        );
      });

      test('Should pass the pagination parameters as expected', async () => {
        await researchTagDataProvider.fetch({ take: 13, skip: 7 });

        expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
          expect.anything(),
          {
            top: 13,
            skip: 7,
            filter: '',
          },
        );
      });

      test('Should pass the entity filter parameters as expected', async () => {
        await researchTagDataProvider.fetch({
          take: 11,
          skip: 4,
          filter: {
            entity: 'Research Output',
          },
        });

        expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
          expect.anything(),
          {
            top: 11,
            skip: 4,
            filter: `(data/entities/iv eq 'Research Output')`,
          },
        );
      });

      test('Should pass the type filter parameters as expected', async () => {
        await researchTagDataProvider.fetch({
          take: 15,
          skip: 3,
          filter: {
            type: 'Software',
          },
        });

        expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
          expect.anything(),
          {
            top: 15,
            skip: 3,
            filter: `(data/types/iv eq 'Software')`,
          },
        );
      });

      test('Should pass the both filters parameters as expected', async () => {
        await researchTagDataProvider.fetch({
          take: 11,
          skip: 4,
          filter: {
            entity: 'Research Output',
            type: 'Software',
          },
        });

        expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
          expect.anything(),
          {
            top: 11,
            skip: 4,
            filter: `(data/types/iv eq 'Software') and (data/entities/iv eq 'Research Output')`,
          },
        );
      });
    });
  });
});
