import { getDataProviderMock } from './data-provider.mock';

export const teamDataProviderMock = {
  ...getDataProviderMock(),
  fetchPublicTeams: jest.fn(),
  fetchTeamIdByProjectId: jest.fn(),
};
