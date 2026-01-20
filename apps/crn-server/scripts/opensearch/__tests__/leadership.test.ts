jest.mock('../../../src/config', () => ({
  awsRegion: 'us-east-1',
  environment: 'test',
  opensearchPassword: 'test-password',
  opensearchUsername: 'test-username',
}));

jest.mock('../../../src/dependencies/analytics.dependencies', () => ({
  getAnalyticsDataProvider: jest.fn().mockReturnValue({}),
}));

const mockFetchTeamLeadership = jest.fn();
jest.mock('../../../src/controllers/analytics.controller', () => {
  return jest.fn().mockImplementation(() => ({
    fetchTeamLeadership: mockFetchTeamLeadership,
  }));
});

import { exportLeadershipData } from '../leadership';
import { LEADERSHIP_PAGE_SIZE } from '../constants';
import {
  IGLeadershipDataObject,
  LeadershipType,
  WGLeadershipDataObject,
} from '../types';

const createMockTeamLeadershipData = (overrides: Partial<{
  id: string;
  displayName: string;
  inactiveSince: string | null;
  workingGroupLeadershipRoleCount: number;
  workingGroupPreviousLeadershipRoleCount: number;
  workingGroupMemberCount: number;
  workingGroupPreviousMemberCount: number;
  interestGroupLeadershipRoleCount: number;
  interestGroupPreviousLeadershipRoleCount: number;
  interestGroupMemberCount: number;
  interestGroupPreviousMemberCount: number;
}> = {}) => ({
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
  ...overrides,
});

describe('exportLeadershipData', () => {
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  describe('ig-leadership', () => {
    it('should extract only IG fields and exclude WG fields', async () => {
      const mockData = {
        total: 1,
        items: [createMockTeamLeadershipData()],
      };

      mockFetchTeamLeadership.mockResolvedValue(mockData);

      const result = await exportLeadershipData('ig-leadership');

      expect(result).toHaveLength(1);
      const item = result[0] as IGLeadershipDataObject;

      expect(item).toEqual({
        id: 'team-1',
        displayName: 'Team Alpha',
        inactiveSince: null,
        isInactive: false,
        interestGroupLeadershipRoleCount: 2,
        interestGroupPreviousLeadershipRoleCount: 1,
        interestGroupMemberCount: 4,
        interestGroupPreviousMemberCount: 3,
      });

      expect(item).not.toHaveProperty('workingGroupLeadershipRoleCount');
      expect(item).not.toHaveProperty('workingGroupPreviousLeadershipRoleCount');
      expect(item).not.toHaveProperty('workingGroupMemberCount');
      expect(item).not.toHaveProperty('workingGroupPreviousMemberCount');
    });

    it('should compute isInactive correctly from inactiveSince', async () => {
      const mockData = {
        total: 3,
        items: [
          createMockTeamLeadershipData({ id: 'active', inactiveSince: null }),
          createMockTeamLeadershipData({
            id: 'inactive',
            inactiveSince: '2024-01-15',
          }),
          createMockTeamLeadershipData({
            id: 'undefined',
            inactiveSince: undefined as unknown as null,
          }),
        ],
      };

      mockFetchTeamLeadership.mockResolvedValue(mockData);

      const result = await exportLeadershipData('ig-leadership');

      expect(result[0]?.isInactive).toBe(false);
      expect(result[1]?.isInactive).toBe(true);
      expect(result[2]?.isInactive).toBe(false);
    });
  });

  describe('wg-leadership', () => {
    it('should extract only WG fields and exclude IG fields', async () => {
      const mockData = {
        total: 1,
        items: [createMockTeamLeadershipData()],
      };

      mockFetchTeamLeadership.mockResolvedValue(mockData);

      const result = await exportLeadershipData('wg-leadership');

      expect(result).toHaveLength(1);
      const item = result[0] as WGLeadershipDataObject;

      expect(item).toEqual({
        id: 'team-1',
        displayName: 'Team Alpha',
        inactiveSince: null,
        isInactive: false,
        workingGroupLeadershipRoleCount: 3,
        workingGroupPreviousLeadershipRoleCount: 1,
        workingGroupMemberCount: 5,
        workingGroupPreviousMemberCount: 2,
      });

      expect(item).not.toHaveProperty('interestGroupLeadershipRoleCount');
      expect(item).not.toHaveProperty(
        'interestGroupPreviousLeadershipRoleCount',
      );
      expect(item).not.toHaveProperty('interestGroupMemberCount');
      expect(item).not.toHaveProperty('interestGroupPreviousMemberCount');
    });

    it('should compute isInactive correctly from inactiveSince', async () => {
      const mockData = {
        total: 2,
        items: [
          createMockTeamLeadershipData({ id: 'active', inactiveSince: null }),
          createMockTeamLeadershipData({
            id: 'inactive',
            inactiveSince: '2023-06-01',
          }),
        ],
      };

      mockFetchTeamLeadership.mockResolvedValue(mockData);

      const result = await exportLeadershipData('wg-leadership');

      expect(result[0]?.isInactive).toBe(false);
      expect(result[1]?.isInactive).toBe(true);
    });
  });

  describe.each<LeadershipType>(['ig-leadership', 'wg-leadership'])(
    'shared behavior for %s',
    (leadershipType) => {
      const callExportLeadershipData = async () => {
        if (leadershipType === 'ig-leadership') {
          return exportLeadershipData('ig-leadership');
        }
        return exportLeadershipData('wg-leadership');
      };

      it('should handle pagination correctly', async () => {
        const totalItems = 25;
        const createPageData = (startIndex: number, count: number) => ({
          total: totalItems,
          items: Array(count)
            .fill(null)
            .map((_, i) =>
              createMockTeamLeadershipData({
                id: `team-${startIndex + i}`,
                displayName: `Team ${startIndex + i}`,
              }),
            ),
        });

        const page1Data = createPageData(0, LEADERSHIP_PAGE_SIZE);
        const page2Data = createPageData(
          LEADERSHIP_PAGE_SIZE,
          LEADERSHIP_PAGE_SIZE,
        );
        const page3Data = createPageData(
          2 * LEADERSHIP_PAGE_SIZE,
          totalItems - 2 * LEADERSHIP_PAGE_SIZE,
        );

        mockFetchTeamLeadership
          .mockResolvedValueOnce(page1Data)
          .mockResolvedValueOnce(page2Data)
          .mockResolvedValueOnce(page3Data);

        const result = await callExportLeadershipData();

        expect(result).toHaveLength(totalItems);
        expect(mockFetchTeamLeadership).toHaveBeenCalledTimes(3);
      });

      it('should return empty array when no data is found', async () => {
        mockFetchTeamLeadership.mockResolvedValue(null);

        const result = await callExportLeadershipData();

        expect(result).toHaveLength(0);
        expect(consoleLogSpy).toHaveBeenCalledWith(
          `No data found for ${leadershipType}`,
        );
      });

      it('should log progress messages', async () => {
        const mockData = {
          total: 1,
          items: [createMockTeamLeadershipData()],
        };

        mockFetchTeamLeadership.mockResolvedValue(mockData);

        await callExportLeadershipData();

        expect(consoleLogSpy).toHaveBeenCalledWith(
          `Fetching ${leadershipType} data...`,
        );
        expect(consoleLogSpy).toHaveBeenCalledWith(
          `Found 1 items (1 pages) for ${leadershipType}`,
        );
        expect(consoleLogSpy).toHaveBeenCalledWith(
          `Completed fetching ${leadershipType}. Total items: 1`,
        );
      });

      it('should skip null responses during pagination', async () => {
        const mockData = {
          total: LEADERSHIP_PAGE_SIZE + 5,
          items: Array(LEADERSHIP_PAGE_SIZE)
            .fill(null)
            .map((_, i) =>
              createMockTeamLeadershipData({
                id: `team-${i}`,
              }),
            ),
        };

        mockFetchTeamLeadership
          .mockResolvedValueOnce(mockData)
          .mockResolvedValueOnce(null);

        const result = await callExportLeadershipData();

        expect(result).toHaveLength(LEADERSHIP_PAGE_SIZE);
      });
    },
  );
});
