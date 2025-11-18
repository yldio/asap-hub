import { getContentfulGraphqlClientMockServer } from '@asap-hub/contentful';
import { ResourceTypeContentfulDataProvider } from '../../../src/data-providers/contentful/resource-type.data-provider';
import { getContentfulGraphqlClientMock } from '../../mocks/contentful-graphql-client.mock';

describe('Resource Types Data Provider', () => {
  const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();
  const resourceTypesDataProvider = new ResourceTypeContentfulDataProvider(
    contentfulGraphqlClientMock,
  );

  const getContentfulGraphqlResourceTypeResponse = () => ({
    total: 3,
    items: [
      { sys: { id: 'type-1' }, name: 'Database' },
      { sys: { id: 'type-2' }, name: 'Data Portal' },
      { sys: { id: 'type-3' }, name: 'Dataset' },
    ],
  });

  const contentfulGraphqlClientMockServer =
    getContentfulGraphqlClientMockServer({
      ResourceTypeCollection: () => getContentfulGraphqlResourceTypeResponse(),
    });

  const resourceTypesDataProviderMockGraphql =
    new ResourceTypeContentfulDataProvider(contentfulGraphqlClientMockServer);

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch method', () => {
    test('can fetch data from mock graphql server', async () => {
      const result = await resourceTypesDataProviderMockGraphql.fetch({});
      expect(result).toEqual({
        total: 3,
        items: [
          { id: 'type-1', name: 'Database' },
          { id: 'type-2', name: 'Data Portal' },
          { id: 'type-3', name: 'Dataset' },
        ],
      });
    });

    test('sets default pagination options if none are provided', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        resourceTypeCollection: getContentfulGraphqlResourceTypeResponse(),
      });
      await resourceTypesDataProvider.fetch({});
      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ limit: 100, skip: 0 }),
      );
    });

    test('passes pagination options if they are provided', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        resourceTypeCollection: getContentfulGraphqlResourceTypeResponse(),
      });
      await resourceTypesDataProvider.fetch({ take: 50, skip: 10 });
      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ limit: 50, skip: 10 }),
      );
    });

    test('should return an empty result if contentful returns a null response', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        resourceTypeCollection: null,
      });

      const result = await resourceTypesDataProvider.fetch({});
      expect(result).toEqual({ total: 0, items: [] });
    });

    test('should return default values if result has null entries', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        resourceTypeCollection: {
          total: 1,
          items: [
            {
              sys: {
                id: 'type-1',
              },
              name: null,
            },
          ],
        },
      });

      const result = await resourceTypesDataProvider.fetch({});
      expect(result).toEqual({
        total: 1,
        items: [
          {
            id: 'type-1',
            name: '',
          },
        ],
      });
    });

    test('should filter out null items from the collection', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        resourceTypeCollection: {
          total: 2,
          items: [
            { sys: { id: 'type-1' }, name: 'Database' },
            null,
            { sys: { id: 'type-2' }, name: 'Data Portal' },
          ],
        },
      });

      const result = await resourceTypesDataProvider.fetch({});
      expect(result).toEqual({
        total: 2,
        items: [
          { id: 'type-1', name: 'Database' },
          { id: 'type-2', name: 'Data Portal' },
        ],
      });
    });

    test('orders results by name ascending', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        resourceTypeCollection: getContentfulGraphqlResourceTypeResponse(),
      });
      await resourceTypesDataProvider.fetch({});
      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ order: ['name_ASC'] }),
      );
    });
  });
});
