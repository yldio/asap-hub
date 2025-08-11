import { AnalyticsDataProvider } from '../../src/data-providers/types/analytics.data-provider.types';

export const analyticsDataProviderMock = {
  fetchTeamLeadership: jest.fn(),
  fetchTeamProductivity: jest.fn(),
  fetchUserProductivity: jest.fn(),
  fetchUserCollaboration: jest.fn(),
  fetchTeamCollaboration: jest.fn(),
  fetchEngagement: jest.fn(),
  fetchOSChampion: jest.fn(),
} as unknown as jest.Mocked<AnalyticsDataProvider>;
