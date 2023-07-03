import { gp2 } from '@asap-hub/model';
import { ContributingCohortDataProvider } from '../data-providers/types';

export default class ContributingCohortController {
  constructor(private cohortDataProvider: ContributingCohortDataProvider) {}

  async fetch(): Promise<gp2.ListContributingCohortResponse> {
    const { total, items } = await this.cohortDataProvider.fetch(null);

    return {
      total,
      items,
    };
  }
}
