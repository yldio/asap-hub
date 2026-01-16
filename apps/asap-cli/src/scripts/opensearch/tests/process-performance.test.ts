import {
  documentCategories,
  timeRanges,
  outputTypes,
  PerformanceMetrics,
} from '@asap-hub/model';
import { getClient, indexOpensearchData } from '@asap-hub/server-common';
import { getPerformanceMetrics } from '../../shared/performance-utils';
import {
  processUserProductivityPerformance,
  processTeamProductivityPerformance,
  processUserCollaborationPerformance,
  processTeamCollaborationPerformance,
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

    // Should process all combinations (5 time ranges x 6 document categories = 30)
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
    expect(mockGetPerformanceMetrics).toHaveBeenCalledTimes(90); // 30 combinations x 3 metrics

    // Verify info logs
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      expect.stringContaining('Processing user performance metrics for'),
    );
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      expect.stringContaining('Processed user performance metrics for'),
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

describe('processTeamProductivityPerformance', () => {
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

  it('should process team productivity performance for all time ranges and output types', async () => {
    const mockHits = [
      {
        _source: {
          Article: 5,
          Bioinformatics: 3,
          Dataset: 2,
          'Lab Material': 1,
          Protocol: 4,
          timeRange: 'all',
          outputType: 'public',
        },
      },
      {
        _source: {
          Article: 10,
          Bioinformatics: 8,
          Dataset: 6,
          'Lab Material': 3,
          Protocol: 7,
          timeRange: 'all',
          outputType: 'public',
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

    const results = await processTeamProductivityPerformance(
      mockClient as unknown as Awaited<ReturnType<typeof getClient>>,
    );

    // Should process all combinations (5 time ranges x 2 output types = 10)
    expect(results).toHaveLength(10);

    // Verify each result has the correct structure
    results.forEach((result) => {
      expect(result).toHaveProperty('article');
      expect(result).toHaveProperty('bioinformatics');
      expect(result).toHaveProperty('dataset');
      expect(result).toHaveProperty('labMaterial');
      expect(result).toHaveProperty('protocol');
      expect(result).toHaveProperty('timeRange');
      expect(result).toHaveProperty('outputType');
      expect(timeRanges).toContain(result.timeRange);
      expect(outputTypes).toContain(result.outputType);
    });

    // Verify getPerformanceMetrics was called correctly (5 document types per combination)
    expect(mockGetPerformanceMetrics).toHaveBeenCalledTimes(50); // 10 combinations x 5 document types

    // Verify info logs
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      expect.stringContaining('Processing team performance metrics for'),
    );
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      expect.stringContaining('Processed team performance metrics for'),
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
          Article: 5,
          // Missing other fields
        },
      },
      {
        _source: {
          Protocol: 3,
          timeRange: 'last-30-days',
          outputType: 'all',
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

    const results = await processTeamProductivityPerformance(
      mockClient as unknown as Awaited<ReturnType<typeof getClient>>,
    );

    expect(results).toHaveLength(10);

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

    const results = await processTeamProductivityPerformance(
      mockClient as unknown as Awaited<ReturnType<typeof getClient>>,
    );

    // All combinations should fail, so results should be empty
    expect(results).toHaveLength(0);

    // Should log errors for each failed combination
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'Failed to process team productivity performance metrics for',
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

    const results = await processTeamProductivityPerformance(
      mockClient as unknown as Awaited<ReturnType<typeof getClient>>,
    );

    expect(results).toHaveLength(10);

    // Verify getPerformanceMetrics was called with empty arrays
    expect(mockGetPerformanceMetrics).toHaveBeenCalledWith([], true);
  });

  it('should process metrics concurrently for all combinations', async () => {
    mockClient = {
      search: jest.fn().mockResolvedValue({
        body: {
          hits: { hits: [] },
        },
      }),
    };

    await processTeamProductivityPerformance(
      mockClient as unknown as Awaited<ReturnType<typeof getClient>>,
    );

    // All searches should be initiated (one per combination)
    expect(mockClient.search).toHaveBeenCalledTimes(10);

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

  it('should process team productivity performance when metric is "team-productivity"', async () => {
    await processPerformance({
      ...defaultOptions,
      metric: 'team-productivity',
    });

    expect(mockIndexOpensearchData).toHaveBeenCalledWith({
      awsRegion: 'us-east-1',
      stage: 'dev',
      opensearchUsername: 'admin',
      opensearchPassword: 'password',
      indexAlias: 'team-productivity-performance',
      getData: expect.any(Function),
    });

    expect(consoleInfoSpy).toHaveBeenCalledWith(
      'Processing team-productivity-performance...',
    );
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      'Successfully indexed team-productivity-performance data',
    );
  });

  it('should process user collaboration performance when metric is "user-collaboration"', async () => {
    await processPerformance({
      ...defaultOptions,
      metric: 'user-collaboration',
    });

    expect(mockIndexOpensearchData).toHaveBeenCalledWith({
      awsRegion: 'us-east-1',
      stage: 'dev',
      opensearchUsername: 'admin',
      opensearchPassword: 'password',
      indexAlias: 'user-collaboration-performance',
      getData: expect.any(Function),
    });

    expect(consoleInfoSpy).toHaveBeenCalledWith(
      'Processing user-collaboration-performance...',
    );
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      'Successfully indexed user-collaboration-performance data',
    );
  });

  it('should process both user and team productivity performance when metric is "all"', async () => {
    await processPerformance({ ...defaultOptions, metric: 'all' });

    expect(mockIndexOpensearchData).toHaveBeenCalledTimes(4);
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      'Processing user-productivity-performance...',
    );
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      'Processing team-productivity-performance...',
    );
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      'Processing user-collaboration-performance...',
    );
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      'Processing team-collaboration-performance...',
    );
  });

  it('should process team collaboration performance when metric is "team-collaboration"', async () => {
    await processPerformance({
      ...defaultOptions,
      metric: 'team-collaboration',
    });

    expect(mockIndexOpensearchData).toHaveBeenCalledWith({
      awsRegion: 'us-east-1',
      stage: 'dev',
      opensearchUsername: 'admin',
      opensearchPassword: 'password',
      indexAlias: 'team-collaboration-performance',
      getData: expect.any(Function),
    });

    expect(consoleInfoSpy).toHaveBeenCalledWith(
      'Processing team-collaboration-performance...',
    );
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      'Successfully indexed team-collaboration-performance data',
    );
  });

  it('should not process when metric is neither "all", "user-productivity", "team-productivity", "user-collaboration", nor "team-collaboration"', async () => {
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

  it('should call getData function with correct parameters for team-productivity', async () => {
    type GetDataFn = () => Promise<{
      documents: unknown[];
      mapping: typeof import('../mappings').teamProductivityPerformanceMapping;
    }>;

    let getDataFn: GetDataFn | undefined;

    mockIndexOpensearchData.mockImplementation(async (options) => {
      getDataFn = options.getData as GetDataFn;
    });

    await processPerformance({
      ...defaultOptions,
      metric: 'team-productivity',
    });

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
    expect(result.documents).toHaveLength(10);
    expect(result.mapping).toHaveProperty('properties');
  });

  it('should include correct mapping in getData result for team-productivity', async () => {
    type GetDataFn = () => Promise<{
      documents: unknown[];
      mapping: typeof import('../mappings').teamProductivityPerformanceMapping;
    }>;

    let getDataFn: GetDataFn | undefined;

    mockIndexOpensearchData.mockImplementation(async (options) => {
      getDataFn = options.getData as GetDataFn;
    });

    await processPerformance({
      ...defaultOptions,
      metric: 'team-productivity',
    });

    if (!getDataFn) {
      throw new Error('getDataFn should be defined');
    }

    const result = await getDataFn();

    expect(result.mapping).toEqual({
      properties: {
        article: {
          properties: {
            belowAverageMin: { type: 'integer' },
            belowAverageMax: { type: 'integer' },
            averageMin: { type: 'integer' },
            averageMax: { type: 'integer' },
            aboveAverageMin: { type: 'integer' },
            aboveAverageMax: { type: 'integer' },
          },
        },
        bioinformatics: {
          properties: {
            belowAverageMin: { type: 'integer' },
            belowAverageMax: { type: 'integer' },
            averageMin: { type: 'integer' },
            averageMax: { type: 'integer' },
            aboveAverageMin: { type: 'integer' },
            aboveAverageMax: { type: 'integer' },
          },
        },
        dataset: {
          properties: {
            belowAverageMin: { type: 'integer' },
            belowAverageMax: { type: 'integer' },
            averageMin: { type: 'integer' },
            averageMax: { type: 'integer' },
            aboveAverageMin: { type: 'integer' },
            aboveAverageMax: { type: 'integer' },
          },
        },
        labMaterial: {
          properties: {
            belowAverageMin: { type: 'integer' },
            belowAverageMax: { type: 'integer' },
            averageMin: { type: 'integer' },
            averageMax: { type: 'integer' },
            aboveAverageMin: { type: 'integer' },
            aboveAverageMax: { type: 'integer' },
          },
        },
        protocol: {
          properties: {
            belowAverageMin: { type: 'integer' },
            belowAverageMax: { type: 'integer' },
            averageMin: { type: 'integer' },
            averageMax: { type: 'integer' },
            aboveAverageMin: { type: 'integer' },
            aboveAverageMax: { type: 'integer' },
          },
        },
        timeRange: { type: 'keyword' },
        outputType: { type: 'keyword' },
      },
    });
  });

  it('should call getData function with correct parameters for user-collaboration', async () => {
    type GetDataFn = () => Promise<{
      documents: unknown[];
      mapping: typeof import('../mappings').userCollaborationPerformanceMapping;
    }>;

    let getDataFn: GetDataFn | undefined;

    mockIndexOpensearchData.mockImplementation(async (options) => {
      getDataFn = options.getData as GetDataFn;
    });

    await processPerformance({
      ...defaultOptions,
      metric: 'user-collaboration',
    });

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

  it('should include correct mapping in getData result for user-collaboration', async () => {
    type GetDataFn = () => Promise<{
      documents: unknown[];
      mapping: typeof import('../mappings').userCollaborationPerformanceMapping;
    }>;

    let getDataFn: GetDataFn | undefined;

    mockIndexOpensearchData.mockImplementation(async (options) => {
      getDataFn = options.getData as GetDataFn;
    });

    await processPerformance({
      ...defaultOptions,
      metric: 'user-collaboration',
    });

    if (!getDataFn) {
      throw new Error('getDataFn should be defined');
    }

    const result = await getDataFn();

    expect(result.mapping).toEqual({
      properties: {
        withinTeam: {
          properties: {
            belowAverageMin: { type: 'integer' },
            belowAverageMax: { type: 'integer' },
            averageMin: { type: 'integer' },
            averageMax: { type: 'integer' },
            aboveAverageMin: { type: 'integer' },
            aboveAverageMax: { type: 'integer' },
          },
        },
        acrossTeam: {
          properties: {
            belowAverageMin: { type: 'integer' },
            belowAverageMax: { type: 'integer' },
            averageMin: { type: 'integer' },
            averageMax: { type: 'integer' },
            aboveAverageMin: { type: 'integer' },
            aboveAverageMax: { type: 'integer' },
          },
        },
        timeRange: { type: 'keyword' },
        documentCategory: { type: 'keyword' },
      },
    });
  });

  it('should call getData function with correct parameters for team-collaboration', async () => {
    type GetDataFn = () => Promise<{
      documents: unknown[];
      mapping: typeof import('../mappings').teamCollaborationPerformanceMapping;
    }>;

    let getDataFn: GetDataFn | undefined;

    mockIndexOpensearchData.mockImplementation(async (options) => {
      getDataFn = options.getData as GetDataFn;
    });

    await processPerformance({
      ...defaultOptions,
      metric: 'team-collaboration',
    });

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
    expect(result.documents).toHaveLength(10);
    expect(result.mapping).toHaveProperty('properties');
  });

  it('should include correct mapping in getData result for team-collaboration', async () => {
    type GetDataFn = () => Promise<{
      documents: unknown[];
      mapping: typeof import('../mappings').teamCollaborationPerformanceMapping;
    }>;

    let getDataFn: GetDataFn | undefined;

    mockIndexOpensearchData.mockImplementation(async (options) => {
      getDataFn = options.getData as GetDataFn;
    });

    await processPerformance({
      ...defaultOptions,
      metric: 'team-collaboration',
    });

    if (!getDataFn) {
      throw new Error('getDataFn should be defined');
    }

    const result = await getDataFn();

    expect(result.mapping).toEqual({
      properties: {
        withinTeam: {
          properties: {
            article: {
              properties: {
                belowAverageMin: { type: 'integer' },
                belowAverageMax: { type: 'integer' },
                averageMin: { type: 'integer' },
                averageMax: { type: 'integer' },
                aboveAverageMin: { type: 'integer' },
                aboveAverageMax: { type: 'integer' },
              },
            },
            bioinformatics: {
              properties: {
                belowAverageMin: { type: 'integer' },
                belowAverageMax: { type: 'integer' },
                averageMin: { type: 'integer' },
                averageMax: { type: 'integer' },
                aboveAverageMin: { type: 'integer' },
                aboveAverageMax: { type: 'integer' },
              },
            },
            dataset: {
              properties: {
                belowAverageMin: { type: 'integer' },
                belowAverageMax: { type: 'integer' },
                averageMin: { type: 'integer' },
                averageMax: { type: 'integer' },
                aboveAverageMin: { type: 'integer' },
                aboveAverageMax: { type: 'integer' },
              },
            },
            labMaterial: {
              properties: {
                belowAverageMin: { type: 'integer' },
                belowAverageMax: { type: 'integer' },
                averageMin: { type: 'integer' },
                averageMax: { type: 'integer' },
                aboveAverageMin: { type: 'integer' },
                aboveAverageMax: { type: 'integer' },
              },
            },
            protocol: {
              properties: {
                belowAverageMin: { type: 'integer' },
                belowAverageMax: { type: 'integer' },
                averageMin: { type: 'integer' },
                averageMax: { type: 'integer' },
                aboveAverageMin: { type: 'integer' },
                aboveAverageMax: { type: 'integer' },
              },
            },
          },
        },
        acrossTeam: {
          properties: {
            article: {
              properties: {
                belowAverageMin: { type: 'integer' },
                belowAverageMax: { type: 'integer' },
                averageMin: { type: 'integer' },
                averageMax: { type: 'integer' },
                aboveAverageMin: { type: 'integer' },
                aboveAverageMax: { type: 'integer' },
              },
            },
            bioinformatics: {
              properties: {
                belowAverageMin: { type: 'integer' },
                belowAverageMax: { type: 'integer' },
                averageMin: { type: 'integer' },
                averageMax: { type: 'integer' },
                aboveAverageMin: { type: 'integer' },
                aboveAverageMax: { type: 'integer' },
              },
            },
            dataset: {
              properties: {
                belowAverageMin: { type: 'integer' },
                belowAverageMax: { type: 'integer' },
                averageMin: { type: 'integer' },
                averageMax: { type: 'integer' },
                aboveAverageMin: { type: 'integer' },
                aboveAverageMax: { type: 'integer' },
              },
            },
            labMaterial: {
              properties: {
                belowAverageMin: { type: 'integer' },
                belowAverageMax: { type: 'integer' },
                averageMin: { type: 'integer' },
                averageMax: { type: 'integer' },
                aboveAverageMin: { type: 'integer' },
                aboveAverageMax: { type: 'integer' },
              },
            },
            protocol: {
              properties: {
                belowAverageMin: { type: 'integer' },
                belowAverageMax: { type: 'integer' },
                averageMin: { type: 'integer' },
                averageMax: { type: 'integer' },
                aboveAverageMin: { type: 'integer' },
                aboveAverageMax: { type: 'integer' },
              },
            },
          },
        },
        timeRange: { type: 'keyword' },
        outputType: { type: 'keyword' },
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

  it('should handle errors for team-productivity and rethrow', async () => {
    const indexError = new Error('Failed to index team data');
    mockIndexOpensearchData.mockRejectedValue(indexError);

    await expect(
      processPerformance({ ...defaultOptions, metric: 'team-productivity' }),
    ).rejects.toThrow(indexError);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to process team-productivity-performance',
      { error: indexError },
    );
  });

  it('should handle errors from getData function for team-productivity', async () => {
    const clientError = new Error('Failed to get client for teams');
    mockGetClient.mockRejectedValue(clientError);

    // Make indexOpensearchData call getData and let the error propagate
    mockIndexOpensearchData.mockImplementation(async (options) => {
      await options.getData();
    });

    await expect(
      processPerformance({ ...defaultOptions, metric: 'team-productivity' }),
    ).rejects.toThrow(clientError);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to process team-productivity-performance',
      expect.objectContaining({ error: clientError }),
    );
  });

  it('should handle errors for user-collaboration and rethrow', async () => {
    const indexError = new Error('Failed to index user collaboration data');
    mockIndexOpensearchData.mockRejectedValue(indexError);

    await expect(
      processPerformance({ ...defaultOptions, metric: 'user-collaboration' }),
    ).rejects.toThrow(indexError);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to process user-collaboration-performance',
      { error: indexError },
    );
  });

  it('should handle errors from getData function for user-collaboration', async () => {
    const clientError = new Error(
      'Failed to get client for user collaboration',
    );
    mockGetClient.mockRejectedValue(clientError);

    // Make indexOpensearchData call getData and let the error propagate
    mockIndexOpensearchData.mockImplementation(async (options) => {
      await options.getData();
    });

    await expect(
      processPerformance({ ...defaultOptions, metric: 'user-collaboration' }),
    ).rejects.toThrow(clientError);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to process user-collaboration-performance',
      expect.objectContaining({ error: clientError }),
    );
  });

  it('should handle errors for team-collaboration and rethrow', async () => {
    const indexError = new Error('Failed to index team collaboration data');
    mockIndexOpensearchData.mockRejectedValue(indexError);

    await expect(
      processPerformance({
        ...defaultOptions,
        metric: 'team-collaboration',
      }),
    ).rejects.toThrow(indexError);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to process team-collaboration-performance',
      { error: indexError },
    );
  });

  it('should handle errors from getData function for team-collaboration', async () => {
    const clientError = new Error(
      'Failed to get client for team collaboration',
    );
    mockGetClient.mockRejectedValue(clientError);

    // Make indexOpensearchData call getData and let the error propagate
    mockIndexOpensearchData.mockImplementation(async (options) => {
      await options.getData();
    });

    await expect(
      processPerformance({
        ...defaultOptions,
        metric: 'team-collaboration',
      }),
    ).rejects.toThrow(clientError);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to process team-collaboration-performance',
      expect.objectContaining({ error: clientError }),
    );
  });
});

describe('processUserCollaborationPerformance', () => {
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

  it('should process user collaboration performance for all time ranges and document categories', async () => {
    const mockHits = [
      {
        _source: {
          teams: [
            {
              outputsCoAuthoredWithinTeam: 5,
              outputsCoAuthoredAcrossTeams: 3,
            },
            {
              outputsCoAuthoredWithinTeam: 2,
              outputsCoAuthoredAcrossTeams: 1,
            },
          ],
          timeRange: 'all',
          documentCategory: 'article',
        },
      },
      {
        _source: {
          teams: [
            {
              outputsCoAuthoredWithinTeam: 10,
              outputsCoAuthoredAcrossTeams: 8,
            },
          ],
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

    const results = await processUserCollaborationPerformance(
      mockClient as unknown as Awaited<ReturnType<typeof getClient>>,
    );

    // Should process all combinations (5 time ranges x 6 document categories = 30)
    expect(results).toHaveLength(30);

    // Verify each result has the correct structure
    results.forEach((result) => {
      expect(result).toHaveProperty('withinTeam');
      expect(result).toHaveProperty('acrossTeam');
      expect(result).toHaveProperty('timeRange');
      expect(result).toHaveProperty('documentCategory');
      expect(timeRanges).toContain(result.timeRange);
      expect(documentCategories).toContain(result.documentCategory);
    });

    // Verify getPerformanceMetrics was called correctly (2 times per combination)
    expect(mockGetPerformanceMetrics).toHaveBeenCalledTimes(60); // 30 combinations x 2 metrics

    // Verify info logs
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'Processing user collaboration performance metrics for',
      ),
    );
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'Processed user collaboration performance metrics for',
      ),
    );
  });

  it('should handle documents with missing or undefined team properties gracefully', async () => {
    const mockHits = [
      {
        _source: {
          teams: [
            {
              // Missing both properties
            },
            {
              outputsCoAuthoredWithinTeam: 5,
              // Missing outputsCoAuthoredAcrossTeams
            },
            {
              // Missing outputsCoAuthoredWithinTeam
              outputsCoAuthoredAcrossTeams: 3,
            },
            {
              outputsCoAuthoredWithinTeam: 10,
              outputsCoAuthoredAcrossTeams: 8,
            },
          ],
          timeRange: 'all',
          documentCategory: 'article',
        },
      },
      {
        _source: {
          // Missing teams array
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

    const results = await processUserCollaborationPerformance(
      mockClient as unknown as Awaited<ReturnType<typeof getClient>>,
    );

    expect(results).toHaveLength(30);

    // Verify metrics were calculated with default values (0) for missing properties
    expect(mockGetPerformanceMetrics).toHaveBeenCalledWith(
      expect.arrayContaining([0, 5, 0, 10]),
      true,
    );
    expect(mockGetPerformanceMetrics).toHaveBeenCalledWith(
      expect.arrayContaining([0, 0, 3, 8]),
      true,
    );
  });

  it('should handle empty teams array', async () => {
    const mockHits = [
      {
        _source: {
          teams: [],
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

    const results = await processUserCollaborationPerformance(
      mockClient as unknown as Awaited<ReturnType<typeof getClient>>,
    );

    expect(results).toHaveLength(30);

    // Verify getPerformanceMetrics was called with empty arrays
    expect(mockGetPerformanceMetrics).toHaveBeenCalledWith([], true);
  });

  it('should flatten teams from all users correctly', async () => {
    const mockHits = [
      {
        _source: {
          teams: [
            {
              outputsCoAuthoredWithinTeam: 1,
              outputsCoAuthoredAcrossTeams: 2,
            },
            {
              outputsCoAuthoredWithinTeam: 3,
              outputsCoAuthoredAcrossTeams: 4,
            },
          ],
          timeRange: 'all',
          documentCategory: 'article',
        },
      },
      {
        _source: {
          teams: [
            {
              outputsCoAuthoredWithinTeam: 5,
              outputsCoAuthoredAcrossTeams: 6,
            },
          ],
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

    await processUserCollaborationPerformance(
      mockClient as unknown as Awaited<ReturnType<typeof getClient>>,
    );

    // Verify getPerformanceMetrics was called with flattened arrays
    expect(mockGetPerformanceMetrics).toHaveBeenCalledWith([1, 3, 5], true);
    expect(mockGetPerformanceMetrics).toHaveBeenCalledWith([2, 4, 6], true);
  });

  it('should log error and exclude failed combinations', async () => {
    const searchError = new Error('Search failed');

    mockClient = {
      search: jest.fn().mockRejectedValue(searchError),
    };

    const results = await processUserCollaborationPerformance(
      mockClient as unknown as Awaited<ReturnType<typeof getClient>>,
    );

    // All combinations should fail, so results should be empty
    expect(results).toHaveLength(0);

    // Should log errors for each failed combination
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'Failed to process user collaboration performance metrics for',
      ),
      expect.objectContaining({ error: searchError }),
    );
  });

  it('should process metrics concurrently for all combinations', async () => {
    mockClient = {
      search: jest.fn().mockResolvedValue({
        body: {
          hits: { hits: [] },
        },
      }),
    };

    await processUserCollaborationPerformance(
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

describe('processTeamCollaborationPerformance', () => {
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

  it('should process team collaboration performance for all time ranges and output types', async () => {
    const mockHits = [
      {
        _source: {
          Article: 5,
          Bioinformatics: 3,
          Dataset: 2,
          'Lab Material': 1,
          Protocol: 4,
          ArticleAcross: 3,
          BioinformaticsAcross: 2,
          DatasetAcross: 1,
          'Lab Material Across': 0,
          ProtocolAcross: 2,
          timeRange: 'all',
          outputType: 'public',
        },
      },
      {
        _source: {
          Article: 10,
          Bioinformatics: 8,
          Dataset: 6,
          'Lab Material': 3,
          Protocol: 7,
          ArticleAcross: 8,
          BioinformaticsAcross: 6,
          DatasetAcross: 4,
          'Lab Material Across': 2,
          ProtocolAcross: 5,
          timeRange: 'all',
          outputType: 'public',
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

    const results = await processTeamCollaborationPerformance(
      mockClient as unknown as Awaited<ReturnType<typeof getClient>>,
    );

    // Should process all combinations (5 time ranges x 2 output types = 10)
    expect(results).toHaveLength(10);

    // Verify each result has the correct structure
    results.forEach((result) => {
      expect(result).toHaveProperty('withinTeam');
      expect(result).toHaveProperty('acrossTeam');
      expect(result).toHaveProperty('timeRange');
      expect(result).toHaveProperty('outputType');
      expect(timeRanges).toContain(result.timeRange);
      expect(outputTypes).toContain(result.outputType);

      // Verify withinTeam structure
      expect(result.withinTeam).toHaveProperty('article');
      expect(result.withinTeam).toHaveProperty('bioinformatics');
      expect(result.withinTeam).toHaveProperty('dataset');
      expect(result.withinTeam).toHaveProperty('labMaterial');
      expect(result.withinTeam).toHaveProperty('protocol');

      // Verify acrossTeam structure
      expect(result.acrossTeam).toHaveProperty('article');
      expect(result.acrossTeam).toHaveProperty('bioinformatics');
      expect(result.acrossTeam).toHaveProperty('dataset');
      expect(result.acrossTeam).toHaveProperty('labMaterial');
      expect(result.acrossTeam).toHaveProperty('protocol');
    });

    // Verify getPerformanceMetrics was called correctly
    // 10 combinations x (5 withinTeam + 5 acrossTeam) = 100 calls
    expect(mockGetPerformanceMetrics).toHaveBeenCalledTimes(100);

    // Verify info logs
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'Processing team collaboration performance metrics for',
      ),
    );
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'Processed team collaboration performance metrics for',
      ),
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
          Article: 5,
          // Missing other fields
        },
      },
      {
        _source: {
          Protocol: 3,
          ProtocolAcross: 2,
          timeRange: 'last-30-days',
          outputType: 'all',
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

    const results = await processTeamCollaborationPerformance(
      mockClient as unknown as Awaited<ReturnType<typeof getClient>>,
    );

    expect(results).toHaveLength(10);

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

    const results = await processTeamCollaborationPerformance(
      mockClient as unknown as Awaited<ReturnType<typeof getClient>>,
    );

    // All combinations should fail, so results should be empty
    expect(results).toHaveLength(0);

    // Should log errors for each failed combination
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'Failed to process team collaboration performance metrics for',
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

    const results = await processTeamCollaborationPerformance(
      mockClient as unknown as Awaited<ReturnType<typeof getClient>>,
    );

    expect(results).toHaveLength(10);

    // Verify getPerformanceMetrics was called with empty arrays
    expect(mockGetPerformanceMetrics).toHaveBeenCalledWith([], true);
  });

  it('should process metrics concurrently for all combinations', async () => {
    mockClient = {
      search: jest.fn().mockResolvedValue({
        body: {
          hits: { hits: [] },
        },
      }),
    };

    await processTeamCollaborationPerformance(
      mockClient as unknown as Awaited<ReturnType<typeof getClient>>,
    );

    // All searches should be initiated (one per combination)
    expect(mockClient.search).toHaveBeenCalledTimes(10);

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

  it('should correctly separate withinTeam and acrossTeam metrics', async () => {
    const mockHits = [
      {
        _source: {
          Article: 5,
          Bioinformatics: 3,
          Dataset: 2,
          'Lab Material': 1,
          Protocol: 4,
          ArticleAcross: 3,
          BioinformaticsAcross: 2,
          DatasetAcross: 1,
          'Lab Material Across': 0,
          ProtocolAcross: 2,
          timeRange: 'all',
          outputType: 'public',
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

    await processTeamCollaborationPerformance(
      mockClient as unknown as Awaited<ReturnType<typeof getClient>>,
    );

    // Verify withinTeam metrics were calculated with correct values
    expect(mockGetPerformanceMetrics).toHaveBeenCalledWith([5], true); // Article withinTeam
    expect(mockGetPerformanceMetrics).toHaveBeenCalledWith([3], true); // Bioinformatics withinTeam
    expect(mockGetPerformanceMetrics).toHaveBeenCalledWith([2], true); // Dataset withinTeam
    expect(mockGetPerformanceMetrics).toHaveBeenCalledWith([1], true); // Lab Material withinTeam
    expect(mockGetPerformanceMetrics).toHaveBeenCalledWith([4], true); // Protocol withinTeam

    // Verify acrossTeam metrics were calculated with correct values
    expect(mockGetPerformanceMetrics).toHaveBeenCalledWith([3], true); // Article acrossTeam
    expect(mockGetPerformanceMetrics).toHaveBeenCalledWith([2], true); // Bioinformatics acrossTeam
    expect(mockGetPerformanceMetrics).toHaveBeenCalledWith([1], true); // Dataset acrossTeam
    expect(mockGetPerformanceMetrics).toHaveBeenCalledWith([0], true); // Lab Material acrossTeam
    expect(mockGetPerformanceMetrics).toHaveBeenCalledWith([2], true); // Protocol acrossTeam
  });
});
