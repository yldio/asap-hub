import ContributingCohort from '../../src/controllers/contributing-cohort.controller';
import {
  getListContributingCohortDataObject,
  getListContributingCohortResponse,
} from '../fixtures/contributing-cohort.fixtures';
import { contributingCohortDataProviderMock } from '../mocks/contributing-cohort.data-provider.mock';

describe('ContributingCohort', () => {
  const cohortController = new ContributingCohort(
    contributingCohortDataProviderMock,
  );

  describe('Fetch method', () => {
    test('Should return an empty result when no contributing cohorts exist', async () => {
      contributingCohortDataProviderMock.fetch.mockResolvedValue({
        total: 0,
        items: [],
      });
      const result = await cohortController.fetch();

      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should fetch the contributing cohort', async () => {
      contributingCohortDataProviderMock.fetch.mockResolvedValue(
        getListContributingCohortDataObject(),
      );

      const result = await cohortController.fetch();

      expect(result).toMatchObject(getListContributingCohortResponse());
    });
  });
});
