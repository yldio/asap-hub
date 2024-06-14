import AnalyticsController from '../../src/controllers/analytics.controller';

export const analyticsControllerMock = {
  fetchTeamLeadership: jest.fn(),
  fetchTeamProductivity: jest.fn(),
  fetchUserProductivity: jest.fn(),
  fetchUserCollaboration: jest.fn(),
  fetchTeamCollaboration: jest.fn(),
} as unknown as jest.Mocked<AnalyticsController>;
