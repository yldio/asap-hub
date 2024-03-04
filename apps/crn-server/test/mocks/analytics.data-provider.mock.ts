import { AnalyticsDataProvider } from '../../src/data-providers/types/analytics.data-provider.types';

export const analyticsDataProviderMock = {
  fetchTeamLeaderShip: jest.fn(),
} as unknown as jest.Mocked<AnalyticsDataProvider>;
