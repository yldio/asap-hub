import ContributingCohortController from '../../src/controllers/contributing-cohort.controller';

export const contributingCohortControllerMock = {
  fetch: jest.fn(),
} as unknown as jest.Mocked<ContributingCohortController>;
