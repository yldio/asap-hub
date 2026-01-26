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

jest.mock('../leadership', () => ({
  exportLeadershipData: jest.fn(),
}));

import { indexOpensearchData } from '@asap-hub/server-common';
import { exportLeadershipData } from '../leadership';
import { exportMetricToOpensearch } from '../sync-opensearch-analytics';

const mockExportLeadershipData = exportLeadershipData as jest.MockedFunction<
  typeof exportLeadershipData
>;

const mockIndexOpensearchData = indexOpensearchData as jest.MockedFunction<
  typeof indexOpensearchData
>;

describe('Leadership sync integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('ig-leadership', () => {
    it('should call indexOpensearchData with correct IG config and mapping', async () => {
      const mockIGData = [
        {
          id: 'team-1',
          displayName: 'Team One',
          inactiveSince: undefined,
          isInactive: false,
          interestGroupLeadershipRoleCount: 2,
          interestGroupPreviousLeadershipRoleCount: 1,
          interestGroupMemberCount: 4,
          interestGroupPreviousMemberCount: 3,
        },
      ];

      mockExportLeadershipData.mockResolvedValue(mockIGData);

      await exportMetricToOpensearch('ig-leadership');

      expect(mockExportLeadershipData).toHaveBeenCalledWith('ig-leadership');
      expect(mockIndexOpensearchData).toHaveBeenCalledWith(
        expect.objectContaining({
          indexAlias: 'ig-leadership',
          getData: expect.any(Function),
        }),
      );

      const call = mockIndexOpensearchData.mock.calls[0];
      if (call) {
        const options = call[0] as any;
        const data = await options.getData();

        expect(data.documents).toEqual(mockIGData);
        expect(data.mapping.properties).toHaveProperty(
          'interestGroupLeadershipRoleCount',
        );
        expect(data.mapping.properties).toHaveProperty(
          'interestGroupPreviousLeadershipRoleCount',
        );
        expect(data.mapping.properties).toHaveProperty(
          'interestGroupMemberCount',
        );
        expect(data.mapping.properties).toHaveProperty(
          'interestGroupPreviousMemberCount',
        );
        expect(data.mapping.properties).not.toHaveProperty(
          'workingGroupLeadershipRoleCount',
        );
      }
    });
  });

  describe('wg-leadership', () => {
    it('should call indexOpensearchData with correct WG config and mapping', async () => {
      const mockWGData = [
        {
          id: 'team-1',
          displayName: 'Team One',
          inactiveSince: undefined,
          isInactive: false,
          workingGroupLeadershipRoleCount: 3,
          workingGroupPreviousLeadershipRoleCount: 1,
          workingGroupMemberCount: 5,
          workingGroupPreviousMemberCount: 2,
        },
      ];

      mockExportLeadershipData.mockResolvedValue(mockWGData);

      await exportMetricToOpensearch('wg-leadership');

      expect(mockExportLeadershipData).toHaveBeenCalledWith('wg-leadership');
      expect(mockIndexOpensearchData).toHaveBeenCalledWith(
        expect.objectContaining({
          indexAlias: 'wg-leadership',
          getData: expect.any(Function),
        }),
      );

      const call = mockIndexOpensearchData.mock.calls[0];
      if (call) {
        const options = call[0] as any;
        const data = await options.getData();

        expect(data.documents).toEqual(mockWGData);
        expect(data.mapping.properties).toHaveProperty(
          'workingGroupLeadershipRoleCount',
        );
        expect(data.mapping.properties).toHaveProperty(
          'workingGroupPreviousLeadershipRoleCount',
        );
        expect(data.mapping.properties).toHaveProperty(
          'workingGroupMemberCount',
        );
        expect(data.mapping.properties).toHaveProperty(
          'workingGroupPreviousMemberCount',
        );
        expect(data.mapping.properties).not.toHaveProperty(
          'interestGroupLeadershipRoleCount',
        );
      }
    });
  });
});
