import AnalyticsController from '../../src/controllers/analytics.controller';

export const analyticsControllerMock = {
  fetchTeamLeadership: jest.fn(),
} as unknown as jest.Mocked<AnalyticsController>;
