import AnalyticsController from '../../src/controllers/analytics.controller';

export const analyticsControllerMock = {
  fetchTeamLeaderShip: jest.fn(),
} as unknown as jest.Mocked<AnalyticsController>;
