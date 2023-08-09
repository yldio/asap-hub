import {
  addLocaleToFields,
  Environment,
  getGP2ContentfulGraphqlClientMockServer,
} from '@asap-hub/contentful';
import { GraphQLError } from 'graphql';
import { KeywordContentfulDataProvider } from '../../src/data-providers/keyword.data-provider';
import { getEntry } from '../fixtures/contentful.fixtures';
import {
  getContentfulGraphqlKeywords,
  getListKeywordsDataObject,
  getContentfulKeywordsGraphqlResponse,
  getKeywordCreateDataObject,
} from '../fixtures/keyword.fixtures';
import { getContentfulGraphqlClientMock } from '../mocks/contentful-graphql-client.mock';
import { getContentfulEnvironmentMock } from '../mocks/contentful-rest-client.mock';

describe('Keyword data provider', () => {
  const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();
  const environmentMock = getContentfulEnvironmentMock();
  const contentfulRestClientMock: () => Promise<Environment> = () =>
    Promise.resolve(environmentMock);

  const keywordDataProvider = new KeywordContentfulDataProvider(
    contentfulGraphqlClientMock,
    contentfulRestClientMock,
  );

  const contentfulGraphqlClientMockServer =
    getGP2ContentfulGraphqlClientMockServer({
      Keywords: () => getContentfulGraphqlKeywords(),
    });

  const keywordDataProviderMockGraphql = new KeywordContentfulDataProvider(
    contentfulGraphqlClientMockServer,
    contentfulRestClientMock,
  );

  beforeEach(jest.resetAllMocks);

  describe('Fetch method', () => {
    test('Should fetch the list of keywords from Contentful GraphQl', async () => {
      const result = await keywordDataProviderMockGraphql.fetch();

      expect(result).toMatchObject(getListKeywordsDataObject());
    });

    test('Should return an empty result when no keywords exist', async () => {
      const contentfulGraphQLResponse = getContentfulKeywordsGraphqlResponse();
      contentfulGraphQLResponse.keywordsCollection!.total = 0;
      contentfulGraphQLResponse.keywordsCollection!.items = [];

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await keywordDataProvider.fetch();

      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });

    test('Should throw an error with a specific error message when the graphql client throws one', async () => {
      contentfulGraphqlClientMock.request.mockRejectedValueOnce(
        new GraphQLError('some error message'),
      );

      await expect(keywordDataProvider.fetch()).rejects.toThrow(
        'some error message',
      );
    });

    test('Should return an empty result when the query is returned as null', async () => {
      const contentfulGraphQLResponse = getContentfulKeywordsGraphqlResponse();
      contentfulGraphQLResponse.keywordsCollection = null;

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await keywordDataProvider.fetch();

      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });
  });

  describe('Fetch-by-id method', () => {
    test('Should throw as not implemented', async () => {
      expect.assertions(1);
      await expect(keywordDataProvider.fetchById()).rejects.toThrow(
        /Method not implemented/i,
      );
    });
  });

  describe('Create', () => {
    beforeEach(jest.resetAllMocks);
    test('Should throw when the POST request to contentful fails', async () => {
      environmentMock.createEntry.mockRejectedValue(new Error('failed'));

      await expect(
        keywordDataProvider.create(getKeywordCreateDataObject()),
      ).rejects.toThrow(Error);
    });

    test('Should create the keyword', async () => {
      const { name } = getKeywordCreateDataObject();

      const keywordMock = getEntry({});
      environmentMock.createEntry.mockResolvedValue(keywordMock);
      keywordMock.publish = jest.fn().mockResolvedValueOnce(keywordMock);

      await keywordDataProvider.create({
        name,
      });

      const fields = addLocaleToFields({
        name,
      });
      expect(environmentMock.createEntry).toHaveBeenCalledWith('keywords', {
        fields,
      });

      expect(keywordMock.publish).toHaveBeenCalled();
    });

    test('Should throw error if error on publish', async () => {
      const { name } = getKeywordCreateDataObject();

      const keywordMock = getEntry({});
      environmentMock.createEntry.mockResolvedValue(keywordMock);

      keywordMock.publish = jest
        .fn()
        .mockRejectedValue(new Error('error on publish'));

      await expect(keywordDataProvider.create({ name })).rejects.toThrow(Error);
    });
  });
});
