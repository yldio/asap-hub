import { getDataProviderMock } from './data-provider.mock';

export const projectDataProviderMock = {
  ...getDataProviderMock(),
  fetchProjectMilestones: jest.fn(),
  createMilestone: jest.fn(),
  isProjectMilestonesSynced: jest.fn(),
};
