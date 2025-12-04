import { renderHook } from '@testing-library/react-hooks';
import { RecoilRoot } from 'recoil';

import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { OpensearchClient } from '../../analytics/utils/opensearch';
import { useOpensearchMetrics } from '../opensearch';
import * as openScienceApi from '../../analytics/open-science/api';
import * as leadershipApi from '../../analytics/leadership/api';
import * as engagementApi from '../../analytics/engagement/api';
import * as collaborationApi from '../../analytics/collaboration/api';
import * as productivityApi from '../../analytics/productivity/api';

jest.mock('../../analytics/utils/opensearch');
jest.mock('../../analytics/open-science/api');
jest.mock('../../analytics/leadership/api');
jest.mock('../../analytics/engagement/api');
jest.mock('../../analytics/collaboration/api');
jest.mock('../../analytics/productivity/api');

const mockOpensearchClient = OpensearchClient as jest.MockedClass<
  typeof OpensearchClient
>;

describe('useOpensearchMetrics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOpensearchClient.mockClear();
  });

  it('throws when user is not provided', () => {
    const { result } = renderHook(() => useOpensearchMetrics());
    expect(() => result.current).toThrow();
  });

  it('returns all metric functions', async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useOpensearchMetrics(),
      {
        wrapper: ({ children }) => (
          <RecoilRoot>
            <Auth0Provider user={{ id: 'user-id' }}>
              <WhenReady>{children}</WhenReady>
            </Auth0Provider>
          </RecoilRoot>
        ),
      },
    );
    await waitForNextUpdate();

    expect(result.current).toHaveProperty('getPublicationCompliance');
    expect(result.current).toHaveProperty('getPreprintCompliance');
    expect(result.current).toHaveProperty('getAnalyticsOSChampion');
    expect(result.current).toHaveProperty('getMeetingRepAttendance');
    expect(result.current).toHaveProperty('getPreliminaryDataSharing');
    expect(result.current).toHaveProperty('getUserProductivity');
    expect(result.current).toHaveProperty('getUserProductivityPerformance');
    expect(result.current).toHaveProperty('getTeamProductivity');
    expect(result.current).toHaveProperty('getTeamProductivityPerformance');
  });

  describe('getPublicationCompliance', () => {
    it('creates OpensearchClient with correct index and calls API method', async () => {
      const mockGetPublicationCompliance = jest
        .spyOn(openScienceApi, 'getPublicationCompliance')
        .mockResolvedValue({
          items: [],
          total: 0,
        });

      const { result, waitForNextUpdate } = renderHook(
        () => useOpensearchMetrics(),
        {
          wrapper: ({ children }) => (
            <RecoilRoot>
              <Auth0Provider user={{ id: 'user-id' }}>
                <WhenReady>{children}</WhenReady>
              </Auth0Provider>
            </RecoilRoot>
          ),
        },
      );
      await waitForNextUpdate();

      const paginationParams = {
        tags: ['Team A'],
        currentPage: 0,
        pageSize: 10,
        timeRange: 'all' as const,
        sort: 'team_asc' as const,
      };

      await result.current.getPublicationCompliance(paginationParams);

      // Verify OpensearchClient was created with correct index
      expect(mockOpensearchClient).toHaveBeenCalledWith(
        'publication-compliance',
        expect.any(String), // authorization token
      );

      // Verify the API method was called with client and params
      expect(mockGetPublicationCompliance).toHaveBeenCalledWith(
        expect.any(OpensearchClient),
        paginationParams,
      );
    });
  });

  describe('getPreprintCompliance', () => {
    it('creates OpensearchClient with correct index and calls API method', async () => {
      const mockGetPreprintCompliance = jest
        .spyOn(openScienceApi, 'getPreprintCompliance')
        .mockResolvedValue({
          items: [],
          total: 0,
        });

      const { result, waitForNextUpdate } = renderHook(
        () => useOpensearchMetrics(),
        {
          wrapper: ({ children }) => (
            <RecoilRoot>
              <Auth0Provider user={{ id: 'user-id' }}>
                <WhenReady>{children}</WhenReady>
              </Auth0Provider>
            </RecoilRoot>
          ),
        },
      );
      await waitForNextUpdate();

      const paginationParams = {
        tags: [],
        currentPage: 1,
        pageSize: 20,
        timeRange: 'last-year' as const,
        sort: 'team_desc' as const,
      };

      await result.current.getPreprintCompliance(paginationParams);

      expect(mockOpensearchClient).toHaveBeenCalledWith(
        'preprint-compliance',
        expect.any(String),
      );

      expect(mockGetPreprintCompliance).toHaveBeenCalledWith(
        expect.any(OpensearchClient),
        paginationParams,
      );
    });
  });

  describe('getAnalyticsOSChampion', () => {
    it('creates OpensearchClient with correct index and calls API method', async () => {
      const mockGetAnalyticsOSChampion = jest
        .spyOn(leadershipApi, 'getAnalyticsOSChampion')
        .mockResolvedValue({
          items: [
            {
              objectID: 'test',
              teamId: 'team-1',
              teamName: 'Team One',
              isTeamInactive: false,
              teamAwardsCount: 5,
              timeRange: 'all',
              users: [],
            },
          ],
          total: 1,
        });

      const { result, waitForNextUpdate } = renderHook(
        () => useOpensearchMetrics(),
        {
          wrapper: ({ children }) => (
            <RecoilRoot>
              <Auth0Provider user={{ id: 'user-id' }}>
                <WhenReady>{children}</WhenReady>
              </Auth0Provider>
            </RecoilRoot>
          ),
        },
      );
      await waitForNextUpdate();

      const paginationParams = {
        tags: ['Team One'],
        currentPage: 0,
        pageSize: 15,
        timeRange: '30d' as const,
        sort: 'os_champion_awards_desc' as const,
      };

      await result.current.getAnalyticsOSChampion(paginationParams);

      expect(mockOpensearchClient).toHaveBeenCalledWith(
        'os-champion',
        expect.any(String),
      );

      expect(mockGetAnalyticsOSChampion).toHaveBeenCalledWith(
        expect.any(OpensearchClient),
        paginationParams,
      );
    });
  });

  describe('getMeetingRepAttendance', () => {
    it('creates OpensearchClient with correct index and calls API method', async () => {
      const mockGetMeetingRepAttendance = jest
        .spyOn(engagementApi, 'getMeetingRepAttendance')
        .mockResolvedValue({
          items: [
            {
              teamId: 'team-1',
              teamName: 'Team Alpha',
              isTeamInactive: false,
              attendancePercentage: 75,
              limitedData: false,
              timeRange: 'all',
            },
          ],
          total: 1,
        });

      const { result, waitForNextUpdate } = renderHook(
        () => useOpensearchMetrics(),
        {
          wrapper: ({ children }) => (
            <RecoilRoot>
              <Auth0Provider user={{ id: 'user-id' }}>
                <WhenReady>{children}</WhenReady>
              </Auth0Provider>
            </RecoilRoot>
          ),
        },
      );
      await waitForNextUpdate();

      const paginationParams = {
        tags: [],
        currentPage: 2,
        pageSize: 5,
        timeRange: 'last-year' as const,
        sort: 'attendance_percentage_desc' as const,
      };

      await result.current.getMeetingRepAttendance(paginationParams);

      expect(mockOpensearchClient).toHaveBeenCalledWith(
        'attendance',
        expect.any(String),
      );

      expect(mockGetMeetingRepAttendance).toHaveBeenCalledWith(
        expect.any(OpensearchClient),
        paginationParams,
      );
    });
  });

  describe('getPreliminaryDataSharing', () => {
    it('creates OpensearchClient with correct index and calls API method', async () => {
      const mockGetPreliminaryDataSharing = jest
        .spyOn(collaborationApi, 'getPreliminaryDataSharing')
        .mockResolvedValue({
          items: [
            {
              teamId: 'team-2',
              teamName: 'Team Beta',
              isTeamInactive: true,
              limitedData: false,
              percentShared: 82,
              timeRange: 'last-year',
            },
          ],
          total: 1,
        });

      const { result, waitForNextUpdate } = renderHook(
        () => useOpensearchMetrics(),
        {
          wrapper: ({ children }) => (
            <RecoilRoot>
              <Auth0Provider user={{ id: 'user-id' }}>
                <WhenReady>{children}</WhenReady>
              </Auth0Provider>
            </RecoilRoot>
          ),
        },
      );
      await waitForNextUpdate();

      const paginationParams = {
        tags: ['Team Beta', 'Team Gamma'],
        currentPage: 0,
        pageSize: 50,
        timeRange: 'all' as const,
      };

      await result.current.getPreliminaryDataSharing(paginationParams);

      expect(mockOpensearchClient).toHaveBeenCalledWith(
        'preliminary-data-sharing',
        expect.any(String),
      );

      expect(mockGetPreliminaryDataSharing).toHaveBeenCalledWith(
        expect.any(OpensearchClient),
        paginationParams,
      );
    });
  });

  describe('getUserProductivity', () => {
    it('creates OpensearchClient with correct index and calls API method', async () => {
      const mockGetUserProductivity = jest
        .spyOn(productivityApi, 'getUserProductivity')
        .mockResolvedValue({
          items: [
            {
              id: 'user-1',
              name: 'John Doe',
              isAlumni: false,
              teams: [
                {
                  id: 'team-1',
                  team: 'Team Alpha',
                  role: 'Collaborating PI',
                  isTeamInactive: false,
                  isUserInactiveOnTeam: false,
                },
              ],
              asapOutput: 10,
              asapPublicOutput: 8,
              ratio: 0.8,
            },
          ],
          total: 1,
        });

      const { result, waitForNextUpdate } = renderHook(
        () => useOpensearchMetrics(),
        {
          wrapper: ({ children }) => (
            <RecoilRoot>
              <Auth0Provider user={{ id: 'user-id' }}>
                <WhenReady>{children}</WhenReady>
              </Auth0Provider>
            </RecoilRoot>
          ),
        },
      );
      await waitForNextUpdate();

      const paginationParams = {
        tags: ['Team Alpha'],
        currentPage: 0,
        pageSize: 10,
        timeRange: '30d' as const,
        documentCategory: 'all' as const,
        sort: 'user_asc' as const,
      };

      await result.current.getUserProductivity(paginationParams);

      expect(mockOpensearchClient).toHaveBeenCalledWith(
        'user-productivity',
        expect.any(String),
      );

      expect(mockGetUserProductivity).toHaveBeenCalledWith(
        expect.any(OpensearchClient),
        paginationParams,
      );
    });
  });

  describe('getUserProductivityPerformance', () => {
    it('creates OpensearchClient with correct index and calls API method', async () => {
      const mockGetUserProductivityPerformance = jest
        .spyOn(productivityApi, 'getUserProductivityPerformance')
        .mockResolvedValue({
          asapOutput: {
            belowAverageMin: 0,
            belowAverageMax: 5,
            averageMin: 5,
            averageMax: 10,
            aboveAverageMin: 10,
            aboveAverageMax: 20,
          },
          asapPublicOutput: {
            belowAverageMin: 0,
            belowAverageMax: 3,
            averageMin: 3,
            averageMax: 7,
            aboveAverageMin: 7,
            aboveAverageMax: 15,
          },
          ratio: {
            belowAverageMin: 0,
            belowAverageMax: 0.5,
            averageMin: 0.5,
            averageMax: 0.75,
            aboveAverageMin: 0.75,
            aboveAverageMax: 1.0,
          },
        });

      const { result, waitForNextUpdate } = renderHook(
        () => useOpensearchMetrics(),
        {
          wrapper: ({ children }) => (
            <RecoilRoot>
              <Auth0Provider user={{ id: 'user-id' }}>
                <WhenReady>{children}</WhenReady>
              </Auth0Provider>
            </RecoilRoot>
          ),
        },
      );
      await waitForNextUpdate();

      const paginationParams = {
        timeRange: '90d' as const,
        documentCategory: 'article' as const,
      };

      await result.current.getUserProductivityPerformance(paginationParams);

      expect(mockOpensearchClient).toHaveBeenCalledWith(
        'user-productivity-performance',
        expect.any(String),
      );

      expect(mockGetUserProductivityPerformance).toHaveBeenCalledWith(
        expect.any(OpensearchClient),
        paginationParams,
      );
    });
  });

  describe('getTeamProductivity', () => {
    it('creates OpensearchClient with correct index and calls API method', async () => {
      const mockGetTeamProductivity = jest
        .spyOn(productivityApi, 'getTeamProductivity')
        .mockResolvedValue({
          items: [
            {
              id: 'team-1',
              name: 'Team Alpha',
              isInactive: false,
              Article: 5,
              Bioinformatics: 3,
              Dataset: 2,
              'Lab Material': 1,
              Protocol: 4,
            },
          ],
          total: 1,
        });

      const { result, waitForNextUpdate } = renderHook(
        () => useOpensearchMetrics(),
        {
          wrapper: ({ children }) => (
            <RecoilRoot>
              <Auth0Provider user={{ id: 'user-id' }}>
                <WhenReady>{children}</WhenReady>
              </Auth0Provider>
            </RecoilRoot>
          ),
        },
      );
      await waitForNextUpdate();

      const paginationParams = {
        tags: ['Team Alpha'],
        currentPage: 0,
        pageSize: 10,
        timeRange: '30d' as const,
        outputType: 'all' as const,
        sort: 'team_asc' as const,
      };

      await result.current.getTeamProductivity(paginationParams);

      expect(mockOpensearchClient).toHaveBeenCalledWith(
        'team-productivity',
        expect.any(String),
      );

      expect(mockGetTeamProductivity).toHaveBeenCalledWith(
        expect.any(OpensearchClient),
        paginationParams,
      );
    });
  });

  describe('getTeamProductivityPerformance', () => {
    it('creates OpensearchClient with correct index and calls API method', async () => {
      const mockGetTeamProductivityPerformance = jest
        .spyOn(productivityApi, 'getTeamProductivityPerformance')
        .mockResolvedValue({
          article: {
            belowAverageMin: 0,
            belowAverageMax: 2,
            averageMin: 2,
            averageMax: 5,
            aboveAverageMin: 5,
            aboveAverageMax: 10,
          },
          bioinformatics: {
            belowAverageMin: 0,
            belowAverageMax: 1,
            averageMin: 1,
            averageMax: 3,
            aboveAverageMin: 3,
            aboveAverageMax: 8,
          },
          dataset: {
            belowAverageMin: 0,
            belowAverageMax: 1,
            averageMin: 1,
            averageMax: 3,
            aboveAverageMin: 3,
            aboveAverageMax: 6,
          },
          labMaterial: {
            belowAverageMin: 0,
            belowAverageMax: 1,
            averageMin: 1,
            averageMax: 2,
            aboveAverageMin: 2,
            aboveAverageMax: 5,
          },
          protocol: {
            belowAverageMin: 0,
            belowAverageMax: 2,
            averageMin: 2,
            averageMax: 4,
            aboveAverageMin: 4,
            aboveAverageMax: 8,
          },
        });

      const { result, waitForNextUpdate } = renderHook(
        () => useOpensearchMetrics(),
        {
          wrapper: ({ children }) => (
            <RecoilRoot>
              <Auth0Provider user={{ id: 'user-id' }}>
                <WhenReady>{children}</WhenReady>
              </Auth0Provider>
            </RecoilRoot>
          ),
        },
      );
      await waitForNextUpdate();

      const paginationParams = {
        timeRange: '90d' as const,
        outputType: 'public' as const,
      };

      await result.current.getTeamProductivityPerformance(paginationParams);

      expect(mockOpensearchClient).toHaveBeenCalledWith(
        'team-productivity-performance',
        expect.any(String),
      );

      expect(mockGetTeamProductivityPerformance).toHaveBeenCalledWith(
        expect.any(OpensearchClient),
        paginationParams,
      );
    });
  });

  it('uses the same authorization for all OpenSearch clients', async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useOpensearchMetrics(),
      {
        wrapper: ({ children }) => (
          <RecoilRoot>
            <Auth0Provider user={{ id: 'user-id' }}>
              <WhenReady>{children}</WhenReady>
            </Auth0Provider>
          </RecoilRoot>
        ),
      },
    );
    await waitForNextUpdate();

    // Call multiple methods
    await result.current.getPublicationCompliance({
      tags: [],
      currentPage: 0,
      pageSize: 10,
      timeRange: 'all',
      sort: 'team_asc',
    });

    await result.current.getPreprintCompliance({
      tags: [],
      currentPage: 0,
      pageSize: 10,
      timeRange: 'all',
      sort: 'team_asc',
    });

    // Verify that all clients were created with the same authorization
    const authorizationCalls = mockOpensearchClient.mock.calls.map(
      (call) => call[1],
    );
    expect(authorizationCalls[0]).toBe(authorizationCalls[1]);
    expect(authorizationCalls).toHaveLength(2);
  });
});
