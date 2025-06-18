import { DataProvider, FetchOptions, gp2 } from '@asap-hub/model';

export type FetchContributingCohortProviderOptions = null;

export type ContributingCohortDataProvider = DataProvider<
  gp2.ContributingCohortDataObject,
  gp2.ContributingCohortDataObject,
  FetchOptions
>;
