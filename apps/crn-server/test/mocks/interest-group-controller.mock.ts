import InterestGroupController from '../../src/controllers/interest-groups.controller';

export const interestGroupControllerMock = {
  fetch: jest.fn(),
  fetchById: jest.fn(),
  fetchByTeamId: jest.fn(),
  fetchByUserId: jest.fn(),
} as unknown as jest.Mocked<InterestGroupController>;
