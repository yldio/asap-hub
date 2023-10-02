import {
  addLocaleToFields,
  Environment,
  getGP2ContentfulGraphqlClientMockServer,
} from '@asap-hub/contentful';
import { GraphQLError } from 'graphql';
import { TagContentfulDataProvider } from '../../src/data-providers/tag.data-provider';
import { getEntry } from '../fixtures/contentful.fixtures';
import {
  getContentfulGraphqlTags,
  getListTagsDataObject,
  getContentfulTagsGraphqlResponse,
  getTagCreateDataObject,
} from '../fixtures/tag.fixtures';
import { getContentfulGraphqlClientMock } from '../mocks/contentful-graphql-client.mock';
import { getContentfulEnvironmentMock } from '../mocks/contentful-rest-client.mock';

describe('Tag data provider', () => {
  const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();
  const environmentMock = getContentfulEnvironmentMock();
  const contentfulRestClientMock: () => Promise<Environment> = () =>
    Promise.resolve(environmentMock);

  const tagDataProvider = new TagContentfulDataProvider(
    contentfulGraphqlClientMock,
    contentfulRestClientMock,
  );

  const contentfulGraphqlClientMockServer =
    getGP2ContentfulGraphqlClientMockServer({
      Tags: () => getContentfulGraphqlTags(),
    });

  const tagDataProviderMockGraphql = new TagContentfulDataProvider(
    contentfulGraphqlClientMockServer,
    contentfulRestClientMock,
  );

  beforeEach(jest.resetAllMocks);

  describe('Fetch method', () => {
    test('Should fetch the list of tags from Contentful GraphQl', async () => {
      const result = await tagDataProviderMockGraphql.fetch();

      expect(result).toMatchObject(getListTagsDataObject());
    });

    test('Should return an empty result when no tags exist', async () => {
      const contentfulGraphQLResponse = getContentfulTagsGraphqlResponse();
      contentfulGraphQLResponse.tagsCollection!.total = 0;
      contentfulGraphQLResponse.tagsCollection!.items = [];

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await tagDataProvider.fetch();

      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });

    test('Should throw an error with a specific error message when the graphql client throws one', async () => {
      contentfulGraphqlClientMock.request.mockRejectedValueOnce(
        new GraphQLError('some error message'),
      );

      await expect(tagDataProvider.fetch()).rejects.toThrow(
        'some error message',
      );
    });

    test('Should return an empty result when the query is returned as null', async () => {
      const contentfulGraphQLResponse = getContentfulTagsGraphqlResponse();
      contentfulGraphQLResponse.tagsCollection = null;

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await tagDataProvider.fetch();

      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });
  });

  describe('Fetch-by-id method', () => {
    test('Should throw as not implemented', async () => {
      expect.assertions(1);
      await expect(tagDataProvider.fetchById()).rejects.toThrow(
        /Method not implemented/i,
      );
    });
  });

  describe('Create', () => {
    beforeEach(jest.resetAllMocks);
    test('Should throw when the POST request to contentful fails', async () => {
      environmentMock.createEntry.mockRejectedValue(new Error('failed'));

      await expect(
        tagDataProvider.create(getTagCreateDataObject()),
      ).rejects.toThrow(Error);
    });

    test('Should create the tag', async () => {
      const { name } = getTagCreateDataObject();

      const tagMock = getEntry({});
      environmentMock.createEntry.mockResolvedValue(tagMock);
      tagMock.publish = jest.fn().mockResolvedValueOnce(tagMock);

      await tagDataProvider.create({
        name,
      });

      const fields = addLocaleToFields({
        name,
      });
      expect(environmentMock.createEntry).toHaveBeenCalledWith('tags', {
        fields,
      });

      expect(tagMock.publish).toHaveBeenCalled();
    });

    test('Should throw error if error on publish', async () => {
      const { name } = getTagCreateDataObject();

      const tagMock = getEntry({});
      environmentMock.createEntry.mockResolvedValue(tagMock);

      tagMock.publish = jest
        .fn()
        .mockRejectedValue(new Error('error on publish'));

      await expect(tagDataProvider.create({ name })).rejects.toThrow(Error);
    });
  });
});
