import { gp2 } from '@asap-hub/model';
import { ContributingCohortDataProvider } from '../data-providers/contributing-cohort.data-provider';

export interface ContributingCohortController {
  fetch: () => Promise<gp2.ListContributingCohortResponse>;
}

export default class ContributingCohort
  implements ContributingCohortController
{
  constructor(private cohortDataProvider: ContributingCohortDataProvider) {}

  async fetch(): Promise<gp2.ListContributingCohortResponse> {
    const { total, items } = await this.cohortDataProvider.fetch();

    return {
      total,
      items,
    };
  }
}
