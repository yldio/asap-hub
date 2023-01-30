import { ContributingCohortDataProvider } from '../../src/data-providers/contributing-cohort.data-provider';

export const contributingCohortDataProviderMock: jest.Mocked<ContributingCohortDataProvider> =
  {
    fetch: jest.fn(),
  };
