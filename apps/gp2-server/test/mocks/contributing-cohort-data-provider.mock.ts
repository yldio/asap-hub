import { ContributingCohortDataProvider } from "../../src/data-providers/types";

export const contributingCohortDataProviderMock: jest.Mocked<ContributingCohortDataProvider> =
  {
    fetch: jest.fn(),
    fetchById: jest.fn(),
  };
