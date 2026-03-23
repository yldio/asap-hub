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

// We do not need the analytics data provider for milestones, but sync-opensearch-analytics
// still imports its dependency wiring, so we mock it to avoid accidental calls.
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
  exportMilestonesData: jest.fn(),
}));

import { indexOpensearchData } from '@asap-hub/server-common';
import { exportMilestonesData } from '../milestones';
import { exportMetricToOpensearch } from '../sync-opensearch-analytics';

const mockExportMilestonesData = exportMilestonesData as jest.MockedFunction<
  typeof exportMilestonesData
>;

const mockIndexOpensearchData = indexOpensearchData as jest.MockedFunction<
  typeof indexOpensearchData
>;

describe('Milestones sync integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call indexOpensearchData with correct config and mapping for project-milestones', async () => {
    const mockMilestoneDocs = [
      {
        id: 'milestone-1',
        description: 'First milestone',
        aimNumbersAsc: '1,2',
        aimNumbersDesc: '2,1',
        status: 'In Progress',
        articleCount: 3,
        articlesDOI: '10.1000/xyz123,10.1000/xyz456,10.1000/xyz789',
        createdDate: '2025-01-01T00:00:00.000Z',
        lastDate: '2025-02-01T00:00:00.000Z',
      },
    ];

    mockExportMilestonesData.mockResolvedValue(mockMilestoneDocs as any[]);

    await exportMetricToOpensearch('project-milestones');

    expect(mockExportMilestonesData).toHaveBeenCalledTimes(1);
    expect(mockIndexOpensearchData).toHaveBeenCalledWith(
      expect.objectContaining({
        indexAlias: 'project-milestones',
        getData: expect.any(Function),
      }),
    );

    const call = mockIndexOpensearchData.mock.calls[0];
    if (call) {
      const options = call[0] as any;
      const data = await options.getData();

      expect(data.documents).toEqual(mockMilestoneDocs);
      expect(data.mapping.properties).toHaveProperty('description');
      expect(data.mapping.properties).toHaveProperty('aimNumbersAsc');
      expect(data.mapping.properties).toHaveProperty('aimNumbersDesc');
      expect(data.mapping.properties).toHaveProperty('status');
      expect(data.mapping.properties).toHaveProperty('articleCount');
      expect(data.mapping.properties).toHaveProperty('articlesDOI');
      expect(data.mapping.properties).toHaveProperty('projectId');
      expect(data.mapping.properties).toHaveProperty('grantType');
      expect(data.mapping.properties).toHaveProperty('createdDate');
      expect(data.mapping.properties).toHaveProperty('lastDate');
    }
  });
});
