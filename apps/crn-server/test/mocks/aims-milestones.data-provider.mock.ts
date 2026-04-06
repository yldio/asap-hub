import { AimsMilestonesDataProvider } from '../../src/data-providers/types/aims-milestones.data-provider.types';

export const aimsMilestonesDataProviderMock = {
  fetchProjectsWithAims: jest.fn(),
  fetchProjectsWithAimsDetail: jest.fn(),
  fetchAimsWithMilestones: jest.fn(),
  fetchMilestones: jest.fn(),
  fetchArticlesForAim: jest.fn(),
  fetchArticlesForMilestone: jest.fn(),
} as unknown as jest.Mocked<AimsMilestonesDataProvider>;
