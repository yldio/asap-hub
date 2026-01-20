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

const mockFetchTeamLeadership = jest.fn();
jest.mock('../../../src/controllers/analytics.controller', () => {
  return jest.fn().mockImplementation(() => ({
    fetchTeamLeadership: mockFetchTeamLeadership,
    fetchOSChampion: jest.fn().mockResolvedValue({ total: 0, items: [] }),
    fetchPreliminaryDataSharing: jest
      .fn()
      .mockResolvedValue({ total: 0, items: [] }),
    fetchAttendance: jest.fn().mockResolvedValue({ total: 0, items: [] }),
    fetchUserProductivity: jest.fn().mockResolvedValue({ total: 0, items: [] }),
    fetchTeamProductivity: jest.fn().mockResolvedValue({ total: 0, items: [] }),
    fetchUserCollaboration: jest
      .fn()
      .mockResolvedValue({ total: 0, items: [] }),
    fetchTeamCollaboration: jest
      .fn()
      .mockResolvedValue({ total: 0, items: [] }),
  }));
});

import { indexOpensearchData } from '@asap-hub/server-common';
import {
  exportAnalyticsData,
  exportMetricToOpensearch,
} from '../sync-opensearch-analytics';
import { LEADERSHIP_PAGE_SIZE } from '../constants';
import { WGLeadershipDataObject } from '../types';

const mockIndexOpensearchData = indexOpensearchData as jest.MockedFunction<
  typeof indexOpensearchData
>;

describe('wg-leadership sync', () => {
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  describe('exportAnalyticsData for wg-leadership', () => {
    it('should fetch and transform team leadership data to WG-only fields', async () => {
      const mockTeamLeadershipData = {
        total: 2,
        items: [
          {
            id: 'team-1',
            displayName: 'Team Alpha',
            inactiveSince: null,
            workingGroupLeadershipRoleCount: 3,
            workingGroupPreviousLeadershipRoleCount: 1,
            workingGroupMemberCount: 5,
            workingGroupPreviousMemberCount: 2,
            interestGroupLeadershipRoleCount: 2,
            interestGroupPreviousLeadershipRoleCount: 1,
            interestGroupMemberCount: 4,
            interestGroupPreviousMemberCount: 3,
          },
          {
            id: 'team-2',
            displayName: 'Team Beta',
            inactiveSince: '2024-01-15',
            workingGroupLeadershipRoleCount: 1,
            workingGroupPreviousLeadershipRoleCount: 2,
            workingGroupMemberCount: 3,
            workingGroupPreviousMemberCount: 4,
            interestGroupLeadershipRoleCount: 0,
            interestGroupPreviousLeadershipRoleCount: 2,
            interestGroupMemberCount: 0,
            interestGroupPreviousMemberCount: 5,
          },
        ],
      };

      mockFetchTeamLeadership.mockResolvedValue(mockTeamLeadershipData);

      const result = (await exportAnalyticsData(
        'wg-leadership',
      )) as WGLeadershipDataObject[];

      expect(result).toHaveLength(2);

      expect(result[0]).toEqual({
        id: 'team-1',
        displayName: 'Team Alpha',
        inactiveSince: null,
        isInactive: false,
        workingGroupLeadershipRoleCount: 3,
        workingGroupPreviousLeadershipRoleCount: 1,
        workingGroupMemberCount: 5,
        workingGroupPreviousMemberCount: 2,
      });

      // inactive team
      expect(result[1]).toEqual({
        id: 'team-2',
        displayName: 'Team Beta',
        inactiveSince: '2024-01-15',
        isInactive: true,
        workingGroupLeadershipRoleCount: 1,
        workingGroupPreviousLeadershipRoleCount: 2,
        workingGroupMemberCount: 3,
        workingGroupPreviousMemberCount: 4,
      });

      // Verify Interest Group fields are NOT included
      expect(result[0]).not.toHaveProperty('interestGroupLeadershipRoleCount');
      expect(result[0]).not.toHaveProperty('interestGroupMemberCount');
      expect(result[1]).not.toHaveProperty('interestGroupLeadershipRoleCount');
      expect(result[1]).not.toHaveProperty('interestGroupMemberCount');
    });

    it('should handle pagination correctly', async () => {
      const totalItems = 25;
      const page1Data = {
        total: totalItems,
        items: Array(LEADERSHIP_PAGE_SIZE)
          .fill(null)
          .map((_, i) => ({
            id: `team-${i}`,
            displayName: `Team ${i}`,
            inactiveSince: null,
            workingGroupLeadershipRoleCount: i,
            workingGroupPreviousLeadershipRoleCount: 0,
            workingGroupMemberCount: 0,
            workingGroupPreviousMemberCount: 0,
            interestGroupLeadershipRoleCount: 0,
            interestGroupPreviousLeadershipRoleCount: 0,
            interestGroupMemberCount: 0,
            interestGroupPreviousMemberCount: 0,
          })),
      };

      const page2Data = {
        total: totalItems,
        items: Array(LEADERSHIP_PAGE_SIZE)
          .fill(null)
          .map((_, i) => ({
            id: `team-${LEADERSHIP_PAGE_SIZE + i}`,
            displayName: `Team ${LEADERSHIP_PAGE_SIZE + i}`,
            inactiveSince: null,
            workingGroupLeadershipRoleCount: LEADERSHIP_PAGE_SIZE + i,
            workingGroupPreviousLeadershipRoleCount: 0,
            workingGroupMemberCount: 0,
            workingGroupPreviousMemberCount: 0,
            interestGroupLeadershipRoleCount: 0,
            interestGroupPreviousLeadershipRoleCount: 0,
            interestGroupMemberCount: 0,
            interestGroupPreviousMemberCount: 0,
          })),
      };

      const page3Data = {
        total: totalItems,
        items: Array(totalItems - 2 * LEADERSHIP_PAGE_SIZE)
          .fill(null)
          .map((_, i) => ({
            id: `team-${2 * LEADERSHIP_PAGE_SIZE + i}`,
            displayName: `Team ${2 * LEADERSHIP_PAGE_SIZE + i}`,
            inactiveSince: null,
            workingGroupLeadershipRoleCount: 2 * LEADERSHIP_PAGE_SIZE + i,
            workingGroupPreviousLeadershipRoleCount: 0,
            workingGroupMemberCount: 0,
            workingGroupPreviousMemberCount: 0,
            interestGroupLeadershipRoleCount: 0,
            interestGroupPreviousLeadershipRoleCount: 0,
            interestGroupMemberCount: 0,
            interestGroupPreviousMemberCount: 0,
          })),
      };

      mockFetchTeamLeadership
        .mockResolvedValueOnce(page1Data)
        .mockResolvedValueOnce(page2Data)
        .mockResolvedValueOnce(page3Data);

      const result = await exportAnalyticsData('wg-leadership');

      expect(result).toHaveLength(totalItems);
      expect(mockFetchTeamLeadership).toHaveBeenCalledTimes(3);
    });

    it('should return empty array when no data is found', async () => {
      mockFetchTeamLeadership.mockResolvedValue(null);

      const result = await exportAnalyticsData('wg-leadership');

      expect(result).toHaveLength(0);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'No data found for wg-leadership',
      );
    });

    it('should set isInactive based on inactiveSince field', async () => {
      const mockData = {
        total: 3,
        items: [
          {
            id: 'team-active',
            displayName: 'Active Team',
            inactiveSince: null,
            workingGroupLeadershipRoleCount: 1,
            workingGroupPreviousLeadershipRoleCount: 0,
            workingGroupMemberCount: 1,
            workingGroupPreviousMemberCount: 0,
            interestGroupLeadershipRoleCount: 0,
            interestGroupPreviousLeadershipRoleCount: 0,
            interestGroupMemberCount: 0,
            interestGroupPreviousMemberCount: 0,
          },
          {
            id: 'team-inactive',
            displayName: 'Inactive Team',
            inactiveSince: '2023-06-01',
            workingGroupLeadershipRoleCount: 0,
            workingGroupPreviousLeadershipRoleCount: 1,
            workingGroupMemberCount: 0,
            workingGroupPreviousMemberCount: 1,
            interestGroupLeadershipRoleCount: 0,
            interestGroupPreviousLeadershipRoleCount: 0,
            interestGroupMemberCount: 0,
            interestGroupPreviousMemberCount: 0,
          },
          {
            id: 'team-undefined',
            displayName: 'Undefined Team',
            inactiveSince: undefined,
            workingGroupLeadershipRoleCount: 1,
            workingGroupPreviousLeadershipRoleCount: 0,
            workingGroupMemberCount: 1,
            workingGroupPreviousMemberCount: 0,
            interestGroupLeadershipRoleCount: 0,
            interestGroupPreviousLeadershipRoleCount: 0,
            interestGroupMemberCount: 0,
            interestGroupPreviousMemberCount: 0,
          },
        ],
      };

      mockFetchTeamLeadership.mockResolvedValue(mockData);

      const result = (await exportAnalyticsData(
        'wg-leadership',
      )) as WGLeadershipDataObject[];

      expect(result[0]?.isInactive).toBe(false);
      expect(result[1]?.isInactive).toBe(true);
      expect(result[2]?.isInactive).toBe(false);
    });
  });

  describe('exportMetricToOpensearch for wg-leadership', () => {
    it('should call indexOpensearchData with correct config', async () => {
      const mockData = {
        total: 1,
        items: [
          {
            id: 'team-1',
            displayName: 'Team One',
            inactiveSince: null,
            workingGroupLeadershipRoleCount: 1,
            workingGroupPreviousLeadershipRoleCount: 0,
            workingGroupMemberCount: 2,
            workingGroupPreviousMemberCount: 0,
            interestGroupLeadershipRoleCount: 0,
            interestGroupPreviousLeadershipRoleCount: 0,
            interestGroupMemberCount: 0,
            interestGroupPreviousMemberCount: 0,
          },
        ],
      };

      mockFetchTeamLeadership.mockResolvedValue(mockData);

      await exportMetricToOpensearch('wg-leadership');

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

        expect(data.documents).toHaveLength(1);
        expect(data.mapping).toHaveProperty('properties');
        expect(data.mapping.properties).toHaveProperty(
          'workingGroupLeadershipRoleCount',
        );
        expect(data.mapping.properties).toHaveProperty(
          'workingGroupMemberCount',
        );
      }
    });
  });
});
