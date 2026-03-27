/* eslint-disable @typescript-eslint/no-explicit-any */

jest.mock('../../../src/config', () => ({
  awsRegion: 'us-east-1',
  environment: 'test',
  opensearchPassword: 'test-password',
  opensearchUsername: 'test-username',
}));

jest.mock('@asap-hub/server-common', () => ({
  indexOpensearchData: jest.fn().mockResolvedValue(undefined),
}));

// sync-opensearch-analytics imports analytics dependency wiring; mock to avoid side effects.
jest.mock('../../../src/dependencies/analytics.dependencies', () => ({
  getAnalyticsDataProvider: jest.fn().mockReturnValue({}),
}));

jest.mock('../preprint-compliance', () => ({
  exportPreprintComplianceData: jest.fn().mockResolvedValue([]),
}));

jest.mock('../publication-compliance', () => ({
  exportPublicationComplianceData: jest.fn().mockResolvedValue([]),
}));

jest.mock('../../../src/controllers/analytics.controller', () => {
  return jest.fn().mockImplementation(() => ({}));
});

jest.mock('../milestones', () => ({
  exportMilestonesData: jest.fn().mockResolvedValue([]),
}));

jest.mock('../aims', () => ({
  exportAimsData: jest.fn(),
}));

import { indexOpensearchData } from '@asap-hub/server-common';
import { exportAimsData } from '../aims';
import { exportMetricToOpensearch } from '../sync-opensearch-analytics';

const mockExportAimsData = exportAimsData as jest.MockedFunction<
  typeof exportAimsData
>;

const mockIndexOpensearchData = indexOpensearchData as jest.MockedFunction<
  typeof indexOpensearchData
>;

describe('Aims sync integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call indexOpensearchData with correct config and mapping for project-aims', async () => {
    const mockAimsDocs = [
      {
        id: 'aim-1',
        description: 'First aim',
        grantType: 'original',
        teamName: 'Team Alpha',
        status: 'Active',
        articleCount: 3,
        articlesDOI: '10.1000/abc,10.1000/def',
        createdDate: '2025-01-01T00:00:00.000Z',
        lastDate: '2025-06-01T00:00:00.000Z',
      },
    ];

    mockExportAimsData.mockResolvedValue(mockAimsDocs as any[]);

    await exportMetricToOpensearch('project-aims');

    expect(mockExportAimsData).toHaveBeenCalledTimes(1);
    expect(mockIndexOpensearchData).toHaveBeenCalledWith(
      expect.objectContaining({
        indexAlias: 'project-aims',
        getData: expect.any(Function),
      }),
    );

    const call = mockIndexOpensearchData.mock.calls[0];
    if (call) {
      const options = call[0] as any;
      const data = await options.getData();

      expect(data.documents).toEqual(mockAimsDocs);
      expect(data.mapping.properties).toHaveProperty('description');
      expect(data.mapping.properties).toHaveProperty('grantType');
      expect(data.mapping.properties).toHaveProperty('teamName');
      expect(data.mapping.properties).toHaveProperty('status');
      expect(data.mapping.properties).toHaveProperty('articleCount');
      expect(data.mapping.properties).toHaveProperty('articlesDOI');
      expect(data.mapping.properties).toHaveProperty('createdDate');
      expect(data.mapping.properties).toHaveProperty('lastDate');
    }
  });
});
