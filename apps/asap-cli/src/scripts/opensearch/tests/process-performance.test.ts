import {
  documentCategories,
  timeRanges,
  PerformanceMetrics,
} from '@asap-hub/model';
import { getClient, indexOpensearchData } from '@asap-hub/server-common';
import { getPerformanceMetrics } from '../../shared/performance-utils';
import {
  processUserProductivityPerformance,
  processPerformance,
  ProcessPerformanceOptions,
} from '../process-performance';

jest.mock('@asap-hub/server-common');
jest.mock('../../shared/performance-utils');

const mockGetClient = getClient as jest.MockedFunction<typeof getClient>;
const mockIndexOpensearchData = indexOpensearchData as jest.MockedFunction<
  typeof indexOpensearchData
>;
const mockGetPerformanceMetrics = getPerformanceMetrics as jest.MockedFunction<
  typeof getPerformanceMetrics
>;

type MockClient = {
  search: jest.Mock;
} & Partial<Awaited<ReturnType<typeof getClient>>>;

describe('processUserProductivityPerformance', () => {
  let mockClient: MockClient;
  let consoleInfoSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const mockPerformanceMetrics: PerformanceMetrics = {
      belowAverageMin: 0,
      belowAverageMax: 1,
      averageMin: 2,
      averageMax: 4,
      aboveAverageMin: 5,
      aboveAverageMax: 10,
    };

    mockGetPerformanceMetrics.mockReturnValue(mockPerformanceMetrics);
  });

  afterEach(() => {
    consoleInfoSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('should process user productivity performance for all time ranges and document categories', async () => {
    const mockHits = [
      {
        _source: {
          asapOutput: 5,
          asapPublicOutput: 3,
          ratio: 0.6,
          timeRange: 'all',
          documentCategory: 'article',
        },
      },
      {
        _source: {
          asapOutput: 10,
          asapPublicOutput: 8,
          ratio: 0.8,
          timeRange: 'all',
          documentCategory: 'article',
        },
      },
    ];

    mockClient = {
      search: jest.fn().mockResolvedValue({
        body: {
          hits: { hits: mockHits },
        },
      }),
    };

    const results = await processUserProductivityPerformance(
      mockClient as unknown as Awaited<ReturnType<typeof getClient>>,
    );

    // Should process all combinations (5 time ranges × 6 document categories = 30)
    expect(results).toHaveLength(30);

    // Verify each result has the correct structure
    results.forEach((result) => {
      expect(result).toHaveProperty('asapOutput');
      expect(result).toHaveProperty('asapPublicOutput');
      expect(result).toHaveProperty('ratio');
      expect(result).toHaveProperty('timeRange');
      expect(result).toHaveProperty('documentCategory');
      expect(timeRanges).toContain(result.timeRange);
      expect(documentCategories).toContain(result.documentCategory);
    });

    // Verify getPerformanceMetrics was called correctly (3 times per combination)
    // For integers (asapOutput and asapPublicOutput) and decimals (ratio)
    expect(mockGetPerformanceMetrics).toHaveBeenCalledTimes(90); // 30 combinations × 3 metrics

    // Verify info logs
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      expect.stringContaining('Processing performance metrics for'),
    );
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      expect.stringContaining('Processed performance metrics for'),
    );
  });

  it('should handle documents with missing fields gracefully', async () => {
    const mockHits = [
      {
        _source: {
          // Missing all optional fields
        },
      },
      {
        _source: {
          asapOutput: 5,
          // Missing other fields
        },
      },
      {
        _source: {
          ratio: 0.75,
          timeRange: 'last-30-days',
          documentCategory: 'protocol',
        },
      },
    ];

    mockClient = {
      search: jest.fn().mockResolvedValue({
        body: {
          hits: { hits: mockHits },
        },
      }),
    };

    const results = await processUserProductivityPerformance(
      mockClient as unknown as Awaited<ReturnType<typeof getClient>>,
    );

    expect(results).toHaveLength(30);

    // Verify metrics were calculated with default values
    expect(mockGetPerformanceMetrics).toHaveBeenCalledWith(
      expect.arrayContaining([0]),
      true,
    );
  });

  it('should log error and exclude failed combinations', async () => {
    const searchError = new Error('Search failed');

    mockClient = {
      search: jest.fn().mockRejectedValue(searchError),
    };

    const results = await processUserProductivityPerformance(
      mockClient as unknown as Awaited<ReturnType<typeof getClient>>,
    );

    // All combinations should fail, so results should be empty
    expect(results).toHaveLength(0);

    // Should log errors for each failed combination
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'Failed to process user productivity performance metrics for',
      ),
      expect.objectContaining({ error: searchError }),
    );
  });

  it('should handle empty hits array', async () => {
    mockClient = {
      search: jest.fn().mockResolvedValue({
        body: {
          hits: { hits: [] },
        },
      }),
    };

    const results = await processUserProductivityPerformance(
      mockClient as unknown as Awaited<ReturnType<typeof getClient>>,
    );

    expect(results).toHaveLength(30);

    // Verify getPerformanceMetrics was called with empty arrays
    expect(mockGetPerformanceMetrics).toHaveBeenCalledWith([], true);
    expect(mockGetPerformanceMetrics).toHaveBeenCalledWith([], false);
  });

  it('should process metrics concurrently for all combinations', async () => {
    mockClient = {
      search: jest.fn().mockResolvedValue({
        body: {
          hits: { hits: [] },
        },
      }),
    };

    await processUserProductivityPerformance(
      mockClient as unknown as Awaited<ReturnType<typeof getClient>>,
    );

    // All searches should be initiated (one per combination)
    expect(mockClient.search).toHaveBeenCalledTimes(30);

    // Verify searches were made with correct filters
    const { calls } = mockClient.search.mock;
    calls.forEach((call: unknown[]) => {
      const [firstArg] = call as [
        { body: { query: { bool: { must: unknown[] } } } },
      ];
      const { body } = firstArg;
      expect(body.query.bool.must).toHaveLength(2);
      expect(body.query.bool.must[0]).toHaveProperty('term');
      expect(body.query.bool.must[1]).toHaveProperty('term');
    });
  });
});

describe('processPerformance', () => {
  let consoleInfoSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  const defaultOptions: ProcessPerformanceOptions = {
    awsRegion: 'us-east-1',
    environment: 'dev',
    opensearchUsername: 'admin',
    opensearchPassword: 'password',
    metric: 'user-productivity',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const mockClient = {
      search: jest.fn().mockResolvedValue({
        body: {
          hits: { hits: [] },
        },
      }),
    };

    mockGetClient.mockResolvedValue(
      mockClient as unknown as Awaited<ReturnType<typeof getClient>>,
    );
    mockIndexOpensearchData.mockResolvedValue(undefined);
    mockGetPerformanceMetrics.mockReturnValue({
      belowAverageMin: 0,
      belowAverageMax: 1,
      averageMin: 2,
      averageMax: 4,
      aboveAverageMin: 5,
      aboveAverageMax: 10,
    });
  });

  afterEach(() => {
    consoleInfoSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('should process user productivity performance when metric is "user-productivity"', async () => {
    await processPerformance(defaultOptions);

    expect(mockIndexOpensearchData).toHaveBeenCalledWith({
      awsRegion: 'us-east-1',
      stage: 'dev',
      opensearchUsername: 'admin',
      opensearchPassword: 'password',
      indexAlias: 'user-productivity-performance',
      getData: expect.any(Function),
    });

    expect(consoleInfoSpy).toHaveBeenCalledWith(
      'Processing user-productivity-performance...',
    );
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      'Successfully indexed user-productivity-performance data',
    );
  });

  it('should process user productivity performance when metric is "all"', async () => {
    await processPerformance({ ...defaultOptions, metric: 'all' });

    expect(mockIndexOpensearchData).toHaveBeenCalled();
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      'Processing user-productivity-performance...',
    );
  });

  it('should not process when metric is neither "all" nor "user-productivity"', async () => {
    await processPerformance({
      ...defaultOptions,
      metric: 'some-other-metric' as ProcessPerformanceOptions['metric'],
    });

    expect(mockIndexOpensearchData).not.toHaveBeenCalled();
    expect(consoleInfoSpy).not.toHaveBeenCalled();
  });

  it('should call getData function with correct parameters', async () => {
    type GetDataFn = () => Promise<{
      documents: unknown[];
      mapping: typeof import('../mappings').userProductivityPerformanceMapping;
    }>;

    let getDataFn: GetDataFn | undefined;

    mockIndexOpensearchData.mockImplementation(async (options) => {
      getDataFn = options.getData as GetDataFn;
    });

    await processPerformance(defaultOptions);

    expect(getDataFn).toBeDefined();

    if (!getDataFn) {
      throw new Error('getDataFn should be defined');
    }

    const result = await getDataFn();

    expect(mockGetClient).toHaveBeenCalledWith(
      'us-east-1',
      'dev',
      'admin',
      'password',
    );

    expect(result).toHaveProperty('documents');
    expect(result).toHaveProperty('mapping');
    expect(result.documents).toHaveLength(30);
    expect(result.mapping).toHaveProperty('properties');
  });

  it('should include correct mapping in getData result', async () => {
    type GetDataFn = () => Promise<{
      documents: unknown[];
      mapping: typeof import('../mappings').userProductivityPerformanceMapping;
    }>;

    let getDataFn: GetDataFn | undefined;

    mockIndexOpensearchData.mockImplementation(async (options) => {
      getDataFn = options.getData as GetDataFn;
    });

    await processPerformance(defaultOptions);

    if (!getDataFn) {
      throw new Error('getDataFn should be defined');
    }

    const result = await getDataFn();

    expect(result.mapping).toEqual({
      properties: {
        asapOutput: {
          properties: {
            belowAverageMin: { type: 'integer' },
            belowAverageMax: { type: 'integer' },
            averageMin: { type: 'integer' },
            averageMax: { type: 'integer' },
            aboveAverageMin: { type: 'integer' },
            aboveAverageMax: { type: 'integer' },
          },
        },
        asapPublicOutput: {
          properties: {
            belowAverageMin: { type: 'integer' },
            belowAverageMax: { type: 'integer' },
            averageMin: { type: 'integer' },
            averageMax: { type: 'integer' },
            aboveAverageMin: { type: 'integer' },
            aboveAverageMax: { type: 'integer' },
          },
        },
        ratio: {
          properties: {
            belowAverageMin: { type: 'float' },
            belowAverageMax: { type: 'float' },
            averageMin: { type: 'float' },
            averageMax: { type: 'float' },
            aboveAverageMin: { type: 'float' },
            aboveAverageMax: { type: 'float' },
          },
        },
        timeRange: { type: 'keyword' },
        documentCategory: { type: 'keyword' },
      },
    });
  });

  it('should handle errors and rethrow', async () => {
    const indexError = new Error('Failed to index data');
    mockIndexOpensearchData.mockRejectedValue(indexError);

    await expect(processPerformance(defaultOptions)).rejects.toThrow(
      indexError,
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to process user-productivity-performance',
      { error: indexError },
    );
  });

  it('should handle errors from getData function', async () => {
    const clientError = new Error('Failed to get client');
    mockGetClient.mockRejectedValue(clientError);

    // Make indexOpensearchData call getData and let the error propagate
    mockIndexOpensearchData.mockImplementation(async (options) => {
      await options.getData();
    });

    await expect(processPerformance(defaultOptions)).rejects.toThrow(
      clientError,
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to process user-productivity-performance',
      expect.objectContaining({ error: clientError }),
    );
  });
});
