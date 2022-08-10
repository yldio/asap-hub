import { TeamDataProvider } from '../../src/data-providers/teams.data-provider';

export const teamDataProviderMock: jest.Mocked<TeamDataProvider> = {
  fetch: jest.fn(),
  fetchById: jest.fn(),
  update: jest.fn(),
  create: jest.fn(),
};
