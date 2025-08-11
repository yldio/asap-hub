import { Client } from '@opensearch-project/opensearch';
import { indexOpenSearchData } from '../../src/utils/open-search';
import { getOpenSearchEndpoint } from '../../src/utils/open-search-endpoint';
import type { OpenSearchMapping } from '../../src/utils/types';

jest.mock('@opensearch-project/opensearch');
jest.mock('../../src/utils/open-search-endpoint');

const mockClient = {
  indices: {
    create: jest.fn(),
    refresh: jest.fn(),
    getAlias: jest.fn(),
    updateAliases: jest.fn(),
    delete: jest.fn(),
  },
  bulk: jest.fn(),
};

const mockGetOpenSearchEndpoint = getOpenSearchEndpoint as jest.MockedFunction<
  typeof getOpenSearchEndpoint
>;

describe('indexOpenSearchData', () => {
  const mockEndpoint = 'https://test-opensearch-endpoint.com';
  const mockIndexAlias = 'test-index';
  const mockDocuments = [
    { id: '1', title: 'Test Document 1', content: 'Test content 1' },
    { id: '2', title: 'Test Document 2', content: 'Test content 2' },
  ];
  const mockMapping: OpenSearchMapping['mappings'] = {
    properties: {
      title: { type: 'text' },
      content: { type: 'text' },
    },
  };

  const mockGetData = jest.fn().mockResolvedValue({
    documents: [],
    mapping: mockMapping,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();

    mockGetOpenSearchEndpoint.mockResolvedValue(mockEndpoint);

    (Client as jest.MockedClass<typeof Client>).mockImplementation(
      () => mockClient as any,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Client initialization', () => {
    test('should create client with username/password authentication when credentials provided', async () => {
      await indexOpenSearchData({
        awsRegion: 'us-east-1',
        stage: 'dev',
        openSearchUsername: 'testuser',
        openSearchPassword: 'testpass',
        indexAlias: mockIndexAlias,
        getData: mockGetData,
      });

      expect(Client).toHaveBeenCalledWith({
        node: mockEndpoint,
        auth: {
          username: 'testuser',
          password: 'testpass',
        },
      });
    });

    test('should throw error when no credentials provided', async () => {
      await expect(
        indexOpenSearchData({
          awsRegion: 'us-east-1',
          stage: 'dev',
          indexAlias: mockIndexAlias,
          getData: mockGetData,
        }),
      ).rejects.toThrow('OpenSearch username and password are required');
    });
  });

  describe('Index creation', () => {
    test('should create new index and log it', async () => {
      await indexOpenSearchData({
        awsRegion: 'us-east-1',
        stage: 'dev',
        openSearchUsername: 'testuser',
        openSearchPassword: 'testpass',
        indexAlias: mockIndexAlias,
        getData: mockGetData,
      });

      expect(mockClient.indices.create).toHaveBeenCalledWith({
        index: expect.stringMatching(new RegExp(`^${mockIndexAlias}-\\d+$`)),
        body: {
          settings: {
            number_of_shards: 1,
            number_of_replicas: 1,
          },
          mappings: mockMapping,
        },
      });

      expect(console.log).toHaveBeenCalledWith(
        expect.stringMatching(
          new RegExp(`Creating new index: ${mockIndexAlias}-\\d+$`),
        ),
      );
    });
  });

  describe('Bulk indexing', () => {
    const mockGetDataForBulkIndexing = jest.fn().mockResolvedValue({
      documents: mockDocuments,
      mapping: mockMapping,
    });

    test('should prepare bulk body correctly', async () => {
      mockClient.bulk.mockResolvedValue({
        body: {
          items: [
            { index: { _index: 'test-index-1234567890' } },
            { index: { _index: 'test-index-1234567890' } },
          ],
        },
      } as any);

      await indexOpenSearchData({
        awsRegion: 'us-east-1',
        stage: 'dev',
        openSearchUsername: 'testuser',
        openSearchPassword: 'testpass',
        indexAlias: mockIndexAlias,
        getData: mockGetDataForBulkIndexing,
      });

      const expectedBulkBody = [
        { index: { _index: expect.stringMatching(/test-index-\d+/) } },
        { id: '1', title: 'Test Document 1', content: 'Test content 1' },
        { index: { _index: expect.stringMatching(/test-index-\d+/) } },
        { id: '2', title: 'Test Document 2', content: 'Test content 2' },
      ];

      expect(mockClient.bulk).toHaveBeenCalledWith({
        body: expectedBulkBody,
      });
    });

    test('should handle empty documents array', async () => {
      const emptyGetData = jest.fn().mockResolvedValue({
        documents: [],
        mapping: mockMapping,
      });

      await indexOpenSearchData({
        awsRegion: 'us-east-1',
        stage: 'dev',
        openSearchUsername: 'testuser',
        openSearchPassword: 'testpass',
        indexAlias: mockIndexAlias,
        getData: emptyGetData,
      });

      expect(mockClient.bulk).not.toHaveBeenCalled();
    });

    test('should log success when bulk indexing succeeds', async () => {
      mockClient.bulk.mockResolvedValue({
        body: {
          items: [
            { index: { _index: 'test-index-1234567890' } },
            { index: { _index: 'test-index-1234567890' } },
          ],
        },
      } as any);

      await indexOpenSearchData({
        awsRegion: 'us-east-1',
        stage: 'dev',
        openSearchUsername: 'testuser',
        openSearchPassword: 'testpass',
        indexAlias: mockIndexAlias,
        getData: jest.fn().mockResolvedValue({
          documents: mockDocuments,
          mapping: mockGetDataForBulkIndexing,
        }),
      });

      expect(console.log).toHaveBeenCalledWith(
        `Successfully indexed ${mockDocuments.length} documents`,
      );
    });

    test('should log errors when bulk indexing fails', async () => {
      const bulkErrors = {
        body: {
          errors: true,
          items: [
            { index: { error: { reason: 'Document 0 error' } } },
            { index: { error: { reason: 'Document 1 error' } } },
          ],
        },
      };
      mockClient.bulk.mockResolvedValue(bulkErrors as any);

      await indexOpenSearchData({
        awsRegion: 'us-east-1',
        stage: 'dev',
        openSearchUsername: 'testuser',
        openSearchPassword: 'testpass',
        indexAlias: mockIndexAlias,
        getData: mockGetDataForBulkIndexing,
      });

      expect(console.error).toHaveBeenCalledWith(
        'Some documents had indexing errors:',
      );
      expect(console.error).toHaveBeenCalledWith(
        '  Document 0: Document 0 error',
      );
      expect(console.error).toHaveBeenCalledWith(
        '  Document 1: Document 1 error',
      );
    });
  });

  describe('Index refresh', () => {
    test('should refresh index after bulk operation', async () => {
      await indexOpenSearchData({
        awsRegion: 'us-east-1',
        stage: 'dev',
        openSearchUsername: 'testuser',
        openSearchPassword: 'testpass',
        indexAlias: mockIndexAlias,
        getData: mockGetData,
      });

      expect(mockClient.indices.refresh).toHaveBeenCalledWith({
        index: expect.stringMatching(/test-index-\d+/),
      });
    });
  });

  describe('Alias management', () => {
    test('should create alias when no existing alias exists', async () => {
      mockClient.indices.getAlias.mockRejectedValue(
        new Error('Alias not found'),
      );

      await indexOpenSearchData({
        awsRegion: 'us-east-1',
        stage: 'dev',
        openSearchUsername: 'testuser',
        openSearchPassword: 'testpass',
        indexAlias: mockIndexAlias,
        getData: mockGetData,
      });

      expect(console.log).toHaveBeenCalledWith(
        `No existing alias found for ${mockIndexAlias}`,
      );
      expect(mockClient.indices.updateAliases).toHaveBeenCalledWith({
        body: {
          actions: [
            {
              add: {
                index: expect.stringMatching(/test-index-\d+/),
                alias: mockIndexAlias,
              },
            },
          ],
        },
      });
    });

    test('should update alias and remove old indices when alias exists', async () => {
      const oldIndexName = 'test-index-1234567890';
      mockClient.indices.getAlias.mockResolvedValue({
        body: {
          [oldIndexName]: { aliases: { [mockIndexAlias]: {} } },
        },
      } as any);

      await indexOpenSearchData({
        awsRegion: 'us-east-1',
        stage: 'dev',
        openSearchUsername: 'testuser',
        openSearchPassword: 'testpass',
        indexAlias: mockIndexAlias,
        getData: mockGetData,
      });

      expect(mockClient.indices.updateAliases).toHaveBeenCalledWith({
        body: {
          actions: [
            { remove: { index: oldIndexName, alias: mockIndexAlias } },
            {
              add: {
                index: expect.stringMatching(/test-index-\d+/),
                alias: mockIndexAlias,
              },
            },
          ],
        },
      });
    });

    test('should log alias update', async () => {
      await indexOpenSearchData({
        awsRegion: 'us-east-1',
        stage: 'dev',
        openSearchUsername: 'testuser',
        openSearchPassword: 'testpass',
        indexAlias: mockIndexAlias,
        getData: mockGetData,
      });

      expect(console.log).toHaveBeenCalledWith(
        expect.stringMatching(
          new RegExp(
            `Alias '${mockIndexAlias}' now points to '${mockIndexAlias}-\\d+'`,
          ),
        ),
      );
    });
  });

  describe('Old index cleanup', () => {
    test('should delete old indices after alias update', async () => {
      const oldIndexName = 'test-index-1234567890';
      mockClient.indices.getAlias.mockResolvedValue({
        body: {
          [oldIndexName]: { aliases: { [mockIndexAlias]: {} } },
        },
      } as any);

      await indexOpenSearchData({
        awsRegion: 'us-east-1',
        stage: 'dev',
        openSearchUsername: 'testuser',
        openSearchPassword: 'testpass',
        indexAlias: mockIndexAlias,
        getData: mockGetData,
      });

      expect(mockClient.indices.delete).toHaveBeenCalledWith({
        index: oldIndexName,
      });
      expect(console.log).toHaveBeenCalledWith(
        `Deleted old index: ${oldIndexName}`,
      );
    });

    test('should handle errors when deleting old indices', async () => {
      const oldIndexName = 'test-index-1234567890';
      mockClient.indices.getAlias.mockResolvedValue({
        body: {
          [oldIndexName]: { aliases: { [mockIndexAlias]: {} } },
        },
      } as any);
      mockClient.indices.delete.mockRejectedValue(new Error('Delete failed'));

      await indexOpenSearchData({
        awsRegion: 'us-east-1',
        stage: 'dev',
        openSearchUsername: 'testuser',
        openSearchPassword: 'testpass',
        indexAlias: mockIndexAlias,
        getData: mockGetData,
      });

      expect(console.error).toHaveBeenCalledWith(
        `Failed to delete old index ${oldIndexName}:`,
        expect.any(Error),
      );
    });

    test('should handle multiple old indices', async () => {
      const oldIndex1 = 'test-index-1234567890';
      const oldIndex2 = 'test-index-0987654321';
      mockClient.indices.getAlias.mockResolvedValue({
        body: {
          [oldIndex1]: { aliases: { [mockIndexAlias]: {} } },
          [oldIndex2]: { aliases: { [mockIndexAlias]: {} } },
        },
      } as any);

      await indexOpenSearchData({
        awsRegion: 'us-east-1',
        stage: 'dev',
        openSearchUsername: 'testuser',
        openSearchPassword: 'testpass',
        indexAlias: mockIndexAlias,
        getData: mockGetData,
      });

      expect(mockClient.indices.delete).toHaveBeenCalledWith({
        index: oldIndex1,
      });
      expect(mockClient.indices.delete).toHaveBeenCalledWith({
        index: oldIndex2,
      });
    });
  });

  describe('Error handling', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should handle getData errors', async () => {
      const errorGetData = jest
        .fn()
        .mockRejectedValue(new Error('Data fetch failed'));

      await expect(
        indexOpenSearchData({
          awsRegion: 'us-east-1',
          stage: 'dev',
          openSearchUsername: 'testuser',
          openSearchPassword: 'testpass',
          indexAlias: mockIndexAlias,
          getData: errorGetData,
        }),
      ).rejects.toThrow('Data fetch failed');
    });

    test('should handle index creation errors', async () => {
      mockClient.indices.create.mockRejectedValue(
        new Error('Index creation failed'),
      );

      await expect(
        indexOpenSearchData({
          awsRegion: 'us-east-1',
          stage: 'dev',
          openSearchUsername: 'testuser',
          openSearchPassword: 'testpass',
          indexAlias: mockIndexAlias,
          getData: mockGetData,
        }),
      ).rejects.toThrow('Index creation failed');
    });

    test('should handle bulk operation errors', async () => {
      mockClient.indices.create.mockResolvedValue({});
      mockClient.bulk.mockRejectedValue(new Error('Bulk operation failed'));

      await expect(
        indexOpenSearchData({
          awsRegion: 'us-east-1',
          stage: 'dev',
          openSearchUsername: 'testuser',
          openSearchPassword: 'testpass',
          indexAlias: mockIndexAlias,
          getData: jest.fn().mockResolvedValue({
            documents: mockDocuments,
            mapping: mockMapping,
          }),
        }),
      ).rejects.toThrow('Bulk operation failed');
    });

    test('should handle alias update errors', async () => {
      mockClient.indices.updateAliases.mockRejectedValue(
        new Error('Alias update failed'),
      );

      await expect(
        indexOpenSearchData({
          awsRegion: 'us-east-1',
          stage: 'dev',
          openSearchUsername: 'testuser',
          openSearchPassword: 'testpass',
          indexAlias: mockIndexAlias,
          getData: mockGetData,
        }),
      ).rejects.toThrow('Alias update failed');
    });
  });
});
