import { ContributingCohortController } from '../../src/controllers/contributing-cohort.controller';

export const contributingCohortControllerMock: jest.Mocked<ContributingCohortController> =
  {
    fetch: jest.fn(),
  };
