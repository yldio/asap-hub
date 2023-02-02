import { ListResponse } from '../common';

export type ContributingCohortDataObject = {
  id: string;
  name: string;
};
export type ListContributingCohortDataObject =
  ListResponse<ContributingCohortDataObject>;

export type ContributingCohortResponse = ContributingCohortDataObject;
export type ListContributingCohortResponse =
  ListResponse<ContributingCohortResponse>;

export type ContributingCohortCreateDataObject = Omit<
  ContributingCohortDataObject,
  'id'
>;
