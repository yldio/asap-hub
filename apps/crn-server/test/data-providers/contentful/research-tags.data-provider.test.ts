import {
  Entry,
  Environment,
  getContentfulGraphqlClientMockServer,
} from '@asap-hub/contentful';
import { ResearchTagContentfulDataProvider } from '../../../src/data-providers/contentful/research-tag.data-provider';
import {
  getFullListResearchTagDataObject,
  getContentfulGraphqlResearchTagResponse,
} from '../../fixtures/research-tag.fixtures';

import { getContentfulGraphqlClientMock } from '../../mocks/contentful-graphql-client.mock';
import { getContentfulEnvironmentMock } from '../../mocks/contentful-rest-client.mock';

describe('Research Tags Data Provider', () => {
  const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();
  const environmentMock = getContentfulEnvironmentMock();
  const contentfulRestClientMock: () => Promise<Environment> = () =>
    Promise.resolve(environmentMock);
  const researchTagsDataProvider = new ResearchTagContentfulDataProvider(
    contentfulGraphqlClientMock,
    contentfulRestClientMock,
  );

  const contentfulGraphqlClientMockServer =
    getContentfulGraphqlClientMockServer({
      ResearchTagsCollection: () => getContentfulGraphqlResearchTagResponse(),
    });
  const researchTagsDataProviderMockGraphql =
    new ResearchTagContentfulDataProvider(
      contentfulGraphqlClientMockServer,
      contentfulRestClientMock,
    );

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch method', () => {
    test('can fetch data from mock graphql server', async () => {
      const result = await researchTagsDataProviderMockGraphql.fetch({});
      expect(result).toEqual(getFullListResearchTagDataObject());
    });

    test('sets default pagination options if none are provided', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        researchTagsCollection: getContentfulGraphqlResearchTagResponse(),
      });
      await researchTagsDataProvider.fetch({});
      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ limit: 8, skip: 0 }),
      );
    });

    test('passes pagination options if they are provided', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        researchTagsCollection: getContentfulGraphqlResearchTagResponse(),
      });
      await researchTagsDataProvider.fetch({ take: 12, skip: 17 });
      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ limit: 12, skip: 17 }),
      );
    });

    test('can filter by type', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        researchTagsCollection: getContentfulGraphqlResearchTagResponse(),
      });
      await researchTagsDataProvider.fetch({ filter: { type: 'Report' } });
      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ where: { types_contains_all: ['Report'] } }),
      );
    });

    test('should return an empty result if contentful returns a null response', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        researchTagsCollection: null,
      });

      const result = await researchTagsDataProvider.fetch({});
      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should throw an error if contentful returns an invalid category', async () => {
      const contentfulGraphqlResponse =
        getContentfulGraphqlResearchTagResponse();
      contentfulGraphqlResponse!.items![0]!.category = 'invalid category';
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        researchTagsCollection: contentfulGraphqlResponse,
      });

      await expect(
        researchTagsDataProvider.fetch({ take: 10, skip: 5 }),
      ).rejects.toThrowError(
        TypeError('Invalid category received from Contentful'),
      );
    });

    test('Should return default values if result has null entries', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        researchTagsCollection: {
          total: 1,
          items: [
            {
              sys: {
                id: 'tag-1',
              },
              name: null,
              types: null,
              category: null,
            },
          ],
        },
      });

      const result = await researchTagsDataProvider.fetch({});
      expect(result).toEqual({
        total: 1,
        items: [
          {
            id: 'tag-1',
            name: '',
            types: undefined,
            category: undefined,
          },
        ],
      });
    });
    test('Should query data properly when passing search param', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        researchTagsCollection: {
          total: 1,
          items: [
            {
              sys: {
                id: 'tag-1',
              },
              name: null,
              types: null,
              category: null,
            },
          ],
        },
      });

      const search = 'Tag';
      await researchTagsDataProvider.fetch({
        search,
      });

      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          limit: 8,
          order: ['name_ASC'],
          skip: 0,
          where: {
            AND: [{ OR: [{ name_contains: 'Tag' }] }],
          },
        }),
      );
    });
  });

  describe('Fetch-by-id', () => {
    test('should throw an error', async () => {
      await expect(researchTagsDataProvider.fetchById()).rejects.toThrow();
    });
  });

  describe('create', () => {
    beforeEach(() => {
      environmentMock.createEntry.mockResolvedValue({
        sys: { id: '1' },
        publish: jest.fn(),
      } as unknown as Entry);
    });

    test('can create a research tag', async () => {
      const publish = jest.fn();
      environmentMock.createEntry.mockResolvedValue({
        sys: { id: '1' },
        publish,
      } as unknown as Entry);
      const response = await researchTagsDataProvider.create('tag');
      expect(environmentMock.createEntry).toHaveBeenCalledWith(
        'researchTags',
        expect.anything(),
      );
      expect(publish).toHaveBeenCalled();
      expect(response).toBe('1');
    });
  });
});
